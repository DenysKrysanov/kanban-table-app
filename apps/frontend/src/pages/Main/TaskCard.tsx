import React, { useState } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import ConfirmationModal from './ConfirmationModal';
import type { Card } from '../../types';

interface Props {
  card: Card;
  onDelete: () => void;
  onUpdate: (updatedCard: Card) => void;
  isDragOverlay?: boolean;
}

const TaskCard: React.FC<Props> = ({
  card,
  onDelete,
  onUpdate,
  isDragOverlay = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: card.id,
    disabled: isEditing || isDragOverlay,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `card-${card.id}`,
    disabled: isDragOverlay,
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onUpdate({ ...card, title: editTitle, description: editDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(card.title);
    setEditDescription(card.description);
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Failed to delete card:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  return (
    <>
      <div
        className={`card ${isOver ? 'card-over' : ''} ${isDragOverlay ? 'drag-overlay' : ''}`}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        {isEditing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="card-edit-input"
              onPointerDown={(e) => e.stopPropagation()}
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="card-edit-textarea"
              onPointerDown={(e) => e.stopPropagation()}
            />
            <div className="card-icons">
              <button
                className="icon-button save-button"
                onClick={handleSave}
                onPointerDown={(e) => e.stopPropagation()}
              >
                ✅
              </button>
              <button
                className="icon-button cancel-button"
                onClick={handleCancel}
                onPointerDown={(e) => e.stopPropagation()}
              >
                ❌
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">
              {card.description}
            </p>
            <div className="card-icons">
              <button
                className="icon-button edit-button"
                onClick={() => setIsEditing(true)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                ✏️
              </button>
              <button
                className="icon-button delete-button"
                onClick={handleDeleteClick}
                onPointerDown={(e) => e.stopPropagation()}
              >
                🗑️
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Card"
        message={`Are you sure you want to delete the card "${card.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default TaskCard;