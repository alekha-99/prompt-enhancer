/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import templatesReducer from './slices/templatesSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        templates: templatesReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types (for non-serializable template objects)
                ignoredActions: ['ui/openTemplatePreview'],
            },
        }),
});

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
