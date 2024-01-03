import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { 
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
 } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import snackbarReducer from './snackbarSlice';
import postFlagReducer from './postFlagSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    snackbar: snackbarReducer,
    postFlag: postFlagReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;