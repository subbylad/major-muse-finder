import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GripVertical, Info } from 'lucide-react';

interface HollandCodeItem {
  id: string;
  title: string;
  description: string;
  tooltip: string;
}

interface HollandCodeRankingProps {
  items: string[];
  onReorder: (newOrder: string[]) => void;
}

const hollandCodeItems: Record<string, HollandCodeItem> = {
  realistic: {
    id: 'realistic',
    title: 'Realistic',
    description: 'Building, repairing, working with tools/machines',
    tooltip: 'Hands-on work with objects, machines, tools, or outdoor activities. Often involves mechanical, electrical, or technical skills.'
  },
  investigative: {
    id: 'investigative',
    title: 'Investigative',
    description: 'Researching, analyzing, solving complex problems',
    tooltip: 'Scientific thinking, research, and problem-solving. Often involves mathematics, biology, chemistry, or other sciences.'
  },
  artistic: {
    id: 'artistic',
    title: 'Artistic',
    description: 'Creating, designing, expressing ideas',
    tooltip: 'Creative expression through art, music, writing, or design. Values originality, creativity, and aesthetic beauty.'
  },
  social: {
    id: 'social',
    title: 'Social',
    description: 'Helping, teaching, working directly with people',
    tooltip: 'Working with people to inform, help, train, or cure. Often involves counseling, teaching, or healthcare.'
  },
  enterprising: {
    id: 'enterprising',
    title: 'Enterprising',
    description: 'Leading, persuading, managing projects/people',
    tooltip: 'Business, leadership, and persuasion. Often involves selling, managing, or starting businesses.'
  },
  conventional: {
    id: 'conventional',
    title: 'Conventional',
    description: 'Organizing, managing data, ensuring accuracy',
    tooltip: 'Working with data, files, or procedures. Values order, accuracy, and following established procedures.'
  }
};

export function HollandCodeRanking({ items, onReorder }: HollandCodeRankingProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);

    onReorder(newItems);
  };

  return (
    <TooltipProvider>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            Drag and drop to rank from <strong>most interesting</strong> (top) to <strong>least interesting</strong> (bottom)
          </p>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="holland-code-ranking">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-3 transition-colors duration-200 ${
                  snapshot.isDraggingOver ? 'bg-muted/20' : ''
                }`}
              >
                {items.map((itemId, index) => {
                  const item = hollandCodeItems[itemId];
                  return (
                    <Draggable key={itemId} draggableId={itemId} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 cursor-move transition-all duration-200 ${
                            snapshot.isDragging 
                              ? 'shadow-lg rotate-1 ring-2 ring-primary' 
                              : 'hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                                {index + 1}
                              </span>
                              <div
                                {...provided.dragHandleProps}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-foreground">{item.title}</h3>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-xs">
                                    <p>{item.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </TooltipProvider>
  );
}