import React from 'react';
import { usePrompt } from '../context/PromptProvider';

const FilterCard = ({ filterName, filterKeywords }) => {
  const { applyFilter, selectedFilter } = usePrompt();
  
  const isSelected = selectedFilter === filterName;

  const handleClick = () => {
    applyFilter(filterKeywords, filterName);
  };

  // 获取滤镜图标（基于名称的前缀）
  const getFilterIcon = (name) => {
    if (name.includes('雨后') || name.includes('💧')) return '💧';
    if (name.includes('午后') || name.includes('☀️')) return '☀️';
    if (name.includes('守护') || name.includes('🛡️')) return '🛡️';
    if (name.includes('悸动') || name.includes('💌')) return '💌';
    if (name.includes('梦') || name.includes('😊')) return '😊';
    if (name.includes('霓虹') || name.includes('🌃')) return '🌃';
    if (name.includes('星际') || name.includes('🪐')) return '🪐';
    if (name.includes('废土') || name.includes('⚙️')) return '⚙️';
    if (name.includes('仿生') || name.includes('🤖')) return '🤖';
    if (name.includes('太空') || name.includes('🛰️')) return '🛰️';
    if (name.includes('史诗') || name.includes('⚔️')) return '⚔️';
    if (name.includes('哥特') || name.includes('🏰')) return '🏰';
    if (name.includes('魔法') || name.includes('✨')) return '✨';
    if (name.includes('遗迹') || name.includes('📜')) return '📜';
    if (name.includes('仙侠') || name.includes('⛩️')) return '⛩️';
    if (name.includes('印象') || name.includes('🎨')) return '🎨';
    if (name.includes('巴洛克') || name.includes('🖼️')) return '🖼️';
    if (name.includes('浮世绘') || name.includes('🌊')) return '🌊';
    if (name.includes('童话') || name.includes('✒️')) return '✒️';
    if (name.includes('新艺术') || name.includes('⚜️')) return '⚜️';
    if (name.includes('蒸汽波') || name.includes('🔮')) return '🔮';
    if (name.includes('多边形') || name.includes('🧩')) return '🧩';
    if (name.includes('故障') || name.includes('💥')) return '💥';
    if (name.includes('像素') || name.includes('🕹️')) return '🕹️';
    if (name.includes('极简') || name.includes('⚪️')) return '⚪️';
    if (name.includes('克苏鲁') || name.includes('🩸')) return '🩸';
    if (name.includes('Found') || name.includes('📼')) return '📼';
    if (name.includes('日式恐怖') || name.includes('👻')) return '👻';
    if (name.includes('心理') || name.includes('🧠')) return '🧠';
    if (name.includes('罗马') || name.includes('🏛️')) return '🏛️';
    if (name.includes('海岛') || name.includes('🏖️')) return '🏖️';
    if (name.includes('咖啡') || name.includes('🍂')) return '🍂';
    if (name.includes('新海诚') || name.includes('🌸')) return '🌸';
    if (name.includes('星空') || name.includes('🌌')) return '🌌';
    if (name.includes('迪士尼') || name.includes('👑')) return '👑';
    if (name.includes('韩剧') || name.includes('💖')) return '💖';
    if (name.includes('情书') || name.includes('📜')) return '📜';
    if (name.includes('探戈') || name.includes('💃')) return '💃';
    if (name.includes('仲夏') || name.includes('🦋')) return '🦋';
    if (name.includes('壁炉') || name.includes('🛋️')) return '🛋️';
    if (name.includes('威尼斯') || name.includes('🎭')) return '🎭';
    if (name.includes('单车') || name.includes('🚲')) return '🚲';
    if (name.includes('英伦') || name.includes('🌹')) return '🌹';
    if (name.includes('战斗') || name.includes('🔥')) return '🔥';
    if (name.includes('西部') || name.includes('🏜️')) return '🏜️';
    if (name.includes('迪斯科') || name.includes('🕺')) return '🕺';
    if (name.includes('深海') || name.includes('🌊')) return '🌊';
    return '🎨'; // 默认图标
  };

  const icon = getFilterIcon(filterName);

  return (
    <div
      onClick={handleClick}
      className={`filter-card ${isSelected ? 'filter-card-selected' : ''}`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl flex-shrink-0">
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-100 mb-2 text-sm">
            {filterName}
          </h4>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {filterKeywords.slice(0, 6).map((keyword, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-md"
              >
                {keyword}
              </span>
            ))}
            {filterKeywords.length > 6 && (
              <span className="text-xs px-2 py-1 bg-gray-600 text-gray-400 rounded-md">
                +{filterKeywords.length - 6}
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            包含 {filterKeywords.length} 个关键词
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2 text-purple-400">
          ✓
        </div>
      )}
    </div>
  );
};

export default FilterCard; 