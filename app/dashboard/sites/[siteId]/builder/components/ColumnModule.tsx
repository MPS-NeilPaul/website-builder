import React from "react";
import { CanvasElement } from "../schema";
import { CanvasRenderer } from "./CanvasRenderer";

interface ColumnModuleProps {
  element: CanvasElement;
  isSelected?: boolean;
  selectedElementId?: string | null;
  onSelect?: (id: string) => void;
  isLive?: boolean; // Added to handle live view
}

export function ColumnModule({ element, isSelected, selectedElementId, onSelect, isLive }: ColumnModuleProps) {
  const { backgroundColor = "transparent", padding = "1rem" } = element.styles || {};

  // Builder-only styles: Dashed borders, hover effects, and the blue selection ring
  const builderClasses = !isLive 
    ? `cursor-pointer border ${isSelected 
        ? "border-blue-500 ring-1 ring-blue-500 z-10 bg-blue-50/10" 
        : "border-dashed border-gray-300 hover:border-blue-300 z-0"}`
    : "border-none"; // Live site stays clean

  return (
    <div 
      onClick={(e) => { 
        if (isLive) return; // Disable clicks on live site
        e.stopPropagation(); 
        onSelect?.(element.id); 
      }}
      className={`relative flex flex-col gap-4 w-full h-full transition-all duration-200 ${builderClasses}`}
      style={{ backgroundColor, padding }}
    >
      {/* If we are live, we use a simple map or the LiveRenderer logic instead of the physics-heavy CanvasRenderer */}
      <CanvasRenderer 
        elements={element.children || []} 
        selectedElementId={selectedElementId} 
        onSelect={onSelect} 
        containerId={element.id} 
      />
      
      {/* Label only shows in builder when selected */}
      {isSelected && !isLive && (
        <div className="absolute top-0 right-0 transform -translate-y-full bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-t-md">
          COLUMN
        </div>
      )}
    </div>
  );
}