import React, { useState } from "react";
import { Save } from "lucide-react";
import { DEFAULT_ADDRESS } from "@/lib/defaultAddress";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countryCodes = [
  { code: "+91", country: "🇮🇳 India" },
  { code: "+1", country: "🇺🇸 United States" },
  { code: "+44", country: "🇬🇧 United Kingdom" },
  { code: "+61", country: "🇦🇺 Australia" },
  { code: "+971", country: "🇦🇪 UAE" },
  { code: "+81", country: "🇯🇵 Japan" },
  { code: "+49", country: "🇩🇪 Germany" },
  { code: "+33", country: "🇫🇷 France" },
  { code: "+65", country: "🇸🇬 Singapore" },
  { code: "+86", country: "🇨🇳 China" },
];

const workingDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const BranchInfo = () => {
  const [branchInfo, setBranchInfo] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    address: DEFAULT_ADDRESS,
    workingDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
  });

  const handleBranchInfoChange = (field, value) => {
    setBranchInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkingDayChange = (day, checked) => {
    if (checked) {
      if (!branchInfo.workingDays.includes(day)) {
        setBranchInfo((prev) => ({
          ...prev,
          workingDays: [...prev.workingDays, day],
        }));
      }
    } else {
      setBranchInfo((prev) => ({
        ...prev,
        workingDays: prev.workingDays.filter((d) => d !== day),
      }));
    }
  };

  const handleSaveSettings = () => {
    console.clear();

    console.log("========== Branch Information ==========");
    console.log(branchInfo);

    alert("Branch Settings Saved Successfully");
  };

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl">
          Branch Information
        </CardTitle>

        <CardDescription>
          Update your branch details and business hours.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
                {/* Branch Details */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Branch Name */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Branch Name
            </label>

            <Input
              placeholder="Enter Branch Name"
              value={branchInfo.name}
              onChange={(e) =>
                handleBranchInfoChange("name", e.target.value)
              }
            />
          </div>

          {/* Phone Number */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Phone Number
            </label>

            <div className="flex gap-2">

              <Select
                value={branchInfo.countryCode}
                onValueChange={(value) =>
                  handleBranchInfoChange("countryCode", value)
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.code}
                    >
                      {country.country} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="tel"
                className="flex-1"
                placeholder="9876543210"
                value={branchInfo.phone}
                onChange={(e) =>
                  handleBranchInfoChange("phone", e.target.value)
                }
              />

            </div>
          </div>

          {/* Email */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email Address
            </label>

            <Input
              type="email"
              placeholder="branch@example.com"
              value={branchInfo.email}
              onChange={(e) =>
                handleBranchInfoChange("email", e.target.value)
              }
            />
          </div>

          {/* Address */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Branch Address
            </label>

            <Input
              placeholder="Enter Complete Branch Address"
              value={branchInfo.address}
              onChange={(e) =>
                handleBranchInfoChange("address", e.target.value)
              }
            />
          </div>

        </div>

        <Separator />

        {/* Working Days */}

        <div className="space-y-4">

          <div>
            <h3 className="text-lg font-semibold">
              Working Days
            </h3>

            <p className="text-sm text-muted-foreground">
              Select the days when your branch remains open.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {workingDays.map((day) => (
              <div
                key={day}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30"
              >
                <Checkbox
                  checked={branchInfo.workingDays.includes(day)}
                  onCheckedChange={(checked) =>
                    handleWorkingDayChange(day, checked)
                  }
                />

                <label className="text-sm font-medium cursor-pointer">
                  {day}
                </label>
              </div>
            ))}

          </div>

        </div>

        <Separator />

        {/* Save Button */}

        <div className="flex justify-end">

          <Button
            className="bg-green-600 hover:bg-green-700 gap-2"
            onClick={handleSaveSettings}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>

        </div>

      </CardContent>
    </Card>
  );
};

export default BranchInfo;