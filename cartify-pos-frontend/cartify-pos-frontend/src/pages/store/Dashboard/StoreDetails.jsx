import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStoreByAdmin } from "@/Redux Toolkit/features/Store/storeThunk";
// ⚠️ verify the import path/casing matches your actual storeThunk.js location

const StoreDetails = () => {
  const dispatch = useDispatch();

  const { store, loading, error } = useSelector((state) => state.store);

  useEffect(() => {
    dispatch(getStoreByAdmin());
  }, [dispatch]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading store details...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!store) {
    return <p className="text-sm text-muted-foreground">No store found.</p>;
  }

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardContent className="p-6 space-y-4">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{store.brand}</h2>
          <Badge
            className={
              store.status === "APPROVED"
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-yellow-100 text-yellow-700 border-yellow-300"
            }
          >
            {store.status}
          </Badge>
        </div>

        <p className="text-muted-foreground">{store.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Store Type</span>
            <span className="font-medium">{store.storeType}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Store Admin</span>
            <span className="font-medium">{store.storeAdmin?.fullName || "—"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Admin Email</span>
            <span className="font-medium">{store.storeAdmin?.email || "—"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Address</span>
            <span className="font-medium">{store.contact?.address || "—"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium">{store.contact?.phone || "—"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Contact Email</span>
            <span className="font-medium">{store.contact?.email || "—"}</span>
          </div>

        </div>

      </CardContent>
    </Card>
  );
};

export default StoreDetails;