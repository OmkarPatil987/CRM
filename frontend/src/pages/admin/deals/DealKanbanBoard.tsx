import React from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { DealListResponse } from '../../../utils/dto/response/deal'
import { Paper, Typography } from '@mui/material'
import {
    FiberNew,
    CheckCircle,
    Description,
    Handshake,
    EmojiEvents,
    Cancel
} from '@mui/icons-material'

interface DealKanbanBoardProps {
    deals: DealListResponse[]
    onDragEnd: (result: DropResult) => void
    onDealClick: (id: number) => void
}

const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']

const stageConfig: Record<string, { icon: React.ReactNode, colorClass: string, bgClass: string, borderClass: string }> = {
    'New': { icon: <FiberNew fontSize="small" />, colorClass: 'text-blue-700', bgClass: 'bg-blue-50', borderClass: 'border-blue-200' },
    'Qualified': { icon: <CheckCircle fontSize="small" />, colorClass: 'text-emerald-700', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200' },
    'Proposal': { icon: <Description fontSize="small" />, colorClass: 'text-amber-700', bgClass: 'bg-amber-50', borderClass: 'border-amber-200' },
    'Negotiation': { icon: <Handshake fontSize="small" />, colorClass: 'text-orange-700', bgClass: 'bg-orange-50', borderClass: 'border-orange-200' },
    'Won': { icon: <EmojiEvents fontSize="small" />, colorClass: 'text-purple-700', bgClass: 'bg-purple-50', borderClass: 'border-purple-200' },
    'Lost': { icon: <Cancel fontSize="small" />, colorClass: 'text-red-700', bgClass: 'bg-red-50', borderClass: 'border-red-200' },
}

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
                        {(() => {
                            const config = stageConfig[stage] || { icon: null, colorClass: 'text-slate-700', bgClass: 'bg-slate-50', borderClass: 'border-slate-200' }
                            return (
                                <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-lg border ${config.bgClass} ${config.borderClass}`}>
                                    <div className="flex items-center gap-2">
                                        <span className={`${config.colorClass}`}>{config.icon}</span>
                                        <span className={`font-semibold text-sm ${config.colorClass}`}>{stage}</span>
                                    </div>
                                    <span className={`bg-white/60 ${config.colorClass} text-xs px-2 py-0.5 rounded-full font-medium`}>
                                        {columns[stage]?.length || 0}
                                    </span>
                                </div>
                            )
                        })()}
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
