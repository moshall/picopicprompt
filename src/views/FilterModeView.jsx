import React, { useState } from 'react';
import FilterCard from '../components/FilterCard';
import { config } from '../data/config.js';

const FilterModeView = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // 获取滤镜分类
  const getFilterCategories = () => {
    const categories = new Set(['全部']);
    
    if (config.styleCombinations) {
      Object.keys(config.styleCombinations).forEach(filterName => {
        if (filterName.includes('情感') || filterName.includes('💧') || filterName.includes('☀️') || 
            filterName.includes('🛡️') || filterName.includes('💌') || filterName.includes('😊')) {
          categories.add('情感氛围');
        } else if (filterName.includes('科幻') || filterName.includes('🌃') || filterName.includes('🪐') || 
                   filterName.includes('⚙️') || filterName.includes('🤖') || filterName.includes('🛰️')) {
          categories.add('科幻未来');
        } else if (filterName.includes('史诗') || filterName.includes('⚔️') || filterName.includes('🏰') || 
                   filterName.includes('✨') || filterName.includes('📜') || filterName.includes('⛩️')) {
          categories.add('奇幻史诗');
        } else if (filterName.includes('艺术') || filterName.includes('🎨') || filterName.includes('🖼️') || 
                   filterName.includes('🌊') || filterName.includes('✒️') || filterName.includes('⚜️')) {
          categories.add('艺术绘画');
        } else if (filterName.includes('潮流') || filterName.includes('🔮') || filterName.includes('🧩') || 
                   filterName.includes('💥') || filterName.includes('🕹️') || filterName.includes('⚪️')) {
          categories.add('潮流设计');
        } else if (filterName.includes('恐怖') || filterName.includes('🩸') || filterName.includes('📼') || 
                   filterName.includes('👻') || filterName.includes('🧠')) {
          categories.add('恐怖悬疑');
        } else if (filterName.includes('浪漫') || filterName.includes('🏛️') || filterName.includes('🏖️') || 
                   filterName.includes('🍂') || filterName.includes('🌸') || filterName.includes('🌌') || 
                   filterName.includes('👑') || filterName.includes('💖') || filterName.includes('💃') || 
                   filterName.includes('🦋') || filterName.includes('🛋️') || filterName.includes('🎭') || 
                   filterName.includes('🚲') || filterName.includes('🌹')) {
          categories.add('浪漫生活');
        } else if (filterName.includes('动态') || filterName.includes('🔥') || filterName.includes('🏜️') || 
                   filterName.includes('🕺') || filterName.includes('🌊')) {
          categories.add('动态动作');
        } else {
          categories.add('其他');
        }
      });
    }
    
    return Array.from(categories);
  };

  // 过滤滤镜
  const getFilteredFilters = () => {
    if (!config.styleCombinations) return [];
    
    let filters = Object.entries(config.styleCombinations);
    
    // 按分类过滤
    if (selectedCategory !== '全部') {
      filters = filters.filter(([filterName]) => {
        switch (selectedCategory) {
          case '情感氛围':
            return filterName.includes('情感') || filterName.includes('💧') || filterName.includes('☀️') || 
                   filterName.includes('🛡️') || filterName.includes('💌') || filterName.includes('😊');
          case '科幻未来':
            return filterName.includes('科幻') || filterName.includes('🌃') || filterName.includes('🪐') || 
                   filterName.includes('⚙️') || filterName.includes('🤖') || filterName.includes('🛰️');
          case '奇幻史诗':
            return filterName.includes('史诗') || filterName.includes('⚔️') || filterName.includes('🏰') || 
                   filterName.includes('✨') || filterName.includes('📜') || filterName.includes('⛩️');
          case '艺术绘画':
            return filterName.includes('艺术') || filterName.includes('🎨') || filterName.includes('🖼️') || 
                   filterName.includes('🌊') || filterName.includes('✒️') || filterName.includes('⚜️');
          case '潮流设计':
            return filterName.includes('潮流') || filterName.includes('🔮') || filterName.includes('🧩') || 
                   filterName.includes('💥') || filterName.includes('🕹️') || filterName.includes('⚪️');
          case '恐怖悬疑':
            return filterName.includes('恐怖') || filterName.includes('🩸') || filterName.includes('📼') || 
                   filterName.includes('👻') || filterName.includes('🧠');
          case '浪漫生活':
            return filterName.includes('浪漫') || filterName.includes('🏛️') || filterName.includes('🏖️') || 
                   filterName.includes('🍂') || filterName.includes('🌸') || filterName.includes('🌌') || 
                   filterName.includes('👑') || filterName.includes('💖') || filterName.includes('💃') || 
                   filterName.includes('🦋') || filterName.includes('🛋️') || filterName.includes('🎭') || 
                   filterName.includes('🚲') || filterName.includes('🌹');
          case '动态动作':
            return filterName.includes('动态') || filterName.includes('🔥') || filterName.includes('🏜️') || 
                   filterName.includes('🕺') || filterName.includes('🌊');
          default:
            return true;
        }
      });
    }
    
    return filters;
  };

  const categories = getFilterCategories();
  const filteredFilters = getFilteredFilters();

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 分类筛选 */}
      <div className="mb-6 space-y-4">
        {/* 分类按钮 */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 滤镜网格 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFilters.map(([filterName, filterKeywords]) => (
          <FilterCard
            key={filterName}
            filterName={filterName}
            filterKeywords={filterKeywords}
          />
        ))}
      </div>

      {/* 无结果提示 */}
      {filteredFilters.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">😢</div>
          <p className="text-gray-400">
            没有找到匹配的滤镜，请尝试其他搜索词或选择不同的分类
          </p>
        </div>
      )}

      {/* 滤镜统计 */}
      <div className="mt-8 text-center text-sm text-gray-500">
        共 {Object.keys(config.styleCombinations || {}).length} 个滤镜，
        当前显示 {filteredFilters.length} 个
      </div>
    </div>
  );
};

export default FilterModeView; 