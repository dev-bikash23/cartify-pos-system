import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCw, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAdminUsers, updateAdminUserRole, updateAdminUserStatus } from "@/Redux Toolkit/features/User/userThunk";

const roles = ["ROLE_ADMIN", "ROLE_STORE_ADMIN", "ROLE_STORE_MANAGER", "ROLE_BRANCH_ADMIN", "ROLE_BRANCH_MANAGER", "ROLE_BRANCH_CASHIER"];
const roleLabels = {
  ROLE_ADMIN: "Super Admin", ROLE_STORE_ADMIN: "Store Admin", ROLE_STORE_MANAGER: "Store Manager",
  ROLE_BRANCH_ADMIN: "Branch Admin", ROLE_BRANCH_MANAGER: "Branch Manager", ROLE_BRANCH_CASHIER: "Cashier",
};

const UserManagement = () => {
  const dispatch = useDispatch();
  const { adminUsers, loading, error, userProfile } = useSelector((state) => state.user);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => { dispatch(getAdminUsers()); }, [dispatch]);

  const filteredUsers = useMemo(() => adminUsers.filter((user) => {
    const matchesQuery = `${user.fullName} ${user.email}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery &&
      (roleFilter === "ALL" || user.role === roleFilter) &&
      (statusFilter === "ALL" || (statusFilter === "ACTIVE" ? user.active : !user.active));
  }), [adminUsers, query, roleFilter, statusFilter]);

  const updateStatus = (user) => {
    if (user.id === userProfile?.id && user.active) return;
    dispatch(updateAdminUserStatus({ id: user.id, active: !user.active }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><h1 className="text-2xl font-bold">User Management</h1><p className="text-sm text-muted-foreground">Manage every administrator, store, manager, and cashier account.</p></div>
        <Button variant="outline" onClick={() => dispatch(getAdminUsers())} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />{loading ? "Loading..." : "Refresh users"}</Button>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-3 md:grid-cols-[1fr_220px_160px]">
        <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search name or email" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-9 rounded-md border bg-background px-3 text-sm"><option value="ALL">All roles</option>{roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-md border bg-background px-3 text-sm"><option value="ALL">All status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select>
      </div>
      <Card><CardHeader><CardTitle>{filteredUsers.length} user accounts</CardTitle><p className="text-sm text-muted-foreground">Showing all accounts returned by the server, including their assigned roles.</p></CardHeader><CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-sm"><thead className="border-b bg-muted/40 text-left"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Last login</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody>{filteredUsers.map((user) => <tr key={user.id} className="border-b last:border-0">
            <td className="p-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-green-100 font-semibold text-green-700">{user.profilePicture ? <img src={user.profilePicture} alt="" className="h-full w-full object-cover" /> : user.fullName?.charAt(0).toUpperCase()}</div><div><p className="font-medium">{user.fullName}</p><p className="text-xs text-muted-foreground">{user.email}</p></div></div></td>
            <td className="p-4"><select value={user.role} onChange={(event) => dispatch(updateAdminUserRole({ id: user.id, role: event.target.value }))} disabled={user.id === userProfile?.id} className="h-8 rounded-md border bg-background px-2 text-xs">{roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select></td>
            <td className="p-4"><Badge variant={user.active ? "default" : "outline"}>{user.active ? "Active" : "Inactive"}</Badge></td>
            <td className="p-4 text-muted-foreground">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</td>
            <td className="p-4 text-right"><Button variant="outline" size="sm" onClick={() => updateStatus(user)} disabled={user.id === userProfile?.id && user.active}>{user.active ? "Deactivate" : "Activate"}</Button></td>
          </tr>)}</tbody>
        </table>
        {!filteredUsers.length && <div className="p-10 text-center text-sm text-muted-foreground"><ShieldCheck className="mx-auto mb-2 h-6 w-6" />No users match the selected filters.</div>}
      </CardContent></Card>
    </div>
  );
};

export default UserManagement;
