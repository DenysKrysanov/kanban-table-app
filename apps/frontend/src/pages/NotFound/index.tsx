import { Link } from 'react-router-dom';
import './styles.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Page not found</h2>
      <p className="notfound-text">
        The page you are looking for does not exist or has been moved.
        Please check the URL or return to the home page.
      </p>
      <Link to="/" className="notfound-link">
        Home page
      </Link>
    </div>
  );
};

export default NotFoundPage;
