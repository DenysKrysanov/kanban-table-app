import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, useDebounce } from '../../hooks';
import { searchBoards, clearSearchResults } from '../../features/boards/boardsSlice';
import { Link } from 'react-router-dom';
import './styles.css';

const SearchQuery: React.FC = () => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const searchResults = useAppSelector((state) => state.boards.searchResults);
  const boardsStatus = useAppSelector((state) => state.boards.status);

  const handleClearSearch = () => {
    setSearch('');
    dispatch(clearSearchResults());
  };

  useEffect(() => {
    if (debouncedSearch.trim()) {
      dispatch(searchBoards(debouncedSearch.trim()));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedSearch, dispatch]);

  return (
    <div className="search-query-container">
      <input
        type="text"
        placeholder="Find board by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input-field"
      />
      {search && (
        <button
          type="button"
          className="clear-search-button"
          onClick={handleClearSearch}
          aria-label="Clear query"
        >
          &times;
        </button>
      )}
      
      {search.trim() && (
        <div className="search-suggestions-wrapper">
          {boardsStatus === 'loading' && (
            <p className="search-status-message">Looking for boards...</p>
          )}
          {boardsStatus === 'failed' && (
            <p className="search-error-message">Error searching for boards.</p>
          )}

          {searchResults.length > 0 && boardsStatus === 'succeeded' ? (
            <ul className="search-suggestions-list">
              {searchResults.map((board) => (
                <li key={board.id} className="search-suggestion-item">
                  <Link
                    to={`/boards/${board.id}`}
                    className="search-suggestion-link"
                    onClick={handleClearSearch}
                  >
                    {board.name} (ID: {board.id})
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            boardsStatus === 'succeeded' && (
              <p className="no-results-message">No boards found.</p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchQuery;