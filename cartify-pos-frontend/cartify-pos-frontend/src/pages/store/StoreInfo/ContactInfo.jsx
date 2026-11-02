import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import React from "react";

const ContactInfo = ({ storeData }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-5">Contact Information</h3>

      <div className="space-y-5">
        <div className="flex gap-3">
          <MapPin className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
          <div>
            <Label className="text-sm text-muted-foreground">Address</Label>
            <p className="text-base mt-1">{storeData.contact?.address}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Phone className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
          <div>
            <Label className="text-sm text-muted-foreground">Phone</Label>
            <p className="text-base mt-1">{storeData.contact?.phone}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Mail className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
          <div>
            <Label className="text-sm text-muted-foreground">Email</Label>
            <p className="text-base mt-1 break-all">{storeData.contact?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;