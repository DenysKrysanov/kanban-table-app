import { Link } from 'react-router-dom';
import BoardView from './BoardView';
import SearchQuery from '../../components/SearchQuery/SearchQuery';
import type { FC } from 'react';

const Main: FC = () => {
  return (
    <div>
      <Link to="/" className="home-icon-link" aria-label="Home page">
        🏠
      </Link>
      <SearchQuery />
      <BoardView />
    </div>
  )
}

export default Main;