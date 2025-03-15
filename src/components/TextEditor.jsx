import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateEntity } from '../redux/features/editorSlice';
import { formatDistanceToNow } from 'date-fns';
import EditorJSComponent from './EditorJS/EditorJS';
import './TextEditor.css';

function TextEditor() {
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor);
  
  // Safely extract values with fallbacks
  const entities = editorState?.entities || [];
  const activeEntityId = editorState?.activeEntityId || null;
  const theme = editorState?.theme || 'dark';
  
  const [localName, setLocalName] = useState('');
  const [localContent, setLocalContent] = useState('');
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  
  const activeEntity = entities.find(entity => entity.id === activeEntityId);
  
  // Update local state when active entity changes
  useEffect(() => {
    if (activeEntity) {
      setLocalName(activeEntity.name);
      setLocalContent(activeEntity.textContent);
      setLastSaved(activeEntity.modifiedAt);
    } else {
      setLocalName('');
      setLocalContent('');
      setLastSaved(null);
    }
  }, [activeEntity]);
  
  // Format the last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return '';
    try {
      return `Last saved ${formatDistanceToNow(new Date(lastSaved), { addSuffix: true })}`;
    } catch {
      return '';
    }
  };
  
  // Debounced save function
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    
    // Clear previous timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Set new timeout for auto-save
    const timeoutId = setTimeout(() => {
      if (activeEntityId) {
        const now = new Date().toISOString();
        dispatch(updateEntity({
          id: activeEntityId,
          textContent: newContent
        }));
        setLastSaved(now);
      }
    }, 500); // 500ms debounce
    
    setSaveTimeout(timeoutId);
  };
  
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setLocalName(newName);
    
    // Clear previous timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Set new timeout for auto-save
    const timeoutId = setTimeout(() => {
      if (activeEntityId) {
        const now = new Date().toISOString();
        dispatch(updateEntity({
          id: activeEntityId,
          name: newName
        }));
        setLastSaved(now);
      }
    }, 500); // 500ms debounce
    
    setSaveTimeout(timeoutId);
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  
  const handlePasswordSubmit = () => {
    // Here you would implement the actual password protection logic
    // For now, we'll just close the modal
    setShowPasswordModal(false);
    setPassword('');
    // Show a simple confirmation
    alert('Password protection applied!');
  };
  
  const handleDownload = () => {
    if (!activeEntity) return;
    
    // Create a blob with the text content
    const blob = new Blob([localContent], { type: 'text/plain' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `${localName || 'document'}.txt`;
    
    // Append to the body, click, and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Release the URL object
    URL.revokeObjectURL(url);
  };
  
  // Add share functionality placeholder
  const handleShare = () => {
    alert('Share functionality will be implemented soon!');
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);
  
  // if (!activeEntity) {
  //   return (
  //     <div className="editor-main">
  //       <div className="empty-state">
  //         <p>Select a document from the sidebar or create a new one</p>
  //       </div>
  //     </div>
  //   );
  // }
  
  return (
    <div className="editor-main">
      <div className="editor-content">
        <div className="editor-header">
          <div className="editor-title-container" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={localName}
                onChange={handleNameChange}
                className="editor-title-input"
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  width: '100%',
                  outline: 'none',
                  padding: '10px 5px',
                  marginBottom: '5px'
                }}
              />
              <div className="editor-last-saved" style={{ 
                fontSize: '0.8rem', 
                opacity: 0.7, 
                paddingLeft: '5px' 
              }}>
                {formatLastSaved()}
              </div>
            </div>
            <div className="editor-actions">
              <button 
                className="action-button share-button"
                onClick={handleShare}
                title="Share Document"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
              <button 
                className="action-button download-button"
                onClick={handleDownload}
                title="Download Document"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button 
                className="action-button password-button"
                onClick={() => setShowPasswordModal(true)}
                title="Password Protect"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`editor-container ${theme}`}>
          <EditorJSComponent
            value={localContent}
            onChange={handleContentChange}
          />
        </div>
      </div>
      
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Password Protection</h3>
            <p>Set a password to protect this document.</p>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
            />
            <div className="modal-buttons">
              <button 
                className="modal-button modal-button-cancel"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-button modal-button-apply"
                onClick={handlePasswordSubmit}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TextEditor; 