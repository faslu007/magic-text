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
      const index = state.entities.findIndex(entity => entity.id === action.payload);
      if (index !== -1) {
        state.entities.splice(index, 1);
        
        // Remove from open tabs
        state.openTabs = state.openTabs.filter(id => id !== action.payload);
        
        if (state.activeEntityId === action.payload) {
          // Set active to the next available tab or null
          state.activeEntityId = state.openTabs.length > 0 ? state.openTabs[0] : null;
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
      // Remove from open tabs
      state.openTabs = state.openTabs.filter(id => id !== action.payload);
      
      // If closing the active tab, switch to another tab
      if (state.activeEntityId === action.payload && state.openTabs.length > 0) {
        state.activeEntityId = state.openTabs[0];
      } else if (state.openTabs.length === 0) {
        state.activeEntityId = null;
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