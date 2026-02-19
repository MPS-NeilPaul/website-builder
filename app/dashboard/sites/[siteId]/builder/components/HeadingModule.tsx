import React, { CSSProperties } from "react";
import { CanvasElement } from "../schema";

interface HeadingModuleProps {
  element: CanvasElement;
  isSelected?: boolean;
  isLive?: boolean; // Added for live view support
}

export function HeadingModule({ element, isSelected, isLive }: HeadingModuleProps) {
  const { text = "New Heading", level = "h2" } = element.content || {};
  
  const { 
    color = "#111827", 
    textAlign = "left", 
    fontSize = "2.25rem", 
    fontWeight = "700",
    letterSpacing = "normal"
  } = element.styles || {};

  const Tag = level as keyof JSX.IntrinsicElements;

  // Logic: Show hover rings and selection UI ONLY if isLive is NOT true
  const hoverClass = !isLive ? "hover:ring-1 hover:ring-blue-300" : "";
  const selectedClass = isSelected && !isLive ? "ring-2 ring-blue-500 z-10" : "z-0";

  return (
    <div className={`relative w-full transition-all duration-200 ${hoverClass} ${selectedClass}`}>
      <Tag 
        style={{ 
          color, 
          textAlign: textAlign as CSSProperties["textAlign"],
          fontSize, 
          fontWeight, 
          letterSpacing, 
          margin: 0, 
          padding: "0.5rem 0" 
        }}
        className="font-sans break-words"
      >
        {text}
      </Tag>
      
      {/* Label only shows in builder when selected and NOT in live mode */}
      {isSelected && !isLive && (
         <div className="absolute top-0 right-0 transform -translate-y-full bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-t-md flex items-center gap-1">
            HEADING ({level.toUpperCase()})
         </div>
      )}
    </div>
  );
}