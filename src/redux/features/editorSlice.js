import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entities: [],
  activeEntityId: null,
  theme: 'dark', // 'dark' or 'light'
  openTabs: [], // IDs of open tabs
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    createEntity: (state, action) => {
      const id = Date.now().toString();
      const newEntity = {
        id,
        name: action.payload.name || `Untitled-${state.entities.length + 1}`,
        textContent: action.payload.textContent || '',
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };
      state.entities.push(newEntity);
      state.activeEntityId = id;
      
      // Add to open tabs if not already there
      if (!state.openTabs.includes(id)) {
        state.openTabs.push(id);
      }
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

        // Remove from open tabs
        state.openTabs = state.openTabs.filter(id => id !== entityId);

        // If the deleted entity was the active tab, select a new active tab
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
      state.activeEntityId = action.payload;
      
      // Add to open tabs if not already there
      if (!state.openTabs.includes(action.payload)) {
        state.openTabs.push(action.payload);
      }
    },
    closeTab: (state, action) => {
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
  },
});

export const { 
  createEntity, 
  updateEntity, 
  deleteEntity, 
  setActiveEntity,
  closeTab,
  toggleTheme
} = editorSlice.actions;

export default editorSlice.reducer; 