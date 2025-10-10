import React, { useState, useEffect, useRef, cloneElement } from 'react';
import './GrammarRectifier.css';

const GrammarRectifier = ({ children }) => {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredError, setHoveredError] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  const checkGrammar = async (inputText) => {
    try {
      const response = await fetch('http://127.0.0.1:5555/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();

      const mappedErrors = (result.errors || []).map(err => ({
        bad: err.bad,
        message: err.message,
        suggestions: err.suggestions || [],
        offset: err.offset,
        length: err.length
      }));

      return { errors: mappedErrors };
    } catch (error) {
      console.error('API request failed:', error);
      return { errors: [] };
    }
  };

  useEffect(() => {
    if (text.length > 0) {
      setLoading(true);
      const timer = setTimeout(async () => {
        try {
          const result = await checkGrammar(text);
          setErrors(result.errors || []);
        } catch (err) {
          console.error('Grammar check failed:', err);
          setErrors([]);
        } finally {
          setLoading(false);
        }
      }, 600); 
      return () => clearTimeout(timer);
    } else {
      setErrors([]);
    }
  }, [text]);

  const getTextWithHighlights = () => {
    if (errors.length === 0) return text;

    let highlightedText = text;
    const sortedErrors = [...errors].sort((a, b) => b.offset - a.offset);

    sortedErrors.forEach((error) => {
      const beforeError = highlightedText.substring(0, error.offset);
      const errorText = highlightedText.substring(error.offset, error.offset + error.length);
      const afterError = highlightedText.substring(error.offset + error.length);

      highlightedText =
        beforeError +
        `<span class="grammar-error" data-error="${error.bad}" data-suggestions="${error.suggestions.join(',')}" data-message="${error.message}">${errorText}</span>` +
        afterError;
    });

    return highlightedText;
  };

  const handleMouseMove = (e) => {
    if (e.target.classList.contains('grammar-error')) {
      const errorWord = e.target.getAttribute('data-error');
      const suggestions = e.target.getAttribute('data-suggestions').split(',').filter(s => s);
      const message = e.target.getAttribute('data-message');

      setHoveredError({ word: errorWord, suggestions, message });
      
      const rect = e.target.getBoundingClientRect();
      setHoverPosition({ 
        x: rect.left + window.scrollX, 
        y: rect.bottom + window.scrollY + 5 
      });
    } else {
      setHoveredError(null);
    }
  };

  const applySuggestion = (suggestion) => {
  if (hoveredError) {
    const errorMatch = errors.find(e => e.bad === hoveredError.word);
    
    if (errorMatch) {
      const start = errorMatch.offset;
      const end = errorMatch.offset + errorMatch.length;
      const newText = text.substring(0, start) + suggestion + text.substring(end);
      setText(newText);
    } else {
      const index = text.indexOf(hoveredError.word);
      if (index !== -1) {
        const newText = text.substring(0, index) + suggestion + text.substring(index + hoveredError.word.length);
        setText(newText);
      }
    }
    setHoveredError(null);
  }
};

  const syncScroll = () => {
    if (inputRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = inputRef.current.scrollTop;
      overlayRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  const enhancedChild = cloneElement(children, {
    ref: inputRef,
    value: text,
    onChange: (e) => setText(e.target.value),
    onScroll: syncScroll,
    className: (children.props.className || '') + ' text-input'
  });

  return (
    <div className="grammar-rectifier">
      <div className="header">
         {loading && <div className="loading-indicator">Checking...</div>}
      </div>

      <div className="input-container">
        <div className="textarea-wrapper">
          {enhancedChild}

          <div
            ref={overlayRef}
            className="highlight-overlay"
            dangerouslySetInnerHTML={{ __html: getTextWithHighlights() }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredError(null)}
          />
        </div>

        {hoveredError && (
          <div
            className="suggestion-tooltip"
            style={{ left: hoverPosition.x, top: hoverPosition.y }}
          >
            <div className="tooltip-message">{hoveredError.message}</div>
            {hoveredError.suggestions.length > 0 && (
              <div className="suggestions">
                <strong>Suggestions:</strong>
                {hoveredError.suggestions.map((s, i) => (
                  <button key={i} className="suggestion-btn" onClick={() => applySuggestion(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="error-summary">Found {errors.length} error{errors.length > 1 ? 's' : ''}</div>
      )}
      {text && errors.length === 0 && !loading && <div className="no-errors">No grammar errors!</div>}
    </div>
  );
};

export default GrammarRectifier;
