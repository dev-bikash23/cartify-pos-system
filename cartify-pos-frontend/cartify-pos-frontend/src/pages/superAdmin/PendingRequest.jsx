import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStores, moderateStore } from "@/Redux Toolkit/features/Store/storeThunk";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Check, X, Mail, Phone } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PendingRequest = () => {
  const dispatch = useDispatch();
  const { stores, loading, error } = useSelector((state) => state.store);

  useEffect(() => {
    dispatch(getAllStores("PENDING"));
  }, [dispatch]);

  const handleModeration = async (storeId, status) => {
    await dispatch(moderateStore({ storeId, status }));
    dispatch(getAllStores("PENDING"));
  };

  return (
    <div className="space-y-6 p-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pending Request</h1>
          <p className="text-muted-foreground">Review live store requests from the database.</p>
        </div>

        <Badge className="gap-2 bg-amber-100 text-amber-700 hover:bg-amber-100 w-fit">
          <Info className="h-4 w-4" />
          {stores.length} Pending
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="min-w-45">Store Name</TableHead>
                  <TableHead className="min-w-37.5">Owner</TableHead>
                  <TableHead className="min-w-50">Contact</TableHead>
                  <TableHead className="text-center min-w-35">
                    Business Type
                  </TableHead>
                  <TableHead className="text-center min-w-32.5">
                    Submitted On
                  </TableHead>
                  <TableHead className="text-center min-w-45">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {stores.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No Pending Requests
                    </TableCell>
                  </TableRow>
                ) : (
                  stores.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        {item.brand}
                      </TableCell>

                      <TableCell>{item.storeAdmin?.fullName || "—"}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{item.contact?.email || item.storeAdmin?.email || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{item.contact?.phone || "—"}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {item.storeType || "—"}
                      </TableCell>

                      <TableCell className="text-center">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-center items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleModeration(item.id, "ACTIVE")}
                            disabled={loading}
                            className="bg-green-100 text-green-700 hover:bg-green-200"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleModeration(item.id, "BLOCKED")}
                            disabled={loading}
                            className="bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

    </div>
  );
};

export default PendingRequest;