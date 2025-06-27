import React from 'react';
import { usePrompt } from '../context/PromptProvider';

const ModeSelector = () => {
  const { currentMode, setMode, generateLucky, clearAll } = usePrompt();

  const modes = [
    {
      key: 'manual',
      name: '🎛️ 手动模式',
      description: '自由选择关键词组合'
    },
    {
      key: 'filter',
      name: '🎨 滤镜模式',
      description: '使用预设风格滤镜'
    },
    {
      key: 'lucky',
      name: '🎲 随机模式',
      description: '一键生成随机Prompt'
    }
  ];

  const handleModeChange = (mode) => {
    setMode(mode);
  };

  const handleLuckyGenerate = () => {
    generateLucky();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* 模式选择按钮 */}
      <div className="flex flex-wrap gap-4 justify-center">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => handleModeChange(mode.key)}
            className={`${
              currentMode === mode.key ? 'mode-button mode-button-active' : 'mode-button mode-button-inactive'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">{mode.name}</div>
              <div className="text-xs opacity-80 mt-1">{mode.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* 底部信息行 */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700/50">
        {/* 当前模式说明 */}
        <div className="inline-block px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
          <span className="text-gray-400 text-sm">
            当前模式: <span className="text-cyan-400 font-medium">
              {modes.find(m => m.key === currentMode)?.name}
            </span>
          </span>
        </div>

        {/* 条件显示的清空按钮 */}
        {currentMode !== 'lucky' && (
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-800/50 text-red-300 rounded-lg font-medium hover:bg-red-700/60 transition-all duration-200 border border-red-700/80 text-sm"
          >
            🧹 清空全部
          </button>
        )}
      </div>
    </div>
  );
};

export default ModeSelector; 