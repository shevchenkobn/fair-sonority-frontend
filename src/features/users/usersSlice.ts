import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiCallStateBase, ApiCallStatus } from '../../app/api';
import { ArtistFull, RatingSeed } from '../../models/artist';
import { User, UserNoId } from '../../models/user';
import {
  ActionType,
  ActionWithPayload,
  createFullActionType,
  RootState,
  serializeStoreError,
  StoreSliceName,
} from '../../store/constant-lib';
import {
  createArtistRatingApi,
  fetchArtistsApi,
  registerApi,
} from './usersApi';

export interface UserState extends ApiCallStateBase {
  user?: User;
  artists?: ArtistFull[];
}

const initialState: UserState = {
  status: ApiCallStatus.Idle,
};

export const register = createAsyncThunk<User, UserNoId>(
  createFullActionType(StoreSliceName.Users, ActionType.Register),
  (user: UserNoId) => {
    return registerApi(user);
  },
  {
    serializeError: serializeStoreError,
  }
);

export const fetchArtists = createAsyncThunk(
  createFullActionType(StoreSliceName.Users, ActionType.Fetch),
  () => fetchArtistsApi(),
  {
    serializeError: serializeStoreError,
  }
);

export const createArtistRating = createAsyncThunk(
  createFullActionType(StoreSliceName.Users, ActionType.RatingCreate),
  (rating: RatingSeed) => createArtistRatingApi(rating),
  {
    serializeError: serializeStoreError,
  }
);

const usersSlice = createSlice({
  name: StoreSliceName.Users,
  initialState,
  reducers: {
    [ActionType.RegisterClear]: (state) => {
      delete state.user;
      delete state.error;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(register.pending, (state) => {
        state.status = ApiCallStatus.Loading;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.error = action.error;
        delete state.user;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.user = action.payload;
        delete state.error;
      })

      .addCase(fetchArtists.pending, (state) => {
        state.status = ApiCallStatus.Loading;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.error = action.error;
        delete state.artists;
      })
      .addCase(
        fetchArtists.fulfilled,
        (state, action: ActionWithPayload<ArtistFull[]>) => {
          state.status = ApiCallStatus.Idle;
          delete state.error;
          state.artists = action.payload;
        }
      )

      .addCase(createArtistRating.pending, (state) => {
        state.status = ApiCallStatus.Loading;
      })
      .addCase(createArtistRating.rejected, (state, action) => {
        state.status = ApiCallStatus.Idle;
        state.error = action.error;
      })
      .addCase(
        createArtistRating.fulfilled,
        (state, action: ActionWithPayload<void>) => {
          state.status = ApiCallStatus.Idle;
          delete state.error;
        }
      );
  },
});

export const { [ActionType.RegisterClear]: registerClear } = usersSlice.actions;

export default usersSlice.reducer;

export const selectArtists = (state: RootState) => state.users.artists;
