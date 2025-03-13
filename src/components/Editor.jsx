import { useSelector, useDispatch } from 'react-redux';
import { setActiveEntity, closeTab } from '../redux/features/editorSlice';
import Sidebar from './Sidebar';
import TextEditor from './TextEditor';
import WelcomeScreen from './WelcomeScreen';
import './Editor.css';

function Editor() {
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor);
  
  // Safely extract values with fallbacks
  const entities = editorState?.entities || [];
  const activeEntityId = editorState?.activeEntityId || null;
  const openTabs = editorState?.openTabs || [];
  const theme = editorState?.theme || 'dark';
  
  const handleTabClick = (id) => {
    dispatch(setActiveEntity(id));
  };
  
  const handleCloseTab = (e, id) => {
    e.stopPropagation();
    dispatch(closeTab(id));
  };
  
  // Get the open tab entities with null check
  const tabEntities = Array.isArray(openTabs) 
    ? openTabs
        .map(id => entities.find(entity => entity.id === id))
        .filter(Boolean) // Filter out any undefined entities
    : [];
  
  return (
    <div className={`editor-app ${theme}`}>
      <Sidebar />
      <div className="editor-container">

        {tabEntities.length === 0 && (
          <WelcomeScreen />
        )}
        {tabEntities.length > 0 && (
          <div className="editor-tabs">
            {tabEntities.map(entity => (
              <div 
                key={entity.id}
                className={`editor-tab ${entity.id === activeEntityId ? 'active' : ''}`}
                onClick={() => handleTabClick(entity.id)}
              >
                <span className="tab-title">{entity.name.split(' - ')[0]}</span>
                <span 
                  className="tab-close" 
                  onClick={(e) => handleCloseTab(e, entity.id)}
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        )}
        <TextEditor />
      </div>
    </div>
  );
}

export default Editor; 