import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createEntity, setActiveEntity, deleteEntity, toggleTheme } from '../redux/features/editorSlice';
import { generateCreativeTitle } from '../utils';

function Sidebar() {
  const dispatch = useDispatch();
  const { entities, activeEntityId, theme } = useSelector((state) => state.editor);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  
  const handleCreateEntity = () => {
    dispatch(createEntity({ name: generateCreativeTitle() }));
  };
  
  const handleSelectEntity = (id) => {
    dispatch(setActiveEntity(id));
  };
  
  const handleDeleteEntity = (e, id) => {
    e.stopPropagation();
    setEntityToDelete(id);
    setShowDeleteModal(true);
  };
  
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  const confirmDelete = () => {
    if (entityToDelete) {
      dispatch(deleteEntity(entityToDelete));
      setShowDeleteModal(false);
      setEntityToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEntityToDelete(null);
  };

  return (
    <div className="sidebar">
      <div className="toolbar">
        <button onClick={handleCreateEntity}>New Document</button>
        <button onClick={handleToggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      
      <ul className="entity-list">
        {entities.length === 0 ? (
          <li className="entity-list-item">
            <div className="entity-name">No documents</div>
            <div className="entity-date">Create a new document to get started</div>
          </li>
        ) : (
          entities.map((entity) => (
            <li
              key={entity.id}
              className={`entity-list-item ${entity.id === activeEntityId ? 'active' : ''}`}
              onClick={() => handleSelectEntity(entity.id)}
              style={{ position: 'relative' }}
            >
              <div className="entity-name">{entity.name}</div>
              <div className="entity-date">
                {new Date(entity.modifiedAt).toLocaleString()}
              </div>
              <button
                className="delete-button"
                onClick={(e) => handleDeleteEntity(e, entity.id)}
                title="Delete document"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this document? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button
                className="modal-button modal-button-cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="modal-button modal-button-apply modal-button-delete"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar; 