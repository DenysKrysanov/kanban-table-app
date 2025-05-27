import React, { useState } from 'react';
import SearchQuery from '../../components/SearchQuery/SearchQuery.tsx';
import BoardCreationForm from './BoardCreationForm';
import './styles.css';

const HomePage: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleCreateBoardClick = () => {
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="home-page-container">
      <SearchQuery />
      <div className="home-page-actions">
        <button className="create-board-button" onClick={handleCreateBoardClick}>
          New board
        </button>
      </div>

      {isFormVisible && (
        <BoardCreationForm onClose={handleFormClose} />
      )}
    </div>
  );
};

export default HomePage;