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
import authReducer from './slices/authSlice';
import snackbarReducer from './slices/snackbarSlice';
import postFlagReducer from './slices/postFlagSlice';
import uploadedDataReducer from './slices/uploadedDataSlice';
import settingReducer from './slices/settingSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    snackbar: snackbarReducer,
    postFlag: postFlagReducer,
    uploadedData: uploadedDataReducer,
    setting: settingReducer,
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