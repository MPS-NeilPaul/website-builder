import React from "react";
import { CanvasElement } from "../schema";
import { CanvasRenderer } from "./CanvasRenderer";

interface SectionModuleProps {
  element: CanvasElement;
  isSelected?: boolean;
  selectedElementId?: string | null;
  onSelect?: (id: string) => void;
  isLive?: boolean; // Added for live view support
}

export function SectionModule({ element, isSelected, selectedElementId, onSelect, isLive }: SectionModuleProps) {
  const { backgroundColor = "#ffffff", padding = "4rem 2rem" } = element.styles || {};

  // Logic: Only show the selection/hover ring if we are NOT in live mode
  const hoverClass = !isLive ? "hover:ring-1 hover:ring-blue-300" : "";
  const selectedClass = isSelected && !isLive ? "ring-2 ring-blue-500 z-10" : "z-0";
  const cursorClass = !isLive ? "cursor-pointer" : "cursor-default";

  return (
    <section 
      onClick={(e) => { 
        if (isLive) return; // Disable selection clicks on live site
        e.stopPropagation(); 
        onSelect?.(element.id); 
      }}
      className={`relative w-full transition-all duration-200 ${cursorClass} ${hoverClass} ${selectedClass}`}
      style={{ backgroundColor, padding }}
    >
      <div className="max-w-[1200px] mx-auto w-full flex flex-col">
        {/* Pass the containerId! */}
        <CanvasRenderer 
          elements={element.children || []} 
          selectedElementId={selectedElementId} 
          onSelect={onSelect} 
          containerId={element.id} 
        />
      </div>
      
      {/* Label only shows in builder mode when selected */}
      {isSelected && !isLive && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-md">
          SECTION
        </div>
      )}
    </section>
  );
}