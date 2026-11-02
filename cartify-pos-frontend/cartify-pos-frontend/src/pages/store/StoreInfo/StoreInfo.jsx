import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, ExternalLink, RotateCcw } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BasicInfo from "./BasicInfo";
import ContactInfo from "./ContactInfo";
import EditStoreForm from "./EditStoreForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getInitialValues } from "./FormUtil";
import { getStoreByAdmin, updateStore } from "@/Redux Toolkit/features/Store/storeThunk";
import { toast } from "sonner";
// ⚠️ verify this import path/casing matches your actual storeThunk.js location

const StoreInfo = () => {
  const dispatch = useDispatch();

  const { store, loading, error } = useSelector((state) => state.store);

  const [isOpenEditStoreDialog, setIsOpenEditStoreDialog] = React.useState(false);

  useEffect(() => {
    dispatch(getStoreByAdmin());
  }, [dispatch]);

  const onSubmit = async (values) => {
    if (store?.id) {
      const result = await dispatch(updateStore({ id: store.id, storeData: values }));
      if (updateStore.fulfilled.match(result)) {
        await dispatch(getStoreByAdmin());
        setIsOpenEditStoreDialog(false);
        toast.success("Store settings saved");
      } else {
        toast.error(result.payload || "Could not save store settings");
      }
    }
  };

  const onCancel = () => {
    setIsOpenEditStoreDialog(false);
  };

  const handleRefresh = async () => {
    await dispatch(getStoreByAdmin());
  };

  if (loading && !store) {
    return <p className="text-sm text-muted-foreground">Loading store details...</p>;
  }

  if (error && !store) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!store) {
    return <p className="text-sm text-muted-foreground">No store found.</p>;
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Store Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your store details
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Store Info Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <CardTitle className="text-lg font-bold">Store Information</CardTitle>

            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setIsOpenEditStoreDialog(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
            <BasicInfo storeData={store} />
            <ContactInfo storeData={store} />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-muted-foreground">
              Store Created on{" "}
              {store.createdAt
                ? new Date(store.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        To open a new store, use the Super Admin Stores page. A store manager can manage the existing assigned store here.
        <a className="ml-1 inline-flex items-center gap-1 text-green-700 hover:underline" href="/super-admin/stores">
          Open store management <ExternalLink className="h-3 w-3" />
        </a>
      </p>

      <Dialog open={isOpenEditStoreDialog} onOpenChange={setIsOpenEditStoreDialog}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Store Details</DialogTitle>
          </DialogHeader>

          <EditStoreForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            initialValues={getInitialValues(store)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreInfo;