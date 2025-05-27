import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createBoard } from '../../features/boards/boardsSlice';
import { useNavigate } from 'react-router-dom';
import './styles.css';

interface Props {
  onClose: () => void;
}

const BoardCreationForm: React.FC<Props> = ({ onClose }) => {
  const [boardName, setBoardName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const createBoardStatus = useAppSelector(state => state.boards.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!boardName.trim()) {
      setError('Board name can not be empty.');
      return;
    }

    try {
      const resultAction = await dispatch(createBoard({ name: boardName.trim() }));

      if (createBoard.fulfilled.match(resultAction)) {
        const newBoard = resultAction.payload;
        navigate(`/boards/${newBoard.id}`);
        onClose();
      } else if (createBoard.rejected.match(resultAction)) {
        setError(resultAction.error.message || 'Error creating a board.');
      }
    } catch (err) {
      setError('Unexpected error creating a board.');
      console.error('Failed to create board:', err);
    }
  };

  return (
    <div className="board-form-overlay">
      <div className="board-form-modal">
        <h2>Create new board</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="boardName">Board name:</label>
            <input
              type="text"
              id="boardName"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="form-input"
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={createBoardStatus === 'loading'}>
              {createBoardStatus === 'loading' ? 'Creating...' : 'Create'}
            </button>
            <button type="button" className="cancel-button" onClick={onClose} disabled={createBoardStatus === 'loading'}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardCreationForm;