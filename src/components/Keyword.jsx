import React from 'react';
import { usePrompt } from '../context/PromptProvider';

const Keyword = ({ keyword, type = 'positive' }) => {
  const { selectedKeywords, negativeKeywords, toggleKeyword, toggleNegativeKeyword } = usePrompt();
  
  const isSelected = type === 'positive' 
    ? selectedKeywords.has(keyword)
    : negativeKeywords.has(keyword);

  const handleClick = () => {
    if (type === 'positive') {
      toggleKeyword(keyword);
    } else {
      toggleNegativeKeyword(keyword);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`keyword-button ${
        isSelected ? 'keyword-button-selected' : 'keyword-button-unselected'
      } ${type === 'negative' ? 'border-red-600 hover:border-red-500' : ''}`}
      title={keyword}
    >
      {keyword}
    </button>
  );
};

export default Keyword; 