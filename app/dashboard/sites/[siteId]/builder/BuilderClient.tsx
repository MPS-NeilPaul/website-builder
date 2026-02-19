"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronDown, Monitor, Tablet, Smartphone, Play, Save, Settings, 
  Type, Image as ImageIcon, LayoutGrid, Box, Plus, Sparkles, 
  MousePointer2, ArrowLeft, Wand2, AlignLeft, Lock, Loader2, Globe, Search, Trash2, AlignVerticalSpaceAround, AlignVerticalJustifyStart, AlignVerticalJustifyEnd
} from "lucide-react";
import toast from "react-hot-toast";
import { 
  DndContext, DragOverlay, DragEndEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, pointerWithin, MeasuringStrategy 
} from "@dnd-kit/core";
import { CanvasRenderer } from "./components/CanvasRenderer";
import { SidebarItem } from "./components/SidebarItem";
import { CanvasElement, ElementType } from "./schema";

type PageData = {
  id: string; siteId: string; title: string; slug: string; status: string;
  aiSeoScore: number; metaTitle: string | null; metaDescription: string | null;
  focusKeywords: string[]; content: { elements: CanvasElement[] };
};

interface BuilderClientProps {
  siteId: string; siteName: string; initialPages: PageData[];
}

const createNewElement = (type: ElementType): CanvasElement => {
  const base = { id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, type };
  switch (type) {
    case "Section": return { ...base, styles: { padding: "4rem 2rem", backgroundColor: "#ffffff" }, content: {}, children: [] };
    case "Grid": return { 
      ...base, 
      styles: { gap: "1.5rem", padding: "1rem", alignItems: "start" }, 
      content: {}, 
      children: [
        { id: `col-${Date.now()}-1`, type: "Column", content: {}, styles: { padding: "1rem" }, children: [] },
        { id: `col-${Date.now()}-2`, type: "Column", content: {}, styles: { padding: "1rem" }, children: [] }
      ] 
    };
    case "Column": return { ...base, styles: { padding: "1rem" }, content: {}, children: [] };
    case "Heading": return { ...base, styles: { fontSize: "2.25rem", fontWeight: "700", textAlign: "left", color: "#111827" }, content: { text: "New Heading", level: "h2" } };
    case "Text": return { ...base, styles: { fontSize: "1rem", lineHeight: "1.6", textAlign: "left", color: "#4b5563" }, content: { text: "Start typing your content here." } };
    case "Button": return { ...base, styles: { backgroundColor: "#2563eb", color: "#ffffff", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", textAlign: "center" }, content: { text: "Click Me", url: "#" } };
    case "Image": return { ...base, styles: { width: "100%", borderRadius: "0.5rem" }, content: { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564", alt: "Placeholder Image" } };
  }
};

const findElementRecursive = (elements: CanvasElement[], id: string): CanvasElement | null => {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElementRecursive(el.children, id);
      if (found) return found;
    }
  }
  return null;
};

export default function BuilderClient({ siteId, siteName, initialPages }: BuilderClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const [pages, setPages] = useState<PageData[]>(initialPages);
  const [activePageId, setActivePageId] = useState<string>(initialPages[0].id);
  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [leftTab, setLeftTab] = useState<"add" | "layers">("add");
  const [rightTab, setRightTab] = useState<"design" | "page" | "seo">("design");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  const [activeDragType, setActiveDragType] = useState<ElementType | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

  const selectedElement = selectedElementId ? findElementRecursive(activePage.content?.elements || [], selectedElementId) : null;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleUpdateElement = (id: string, updates: { content?: any, styles?: any }) => {
    setPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;
      const updateRecursive = (elements: CanvasElement[]): CanvasElement[] => {
        return elements.map(el => {
          if (el.id === id) return { ...el, content: { ...el.content, ...updates.content }, styles: { ...el.styles, ...updates.styles } };
          if (el.children) return { ...el, children: updateRecursive(el.children) };
          return el;
        });
      };
      return { ...p, content: { ...p.content, elements: updateRecursive(p.content?.elements || []) } };
    }));
  };

  const handleSetGridColumns = (gridId: string, count: number) => {
    setPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;
      const updateRecursive = (elements: CanvasElement[]): CanvasElement[] => {
        return elements.map(el => {
          if (el.id === gridId) {
            const currentCols = el.children || [];
            let newCols = [...currentCols];
            if (newCols.length < count) {
              const colsToAdd = count - newCols.length;
              for (let i = 0; i < colsToAdd; i++) newCols.push(createNewElement("Column"));
            } else if (newCols.length > count) {
               newCols = newCols.slice(0, count);
            }
            return { ...el, children: newCols };
          }
          if (el.children) return { ...el, children: updateRecursive(el.children) };
          return el;
        });
      };
      return { ...p, content: { ...p.content, elements: updateRecursive(p.content?.elements || []) } };
    }));
  };

  const deleteElement = () => {
    if (!selectedElementId) return;
    setPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;
      const deleteRecursive = (elements: CanvasElement[]): CanvasElement[] => {
        return elements.filter(el => el.id !== selectedElementId).map(el => el.children ? { ...el, children: deleteRecursive(el.children) } : el);
      };
      return { ...p, content: { ...p.content, elements: deleteRecursive(p.content?.elements || []) } };
    }));
    setSelectedElementId(null);
    toast.success("Element deleted");
  };

  const handleUpdateActivePage = (field: keyof PageData, value: any) => setPages(prev => prev.map(p => p.id === activePageId ? { ...p, [field]: value } : p));
  const handleUpdateMultipleFields = (updates: Partial<PageData>) => setPages(prev => prev.map(p => p.id === activePageId ? { ...p, ...updates } : p));
  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => handleUpdateActivePage("focusKeywords", e.target.value.split(",").map(k => k.trim()));

  const handleGenerateSEO = async () => {
    setIsGeneratingSEO(true);
    try {
      const res = await fetch("/api/ai/generate-seo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pageTitle: activePage.title, siteName: siteName }) });
      if (!res.ok) throw new Error("Failed");
      const aiData = await res.json();
      handleUpdateMultipleFields({ metaTitle: aiData.metaTitle, metaDescription: aiData.metaDescription, focusKeywords: aiData.focusKeywords, aiSeoScore: aiData.aiSeoScore });
      toast.success("AI optimized SEO metadata!");
    } catch { toast.error("Failed to reach AI."); } finally { setIsGeneratingSEO(false); }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/pages/${activePage.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(activePage) });
      if (!res.ok) throw new Error("Failed");
      toast.success("Saved to database!");
    } catch { toast.error("Failed to save."); } finally { setIsSaving(false); }
  };

  const handleDragStart = (e: DragStartEvent) => { 
    if (e.active.data.current?.isSidebarItem) setActiveDragType(e.active.data.current.type); 
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDragType(null);
    const { active, over } = e;
    
    if (!over) {
      toast.error("Missed the drop zone. Drag directly over a highlighted area.");
      return;
    }

    setPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;

      let currentTree = p.content?.elements || [];
      let draggedItem: CanvasElement | null = null;
      let isNewItem = false;

      // 1. EXTRACT THE DRAGGED ITEM
      if (active.data.current?.isSidebarItem) {
        draggedItem = createNewElement(active.data.current.type);
        isNewItem = true;
      } else {
        const extractRecursive = (elements: CanvasElement[]): CanvasElement[] => {
          const index = elements.findIndex(el => el.id === active.id);
          if (index !== -1) {
            draggedItem = elements[index];
            const newEls = [...elements];
            newEls.splice(index, 1);
            return newEls;
          }
          return elements.map(el => el.children ? { ...el, children: extractRecursive(el.children) } : el);
        };
        currentTree = extractRecursive(currentTree);
      }

      if (!draggedItem) return p;

      // 2. PARSE PLACEHOLDER DROP (Appending inside a container)
      if (String(over.id).startsWith("placeholder-")) {
        const targetContainerId = String(over.id).replace("placeholder-", "");
        
        if (targetContainerId === "root") {
          const finalTree = [...currentTree, draggedItem];
          if (isNewItem) { setSelectedElementId(draggedItem.id); setRightTab("design"); }
          return { ...p, content: { ...p.content, elements: finalTree } };
        } else {
          let success = false;
          const appendRecursive = (elements: CanvasElement[]): CanvasElement[] => {
            return elements.map(el => {
              if (el.id === targetContainerId) {
                 if (draggedItem!.type === "Section") {
                   toast.error("Sections must remain at the root level.");
                   return el;
                 }
                 if (el.type === "Grid" && draggedItem!.type !== "Column") {
                   toast.error("Only columns can be added directly inside Grids.");
                   return el;
                 }
                 success = true;
                 return { ...el, children: [...(el.children || []), draggedItem!] };
              }
              if (el.children) return { ...el, children: appendRecursive(el.children) };
              return el;
            });
          };

          const updatedTree = appendRecursive(currentTree);
          if (success) {
            if (isNewItem) { setSelectedElementId(draggedItem.id); setRightTab("design"); }
            return { ...p, content: { ...p.content, elements: updatedTree } };
          }
          return p;
        }
      }

      // 3. PARSE ELEMENT DROP (Reordering next to an existing item)
      const insertRecursive = (elements: CanvasElement[], isRoot: boolean): { updated: CanvasElement[], success: boolean } => {
        let newElements = [...elements];
        const overIndex = newElements.findIndex(el => el.id === over.id);

        if (overIndex !== -1) {
          const targetEl = newElements[overIndex];

          if (!isRoot && draggedItem!.type === "Section") {
            toast.error("Sections must remain at the root level.");
            return { updated: elements, success: false };
          }
          if (targetEl.type === "Grid" && draggedItem!.type === "Grid") {
            toast.error("You cannot place a Grid next to another Grid inside a column.");
            newElements.splice(overIndex + 1, 0, draggedItem!);
            return { updated: newElements, success: true };
          }
          
          newElements.splice(overIndex, 0, draggedItem!);
          return { updated: newElements, success: true };
        }

        for (let i = 0; i < newElements.length; i++) {
          if (newElements[i].children) {
            const { updated: updatedChildren, success } = insertRecursive(newElements[i].children!, false);
            if (success) {
              newElements[i] = { ...newElements[i], children: updatedChildren };
              return { updated: newElements, success: true };
            }
          }
        }
        return { updated: elements, success: false };
      };

      const { updated, success } = insertRecursive(currentTree, true);

      if (success) {
        if (isNewItem) { setSelectedElementId(draggedItem.id); setRightTab("design"); }
        return { ...p, content: { ...p.content, elements: updated } };
      }

      return p;
    }));
  };

  if (!isMounted) return null;

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} measuring={{ droppable: { strategy: MeasuringStrategy.Always } }} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen w-screen bg-[#0a0a0a] text-gray-300 flex flex-col font-sans overflow-hidden fixed inset-0 z-50">
        
        {/* TOP BAR */}
        <header className="h-14 border-b border-gray-800 bg-[#111] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/sites/${siteId}`} className="p-2 hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /></Link>
            <div className="h-6 w-px bg-gray-800"></div>
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-sm font-medium text-white transition-all">
                <span className="text-gray-400">Page:</span> {activePage.title} <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
              </button>
            </div>
          </div>
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-1">
            <button onClick={() => setViewport("desktop")} className={`p-1.5 rounded-md transition-all ${viewport === "desktop" ? "bg-gray-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}><Monitor className="h-4 w-4" /></button>
            <button onClick={() => setViewport("tablet")} className={`p-1.5 rounded-md transition-all ${viewport === "tablet" ? "bg-gray-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}><Tablet className="h-4 w-4" /></button>
            <button onClick={() => setViewport("mobile")} className={`p-1.5 rounded-md transition-all ${viewport === "mobile" ? "bg-gray-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}><Smartphone className="h-4 w-4" /></button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold"><Sparkles className="h-3.5 w-3.5" /> SEO: {activePage.aiSeoScore}/100</div>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT PANEL */}
          <aside className="w-64 bg-[#111] border-r border-gray-800 flex flex-col shrink-0">
            <div className="flex border-b border-gray-800">
              <button onClick={() => setLeftTab("add")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${leftTab === "add" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-500 hover:text-gray-300"}`}>Add Elements</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {leftTab === "add" && (
                <>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Layout</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <SidebarItem type="Section" label="Section" icon={<Box className="h-5 w-5" />} />
                      <SidebarItem type="Grid" label="Grid" icon={<LayoutGrid className="h-5 w-5" />} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Content</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <SidebarItem type="Heading" label="Heading" icon={<Type className="h-5 w-5" />} />
                      <SidebarItem type="Text" label="Text" icon={<AlignLeft className="h-5 w-5" />} />
                      <SidebarItem type="Button" label="Button" icon={<MousePointer2 className="h-5 w-5" />} />
                      <SidebarItem type="Image" label="Image" icon={<ImageIcon className="h-5 w-5" />} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>

          {/* CANVAS */}
          <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center bg-[#0a0a0a]" onClick={() => setSelectedElementId(null)}>
            <div className={`bg-white text-black flex flex-col shadow-2xl transition-all duration-300 ring-1 ring-gray-800 ${viewport === "desktop" ? "w-full max-w-[1200px]" : viewport === "tablet" ? "w-[768px]" : "w-[375px]"} min-h-[800px]`}>
              <div className="bg-gray-100/80 border-b border-gray-200 p-4 flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest select-none"><Lock className="h-3.5 w-3.5" /> Global Navigation (Edit in Theme Settings)</div>
              
              <div className="flex-1 w-full h-full min-h-[600px] flex flex-col transition-all duration-200 p-4">
                <CanvasRenderer elements={activePage.content.elements || []} selectedElementId={selectedElementId} onSelect={setSelectedElementId} containerId="root" />
              </div>

              <div className="bg-gray-100/80 border-t border-gray-200 p-6 flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest select-none"><Lock className="h-3.5 w-3.5" /> Global Footer (Edit in Theme Settings)</div>
            </div>
          </main>

          {/* RIGHT PANEL */}
          <aside className="w-80 bg-[#111] border-l border-gray-800 flex flex-col shrink-0 overflow-y-auto pb-10">
            <div className="flex border-b border-gray-800 sticky top-0 bg-[#111] z-10">
              <button onClick={() => setRightTab("design")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 ${rightTab === "design" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-500"}`}>Design</button>
              <button onClick={() => setRightTab("page")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 ${rightTab === "page" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-500"}`}>Page</button>
              <button onClick={() => setRightTab("seo")} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 ${rightTab === "seo" ? "border-purple-500 text-purple-400" : "border-transparent text-gray-500"}`}><Search className="h-3.5 w-3.5" /> SEO</button>
            </div>

            <div className="p-5 space-y-6">
              
              {/* DESIGN TAB */}
              {rightTab === "design" && (
                selectedElement ? (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-bold text-white uppercase tracking-wider">{selectedElement.type} Settings</span>
                      </div>
                      <button onClick={deleteElement} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors" title="Delete Element">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {selectedElement.type === "Grid" && (
                      <div className="space-y-4 pb-4 border-b border-gray-800">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Column Layout</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <button 
                                key={num}
                                onClick={() => handleSetGridColumns(selectedElement.id, num)}
                                className={`py-2 text-xs font-bold rounded-md border transition-colors ${
                                  (selectedElement.children?.length || 1) === num 
                                    ? "bg-blue-600 border-blue-500 text-white" 
                                    : "bg-[#1a1a1a] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                                }`}
                              >
                                {num} Col
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                           <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Vertical Align</label>
                           <div className="flex bg-[#1a1a1a] border border-gray-700 rounded-md overflow-hidden">
                             <button onClick={() => handleUpdateElement(selectedElement.id, { styles: { alignItems: "start" } })} className={`flex-1 flex justify-center py-2 transition-colors ${selectedElement.styles.alignItems === "start" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-white hover:bg-gray-800"}`} title="Top"><AlignVerticalJustifyStart className="h-4 w-4" /></button>
                             <button onClick={() => handleUpdateElement(selectedElement.id, { styles: { alignItems: "center" } })} className={`flex-1 flex justify-center py-2 transition-colors border-l border-r border-gray-700 ${selectedElement.styles.alignItems === "center" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-white hover:bg-gray-800"}`} title="Middle"><AlignVerticalSpaceAround className="h-4 w-4" /></button>
                             <button onClick={() => handleUpdateElement(selectedElement.id, { styles: { alignItems: "end" } })} className={`flex-1 flex justify-center py-2 transition-colors ${selectedElement.styles.alignItems === "end" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-white hover:bg-gray-800"}`} title="Bottom"><AlignVerticalJustifyEnd className="h-4 w-4" /></button>
                           </div>
                        </div>
                      </div>
                    )}

                    {(selectedElement.type === "Heading" || selectedElement.type === "Text" || selectedElement.type === "Button") && (
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Content</label>
                        <textarea value={selectedElement.content.text || ""} onChange={(e) => handleUpdateElement(selectedElement.id, { content: { text: e.target.value } })} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none" rows={selectedElement.type === "Text" ? 4 : 2} />
                      </div>
                    )}

                    {selectedElement.type === "Button" && (
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Link URL</label>
                        <input type="text" value={selectedElement.content.url || ""} onChange={(e) => handleUpdateElement(selectedElement.id, { content: { url: e.target.value } })} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500" />
                      </div>
                    )}

                    {selectedElement.type === "Image" && (
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Image URL</label>
                        <input type="text" value={selectedElement.content.src || ""} onChange={(e) => handleUpdateElement(selectedElement.id, { content: { src: e.target.value } })} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500" />
                      </div>
                    )}

                    {selectedElement.type === "Heading" && (
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">HTML Tag (SEO)</label>
                        <select value={selectedElement.content.level || "h2"} onChange={(e) => handleUpdateElement(selectedElement.id, { content: { level: e.target.value } })} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                          <option value="h1">Heading 1 (Main Title)</option>
                          <option value="h2">Heading 2 (Section Title)</option>
                          <option value="h3">Heading 3 (Sub-section)</option>
                        </select>
                      </div>
                    )}

                    {(selectedElement.type === "Heading" || selectedElement.type === "Text") && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Font Size</label>
                          <input type="text" value={selectedElement.styles.fontSize || ""} onChange={(e) => handleUpdateElement(selectedElement.id, { styles: { fontSize: e.target.value } })} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-blue-500" placeholder="e.g. 2rem" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Alignment</label>
                          <select value={selectedElement.styles.textAlign || "left"} onChange={(e) => handleUpdateElement(selectedElement.id, { styles: { textAlign: e.target.value } })} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {selectedElement.type === "Grid" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Gap</label>
                          <input type="text" value={selectedElement.styles.gap || ""} onChange={(e) => handleUpdateElement(selectedElement.id, { styles: { gap: e.target.value } })} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-blue-500" placeholder="1.5rem" />
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 pt-2 border-t border-gray-800">
                      {selectedElement.styles.color !== undefined && (
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Text Color</label>
                          <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-700 rounded-md p-1 pl-2">
                            <span className="text-[10px] text-gray-400 font-mono uppercase">{selectedElement.styles.color}</span>
                            <input type="color" value={selectedElement.styles.color} onChange={(e) => handleUpdateElement(selectedElement.id, { styles: { color: e.target.value } })} className="h-6 w-6 rounded cursor-pointer bg-transparent border-0 p-0" />
                          </div>
                        </div>
                      )}
                      
                      {selectedElement.styles.backgroundColor !== undefined && (
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Background</label>
                          <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-700 rounded-md p-1 pl-2">
                            <span className="text-[10px] text-gray-400 font-mono uppercase">{selectedElement.styles.backgroundColor}</span>
                            <input type="color" value={selectedElement.styles.backgroundColor} onChange={(e) => handleUpdateElement(selectedElement.id, { styles: { backgroundColor: e.target.value } })} className="h-6 w-6 rounded cursor-pointer bg-transparent border-0 p-0" />
                          </div>
                        </div>
                      )}
                    </div>

                    {(selectedElement.type === "Section" || selectedElement.type === "Column" || selectedElement.type === "Grid") && (
                      <div className="pt-2 border-t border-gray-800">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Padding (CSS)</label>
                        <input type="text" value={selectedElement.styles.padding || ""} onChange={(e) => handleUpdateElement(selectedElement.id, { styles: { padding: e.target.value } })} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-blue-500" placeholder="1rem" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center mt-10">
                    <Settings className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    Click an element on the canvas to edit its properties or delete it.
                  </div>
                )
              )}

              {/* PAGE TAB */}
              {rightTab === "page" && (
                <div className="space-y-6">
                  <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Page Title</label><input type="text" value={activePage.title} onChange={(e) => handleUpdateActivePage("title", e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" /></div>
                  <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">URL Slug</label><div className="flex rounded-lg border border-gray-700 overflow-hidden focus-within:border-blue-500 transition-colors"><span className="bg-gray-800 px-3 py-2.5 text-sm text-gray-500 flex items-center border-r border-gray-700"><Globe className="h-4 w-4" /></span><input type="text" value={activePage.slug} onChange={(e) => handleUpdateActivePage("slug", e.target.value)} className="w-full bg-[#0a0a0a] p-2.5 text-sm font-mono text-white focus:outline-none" /></div></div>
                  <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label><select value={activePage.status} onChange={(e) => handleUpdateActivePage("status", e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"><option value="DRAFT">Draft (Hidden)</option><option value="PUBLISHED">Published (Live)</option></select></div>
                </div>
              )}

              {/* SEO TAB */}
              {rightTab === "seo" && (
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20 rounded-xl">
                    <div className="flex items-start gap-3 mb-3"><div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Wand2 className="h-5 w-5" /></div><div><h4 className="text-sm font-bold text-white">Auto-SEO Optimizer</h4><p className="text-xs text-gray-400 mt-1">AI will scan your page content and generate optimal meta tags.</p></div></div>
                    <button onClick={handleGenerateSEO} disabled={isGeneratingSEO} className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-purple-900/20">{isGeneratingSEO ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{isGeneratingSEO ? "Analyzing Canvas..." : "Generate SEO Meta"}</button>
                  </div>
                  <div className="space-y-5">
                    <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Meta Title</label><input type="text" value={activePage.metaTitle || ""} onChange={(e) => handleUpdateActivePage("metaTitle", e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" /></div>
                    <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Meta Description</label><textarea value={activePage.metaDescription || ""} onChange={(e) => handleUpdateActivePage("metaDescription", e.target.value)} className="w-full h-24 bg-[#0a0a0a] border border-gray-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-purple-500 resize-none transition-colors"></textarea></div>
                    <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Keywords (Comma Separated)</label><input type="text" value={(activePage.focusKeywords || []).join(", ")} onChange={handleKeywordsChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" /></div>
                  </div>
                </div>
              )}

            </div>
          </aside>

        </div>
      </div>
      
      <DragOverlay dropAnimation={null}>
        {activeDragType ? (
          <div className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded shadow-2xl flex items-center gap-2 pointer-events-none">
            Dropping: {activeDragType}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}