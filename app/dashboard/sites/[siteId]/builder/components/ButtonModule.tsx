import React, { CSSProperties } from "react";
import { CanvasElement } from "../schema";

interface ButtonModuleProps {
  element: CanvasElement;
  isSelected?: boolean;
  // We'll use a simple boolean to flag "Live Mode"
  isLive?: boolean; 
}

export function ButtonModule({ element, isSelected, isLive }: ButtonModuleProps) {
  const { text = "Click Me", url = "#" } = element.content || {};
  
  const { 
    backgroundColor = "#2563eb", 
    color = "#ffffff", 
    borderRadius = "0.5rem",
    padding = "0.75rem 1.5rem",
    fontSize = "0.875rem",
    fontWeight = "600",
    textAlign = "center"
  } = element.styles || {};

  // Logic: Show hover rings ONLY if isLive is NOT true
  const hoverClass = !isLive ? "hover:ring-1 hover:ring-blue-300" : "";
  const selectedClass = isSelected && !isLive ? "ring-2 ring-blue-500 z-10" : "z-0";

  return (
    <div 
      className={`relative w-full py-2 flex transition-all duration-200 ${hoverClass} ${selectedClass}`}
      style={{ justifyContent: textAlign === "left" ? "flex-start" : textAlign === "right" ? "flex-end" : "center" }}
    >
      <button
        style={{
          backgroundColor,
          color,
          borderRadius,
          padding,
          fontSize,
          fontWeight,
          border: "none",
          cursor: "pointer",
          transition: "opacity 0.2s"
        }}
        className="hover:opacity-90 active:scale-95"
      >
        {text}
      </button>
      
      {/* Label only shows in builder when selected and NOT in live mode */}
      {isSelected && !isLive && (
        <div className="absolute top-0 right-0 transform -translate-y-full bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-t-md">
          BUTTON
        </div>
      )}
    </div>
  );
}