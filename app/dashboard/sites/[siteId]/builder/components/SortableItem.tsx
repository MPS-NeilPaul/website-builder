import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  // 1. Initialize the sorting physics for this specific element
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  // 2. Apply the CSS transform so it smoothly animates out of the way
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : 1, // Ensure the dragged item floats above the rest
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}