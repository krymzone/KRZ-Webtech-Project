import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './Dashboard.css';
import logo from './logo.png'

const Dashboard = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Note 1', content: '', attachments: [], markdownContent: '' },
    { id: 2, title: 'Note 2', content: '', attachments: [], markdownContent: '' },
  ]);

  const [selectedNote, setSelectedNote] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [isMarkdownView, setIsMarkdownView] = useState(true);

  const noteRef = useRef(null);

  useEffect(() => {
    if (selectedNote !== null) {
      const note = notes.find((note) => note.id === selectedNote);
      setEditingContent(note.content);
      const markdownContent = note.markdownContent || '';
      noteRef.current.value = isMarkdownView ? markdownContent : ''; // Set the value based on the current view
    }
  }, [selectedNote, notes, isMarkdownView]);  

  const handleCreateNote = () => {
    const newNoteObject = {
      id: notes.length + 1,
      title: `Note ${notes.length + 1}`,
      content: '',
      attachments: [],
      markdownContent: '',
    };

    setNotes([...notes, newNoteObject]);
    setSelectedNote(newNoteObject.id);
    setEditingContent('');
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setSelectedNote(null);
    setEditingContent('');
  };

  const handleTitleChange = (id, newTitle) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, title: newTitle } : note
    );
    setNotes(updatedNotes);
  };

  const handleContentChange = (content) => {
    setEditingContent(content);
  };

  const handleToggleMarkdownView = () => {
    setIsMarkdownView(!isMarkdownView);
  
    if (!isMarkdownView) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote ? { ...note, markdownContent: editingContent } : note
      );
      setNotes(updatedNotes);
    }
  };
  

  const handleShare = (action) => {
    const noteContent = isMarkdownView
      ? notes.find((note) => note.id === selectedNote)?.markdownContent || ''
      : editingContent;

    switch (action) {
      case 'downloadTxt':
        downloadFile(noteContent, 'txt');
        break;
      case 'downloadMd':
        downloadFile(noteContent, 'md');
        break;
      case 'copyToClipboard':
        copyToClipboard(noteContent);
        break;
      default:
        break;
    }
  };

  const downloadFile = (content, extension) => {
    const blob = new Blob([content], { type: `text/${extension}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    // Optionally, you can show a notification or perform other actions after copying.
  };

  const handleAttachmentChange = (e) => {
    const files = e.target.files;
    const updatedNotes = notes.map((note) =>
      note.id === selectedNote ? { ...note, attachments: files } : note
    );
    setNotes(updatedNotes);
  };

  const renderAttachments = (attachments) => {
    return Array.from(attachments).map((attachment, index) => {
      const type = attachment.type.split('/')[0]; // Get the general type (image, audio, video, etc.)

      switch (type) {
        case 'image':
          return (
            <div key={index} className="attachment-container">
              <img
                src={URL.createObjectURL(attachment)}
                alt={`Attachment ${index + 1}`}
                className="attachment-image"
              />
            </div>
          );
        case 'audio':
          return (
            <div key={index}>
              <audio controls>
                <source src={URL.createObjectURL(attachment)} type={attachment.type} />
                Your browser does not support the audio element.
              </audio>
            </div>
          );
        case 'video':
          return (
            <div key={index}>
              <video width="320" height="240" controls>
                <source src={URL.createObjectURL(attachment)} type={attachment.type} />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        case 'text':
          // You can implement more specific handling for text-based attachments
          return (
            <div key={index}>
              <a href={URL.createObjectURL(attachment)} download={`attachment_${index + 1}`}>
                Attachment {index + 1}
              </a>
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="dashboard-container">
      {/* Notes Sidebar */}
      <div className="sidebar">
        <h2>Your Notes</h2>
        <ul>
          {notes.map((note) => (
            <li key={note.id} onClick={() => setSelectedNote(note.id)}>
              {note.title}
            </li>
          ))}
        </ul>
        <img src={logo} alt="Logo" className="logo" /> {/* Update the logo source */}
        <button onClick={handleCreateNote}>Create Note</button>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {selectedNote !== null && (
          <div className="note-content" ref={noteRef}>
            {/* Title Bar */}
            <div className="title-bar">
              <input
                type="text"
                value={notes.find((note) => note.id === selectedNote)?.title || ''}
                onChange={(e) => handleTitleChange(selectedNote, e.target.value)}
                placeholder="Enter title"
              />
            </div>

            {/* Markdown Renderer or Textarea for Editing */}
            {isMarkdownView ? (
              <>
                <ReactMarkdown>
                  {notes.find((note) => note.id === selectedNote)?.markdownContent || ''}
                </ReactMarkdown>
                {renderAttachments(notes.find((note) => note.id === selectedNote)?.attachments)}
              </>
            ) : (
              <>
                <textarea
                  value={editingContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Enter your note content (supports Markdown)"
                />
                <input
                  type="file"
                  accept="image/*, audio/*, video/*, .doc, .docx, .pdf, .txt"
                  onChange={handleAttachmentChange}
                />
              </>
            )}

            {/* Toggle Button */}
            <button className="option-button" onClick={handleToggleMarkdownView}>
              {isMarkdownView ? 'Edit' : 'Markdown'}
            </button>

            {/* Share Options */}
            <button className="option-button" onClick={() => handleShare('downloadTxt')}>Download as .txt</button>
            <button className="option-button" onClick={() => handleShare('downloadMd')}>Download as .md</button>
            <button className="option-button" onClick={() => handleShare('copyToClipboard')}>Copy to Clipboard</button>

            {/* Note Options */}
            <button className="delete-button" onClick={() => handleDeleteNote(selectedNote)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
