import React from "react";
import { CanvasElement } from "../schema";
import { CanvasRenderer } from "./CanvasRenderer";

interface GridModuleProps {
  element: CanvasElement;
  isSelected?: boolean;
  selectedElementId?: string | null;
  onSelect?: (id: string) => void;
  isLive?: boolean; // Added for live view support
}

export function GridModule({ element, isSelected, selectedElementId, onSelect, isLive }: GridModuleProps) {
  const { gap = "1.5rem", padding = "1rem", alignItems = "start" } = element.styles || {};
  const colCount = element.children?.length || 1;

  // Logic: Only apply editor visuals if we are NOT in live mode
  const hoverClass = !isLive ? "hover:ring-1 hover:ring-blue-300" : "";
  const selectedClass = isSelected && !isLive ? "ring-2 ring-blue-500 z-10" : "z-0";
  const cursorClass = !isLive ? "cursor-pointer" : "cursor-default";

  return (
    <div 
      onClick={(e) => { 
        if (isLive) return; 
        e.stopPropagation(); 
        onSelect?.(element.id); 
      }}
      className={`relative w-full transition-all duration-200 ${cursorClass} ${hoverClass} ${selectedClass}`}
      style={{ 
        display: "grid", 
        gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`, 
        gap, 
        padding,
        alignItems 
      }}
    >
      <CanvasRenderer 
        elements={element.children || []} 
        selectedElementId={selectedElementId} 
        onSelect={onSelect} 
        containerId={`grid-${element.id}`} 
      />

      {/* Label and Selection UI only show in Builder mode */}
      {isSelected && !isLive && (
        <div className="absolute top-0 right-0 transform -translate-y-full bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-t-md">
          GRID
        </div>
      )}
    </div>
  );
}