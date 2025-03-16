import React from 'react';
import { createRoot } from 'react-dom/client';
import MonacoEditor from '@monaco-editor/react';

class MonacoCodeTool {
    static get toolbox() {
        return {
            title: 'Code',
            icon: '{}'
        };
    }

    constructor({ data, api, config }) {
        this.api = api;
        this.data = {
            code: data.code || '',
            language: data.language || 'javascript'
        };
        this.config = config || {};
        this.wrapper = undefined;
        this.editorNode = undefined;
        this.editor = undefined;
        this.root = undefined;
        this.contentChanged = false;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('monaco-code-tool');

        // Create language selector
        const languageSelector = document.createElement('select');
        languageSelector.classList.add('monaco-language-selector');
        const languages = ['javascript', 'typescript', 'html', 'css', 'python', 'java', 'c', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust', 'swift'];

        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.text = lang.charAt(0).toUpperCase() + lang.slice(1);
            option.selected = this.data.language === lang;
            languageSelector.appendChild(option);
        });

        languageSelector.addEventListener('change', (e) => {
            this.data.language = e.target.value;
            if (this.editor && window.monaco) {
                this.editor.setModel(window.monaco.editor.createModel(this.data.code, this.data.language));
            }
        });

        this.wrapper.appendChild(languageSelector);

        // Create editor container
        this.editorNode = document.createElement('div');
        this.editorNode.style.width = '100%';
        // Start with minimum height
        const initialHeight = this.data.code ? Math.max(this.getCodeLineCount() * 20, 40) : 40;
        this.editorNode.style.height = `${initialHeight}px`;

        this.wrapper.appendChild(this.editorNode);

        // Set up Monaco Editor using React 18's createRoot API
        this.root = createRoot(this.editorNode);

        const EditorComponent = () => {
            return (
                <MonacoEditor
                    height="100%"
                    language={this.data.language}
                    value={this.data.code}
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        lineNumbers: "on",
                        glyphMargin: false,
                        folding: false,
                        lineDecorationsWidth: 5,
                        lineNumbersMinChars: 3,
                        automaticLayout: true
                    }}
                    onChange={(value) => {

                        this.data.code = value;
                        this.contentChanged = true;
                        this.updateEditorHeight();
                    }}
                    onMount={(editor) => {
                        this.editor = editor;

                        // After the editor is mounted, set up auto-resize functionality
                        editor.onDidContentSizeChange(() => {
                            this.updateEditorHeight();
                        });

                        this.addEnterKeyHandling(editor);

                        // Initial height calculation
                        setTimeout(() => {
                            this.updateEditorHeight();
                        }, 50);
                    }}
                />
            );
        };

        this.root.render(<EditorComponent />);

        return this.wrapper;
    }

    getCodeLineCount() {
        // Get line count from code
        return this.data.code.split("\n").length;
    }

    addEnterKeyHandling(editor) {
        // Add command to handle Enter key in Monaco
        editor.addCommand(
            window.monaco.KeyCode.Enter,
            () => {
                // Insert a new line at the current cursor position
                const selection = editor.getSelection();
                const text = '\n';
                this.enterKeyPressed = true;
                editor.executeEdits('', [
                    {
                        range: selection,
                        text: text,
                        forceMoveMarkers: true
                    }
                ]);
            },
            'editorTextFocus'
        );
    }

    updateEditorHeight() {
        if (!this.editor) return;

        // Use the editor's content height directly
        const contentHeight = this.editor.getContentHeight();

        // Set a minimum height for empty or very small content
        const newHeight = Math.max(40, contentHeight);

        // Update the editor's container height
        this.editorNode.style.height = `${newHeight}px`;

        // Force editor to relayout with new dimensions
        this.editor.layout();

        // Notify EditorJS to recalculate block size
        if (this.contentChanged) {
            this.contentChanged = false;
            this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex(), newHeight);
        }
    }

    save() {
        return {
            code: this.data.code,
            language: this.data.language
        };
    }

    destroy() {
        // Clean up React root on destroy
        if (this.root) {
            this.root.unmount();
        }
    }

    static get sanitize() {
        return {
            code: true,
            language: false
        };
    }

    // Handle pasting from pre/code tags
    static get pasteConfig() {
        return {
            tags: ['pre', 'code']
        };
    }
}


const style = document.createElement('style');
style.textContent = `
.monaco-code-tool {
    margin-bottom: 10px;
    border-radius: 8px;
}   
`;
document.head.appendChild(style);

export default MonacoCodeTool;