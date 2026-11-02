import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BranchForm from "./BranchForm";
import BranchTable from "./BranchTable";
import { createBranch, deleteBranch, getAllBranchesByStore, updateBranch } from "@/Redux Toolkit/features/Branch/branchThunk";
import { getStoreByAdmin } from "@/Redux Toolkit/features/Store/storeThunk";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, RotateCcw } from "lucide-react";

const Branches = () => {
  const dispatch = useDispatch();
  const { branches, loading, error } = useSelector((state) => state.branch);
  const store = useSelector((state) => state.store.store);

  const [selectedBranch, setSelectedBranch] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getStoreByAdmin()).then((result) => {
      if (getStoreByAdmin.fulfilled.match(result) && result.payload?.id) {
        dispatch(getAllBranchesByStore({ id: result.payload.id }));
      }
    });
  }, [dispatch]);

  const handleAddBranch = async (values) => {
    const branchData = {
      ...values,
      manager: { fullName: values.manager },
    };
    const result = await dispatch(createBranch({ dto: branchData }));
    if (createBranch.fulfilled.match(result)) {
      setIsAddDialogOpen(false);
    }
  };

  // Edit Button
  const handleEditBranch = (branch) => {
    setSelectedBranch({
      ...branch,
      manager: branch.manager?.fullName || branch.manager || "",
      email: branch.email || "",
      phone: branch.phone || "",
      address: branch.address || "",
      name: branch.name || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBranch = async (values) => {
    const branchData = {
      ...values,
      manager: { fullName: values.manager },
    };
    const result = await dispatch(updateBranch({ id: selectedBranch.id, dto: branchData }));
    if (updateBranch.fulfilled.match(result)) {
      setIsEditDialogOpen(false);
      if (store?.id) {
        await dispatch(getAllBranchesByStore({ id: store.id }));
      }
    }
  };

  const handleDeleteBranch = async (branch) => {
    if (window.confirm(`Delete "${branch.name}"?`)) {
      await dispatch(deleteBranch(branch.id));
    }
  };

  const handleRefresh = async () => {
    const result = await dispatch(getStoreByAdmin());
    const storeId = result.payload?.id || store?.id;
    if (storeId) await dispatch(getAllBranchesByStore({ id: storeId }));
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">Branch Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage your store locations and branch teams
          </p>
        </div>

        <div className="flex gap-2">
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          <RotateCcw className="mr-2 h-4 w-4" />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-155 rounded-xl">

            <DialogHeader>
              <DialogTitle>Add Branch</DialogTitle>
            </DialogHeader>

            <BranchForm
              onSubmit={handleAddBranch}
              onCancel={() => setIsAddDialogOpen(false)}
            />

          </DialogContent>
        </Dialog>
        </div>

      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && branches.length === 0 && <p className="text-sm text-muted-foreground">Loading branches...</p>}

      <Card className="shadow-sm">

        <CardContent className="p-6">

          <BranchTable
            branches={branches}
            handleEditBranch={handleEditBranch}
            handleDeleteBranch={handleDeleteBranch}
          />

        </CardContent>

      </Card>

      {/* Edit Dialog */}

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >

        <DialogContent className="sm:max-w-155 rounded-xl">

          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
          </DialogHeader>

          <BranchForm
            initialValues={selectedBranch}
            isEditing={true}
            onSubmit={handleUpdateBranch}
            onCancel={() => setIsEditDialogOpen(false)}
          />

        </DialogContent>

      </Dialog>

    </div>
  );
};

export default Branches;