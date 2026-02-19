export type ElementType = "Section" | "Grid" | "Column" | "Heading" | "Text" | "Button" | "Image";

export interface CanvasElement {
  id: string;
  type: ElementType;
  content: Record<string, any>;
  styles: Record<string, string>;
  children?: CanvasElement[];
}