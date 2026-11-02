import React from "react";

import BranchInfo from "./BranchInfo";

const Settings = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      <div>
        <h1 className="text-4xl font-bold">
          Branch Settings
        </h1>

        <p className="text-muted-foreground mt-2">
          Manage your branch information and business settings.
        </p>
      </div>

      <BranchInfo />

    </div>
  );
};

export default Settings;