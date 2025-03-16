import React, { useEffect, useRef, useCallback, memo } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import Paragraph from '@editorjs/paragraph';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import DragDrop from 'editorjs-drag-drop';
import { debounce } from 'lodash';
import './EditorJS.css';
import { useSelector } from 'react-redux';

const EditorJSComponent = ({ onChange, entityId }) => {
    const editorState = useSelector((state) => state.editor);

    // Safely extract values with fallbacks
    const entities = editorState?.entities || [];
    const activeEntityId = editorState?.activeEntityId || null;
    const activeEntity = entities.find(entity => entity.id === activeEntityId);

    const editorRef = useRef(null);
    const editorInstanceRef = useRef(null);
    const prevEntityIdRef = useRef(entityId);

    // Create a debounced function for the onChange handler using lodash
    const debouncedOnChange = useCallback(
        debounce(async (editorInstance) => {
            try {
                const outputData = await editorInstance.save();
                onChange(outputData);
            } catch (error) {
                console.error('Failed to save EditorJS data:', error);
            }
        }, 300),
        [onChange]
    );

    // Reset and initialize Editor.js when entityId changes
    useEffect(() => {
        if (!editorRef.current) return;

        // Check if entityId has changed
        const entityChanged = prevEntityIdRef.current !== entityId;
        prevEntityIdRef.current = entityId;

        // If the entity has changed or editor isn't initialized yet
        if (entityChanged || !editorInstanceRef.current) {
            // Clean up previous instance if it exists
            if (editorInstanceRef.current) {
                try {
                    editorInstanceRef.current.destroy();
                    editorInstanceRef.current = null;
                } catch (error) {
                    console.error('Error destroying previous editor instance:', error);
                }
            }

            const initEditor = async () => {
                try {
                    const editorInstance = new EditorJS({
                        holder: editorRef.current,
                        tools: {
                            header: {
                                class: Header,
                                inlineToolbar: true,
                                config: {
                                    levels: [1, 2, 3, 4],
                                    defaultLevel: 2
                                }
                            },
                            list: {
                                class: List,
                                inlineToolbar: true,
                                config: {
                                    defaultStyle: 'unordered'
                                }
                            },
                            code: Code,
                            paragraph: {
                                class: Paragraph,
                                inlineToolbar: true,
                            },
                            marker: {
                                class: Marker,
                                shortcut: 'CMD+SHIFT+M',
                            },
                            inlineCode: {
                                class: InlineCode,
                                shortcut: 'CMD+SHIFT+C',
                            }
                        },
                        data: activeEntity.textContent,
                        placeholder: 'Start typing...',
                        onChange: () => {
                            if (editorInstanceRef.current) {
                                debouncedOnChange(editorInstanceRef.current);
                            }
                        }
                    });

                    editorInstanceRef.current = editorInstance;

                    await editorInstance.isReady;

                    // Initialize drag and drop functionality after editor is ready
                    try {
                        new DragDrop(editorInstance);
                    } catch (error) {
                        console.error('Failed to initialize DragDrop:', error);
                    }
                } catch (error) {
                    console.error('Editor.js initialization failed:', error);
                }
            };

            initEditor();
        }

        return () => {
            // Proper cleanup for Editor.js
            if (editorInstanceRef.current) {
                try {
                    editorInstanceRef.current.destroy();
                    editorInstanceRef.current = null;
                } catch (error) {
                    console.error('Error during editor cleanup:', error);
                }
            }
        };
    }, [entityId]);

    return (
        <div className="editorjs-wrapper">
            <div ref={editorRef} className="editorjs-container"></div>
        </div>
    );
};

export default memo(EditorJSComponent, (prevProps, nextProps) => {
    // Only re-render if entityId changes or if entityTextContent changes
    return prevProps.entityId === nextProps.entityId
});