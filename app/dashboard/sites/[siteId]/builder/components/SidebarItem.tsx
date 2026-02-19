import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { ElementType } from "../schema";

interface SidebarItemProps {
  type: ElementType;
  icon: React.ReactNode;
  label: string;
}

export function SidebarItem({ type, icon, label }: SidebarItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type: type, isSidebarItem: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`touch-none select-none bg-gray-800/50 hover:bg-gray-800 border p-3 rounded-lg flex flex-col items-center justify-center gap-2 cursor-grab transition-colors ${
        isDragging ? "opacity-30 border-gray-700/50" : "border-gray-700/50"
      }`}
    >
      <div className={isDragging ? "text-blue-500" : "text-gray-400"}>{icon}</div>
      <span className={`text-[11px] font-medium ${isDragging ? "text-blue-500" : "text-gray-400"}`}>{label}</span>
    </div>
  );
}