import React, { useState } from 'react';
import Keyword from './Keyword';

const Category = ({ categoryTitle, categoryData, type = 'positive' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // 渲染关键词数组
  const renderKeywords = (keywords) => {
    if (!Array.isArray(keywords)) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {keywords.map((keyword, index) => (
          <Keyword key={index} keyword={keyword} type={type} />
        ))}
      </div>
    );
  };

  // 渲染嵌套对象
  const renderNestedData = (data, level = 0) => {
    if (Array.isArray(data)) {
      return renderKeywords(data);
    }

    if (typeof data === 'object' && data !== null) {
      return (
        <div className={`space-y-4 ${level > 0 ? 'ml-4 mt-3' : 'mt-3'}`}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <h5 className={`font-medium ${
                level === 0 ? 'text-purple-400' : 'text-gray-400'
              } text-sm`}>
                {key}
              </h5>
              {renderNestedData(value, level + 1)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof data === 'string') {
      // 处理逗号分隔的字符串
      const keywords = data.split(', ').map(k => k.trim()).filter(k => k);
      return renderKeywords(keywords);
    }

    return null;
  };

  // 计算关键词总数
  const countKeywords = (data) => {
    if (Array.isArray(data)) {
      return data.length;
    }
    
    if (typeof data === 'object' && data !== null) {
      return Object.values(data).reduce((sum, value) => sum + countKeywords(value), 0);
    }
    
    if (typeof data === 'string') {
      return data.split(', ').filter(k => k.trim()).length;
    }
    
    return 0;
  };

  const keywordCount = countKeywords(categoryData);

  return (
    <div className="category-section">
      <div className="category-title cursor-pointer" onClick={toggleExpanded}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <span className={`transform transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}>
              ▶
            </span>
            <span>{categoryTitle}</span>
          </div>
          <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
            {keywordCount} 项
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
          {renderNestedData(categoryData)}
        </div>
      )}
    </div>
  );
};

export default Category; 