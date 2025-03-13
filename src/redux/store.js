import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import editorReducer from './features/editorSlice';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { entitySyncMiddleware } from './entitySyncMiddleware';

// Configure redux-state-sync
const stateSyncConfig = {
  // Only sync data updates and deletions across tabs
  whitelist: [
    'editor/createEntity',
    'editor/updateEntity',
    'editor/deleteEntity',
    'editor/toggleTheme'
  ],
  // Blacklist active tab state actions
  blacklist: [
    'editor/setActiveEntity',
    'editor/closeTab'
  ]
};

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter', 'editor'], // persist counter and editor
};

// Combine reducers
const rootReducer = combineReducers({
  editor: editorReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(createStateSyncMiddleware(stateSyncConfig), entitySyncMiddleware),
});

// Initialize redux-state-sync message listener
initMessageListener(store);

// Create persistor
export const persistor = persistStore(store); 