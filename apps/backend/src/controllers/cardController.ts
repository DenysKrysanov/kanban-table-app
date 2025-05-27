import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  CreateCardRequest, 
  UpdateCardRequest, 
  TypedRequest,
  CardStatus,
  ErrorResponse 
} from '../types';

const prisma = new PrismaClient();

export class CardController {
  // POST /cards
  static async createCard(
    req: TypedRequest<CreateCardRequest>, 
    res: Response
  ): Promise<void> {
    try {
      const { title, description, status, boardId, order } = req.body;

      if (!title || typeof title !== 'string') {
        res.status(400).json({ error: 'Card title is required' } as ErrorResponse);
        return;
      }

      if (!boardId || typeof boardId !== 'string') {
        res.status(400).json({ error: 'Board ID is required' } as ErrorResponse);
        return;
      }

      if (!Object.values(CardStatus).includes(status)) {
        res.status(400).json({ error: 'Invalid card status' } as ErrorResponse);
        return;
      }

      if (typeof order !== 'number') {
        res.status(400).json({ error: 'Order must be a number' } as ErrorResponse);
        return;
      }

      const board = await prisma.board.findUnique({
        where: { id: boardId }
      });

      if (!board) {
        res.status(404).json({ error: 'Board not found' } as ErrorResponse);
        return;
      }

      const card = await prisma.card.create({
        data: { 
          title, 
          description: description || null, 
          status, 
          boardId, 
          order 
        },
        include: { board: true }
      });

      res.status(201).json(card);
    } catch (error) {
      console.error('Error creating card:', error);
      res.status(500).json({ error: 'Failed to create card' } as ErrorResponse);
    }
  }

  // PUT /cards/:id
  static async updateCard(
    req: TypedRequest<UpdateCardRequest>, 
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, status, order } = req.body;

      const existingCard = await prisma.card.findUnique({
        where: { id }
      });

      if (!existingCard) {
        res.status(404).json({ error: 'Card not found' } as ErrorResponse);
        return;
      }

      if (status && !Object.values(CardStatus).includes(status)) {
        res.status(400).json({ error: 'Invalid card status' } as ErrorResponse);
        return;
      }

      if (order !== undefined && typeof order !== 'number') {
        res.status(400).json({ error: 'Order must be a number' } as ErrorResponse);
        return;
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (order !== undefined) updateData.order = order;

      const card = await prisma.card.update({
        where: { id },
        data: updateData,
        include: { board: true }
      });

      res.json(card);
    } catch (error) {
      console.error('Error updating card:', error);
      res.status(500).json({ error: 'Failed to update card' } as ErrorResponse);
    }
  }

  // DELETE /cards/:id
  static async deleteCard(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const existingCard = await prisma.card.findUnique({
        where: { id }
      });

      if (!existingCard) {
        res.status(404).json({ error: 'Card not found' } as ErrorResponse);
        return;
      }

      await prisma.card.delete({ 
        where: { id } 
      });
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting card:', error);
      res.status(500).json({ error: 'Failed to delete card' } as ErrorResponse);
    }
  }

  // GET /cards
  static async getAllCards(req: Request, res: Response): Promise<void> {
    try {
      const cards = await prisma.card.findMany({
        include: { board: true },
        orderBy: { order: 'asc' }
      });
      res.json(cards);
    } catch (error) {
      console.error('Error fetching cards:', error);
      res.status(500).json({ error: 'Failed to fetch cards' } as ErrorResponse);
    }
  }
}