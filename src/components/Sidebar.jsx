import { useSelector, useDispatch } from 'react-redux';
import { createEntity, setActiveEntity, deleteEntity, toggleTheme } from '../redux/features/editorSlice';
import { formatDistanceToNow } from 'date-fns';

function Sidebar() {
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor);
  
  // Safely extract values with fallbacks
  const entities = editorState?.entities || [];
  const activeEntityId = editorState?.activeEntityId || null;
  const theme = editorState?.theme || 'dark';
  
  const generateCreativeTitle = () => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Time-based prefixes
    let timePrefix = '';
    if (hour < 6) timePrefix = 'Night Owl';
    else if (hour < 12) timePrefix = 'Morning Muse';
    else if (hour < 17) timePrefix = 'Afternoon Thoughts';
    else if (hour < 21) timePrefix = 'Evening Notes';
    else timePrefix = 'Night Reflections';
    
    // Random creative suffixes
    const creativeSuffixes = [
      'Inspiration', 'Ideas', 'Brainstorm', 'Thoughts', 'Journal', 
      'Draft', 'Concept', 'Vision', 'Plan', 'Notes', 'Musings'
    ];
    
    const randomSuffix = creativeSuffixes[Math.floor(Math.random() * creativeSuffixes.length)];
    
    return `${timePrefix} - ${date} at ${hour}:${minutes} - ${randomSuffix}`;
  };
  
  const handleCreateEntity = () => {
    dispatch(createEntity({ name: generateCreativeTitle() }));
  };
  
  const handleSelectEntity = (id) => {
    dispatch(setActiveEntity(id));
  };
  
  const handleDeleteEntity = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      dispatch(deleteEntity(id));
    }
  };
  
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
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
            >
              <div className="entity-name">{entity.name}</div>
              <div className="entity-date">
                Modified {formatDate(entity.modifiedAt)}
              </div>
              <button 
                onClick={(e) => handleDeleteEntity(e, entity.id)}
                style={{ float: 'right', marginTop: '-20px' }}
              >
                🗑️
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Sidebar; 