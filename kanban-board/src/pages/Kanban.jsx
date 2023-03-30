import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';


function Kanban() {
    const itemsFromBackend = [
        { id: uuidv4(), content: "Finish BreakLine Assignment", priority: "HIGH"},
        { id: uuidv4(), content: "Apply to 10 Jobs", priority: "LOW"},
    ]

    const columnsFromBackend =
        {
            [uuidv4()]: {
                name: 'BACKLOG',
                items: itemsFromBackend
            },
            [uuidv4()]: {
                name: 'TO DO',
                items: []
            },
            [uuidv4()]: {
                name: 'IN PROGRESS',
                items: []
            },
            [uuidv4()]: {
                name: 'COMPLETED',
                items: []
            },
            [uuidv4()]: {
                name: 'NEEDS REVIEW',
                items: []
            }
        }

    const [ columns, setColumns ] = useState(columnsFromBackend);

    const onDragEnd = (result, columns, setColumns) => {
        if(!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId]
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            })
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            })
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
            <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                {Object.entries(columns).map(([id, column]) => {
                    return (
                        <div style={{ display: 'flex', flexDirection:'column', alignItems:'center' }}>
                            <h2>{column.name}</h2>
                            <div style={{margin: 8}}>
                                <Droppable droppableId={id} key={id}>
                                    {(provided, snapshot) => {
                                        return (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{
                                                    background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                                                    padding: 4,
                                                    width: 250,
                                                    minHeight: 900
                                                }}
                                            >
                                                {column.items.map((item, index) => {
                                                    return (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided, snapshot) => {
                                                                return (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            userSelect: 'none',
                                                                            padding: 16,
                                                                            margin: '0 00 8px 0',
                                                                            minHeight: '50px',
                                                                            backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                                                            color: 'white',
                                                                            ...provided.draggableProps.style
                                                                        }}
                                                                    >
                                                                        <div>
                                                                            {item.content}
                                                                        </div>
                                                                        <div>
                                                                            Priority: {item.priority}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }}
                                                        </Draggable>
                                                    )
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        )
                                    }}
                                </Droppable>
                            </div>
                        </div>
                    )
                })}
            </DragDropContext>

        </div>
    )
}

export default Kanban