import { configureStore } from '@reduxjs/toolkit';
import tradeDataReducer from './tradeDataSlice';
import receiptDataReducer from './receiptDataSlice';
import soloTokenReducer from './soloTokenDataSlice';
export const store = configureStore({
    reducer: {
        tradeData: tradeDataReducer,
        receiptData: receiptDataReducer,
        soloTokenData: soloTokenReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
