import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Card } from '../../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BoardWithCards {
  id: string;
  name: string;
  cards: Card[];
}

interface CardsState {
  items: Card[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CardsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchCardsByBoardId = createAsyncThunk<Card[], string>(
  'cards/fetchByBoardId',
  async (boardId: string) => {
    const response = await axios.get<BoardWithCards>(`${BASE_URL}/boards/${boardId}`);
    return response.data.cards;
  }
);

export const createCard = createAsyncThunk<Card, Partial<Card>>(
  'cards/createCard',
  async (newCardData) => {
    const response = await axios.post<Card>(`${BASE_URL}/cards`, newCardData);
    return response.data;
  }
);

export const updateCard = createAsyncThunk<Card, Card>(
  'cards/updateCard',
  async (updatedCard) => {
    const response = await axios.put<Card>(`${BASE_URL}/cards/${updatedCard.id}`, updatedCard);
    return response.data;
  }
);

export const deleteCard = createAsyncThunk<string, string>(
  'cards/deleteCard',
  async (cardId) => {
    await axios.delete(`${BASE_URL}/cards/${cardId}`);
    return cardId;
  }
);



const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardsByBoardId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCardsByBoardId.fulfilled, (state, action: PayloadAction<Card[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCardsByBoardId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch cards';
      })
      .addCase(createCard.fulfilled, (state, action: PayloadAction<Card>) => {
        state.items.push(action.payload);
      })
      .addCase(deleteCard.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(card => card.id !== action.payload);
      })
      .addCase(updateCard.fulfilled, (state, action: PayloadAction<Card>) => {
        const index = state.items.findIndex(card => card.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default cardsSlice.reducer;
