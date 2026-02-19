import React from "react";
import { CanvasElement } from "../schema";

interface ImageModuleProps {
  element: CanvasElement;
  isSelected?: boolean;
  isLive?: boolean; // Added for live view support
}

export function ImageModule({ element, isSelected, isLive }: ImageModuleProps) {
  const { src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426", alt = "Module Image" } = element.content || {};
  
  const { 
    borderRadius = "0.75rem",
    width = "100%",
    maxWidth = "100%"
  } = element.styles || {};

  // Logic: Show hover rings and selection UI ONLY if isLive is NOT true
  const hoverClass = !isLive ? "hover:ring-1 hover:ring-blue-300" : "";
  const selectedClass = isSelected && !isLive ? "ring-2 ring-blue-500 z-10" : "z-0";

  return (
    <div className={`relative w-full py-4 transition-all duration-200 ${hoverClass} ${selectedClass}`}>
      <img 
        src={src} 
        alt={alt}
        style={{ 
          borderRadius, 
          width, 
          maxWidth,
          height: "auto",
          display: "block"
        }} 
        className="mx-auto shadow-sm"
      />
      
      {/* Label only shows in builder when selected and NOT in live mode */}
      {isSelected && !isLive && (
        <div className="absolute top-0 right-0 transform -translate-y-full bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-t-md">
          IMAGE
        </div>
      )}
    </div>
  );
}