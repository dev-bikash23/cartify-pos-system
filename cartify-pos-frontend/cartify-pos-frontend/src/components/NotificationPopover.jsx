import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationPopover = ({ items = [], label = "Notifications" }) => {
  const [open, setOpen] = useState(false);
  const visibleItems = items.length ? items : ["You are all caught up."];

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-gray-100" onClick={() => setOpen((current) => !current)} aria-label={label} aria-expanded={open}>
        <Bell className="h-5 w-5" />
        {items.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />}
      </Button>
      {open && (
        <div className="absolute right-0 top-11 z-30 w-80 rounded-lg border bg-white p-4 text-left shadow-lg">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{label}</h2><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)} aria-label="Close notifications"><X className="h-4 w-4" /></Button></div>
          <div className="space-y-2">{visibleItems.map((item, index) => <p key={`${item}-${index}`} className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{item}</p>)}</div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
