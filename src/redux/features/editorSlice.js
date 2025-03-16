import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Generate a unique ID for this browser tab
const browserTabId = Date.now().toString();

const initialState = {
  entities: [],
  activeEntityId: null,
  theme: 'dark', // 'dark' or 'light'
  openTabs: [], // IDs of open tabs - this will be tab-specific
  browserTabId, // Store the browser tab ID to identify this tab
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    createEntity: (state, action) => {
      const id = uuidv4();
      const newEntity = {
        id,
        name: action.payload.name || `Untitled-${state.entities.length + 1}`,
        textContent: { blocks: [] },
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };
      state.entities.push(newEntity);
      
      // Add to open tabs if not already there - tab-specific behavior
      if (!state.openTabs.includes(id)) {
        state.openTabs.push(id);
      }

      // Set as active entity - tab-specific behavior
      state.activeEntityId = id;
    },
    updateEntity: (state, action) => {
      const { id, name, textContent } = action.payload;
      const entity = state.entities.find(entity => entity.id === id);
      if (entity) {
        if (name !== undefined) entity.name = name;
        if (textContent !== undefined) entity.textContent = textContent;
        entity.modifiedAt = new Date().toISOString();
      }
    },
    deleteEntity: (state, action) => {
      const entityId = action.payload;
      const entityIndex = state.entities.findIndex(entity => entity.id === entityId);

      if (entityIndex !== -1) {
        // Remove the entity
        state.entities.splice(entityIndex, 1);

        // Find the index in openTabs before removing
        const tabIndex = state.openTabs.findIndex(id => id === entityId);

        // Remove from open tabs - tab-specific behavior
        state.openTabs = state.openTabs.filter(id => id !== entityId);

        // If the deleted entity was the active tab, select a new active tab - tab-specific behavior
        if (state.activeEntityId === entityId) {
          if (state.openTabs.length > 0) {
            // Try to select the tab to the left
            let newIndex = tabIndex - 1;

            // If left tab doesn't exist (index would be -1) or tab wasn't found,
            // try right tab or adjust accordingly
            if (newIndex < 0) {
              // If we were at the first tab, select what would be the next tab (index 0 after removal)
              newIndex = 0;
            } else if (newIndex >= state.openTabs.length) {
              // If we were at the last tab, select the new last tab
              newIndex = state.openTabs.length - 1;
            }

            state.activeEntityId = state.openTabs[newIndex];
          } else {
            // No tabs left after closing
            state.activeEntityId = null;
          }
        }
      }
    },
    setActiveEntity: (state, action) => {
      // Tab-specific behavior - not synced across tabs
      state.activeEntityId = action.payload;
      
      // Add to open tabs if not already there - tab-specific behavior
      if (!state.openTabs.includes(action.payload)) {
        state.openTabs.push(action.payload);
      }
    },
    closeTab: (state, action) => {
      // Tab-specific behavior - not synced across tabs
      const closingTabId = action.payload;
      const currentIndex = state.openTabs.findIndex(id => id === closingTabId);

      // Remove from open tabs
      state.openTabs = state.openTabs.filter(id => id !== action.payload);

      // If closing the active tab, switch to another tab
      if (state.activeEntityId === closingTabId) {
        if (state.openTabs.length > 0) {
          // Try to select the tab to the left
          let newIndex = currentIndex - 1;

          // If left tab doesn't exist (index would be -1), try right tab
          if (newIndex < 0) {
            newIndex = currentIndex; // If currentIndex was 0, this will now point to 0
            // If there was only one tab (now 0 after removal), newIndex will be 0
            if (newIndex >= state.openTabs.length) {
              newIndex = state.openTabs.length - 1; // Take last available tab
            }
          }

          state.activeEntityId = state.openTabs[newIndex];
        } else {
          // No tabs left after closing
          state.activeEntityId = null;
        }
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    // Handle external tab changes (from other browser tabs)
    handleExternalEntityChange: (state) => {
      // This is a special reducer that will be called when entities are updated or deleted in other tabs
      // It ensures that if an entity is deleted in another tab but open in this tab, we handle it properly

      // Check if any of our open tabs no longer exist in the entities list
      state.openTabs = state.openTabs.filter(tabId =>
        state.entities.some(entity => entity.id === tabId)
      );

      // If the active entity was deleted, select a new one
      if (state.activeEntityId && !state.entities.some(entity => entity.id === state.activeEntityId)) {
        if (state.openTabs.length > 0) {
          state.activeEntityId = state.openTabs[0];
        } else {
          state.activeEntityId = null;
        }
      }
    },
  },
});

export const { 
  createEntity, 
  updateEntity, 
  deleteEntity, 
  setActiveEntity,
  closeTab,
  toggleTheme,
  handleExternalEntityChange
} = editorSlice.actions;

export default editorSlice.reducer; 