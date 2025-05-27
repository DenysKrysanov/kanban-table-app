import { Router } from 'express';
import { BoardController } from '../controllers/boardController';

const router = Router();

// GET /boards - Get all boards
router.get('/', BoardController.getAllBoards);

// GET /boards/search - Search boards
router.get('/search', BoardController.searchBoards);

// GET /boards/:id - Get board by ID
router.get('/:id', BoardController.getBoardById);

// POST /boards - Create new board
router.post('/', BoardController.createBoard);

// DELETE /boards/:id - Delete board
router.delete('/:id', BoardController.deleteBoard);

export default router;