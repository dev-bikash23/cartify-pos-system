import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createProduct, getProductsByStore } from "@/Redux Toolkit/features/Product/productThunk";

const CSV_TEMPLATE = `name,sku,sellingPrice,costPrice,categoryId,image,description
Nike Air Max 90,SHOE001,12999,8500,1,https://example.com/shoe1.jpg,Classic running shoes
Levi's 501 Jeans,DRESS001,3999,2200,2,https://example.com/jeans1.jpg,Original fit jeans
Adidas Ultraboost,SHOE002,15999,10000,1,,Comfortable running shoes`;

const BulkProductImportDialog = ({ branch }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [parsedProducts, setParsedProducts] = useState([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState([]);
  const [step, setStep] = useState("upload"); // upload | preview | results
  const fileInputRef = useRef(null);
  const storeId = branch?.storeId ?? branch?.store?.id;

  const handleOpen = () => {
    if (!storeId) {
      toast.error("Branch store information is not available");
      return;
    }
    setOpen(true);
    setStep("upload");
    setParsedProducts([]);
    setResults([]);
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const values = [];
      let current = "";
      let inQuotes = false;

      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      if (values.length < 3) continue;

      const product = {};
      headers.forEach((header, index) => {
        product[header] = values[index] || "";
      });

      if (product.name && product.sellingprice) {
        products.push({
          name: product.name,
          sku: product.sku || `SKU${Date.now()}${i}`,
          sellingPrice: parseFloat(product.sellingprice) || 0,
          costPrice: parseFloat(product.costprice) || 0,
          categoryId: parseInt(product.categoryid) || 1,
          image: product.image || "",
          description: product.description || "",
        });
      }
    }
    return products;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const products = parseCSV(event.target.result);
      if (products.length === 0) {
        toast.error("No valid products found in CSV. Check the format.");
        return;
      }
      setParsedProducts(products);
      setStep("preview");
      toast.success(`${products.length} products parsed from CSV`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImport = async () => {
    setImporting(true);
    setStep("results");
    const importResults = [];

    for (let i = 0; i < parsedProducts.length; i++) {
      const product = parsedProducts[i];
      try {
        const result = await dispatch(
          createProduct({
            ...product,
            storeId,
            categoryId: Number(product.categoryId),
          })
        );

        if (createProduct.fulfilled.match(result)) {
          importResults.push({ name: product.name, status: "success" });
        } else {
          importResults.push({
            name: product.name,
            status: "error",
            message: result.payload || "Failed",
          });
        }
      } catch (err) {
        importResults.push({
          name: product.name,
          status: "error",
          message: "Unexpected error",
        });
      }
      setResults([...importResults]);
    }

    setImporting(false);
    const successCount = importResults.filter((r) => r.status === "success").length;
    toast.success(`Imported ${successCount} of ${parsedProducts.length} products`);

    // Refresh product list
    dispatch(getProductsByStore({ storeId }));
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-700 transition-all hover:bg-gray-100"
      >
        <Upload size={20} />
        <span className="font-medium">Bulk Import (CSV)</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Bulk Product Import
            </DialogTitle>
            <DialogDescription>
              Upload a CSV file to add multiple products at once.
            </DialogDescription>
          </DialogHeader>

          {step === "upload" && (
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV file with product details
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose CSV File
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div>
                  <p className="text-sm font-medium">Need a template?</p>
                  <p className="text-xs text-muted-foreground">
                    Download our CSV template with example data
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Template
                </Button>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-sm">
                <p className="font-medium text-blue-800 mb-1">CSV Format:</p>
                <code className="text-xs text-blue-700 block">
                  name, sku, sellingPrice, costPrice, categoryId, image, description
                </code>
                <p className="text-xs text-blue-600 mt-1">
                  • <strong>name</strong> and <strong>sellingPrice</strong> are required
                  <br />• <strong>categoryId</strong>: use the ID number of the category
                </p>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {parsedProducts.length} products ready to import
                </p>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setStep("upload")}>
                    Back
                  </Button>
                  <Button size="sm" onClick={handleImport}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import All
                  </Button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-2">#</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">SKU</th>
                      <th className="text-right p-2">Price</th>
                      <th className="text-right p-2">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedProducts.map((p, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2 text-muted-foreground">{i + 1}</td>
                        <td className="p-2 font-medium">{p.name}</td>
                        <td className="p-2 text-muted-foreground">{p.sku}</td>
                        <td className="p-2 text-right text-green-600">₹{p.sellingPrice}</td>
                        <td className="p-2 text-right">₹{p.costPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === "results" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {importing ? "Importing..." : "Import Complete"}
                </p>
                {!importing && (
                  <Button size="sm" onClick={() => setOpen(false)}>
                    Done
                  </Button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 rounded-lg p-2 text-sm ${
                      r.status === "success"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {r.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0" />
                    )}
                    <span className="flex-1">{r.name}</span>
                    {r.message && (
                      <span className="text-xs">{r.message}</span>
                    )}
                  </div>
                ))}
                {importing && (
                  <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing {results.length + 1} of {parsedProducts.length}...
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkProductImportDialog;
