import React from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { DealListResponse } from '../../../utils/dto/response/deal'
import { Paper, Typography } from '@mui/material'

interface DealKanbanBoardProps {
    deals: DealListResponse[]
    onDragEnd: (result: DropResult) => void
    onDealClick: (id: number) => void
}

const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']

const DealKanbanBoard: React.FC<DealKanbanBoardProps> = ({ deals, onDragEnd, onDealClick }) => {

    // Group deals by stage
    const columns = stages.reduce((acc, stage) => {
        acc[stage] = deals.filter(d => d.stage === stage)
        return acc
    }, {} as Record<string, DealListResponse[]>)

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full w-full overflow-x-auto pb-4 gap-4 px-2">
                {stages.map((stage) => (
                    <div key={stage} className="flex-shrink-0 w-72 flex flex-col">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="font-semibold text-slate-700 text-sm">{stage}</span>
                            <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                                {columns[stage]?.length || 0}
                            </span>
                        </div>
                        <Droppable droppableId={stage}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`flex-1 rounded-xl p-2 transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50/50' : 'bg-slate-50'
                                        }`}
                                    style={{ minHeight: '150px' }}
                                >
                                    {columns[stage]?.map((deal, index) => (
                                        <Draggable key={deal.id} draggableId={deal.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => onDealClick(deal.id)}
                                                    className={`mb-3 select-none rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl cursor-grabbing' : 'cursor-grab'
                                                        }`}
                                                    style={{ ...provided.draggableProps.style }}
                                                >
                                                    <div className="mb-2">
                                                        <h4 className="font-medium text-slate-900 text-sm line-clamp-2">{deal.title}</h4>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                                        <span>${deal.amount.toLocaleString()}</span>
                                                        <span>{deal.probability}%</span>
                                                    </div>
                                                    {deal.contact_name && (
                                                        <div className="mt-2 text-xs text-indigo-600 truncate">
                                                            {deal.contact_name}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    )
}

export default DealKanbanBoard
