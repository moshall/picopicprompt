import React, { useState } from 'react';
import { usePrompt } from '../context/PromptProvider';

const PromptDisplay = () => {
  const { 
    finalPrompt, 
    finalNegativePrompt, 
    updatePrompt, 
    updateNegativePrompt,
    isAnimeMode,
    toggleAnimeMode
  } = usePrompt();
  const [copiedType, setCopiedType] = useState(null);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 正面Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cyan-400">
            ✨ 正面 Prompt
          </h3>
          <button
            onClick={() => copyToClipboard(finalPrompt, 'positive')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              copiedType === 'positive'
                ? 'bg-green-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {copiedType === 'positive' ? '✅ 已复制' : '📋 复制'}
          </button>
        </div>
        
        <textarea
          value={finalPrompt}
          onChange={(e) => updatePrompt(e.target.value)}
          placeholder="暂无选择的关键词，请选择关键词或使用随机生成功能"
          className="prompt-output w-full h-32 resize-y bg-gray-800 border border-gray-600 rounded-lg p-4 font-mono text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex items-center justify-end mt-2">
          <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-300 hover:text-white">
            <input
              type="checkbox"
              checked={isAnimeMode}
              onChange={toggleAnimeMode}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-2 focus:ring-offset-gray-800 focus:ring-purple-600"
            />
            <span>默认增加「二次元」关键词</span>
          </label>
        </div>
      </div>

      {/* 负面Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-red-400">
            🚫 负面 Prompt
          </h3>
          <button
            onClick={() => copyToClipboard(finalNegativePrompt, 'negative')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              copiedType === 'negative'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {copiedType === 'negative' ? '✅ 已复制' : '📋 复制'}
          </button>
        </div>
        
        <textarea
          value={finalNegativePrompt}
          onChange={(e) => updateNegativePrompt(e.target.value)}
          className="prompt-output w-full h-24 resize-y bg-gray-800 border border-gray-600 rounded-lg p-4 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* 统计信息 */}
      <div className="flex justify-center space-x-6 text-sm text-gray-400">
        <span>
          正面关键词: {finalPrompt.split(', ').filter(word => word.trim()).length}
        </span>
        <span>
          负面关键词: {finalNegativePrompt.split(', ').filter(word => word.trim()).length}
        </span>
      </div>
    </div>
  );
};

export default PromptDisplay; 