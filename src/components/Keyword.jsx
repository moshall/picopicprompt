import React from 'react';
import { usePrompt } from '../context/PromptProvider';

const Keyword = ({ keyword, type = 'positive' }) => {
  const { 
    selectedKeywords, 
    negativeKeywords, 
    toggleKeyword, 
    toggleNegativeKeyword, 
    toggleKeywordCombination 
  } = usePrompt();

  const isCombination = typeof keyword === 'object' && keyword !== null && keyword.combo;
  const name = isCombination ? keyword.name : keyword;
  const comboKeywords = isCombination ? keyword.combo : [];

  const isSelected = isCombination
    ? selectedKeywords.has(comboKeywords[0]) // 以组合的第一个词为准
    : type === 'positive' 
      ? selectedKeywords.has(name)
      : negativeKeywords.has(name);

  const handleClick = () => {
    if (isCombination) {
      toggleKeywordCombination(comboKeywords);
    } else if (type === 'positive') {
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
      title={name}
    >
      {name}
    </button>
  );
};

export default Keyword; 