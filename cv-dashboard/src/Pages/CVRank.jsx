import React, { useState } from 'react';
import Input from '../Components/ui/Input';
import { Card } from '../Components/ui/Card';
import './cv-rank.css';
import Background from '../Components/Background';
import { suggestionsList } from '../utils/suggestions';

const CVRank = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cvs, setCvs] = useState([]);
  const [suggestions] = useState(suggestionsList);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return; // Prevent empty search
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/Sewmini/api/search_cvs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: searchQuery, top_n: 5 }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setCvs(data.ranked_cvs || []); // Ensure we handle empty results gracefully
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const words = searchQuery.trim().split(/\s+/);
    words[words.length - 1] = suggestion;
    setSearchQuery(words.join(' ') + ' ');
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const words = searchQuery.trim().split(/\s+/);
  const lastWord = words[words.length - 1] || '';
  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(lastWord.toLowerCase())
  );

  return (
    <Background>
      <div className="cv-rank-page">
        <h2>Welcome to CV Ranker</h2>
        <h3 className="page-subtopic">Upload, Analyze, and Rank CVs with Ease!</h3>

        <div className="search-container">
          <Input
            type="text"
            placeholder="Enter your search query"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          <button className="search-button" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>

          {lastWord && filteredSuggestions.length > 0 && showSuggestions && (
            <div className="suggestions-dropdown">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-button"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="cv-cards">
          {cvs.map((cv, index) => (
            <Card key={index}>
              <div className="card-content">
                <h2>Rank {index+1}</h2>
                <h3>{cv.file_name}</h3>
                <p className='Similarity'>Compatibility: {(cv.similarity_score * 1000).toFixed(2)}%</p>
                </div>
            </Card>
          ))}
        </div>
      </div>
    </Background>
  );
};

export default CVRank;
