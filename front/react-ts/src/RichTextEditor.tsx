import React, { useState, useRef, useEffect } from 'react';
// import './App.css'; // Import NES.css for styling

const RichTextEditor: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [isBoldMode, setIsBoldMode] = useState<boolean>(false);
  const [isLinkMode, setIsLinkMode] = useState<boolean>(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Function to handle bold shortcut
  const handleBoldShortcut = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === 'b') {
      setIsBoldMode(!isBoldMode);
    }
  };

  // Function to handle link shortcut
  const handleLinkShortcut = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === 'i') {
      setIsLinkMode(!isLinkMode);
    }
  };

  useEffect(() => {
    // Focus the editor on component mount
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleBoldClick = () => {
    setIsBoldMode(!isBoldMode);
  };

  const handleLinkClick = () => {
    setIsLinkMode(!isLinkMode);
  };

  const handleInsertText = (textToInsert: string) => {
    const textarea = editorRef.current;
    if (textarea) {
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const newText =
        content.substring(0, startPos) +
        textToInsert +
        content.substring(endPos, content.length);
      setContent(newText);
    }
  };

  return (
    <div className="nes-container">
      <textarea
        ref={editorRef}
        className="nes-textarea"
        value={content}
        onChange={handleTextAreaChange}
        onKeyDown={(e) => {
          handleBoldShortcut(e);
          handleLinkShortcut(e);
        }}
        placeholder="Type your text here..."
      />
      <div className="controls">
        <button
          className={`nes-btn ${isBoldMode ? 'is-error' : ''}`}
          onClick={handleBoldClick}
        >
          Bold (Ctrl+B)
        </button>
        <button
          className={`nes-btn ${isLinkMode ? 'is-primary' : ''}`}
          onClick={handleLinkClick}
        >
          Link (Ctrl+I)
        </button>
      </div>
      <div className="preview">{content}</div>
      {isBoldMode && (
        <span onClick={() => handleInsertText('<strong></strong>')}>
          Select text to make it bold
        </span>
      )}
      {isLinkMode && (
        <span onClick={() => handleInsertText('<a href=""></a>')}>
          Select text to insert a link
        </span>
      )}
    </div>
  );
};

export default RichTextEditor;
