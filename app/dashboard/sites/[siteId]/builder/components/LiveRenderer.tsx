import React from "react";
import { CanvasElement } from "../schema";
import { SectionModule } from "./SectionModule";
import { HeadingModule } from "./HeadingModule";
import { TextBlockModule } from "./TextBlockModule";
import { ButtonModule } from "./ButtonModule";
import { ImageModule } from "./ImageModule";
import { GridModule } from "./GridModule";
import { ColumnModule } from "./ColumnModule";

interface LiveRendererProps {
  elements: CanvasElement[];
}

export function LiveRenderer({ elements }: LiveRendererProps) {
  if (!elements || elements.length === 0) return null;

  return (
    <>
      {elements.map((element) => {
        // We set isLive: true here. 
        // Any module receiving this will hide hover rings and editor labels.
        const props = { element, isSelected: false, isLive: true };
        
        switch (element.type) {
          case "Section": 
            return (
              <section key={element.id} style={{ backgroundColor: element.styles.backgroundColor, padding: element.styles.padding }}>
                 <div className="max-w-[1200px] mx-auto w-full flex flex-col">
                    <LiveRenderer elements={element.children || []} />
                 </div>
              </section>
            );
          case "Grid": 
            const colCount = element.children?.length || 1;
            return (
              <div key={element.id} style={{ 
                display: "grid", 
                gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`, 
                gap: element.styles.gap || "1.5rem", 
                padding: element.styles.padding || "0px",
                alignItems: element.styles.alignItems || "start" 
              }}>
                <LiveRenderer elements={element.children || []} />
              </div>
            );
          case "Column": 
            return (
              <div key={element.id} style={{ backgroundColor: element.styles.backgroundColor, padding: element.styles.padding }} className="flex flex-col gap-4">
                <LiveRenderer elements={element.children || []} />
              </div>
            );
          case "Heading": return <HeadingModule key={element.id} {...props} />;
          case "Text": return <TextBlockModule key={element.id} {...props} />;
          case "Button": return <ButtonModule key={element.id} {...props} />;
          case "Image": return <ImageModule key={element.id} {...props} />;
          default: return null;
        }
      })}
    </>
  );
}