import React, { useState } from 'react';
import { usePrompt } from '../context/PromptProvider';

const LuckyModeView = () => {
  const { generateLucky, selectedKeywords, finalPrompt } = usePrompt();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLuckyGenerate = async () => {
    setIsGenerating(true);
    
    // 添加一些生成动画效果
    setTimeout(() => {
      generateLucky();
      setIsGenerating(false);
    }, 1000);
  };

  const luckyTips = [
    "🎲 点击 Lucky 按钮获取随机 Prompt 组合",
    "✨ 每次生成都会从不同分类中随机选择关键词",
    "🎯 生成后可以切换到手动模式进行微调",
    "🔄 不满意结果？再来一次 Lucky！",
    "🎨 随机生成包含情感、角色、场景、灯光等元素"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 主要操作区域 */}
      <div className="text-center mb-8">
        <button
          onClick={handleLuckyGenerate}
          disabled={isGenerating}
          className={`px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 transform ${
            isGenerating
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-2xl hover:scale-105'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center space-x-2">
              <span className="animate-spin">🎲</span>
              <span>生成中...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <span>🎲</span>
              <span>Lucky一下！</span>
            </span>
          )}
        </button>
      </div>

      {/* 生成结果预览 */}
      {finalPrompt && (
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-400 mb-4 text-center">
            ✨ 随机生成结果
          </h3>
          
          {/* 选择的关键词标签 */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {Array.from(selectedKeywords).map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-full shadow-lg"
              >
                {keyword}
              </span>
            ))}
          </div>
          
          <div className="text-center text-gray-300 text-sm">
            共生成 {selectedKeywords.size} 个关键词
          </div>
        </div>
      )}

      {/* 使用提示 */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 text-center">
          💡 使用提示
        </h3>
        
        <div className="space-y-3">
          {luckyTips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-purple-400 font-bold text-lg">•</span>
              <span className="text-gray-300 text-sm leading-relaxed">
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 随机生成统计 */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-4 px-6 py-3 bg-gray-800 rounded-full border border-gray-700">
          <div className="text-center">
            <div className="text-cyan-400 font-bold text-lg">∞</div>
            <div className="text-gray-400 text-xs">无限组合</div>
          </div>
          <div className="w-px h-8 bg-gray-600"></div>
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-lg">1</div>
            <div className="text-gray-400 text-xs">一键生成</div>
          </div>
          <div className="w-px h-8 bg-gray-600"></div>
          <div className="text-center">
            <div className="text-green-400 font-bold text-lg">✓</div>
            <div className="text-gray-400 text-xs">即时可用</div>
          </div>
        </div>
      </div>

      {/* 底部说明 */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        随机生成基于 config.js 中的所有关键词数据库
      </div>
    </div>
  );
};

export default LuckyModeView; 