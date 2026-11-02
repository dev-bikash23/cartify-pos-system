import React from "react";
import { FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectNote, setNote } from "@/Redux Toolkit/features/Cart/cartSlice";

const NoteSection = () => {
  const dispatch = useDispatch();
  const note = useSelector(selectNote);

  const handleNoteChange = (e) => {
    dispatch(setNote(e.target.value));
  };

  return (
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <FileText className="w-5 h-5 mr-2" /> Note
      </h2>

      <div className="space-y-3">
        <textarea
          id="order-note"
          className="w-full p-3 border border-input rounded-md text-sm resize-none bg-transparent shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 focus:border-transparent transition-shadow"
          placeholder="Enter note..."
          rows={3}
          value={note}
          onChange={handleNoteChange}
        />
      </div>
    </div>
  );
};

export default NoteSection;