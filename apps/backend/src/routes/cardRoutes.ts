import { Router } from 'express';
import { CardController } from '../controllers/cardController';

const router = Router();

// GET /cards - Get all cards
router.get('/', CardController.getAllCards);

// POST /cards - Create new card
router.post('/', CardController.createCard);

// PUT /cards/:id - Update card
router.put('/:id', CardController.updateCard);

// DELETE /cards/:id - Delete card
router.delete('/:id', CardController.deleteCard);

export default router;