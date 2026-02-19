import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableCanvasProps {
  children: React.ReactNode;
  isCanvasOver: boolean;
}

export function DroppableCanvas({ children, isCanvasOver }: DroppableCanvasProps) {
  const { setNodeRef } = useDroppable({
    id: "canvas-root",
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`flex-1 w-full h-full min-h-[800px] flex flex-col transition-all duration-200 border-2 ${
        isCanvasOver ? "border-blue-400 border-dashed bg-blue-50/30" : "border-transparent"
      }`}
    >
      {children}
    </div>
  );
}