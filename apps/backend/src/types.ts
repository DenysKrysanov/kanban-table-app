import { Request, Response } from 'express';
import { ParsedQs } from 'qs';

export interface Board {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  cards?: Card[];
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  status: CardStatus;
  order: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  board?: Board;
}

export enum CardStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export interface CreateBoardRequest {
  name: string;
}

export interface CreateCardRequest {
  title: string;
  description?: string;
  status: CardStatus;
  boardId: string;
  order: number;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
  status?: CardStatus;
  order?: number;
}

export interface SearchBoardsQuery extends ParsedQs {
  q?: string;
}

export interface TypedRequest<T = {}> extends Request {
  body: T;
}

export interface TypedRequestWithQuery<T = {}, Q extends ParsedQs = ParsedQs> extends Request {
  body: T;
  query: Q;
}

export type TypedResponse<T = any> = Response;

export type RequestHandler<T = {}> = (
  req: TypedRequest<T>,
  res: Response
) => Promise<void> | void;

export type RequestHandlerWithQuery<T = {}, Q extends ParsedQs = ParsedQs> = (
  req: TypedRequestWithQuery<T, Q>,
  res: Response
) => Promise<void> | void;

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}