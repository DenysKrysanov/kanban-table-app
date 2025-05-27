import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from '../features/boards/boardsSlice';
import cardsReducer from '../features/cards/cardsSlice';

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
    cards: cardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
