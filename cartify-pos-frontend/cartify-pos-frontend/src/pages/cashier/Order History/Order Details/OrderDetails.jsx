import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import CustomerInformation from "./CustomerInformation";
import OrderInformation from "./OrderInformation";
import OrderItemTable from "./OrderItemTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const OrderDetails = ({ selectedOrder }) => {
  const invoiceRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!selectedOrder) return null;

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        backgroundColor: "#f8fafc",
        scale: 2,
        useCORS: true,
        onclone: (clonedDocument) => {
          const captureStyles = clonedDocument.createElement("style");
          captureStyles.textContent = `
            *, *::before, *::after {
              color: #111827 !important;
              background-color: transparent !important;
              border-color: #d1d5db !important;
              box-shadow: none !important;
            }
            body, [data-slot="dialog-content"] {
              background-color: #f8fafc !important;
            }
          `;
          clonedDocument.head.appendChild(captureStyles);

          clonedDocument.querySelectorAll("svg").forEach((svg) => {
            const placeholder = clonedDocument.createElement("span");
            placeholder.style.display = "inline-block";
            placeholder.style.width = `${svg.clientWidth || 16}px`;
            placeholder.style.height = `${svg.clientHeight || 16}px`;
            svg.replaceWith(placeholder);
          });
        },
      });
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      const image = canvas.toDataURL("image/png");
      let offset = 0;

      while (offset < imageHeight) {
        if (offset > 0) pdf.addPage();
        pdf.addImage(image, "PNG", 0, -offset, pageWidth, imageHeight);
        offset += pageHeight;
      }

      pdf.save(`invoice-ORD-${selectedOrder.id}.pdf`);
    } catch (error) {
      console.error("Invoice download failed", error);
      toast.error("Could not download the invoice. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={invoiceRef} className="space-y-4 p-4 sm:p-5">
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
        <OrderInformation selectedOrder={selectedOrder} />
        <CustomerInformation selectedOrder={selectedOrder} />
      </div>

      <OrderItemTable selectedOrder={selectedOrder} />

      <div className="flex justify-end">
        <Button
          className="h-8 bg-green-700 px-3 text-xs hover:bg-green-800"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          {isDownloading ? "Preparing..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;