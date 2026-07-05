'use client';
import { useState, useEffect } from 'react';
import { PlacementRecord, PlacementStage } from '@/src/types/placement.types';
import { PlacementService } from '@/src/services/placement.service';
import { Briefcase, Clock, CheckCircle } from 'lucide-react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { DragOverlay } from '@dnd-kit/core';
import { Drawer } from '../ui/Drawer';

const COLUMNS: PlacementStage[] = ['Applied', 'Shortlisted', 'Technical Round', 'HR Round', 'Offer Released', 'Joined'];

// Sortable Item Component
const SortableItem = ({ id, placement, onSelect }: { id: string, placement: PlacementRecord, onSelect?: (p: PlacementRecord) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect?.(placement)}
      className="bg-white border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-3"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-text-primary text-sm">{placement.studentName}</span>
        <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{placement.package}</span>
      </div>
      <div className="text-xs text-text-secondary font-medium">
        {placement.companyName} • {placement.role}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span>{placement.program}</span>
        {placement.interviewDate ? (
          <div className="flex items-center gap-1 text-amber-600">
            <Clock className="w-3 h-3" /> {new Date(placement.interviewDate).toLocaleDateString()}
          </div>
        ) : placement.joiningDate ? (
          <div className="flex items-center gap-1 text-emerald-600">
            <CheckCircle className="w-3 h-3" /> {new Date(placement.joiningDate).toLocaleDateString()}
          </div>
        ) : null}
      </div>
    </div>
  );
};

import { useDroppable } from '@dnd-kit/core';

// Droppable Column Component
const DroppableColumn = ({ id, items, children }: { id: string, items: any[], children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto min-h-[150px]">
      <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
        <div className="min-h-[100px] h-full">
          {children}
        </div>
      </SortableContext>
    </div>
  );
};

export default function PlacementPipeline() {
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedPlacement, setSelectedPlacement] = useState<PlacementRecord | null>(null);

  useEffect(() => {
    async function loadPlacements() {
      setLoading(true);
      try {
        const data = await PlacementService.getPlacements();
        const mappedData = data.map(p => ({
          ...p,
          stage: COLUMNS.includes(p.stage) ? p.stage : (p.stage === 'Selected' ? 'Offer Released' : 'Applied')
        }));
        setPlacements(mappedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadPlacements();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = placements.find(p => p.id === activeId);
    if (!activeItem) return;

    const oldColIndex = COLUMNS.indexOf(activeItem.stage);
    let targetStage: PlacementStage | null = null;
    
    if (COLUMNS.includes(overId as PlacementStage)) {
      targetStage = overId as PlacementStage;
    } else {
      const overItem = placements.find(p => p.id === overId);
      if (overItem) {
        targetStage = overItem.stage;
      }
    }

    if (!targetStage) return;

    const newColIndex = COLUMNS.indexOf(targetStage);

    if (newColIndex < oldColIndex) {
      alert("You cannot move a candidate backwards in the pipeline.");
      return;
    }

    if (activeItem.stage !== targetStage) {
      // Optimistic UI Update
      setPlacements((items) => items.map(item => 
        item.id === activeId ? { ...item, stage: targetStage! } : item
      ));
      // Persist to backend
      const success = await PlacementService.updatePlacementStage(activeId, targetStage);
      if (!success) {
        // Revert on failure
        alert("Failed to update pipeline stage in the database. Please try again.");
        setPlacements((items) => items.map(item => 
          item.id === activeId ? { ...item, stage: activeItem.stage } : item
        ));
      }
    } else {
      const overItem = placements.find(p => p.id === overId);
      if (overItem) {
        setPlacements((items) => {
          const oldIndex = items.findIndex((item) => item.id === activeId);
          const newIndex = items.findIndex((item) => item.id === overId);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-text-secondary">Loading pipeline board...</div>;
  }

  const activeItemData = activeId ? placements.find(p => p.id === activeId) : null;

  return (
    <div className="mt-6 overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex gap-4 min-w-[1500px] h-[calc(100vh-280px)]">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map((colName) => {
            const columnItems = placements.filter(p => p.stage === colName);
            return (
              <div key={colName} className="flex-1 min-w-[280px] max-w-[320px] bg-slate-100/80 rounded-2xl flex flex-col overflow-hidden border border-slate-200 shadow-inner">
                <div className="p-3.5 border-b border-slate-200/60 bg-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-[13px] text-slate-700 uppercase tracking-wider">{colName}</h3>
                  <span className="bg-white text-slate-500 shadow-sm border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {columnItems.length}
                  </span>
                </div>
                
                <DroppableColumn id={colName} items={columnItems.map(i => i.id)}>
                  {columnItems.map(item => (
                    <SortableItem key={item.id} id={item.id} placement={item} onSelect={setSelectedPlacement} />
                  ))}
                </DroppableColumn>
              </div>
            );
          })}

          <DragOverlay>
            {activeItemData ? (
              <div className="rotate-3 opacity-90">
                <SortableItem id={activeItemData.id} placement={activeItemData} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Drawer
        isOpen={!!selectedPlacement}
        onClose={() => setSelectedPlacement(null)}
        title="Application Details"
      >
        {selectedPlacement && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                {selectedPlacement.studentName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedPlacement.studentName}</h3>
                <p className="text-sm font-medium text-slate-500">{selectedPlacement.program}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Company</span>
                <span className="text-sm font-bold text-slate-800">{selectedPlacement.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Role</span>
                <span className="text-sm font-bold text-slate-800">{selectedPlacement.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Package</span>
                <span className="text-sm font-bold text-blue-600">{selectedPlacement.package}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current Stage</span>
                <span className="text-sm font-bold text-slate-800 px-2 py-0.5 bg-white rounded border border-slate-200">{selectedPlacement.stage}</span>
              </div>
              {selectedPlacement.interviewDate && (
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Interview Date</span>
                  <span className="text-sm font-bold text-slate-800">{new Date(selectedPlacement.interviewDate).toLocaleDateString()}</span>
                </div>
              )}
              {selectedPlacement.joiningDate && (
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Joining Date</span>
                  <span className="text-sm font-bold text-slate-800">{new Date(selectedPlacement.joiningDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
