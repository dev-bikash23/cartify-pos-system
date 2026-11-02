import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import React from "react";

const BasicInfo = ({ storeData }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-5">Basic Information</h3>

      <div className="space-y-5">
        <div>
          <Label className="text-sm text-muted-foreground">Store Name</Label>
          <p className="font-medium mt-1">{storeData.brand}</p>
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Store Type</Label>
          <div className="mt-1">
            <Badge variant="secondary">{storeData.storeType}</Badge>
          </div>
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Description</Label>
          <p className="font-medium mt-1">{storeData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;