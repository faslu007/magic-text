import { handleExternalEntityChange } from './features/editorSlice';

// This middleware listens for entity changes from other tabs and updates the local tab state accordingly
export const entitySyncMiddleware = store => next => action => {
    // Process the action first
    const result = next(action);

    // Check if this is an entity update or delete action from another tab
    // We can identify this by checking if the action has a 'RECEIVED_FROM_OTHER_INSTANCE' flag
    // which is added by redux-state-sync
    if (
        action._isFromReduxStateSync &&
        (action.type === 'editor/updateEntity' || action.type === 'editor/deleteEntity' || action.type === 'editor/createEntity')
    ) {
        // Dispatch our special action to handle external entity changes
        store.dispatch(handleExternalEntityChange());
    }

    return result;
}; 