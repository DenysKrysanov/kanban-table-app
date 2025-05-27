import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import { ErrorResponse } from './types';

const app: Application = express();

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

try {
  console.log('Setting up routes...');

  const { BoardController } = require('./controllers/boardController');
  const { CardController } = require('./controllers/cardController');

  // Board routes
  app.get('/boards', BoardController.getAllBoards);
  app.get('/boards/search', BoardController.searchBoards);
  app.get('/boards/:id', BoardController.getBoardById);
  app.post('/boards', BoardController.createBoard);
  app.delete('/boards/:id', BoardController.deleteBoard);

  // Card routes  
  app.get('/cards', CardController.getAllCards);
  app.post('/cards', CardController.createCard);
  app.put('/cards/:id', CardController.updateCard);
  app.delete('/cards/:id', CardController.deleteCard);

  console.log('All routes loaded successfully');

} catch (error) {
  console.error('Error setting up routes:', error);
  process.exit(1);
}

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  } as ErrorResponse);
});

// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    ...(config.nodeEnv === 'development' && { details: error.message })
  } as ErrorResponse);
});

app.listen(config.port, () => {
  console.log(`🚀 Backend running on http://localhost:${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔧 Health check: http://localhost:${config.port}/health`);
});

export default app;