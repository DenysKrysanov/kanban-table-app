import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Board } from '../../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BoardsState {
  items: Board[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchResults: Board[];
  selectedBoard?: Board;
}

const initialState: BoardsState = {
  items: [],
  status: 'idle',
  error: null,
  searchResults: [],
};

export const fetchBoards = createAsyncThunk<Board[]>(
  'boards/fetchBoards',
  async () => {
    const response = await axios.get<Board[]>(`${BASE_URL}/boards`);
    return response.data;
  }
);

export const searchBoards = createAsyncThunk(
  'boards/searchBoards',
  async (query: string) => {
    const response = await fetch(`${BASE_URL}/boards/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }
);

export const fetchBoardById = createAsyncThunk(
  'boards/fetchBoardById',
  async (boardId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Board>(`${BASE_URL}/boards/${boardId}`);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any ) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);


export const createBoard = createAsyncThunk<Board, Partial<Board>>(
  'boards/createBoard',
  async (boardData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Board>(`${BASE_URL}/boards`, boardData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = (error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data)
          ? (error.response.data as { message?: string }).message
          : 'Unknown error occurred while creating the board';
        return rejectWithValue(errorMessage);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred while creating the board');
    }
  }
);

export const deleteBoard = createAsyncThunk<string, string>(
  'boards/deleteBoard',
  async (boardId) => {
    await axios.delete(`${BASE_URL}/boards/${boardId}`);
    return boardId;
  }
);

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action: PayloadAction<Board[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch boards';
      })
      .addCase(createBoard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Failed to create board';
      })
      .addCase(deleteBoard.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((board) => board.id !== action.payload);
      })
      .addCase(searchBoards.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchBoards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchBoards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Search failed';
      })
            .addCase(fetchBoardById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBoardById.fulfilled, (state, action: PayloadAction<Board>) => {
        state.status = 'succeeded';
        state.selectedBoard = action.payload;
        const existingBoard = state.items.find(board => board.id === action.payload.id);
        if (!existingBoard) {
          state.items.push(action.payload);
        } else {
          Object.assign(existingBoard, action.payload);
        }
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearSearchResults } = boardsSlice.actions;
export default boardsSlice.reducer;