import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const ExtraFeaturesList = ({
  extra,
  handleExtraFeatureChange,
  handleRemoveExtraFeature,
  handleAddExtraFeatures,
}) => {
  return (
    <div className="space-y-2">
      {extra?.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            value={feature}
            onChange={(e) => handleExtraFeatureChange(idx, e.target.value)}
            placeholder="Feature name"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => handleRemoveExtraFeature(idx)}
            disabled={extra.length === 1 && !feature}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddExtraFeatures}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Feature
      </Button>
    </div>
  );
};

export default ExtraFeaturesList;