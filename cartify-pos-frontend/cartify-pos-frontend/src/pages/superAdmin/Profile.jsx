import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/Redux Toolkit/features/User/userThunk";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfile, loading, error } = useSelector((state) => state.user);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", profilePicture: "" });
  const [picturePreview, setPicturePreview] = useState("");
  const [password, setPassword] = useState({ value: "", confirm: "" });
  const [message, setMessage] = useState("");
  const pictureInputRef = useRef(null);
  const [pictureName, setPictureName] = useState("");

  useEffect(() => {
    if (userProfile) {
      setForm({
        fullName: userProfile.fullName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        profilePicture: userProfile.profilePicture || "",
      });
      setPicturePreview(userProfile.profilePicture || "");
    }
  }, [userProfile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!userProfile?.id) {
      setMessage("Profile data is still loading. Please try again in a moment.");
      return;
    }
    try {
      if (password.value && password.value !== password.confirm) {
        setMessage("New passwords do not match.");
        return;
      }
      await dispatch(updateUserProfile({
        id: userProfile.id,
        userData: {
          ...form,
          role: userProfile.role,
          ...(password.value ? { password: password.value } : {}),
        },
      })).unwrap();
      setPassword({ value: "", confirm: "" });
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Unable to update your profile.");
    }
  };

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPictureName(file.name);
    setMessage("");
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Profile pictures must be smaller than 2 MB.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPicturePreview(previewUrl);
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, profilePicture: String(reader.result || "") }));
    reader.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      setPicturePreview("");
      setMessage("The selected picture could not be read.");
    };
    reader.readAsDataURL(file);
  };

  const goBack = () => navigate(-1);

  return (
    <div className="relative w-full p-6 sm:p-8">
      <Button type="button" variant="outline" className="absolute left-6 top-6 gap-2" onClick={goBack} aria-label="Back to previous page" title="Back to previous page">
          <ArrowLeft className="h-4 w-4" />
          Back
      </Button>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your authenticated account.</p>
        </div>
      {!userProfile && (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              {error || "Loading your profile..."}
            </p>
          </CardContent>
        </Card>
      )}
      {userProfile && <Card>
        <CardHeader><CardTitle>Personal details</CardTitle></CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          {message && <p className="mb-4 text-sm text-green-700">{message}</p>}
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 sm:col-span-2">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-2xl font-semibold text-green-700">
                {picturePreview ? <img src={picturePreview} alt="Profile preview" className="h-full w-full rounded-full object-cover" onError={() => setPicturePreview("")} /> : form.fullName?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <Label htmlFor="profilePicture">Profile picture</Label>
                <input ref={pictureInputRef} id="profilePicture" type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePictureChange} className="sr-only" />
                <Button type="button" variant="outline" className="mt-1" onClick={() => pictureInputRef.current?.click()}>
                  Choose picture
                </Button>
                <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">{pictureName || "PNG, JPG, or WebP up to 2 MB"}</p>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </div>
            <div className="border-t pt-5 sm:col-span-2">
              <h3 className="font-semibold">Change password</h3>
              <p className="mb-3 text-sm text-muted-foreground">Leave blank to keep your current password.</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><Label htmlFor="newPassword">New password</Label><Input id="newPassword" type="password" minLength={6} value={password.value} onChange={(event) => setPassword({ ...password, value: event.target.value })} /></div>
                <div><Label htmlFor="confirmPassword">Confirm password</Label><Input id="confirmPassword" type="password" minLength={6} value={password.confirm} onChange={(event) => setPassword({ ...password, confirm: event.target.value })} /></div>
              </div>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={loading || !userProfile}>{loading ? "Saving..." : "Save changes"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>}
      </div>
    </div>
  );
};

export default Profile;
