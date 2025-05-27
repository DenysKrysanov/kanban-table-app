import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  CreateBoardRequest, 
  SearchBoardsQuery, 
  TypedRequest, 
  TypedRequestWithQuery,
  Board,
  ErrorResponse 
} from '../types';

const prisma = new PrismaClient();

export class BoardController {
  // GET /boards
  static async getAllBoards(req: Request, res: Response): Promise<void> {
    try {
      const boards = await prisma.board.findMany({
        include: { cards: true }
      });
      res.json(boards);
    } catch (error) {
      console.error('Error fetching boards:', error);
      res.status(500).json({ error: 'Failed to fetch boards' } as ErrorResponse);
    }
  }

  // GET /boards/search
  static async searchBoards(
    req: TypedRequestWithQuery<{}, SearchBoardsQuery>, 
    res: Response
  ): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(400).json({ error: 'Query parameter "q" is required' } as ErrorResponse);
        return;
      }

      const boards = await prisma.board.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { id: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: { cards: true }
      });
      
      res.json(boards);
    } catch (error) {
      console.error('Error searching boards:', error);
      res.status(500).json({ error: 'Failed to search boards' } as ErrorResponse);
    }
  }

  // GET /boards/:id
  static async getBoardById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const board = await prisma.board.findUnique({
        where: { id },
        include: { cards: true },
      });

      if (!board) {
        res.status(404).json({ error: 'Board not found' } as ErrorResponse);
        return;
      }

      res.json(board);
    } catch (error) {
      console.error('Error fetching board:', error);
      res.status(500).json({ error: 'Failed to fetch board' } as ErrorResponse);
    }
  }

  // POST /boards
  static async createBoard(
    req: TypedRequest<CreateBoardRequest>, 
    res: Response
  ): Promise<void> {
    try {
      const { name } = req.body;

      if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Board name is required' } as ErrorResponse);
        return;
      }

      const board = await prisma.board.create({
        data: { name },
        include: { cards: true }
      });

      res.status(201).json(board);
    } catch (error) {
      console.error('Error creating board:', error);
      res.status(500).json({ error: 'Failed to create board' } as ErrorResponse);
    }
  }

  // DELETE /boards/:id
  static async deleteBoard(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const existingBoard = await prisma.board.findUnique({
        where: { id }
      });

      if (!existingBoard) {
        res.status(404).json({ error: 'Board not found' } as ErrorResponse);
        return;
      }

      await prisma.card.deleteMany({
        where: { boardId: id }
      });
      
      await prisma.board.delete({
        where: { id }
      });
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting board:', error);
      res.status(500).json({ error: 'Failed to delete board' } as ErrorResponse);
    }
  }
}