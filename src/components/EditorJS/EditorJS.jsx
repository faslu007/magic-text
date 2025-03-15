import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import Paragraph from '@editorjs/paragraph';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import DragDrop from 'editorjs-drag-drop';
import './EditorJS.css';

// Helper function to convert Editor.js data to plain text
const editorJsToPlainText = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return '';

    return blocks.map(block => {
        if (block.type === 'paragraph') {
            return block.data.text;
        } else if (block.type === 'header') {
            return block.data.text;
        } else if (block.type === 'list') {
            return block.data.items.join('\n');
        } else if (block.type === 'code') {
            return block.data.code;
        } else {
            return '';
        }
    }).join('\n\n');
};

// Helper function to convert plain text to Editor.js data
const plainTextToEditorJs = (text) => {
    if (!text) return { blocks: [] };

    const paragraphs = text.split('\n\n');
    const blocks = paragraphs.map(paragraph => {
        return {
            type: 'paragraph',
            data: {
                text: paragraph
            }
        };
    });

    return { blocks };
};

const EditorJSComponent = ({ value, onChange }) => {
    const editorRef = useRef(null);
    const editorInstanceRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const initialData = plainTextToEditorJs(value || '');

    // Initialize Editor.js
    useEffect(() => {
        if (!editorRef.current) return;

        let editorInstance = null;

        const initEditor = async () => {
            try {
                const EditorJS = (await import('@editorjs/editorjs')).default;

                editorInstance = new EditorJS({
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
                    data: initialData,
                    placeholder: 'Start typing...',
                    onChange: async () => {
                        if (!isReady) return;

                        try {
                            const outputData = await editorInstance.save();
                            const plainText = editorJsToPlainText(outputData.blocks);

                            if (onChange) {
                                onChange({
                                    target: {
                                        value: plainText
                                    }
                                });
                            }
                        } catch (error) {
                            console.error('Failed to save Editor.js data', error);
                        }
                    }
                });

                editorInstanceRef.current = editorInstance;

                await editorInstance.isReady;
                setIsReady(true);

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

        return () => {
            // Proper cleanup for Editor.js
            if (editorInstanceRef.current) {
                try {
                    // Remove the editor's DOM content
                    if (editorRef.current) {
                        editorRef.current.innerHTML = '';
                    }
                    // Remove the reference
                    editorInstanceRef.current = null;
                } catch (error) {
                    console.error('Error during editor cleanup:', error);
                }
            }
        };
    }, []);

    // Update editor content when value prop changes
    useEffect(() => {
        if (!editorInstanceRef.current || !isReady) return;

        try {
            const currentData = plainTextToEditorJs(value || '');

            // Get the current data to compare
            editorInstanceRef.current.save().then(savedData => {
                // Only update if the content has actually changed
                const currentText = editorJsToPlainText(savedData.blocks);
                const newText = value || '';

                if (currentText !== newText) {
                    editorInstanceRef.current.render(currentData);
                }
            }).catch(error => {
                console.error('Failed to save editor content for comparison:', error);
            });
        } catch (error) {
            console.error('Failed to render editor content:', error);
        }
    }, [value, isReady]);

    return (
        <div className="editorjs-wrapper">
            <div ref={editorRef} className="editorjs-container"></div>
        </div>
    );
};

export default EditorJSComponent; 