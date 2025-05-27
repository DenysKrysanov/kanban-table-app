import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchCardsByBoardId, updateCard } from '../../features/cards/cardsSlice';
import { fetchBoardById, deleteBoard } from '../../features/boards/boardsSlice';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import CardsColumn from './CardsColumn';
import TaskCard from './TaskCard';
import ConfirmationModal from './ConfirmationModal';
import './styles.css';
import type { Card } from '../../types';

const BoardView: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cards = useAppSelector((state) => state.cards.items);
  const selectedBoard = useAppSelector((state) => state.boards.selectedBoard);
  const [addingStatus, setAddingStatus] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (boardId) {
      dispatch(fetchCardsByBoardId(boardId));
      dispatch(fetchBoardById(boardId));
    }
  }, [dispatch, boardId]);

  const getCardsByStatus = (status: string): Card[] => {
    return (Array.isArray(cards) ? cards : [])
      .filter((card) => card.status === status)
      .sort((a, b) => a.order - b.order);
  };

  const handleDeleteBoard = async () => {
    if (!boardId || !selectedBoard) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteBoard(boardId)).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Failed to delete board:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find(c => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const cardId = active.id as string;
    const draggedCard = cards.find(card => card.id === cardId);
    if (!draggedCard) return;

    const overId = over.id as string;
    let newStatus: 'To Do' | 'In Progress' | 'Done';
    let newPosition: number;

    if (overId.startsWith('column-')) {
      newStatus = overId.replace('column-', '') as 'To Do' | 'In Progress' | 'Done';
      newPosition = getCardsByStatus(newStatus).length;
    } else if (overId.startsWith('card-')) {
      const targetCard = cards.find(card => card.id === overId.replace('card-', ''));
      if (!targetCard) return;

      newStatus = targetCard.status;
      const targetCards = getCardsByStatus(newStatus);
      newPosition = targetCards.findIndex(card => card.id === targetCard.id);
    } else {
      return;
    }

    if (draggedCard.status === newStatus &&
      getCardsByStatus(draggedCard.status).findIndex(c => c.id === draggedCard.id) === newPosition) {
      return;
    }

    const sourceCards = getCardsByStatus(draggedCard.status);
    const destCards = newStatus === draggedCard.status ? sourceCards : getCardsByStatus(newStatus);

    let cardsToUpdate: Card[] = [];

    if (draggedCard.status === newStatus) {
      const oldIndex = sourceCards.findIndex(c => c.id === draggedCard.id);
      const reorderedCards = [...sourceCards];
      const [movedCard] = reorderedCards.splice(oldIndex, 1);
      reorderedCards.splice(newPosition, 0, movedCard);

      cardsToUpdate = reorderedCards.map((card, index) => ({
        ...card,
        order: index + 1
      }));
    } else {

      const updatedSourceCards = sourceCards
        .filter(c => c.id !== draggedCard.id)
        .map((card, index) => ({
          ...card,
          order: index + 1
        }));

      const updatedDestCards = [...destCards];
      updatedDestCards.splice(newPosition, 0, { ...draggedCard, status: newStatus });
      const finalDestCards = updatedDestCards.map((card, index) => ({
        ...card,
        order: index + 1,
        status: newStatus
      }));

      cardsToUpdate = [...updatedSourceCards, ...finalDestCards];
    }

    const finalCardsToUpdate = cardsToUpdate.filter(updatedCard => {
      const originalCard = cards.find(c => c.id === updatedCard.id);
      return originalCard && (
        originalCard.order !== updatedCard.order ||
        originalCard.status !== updatedCard.status
      );
    });

    finalCardsToUpdate.forEach(card => {
      dispatch(updateCard(card));
    });
  };

  return (
    <div className="board-view">
      {selectedBoard && (
        <>
          <div className="board-header">
            <h1 className="board-name">{selectedBoard.name}</h1>
            <button
              className="delete-board-btn"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              title="Delete Board"
            >
              {isDeleting ? '⏳' : '🗑️'}
            </button>
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Board"
        message={`Are you sure you want to delete "${selectedBoard?.name}"? This action cannot be undone and all cards will be permanently deleted.`}
        onConfirm={handleDeleteBoard}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
        loadingText="Deleting..."
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {(['To Do', 'In Progress', 'Done'] as const).map((columnTitle) => (
          <CardsColumn
            key={columnTitle}
            columnTitle={columnTitle}
            cards={getCardsByStatus(columnTitle)}
            boardId={boardId!}
            addingStatus={addingStatus}
            setAddingStatus={setAddingStatus}
          />
        ))}

        <DragOverlay>
          {activeCard ? (
            <TaskCard
              card={activeCard}
              onDelete={() => { }}
              onUpdate={() => { }}
              isDragOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default BoardView;