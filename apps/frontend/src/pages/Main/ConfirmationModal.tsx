import  { type FC } from 'react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  loadingText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: FC<Props> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
  loadingText = 'Deleting...',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button
            className="cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className="delete-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;