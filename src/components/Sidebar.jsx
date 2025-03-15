import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createEntity, setActiveEntity, deleteEntity, toggleTheme } from '../redux/features/editorSlice';
import { generateCreativeTitle } from '../utils';
import { formatDistanceToNow } from 'date-fns';
import { useAuth, useClerk } from '@clerk/clerk-react';

function Sidebar() {
  const dispatch = useDispatch();
  const { entities, activeEntityId, theme } = useSelector((state) => state.editor);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('mine'); // 'mine' or 'shared'

  // Clerk authentication
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarVisible(false); // Reset when switching to desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleCreateEntity = () => {
    dispatch(createEntity({ name: generateCreativeTitle() }));
    if (isMobile) {
      setSidebarVisible(false); // Close sidebar after creating a document on mobile
    }
  };
  
  const handleSelectEntity = (id) => {
    dispatch(setActiveEntity(id));
    if (isMobile) {
      setSidebarVisible(false); // Close sidebar after selecting a document on mobile
    }
  };
  
  const handleDeleteEntity = (e, id) => {
    e.stopPropagation();
    setEntityToDelete(id);
    setShowDeleteModal(true);
  };
  
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleAuth = () => {
    if (!isLoaded) return;

    if (isSignedIn) {
      clerk.openUserProfile();
    } else {
      clerk.openSignIn();
    }
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

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  // Determine sidebar classes based on visibility and theme
  const sidebarClasses = `sidebar ${isMobile ? 'mobile' : ''}`;
  const entityListClasses = `entity-list-container ${isMobile ? 'mobile' : ''} ${sidebarVisible ? 'visible' : ''}`;

  return (
    <div className={sidebarClasses}>
      <div className="toolbar">
        <button onClick={handleCreateEntity}>New Document</button>
        <div className="toolbar-right">
          {isMobile && (
            <button
              className="list-toggle-button"
              onClick={toggleSidebar}
              aria-label="Toggle document list"
            >
              {sidebarVisible ? 'Hide List' : 'Show List'}
            </button>
          )}
        </div>
      </div>

      {/* Entity list - toggleable on mobile */}
      <div className={entityListClasses}>
        {/* Tab navigation */}
        <div className="sidebar-tabs-container">
          <div className="sidebar-tabs">
            <button 
              className={`sidebar-tab ${activeTab === 'mine' ? 'active' : ''}`}
              onClick={() => setActiveTab('mine')}
            >
              Mine
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'shared' ? 'active' : ''}`}
              onClick={() => setActiveTab('shared')}
            >
              Shared
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="sidebar-tab-content">
          {/* Mine Tab */}
          {activeTab === 'mine' && (
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
                      Modified {formatDate(entity.modifiedAt)}
                    </div>
                    <button
                      className="delete-button"
                      onClick={(e) => handleDeleteEntity(e, entity.id)}
                      title="Delete document"
                    >
                      🗑️
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}

          {/* Shared Tab */}
          {activeTab === 'shared' && (
            <div className="shared-documents-placeholder">
              <div className="shared-empty-state">
                <div className="shared-icon">🔄</div>
                <h3>Shared Documents</h3>
                <p>Documents shared with you will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar bottom toolbar */}
      <div className="sidebar-bottom-toolbar">
        <div className="sidebar-bottom-actions">
          <button
            onClick={handleAuth}
            className="sidebar-auth-btn"
            title={isSignedIn ? "User profile" : "Sign in"}
          >
            👤
          </button>
          <button
            onClick={handleToggleTheme}
            className="sidebar-theme-btn"
            title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

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

      {isMobile && sidebarVisible && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
}

export default Sidebar; 