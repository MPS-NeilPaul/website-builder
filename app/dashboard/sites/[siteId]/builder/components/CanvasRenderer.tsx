import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { CanvasElement } from "../schema";
import { SectionModule } from "./SectionModule";
import { HeadingModule } from "./HeadingModule";
import { TextBlockModule } from "./TextBlockModule";
import { ButtonModule } from "./ButtonModule";
import { ImageModule } from "./ImageModule";
import { GridModule } from "./GridModule";
import { ColumnModule } from "./ColumnModule";
import { SortableItem } from "./SortableItem";

function CanvasPlaceholder({ isEmpty, containerId }: { isEmpty: boolean; containerId: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: `placeholder-${containerId}` });
  const isRoot = containerId === "root";

  // Hide placeholder inside Grids because Grids should only contain Columns
  // We handle column addition via the Grid settings panel instead
  const isGrid = containerId.includes("el-") && !isRoot; 

  return (
    <div
      ref={setNodeRef}
      className={`w-full flex items-center justify-center transition-all duration-200 border-2 border-dashed ${
        isEmpty ? (isRoot ? "min-h-[400px] rounded-2xl" : "min-h-[100px] rounded-xl") : "min-h-[60px] mt-4 rounded-xl"
      } ${isOver ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-gray-200 bg-gray-50/50 text-gray-400 hover:border-gray-400"}`}
    >
      <div className="flex flex-col items-center pointer-events-none">
        <Plus className={`h-5 w-5 mb-1 ${isOver ? "animate-bounce" : ""}`} />
        <span className="text-[10px] font-bold tracking-wider uppercase">
          {isEmpty ? "Drag module here" : "Add module"}
        </span>
      </div>
    </div>
  );
}

interface CanvasRendererProps {
  elements: CanvasElement[];
  selectedElementId?: string | null;
  onSelect?: (id: string) => void;
  containerId?: string;
}

export function CanvasRenderer({ elements, selectedElementId, onSelect, containerId = "root" }: CanvasRendererProps) {
  const safeElements = elements || [];
  const elementIds = safeElements.map((el) => el.id);

  return (
    /* FIX: display: contents is the key. 
      It allows children to ignore this div and obey the parent's Grid/Flex rules.
    */
    <div style={{ display: "contents" }}>
      <SortableContext items={elementIds} strategy={verticalListSortingStrategy}>
        {safeElements.map((element) => {
          const isSelected = element.id === selectedElementId;
          
          const renderModule = () => {
            const props = { element, isSelected, selectedElementId, onSelect };
            switch (element.type) {
              case "Section": return <SectionModule {...props} />;
              case "Grid": return <GridModule {...props} />;
              case "Column": return <ColumnModule {...props} />;
              case "Heading": return <HeadingModule element={element} isSelected={isSelected} />;
              case "Text": return <TextBlockModule element={element} isSelected={isSelected} />;
              case "Button": return <ButtonModule element={element} isSelected={isSelected} />;
              case "Image": return <ImageModule element={element} isSelected={isSelected} />;
              default: return <div className="p-4 border border-red-500 bg-red-50 text-red-500">Unknown</div>;
            }
          };

          return (
            <SortableItem key={element.id} id={element.id}>
              <div 
                className="w-full h-full"
                onClick={(e) => { e.stopPropagation(); onSelect?.(element.id); }}
              >
                {renderModule()}
              </div>
            </SortableItem>
          );
        })}
      </SortableContext>
      
      {/* Root canvas always needs a placeholder to catch new drops */}
      {containerId === "root" && <CanvasPlaceholder isEmpty={safeElements.length === 0} containerId={containerId} />}
      
      {/* Sections and Columns also need placeholders to catch nested items */}
      {(containerId !== "root" && !containerId.includes("grid")) && (
        <CanvasPlaceholder isEmpty={safeElements.length === 0} containerId={containerId} />
      )}
    </div>
  );
}