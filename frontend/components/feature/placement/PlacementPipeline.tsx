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

const COLUMNS: PlacementStage[] = ['Applied', 'Shortlisted', 'Technical Round', 'HR Round', 'Offer Released', 'Joined'];

// Sortable Item Component
const SortableItem = ({ id, placement }: { id: string, placement: PlacementRecord }) => {
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

export default function PlacementPipeline() {
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlacements() {
      setLoading(true);
      try {
        const data = await PlacementService.getPlacements();
        // Fallback stages for mock data
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle dropping into a column directly
    if (COLUMNS.includes(overId as PlacementStage)) {
      setPlacements((items) => {
        return items.map(item => 
          item.id === activeId ? { ...item, stage: overId as PlacementStage } : item
        );
      });
      return;
    }

    // Handle reordering / dropping onto another item
    const activeItem = placements.find(p => p.id === activeId);
    const overItem = placements.find(p => p.id === overId);

    if (activeItem && overItem) {
      if (activeItem.stage !== overItem.stage) {
        // Moving to a different column
        setPlacements((items) => {
          return items.map(item => 
            item.id === activeId ? { ...item, stage: overItem.stage } : item
          );
        });
      } else {
        // Reordering in the same column
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

  return (
    <div className="mt-6 overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1200px] h-[calc(100vh-280px)]">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          {COLUMNS.map((colName) => {
            const columnItems = placements.filter(p => p.stage === colName);
            return (
              <div key={colName} className="flex-1 min-w-[280px] bg-slate-50/50 border border-border rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border bg-white flex justify-between items-center">
                  <h3 className="font-bold text-sm text-text-primary tracking-tight">{colName}</h3>
                  <span className="bg-slate-100 text-text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {columnItems.length}
                  </span>
                </div>
                
                {/* Column Droppable Area */}
                <div className="flex-1 p-3 overflow-y-auto">
                  <SortableContext 
                    id={colName}
                    items={columnItems.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="min-h-[100px]">
                      {columnItems.map(item => (
                        <SortableItem key={item.id} id={item.id} placement={item} />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </DndContext>
      </div>
    </div>
  );
}
