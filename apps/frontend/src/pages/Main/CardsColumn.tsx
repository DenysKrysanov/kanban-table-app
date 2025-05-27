import React, { useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useAppDispatch } from '../../hooks';
import { createCard, deleteCard, updateCard } from '../../features/cards/cardsSlice';
import type { Card } from '../../types';
import AddCardForm from './AddCardForm';
import TaskCard from './TaskCard';

interface Props {
  columnTitle: 'To Do' | 'In Progress' | 'Done';
  cards: Card[];
  boardId: string;
  addingStatus: string | null;
  setAddingStatus: React.Dispatch<React.SetStateAction<string | null>>;
}

const CardsColumn: React.FC<Props> = ({
  columnTitle,
  cards,
  boardId,
  addingStatus,
  setAddingStatus,
}) => {
  const dispatch = useAppDispatch();
  const addFormRef = useRef<HTMLDivElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${columnTitle}`,
  });

  const handleAddCard = (newCardData: { title: string; description: string }) => {
    dispatch(
      createCard({
        ...newCardData,
        boardId: boardId!,
        status: columnTitle,
        order: cards.length + 1,
      })
    );
    setAddingStatus(null);
  };

  const handleDeleteCard = async (cardId: string) => {
    await dispatch(deleteCard(cardId)).unwrap();
  };

  useEffect(() => {
    if (addingStatus === columnTitle && addFormRef.current) {
      addFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [addingStatus, columnTitle]);

  return (
    <div
      className={`column ${isOver ? 'column-over' : ''}`}
      ref={setNodeRef}
    >
      <h2 className="column-title">{columnTitle}</h2>
      
      {cards.map((card) => (
        <TaskCard
          key={card.id}
          card={card}
          onDelete={() => handleDeleteCard(card.id)}
          onUpdate={(updatedCardData: Card) => dispatch(updateCard(updatedCardData))}
        />
      ))}

      {columnTitle === 'To Do' && (
        <div ref={addFormRef} className="card">
          {addingStatus === columnTitle ? (
            <AddCardForm
              onAdd={handleAddCard}
              onCancel={() => setAddingStatus(null)}
            />
          ) : (
            <button
              className="add-card-button"
              onClick={() => setAddingStatus(columnTitle)}
            >
              +
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CardsColumn;