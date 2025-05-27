import React, { useState } from 'react';
import './styles.css';

interface Props {
  onAdd: (card: { title: string; description: string }) => void;
  onCancel: () => void;
}

const AddCardForm: React.FC<Props> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title, description });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-card-form">
      <input
        type="text"
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="inputField"
        autoFocus
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textareaField"
      />
      <div className="form-buttons">
        <button type="submit" className="confirmButton">Add</button>
        <button type="button" onClick={onCancel} className="cancelButton">Cancel</button>
      </div>
    </form>
  );
};

export default AddCardForm;
