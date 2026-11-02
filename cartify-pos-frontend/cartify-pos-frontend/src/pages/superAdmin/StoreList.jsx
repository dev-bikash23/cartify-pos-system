import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStore, getAllStores } from "@/Redux Toolkit/features/Store/storeThunk";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Plus, RefreshCw, ExternalLink } from "lucide-react";

const emptyForm = {
  brand: "",
  description: "",
  storeType: "Retail Store",
  contact: { address: "", phone: "", email: "", latitude: "", longitude: "" },
};

const statusClass = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  BLOCKED: "bg-red-100 text-red-700",
};

const StoreList = () => {
  const dispatch = useDispatch();
  const { stores, loading, error } = useSelector((state) => state.store);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const loadStores = () => dispatch(getAllStores());

  useEffect(() => {
    loadStores();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateContact = (field, value) => {
    setForm((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setFormError("Location services are not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        updateContact("latitude", coords.latitude.toFixed(6));
        updateContact("longitude", coords.longitude.toFixed(6));
        setFormError("");
      },
      () => setFormError("Location permission was denied. Enter coordinates manually."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.brand.trim()) {
      setFormError("Store name is required.");
      return;
    }

    const latitude = form.contact.latitude === "" ? null : Number(form.contact.latitude);
    const longitude = form.contact.longitude === "" ? null : Number(form.contact.longitude);
    if ((latitude !== null && Number.isNaN(latitude)) || (longitude !== null && Number.isNaN(longitude))) {
      setFormError("Latitude and longitude must be valid numbers.");
      return;
    }

    try {
      await dispatch(createStore({
        ...form,
        brand: form.brand.trim(),
        contact: { ...form.contact, latitude, longitude },
      })).unwrap();
      setForm(emptyForm);
      setIsOpen(false);
      loadStores();
    } catch (createError) {
      setFormError(createError || "Unable to create store.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stores</h1>
          <p className="text-muted-foreground">Live store records from the Cartify database.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadStores} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button onClick={() => { setFormError(""); setIsOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Store
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Card>
        <CardHeader><CardTitle>All Stores ({stores.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            {stores.length === 0 ? (
              <p className="py-10 text-muted-foreground">No stores found.</p>
            ) : stores.map((store) => {
              const coordinates = store.contact?.latitude && store.contact?.longitude
                ? `${store.contact.latitude}, ${store.contact.longitude}`
                : null;
              const mapUrl = coordinates
                ? `https://www.openstreetmap.org/?mlat=${store.contact.latitude}&mlon=${store.contact.longitude}#map=16/${store.contact.latitude}/${store.contact.longitude}`
                : null;
              return (
                <div key={store.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{store.brand}</h2>
                      <p className="text-sm text-muted-foreground">{store.storeType || "Store"}</p>
                    </div>
                    <Badge className={statusClass[store.status] || ""}>{store.status || "PENDING"}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{store.description || "No description"}</p>
                  <div className="mt-4 space-y-1 text-sm">
                    <p>{store.contact?.address || "No address"}</p>
                    <p>{store.contact?.phone || "No phone"}</p>
                    {coordinates ? (
                      <a className="inline-flex items-center gap-1 text-green-700 hover:underline" href={mapUrl} target="_blank" rel="noreferrer">
                        <MapPin className="h-4 w-4" /> {coordinates} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : <p className="text-muted-foreground">Location not mapped</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-160">
          <DialogHeader><DialogTitle>Add Store</DialogTitle></DialogHeader>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="brand">Store name *</Label>
                <Input id="brand" value={form.brand} onChange={(event) => updateField("brand", event.target.value)} required />
              </div>
              <div>
                <Label htmlFor="storeType">Store type</Label>
                <select id="storeType" value={form.storeType} onChange={(event) => updateField("storeType", event.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option>Retail Store</option><option>Supermarket</option><option>Mall</option><option>Department Store</option><option>Convenience Store</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(event) => updateField("description", event.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="address">Address</Label><Input id="address" value={form.contact.address} onChange={(event) => updateContact("address", event.target.value)} /></div>
              <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={form.contact.phone} onChange={(event) => updateContact("phone", event.target.value)} /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.contact.email} onChange={(event) => updateContact("email", event.target.value)} /></div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div><Label>Location mapping</Label><p className="text-xs text-muted-foreground">Capture the store coordinates for map links.</p></div>
                <Button type="button" variant="outline" onClick={useCurrentLocation}><MapPin className="mr-2 h-4 w-4" />Use my location</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input aria-label="Latitude" placeholder="Latitude" value={form.contact.latitude} onChange={(event) => updateContact("latitude", event.target.value)} />
                <Input aria-label="Longitude" placeholder="Longitude" value={form.contact.longitude} onChange={(event) => updateContact("longitude", event.target.value)} />
              </div>
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Create Store"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreList;