import React, { useState, useMemo } from 'react';
import { usePrompt } from '../context/PromptProvider';
import { config } from '../data/config';
import FilterCard from '../components/FilterCard';

const FilterModeView = () => {
    const { applyFilter } = usePrompt();
    const [activeCategory, setActiveCategory] = useState('全部');

    const filterCategories = useMemo(() => {
        const categories = new Set(['全部']);
        if (config.styleCombinations) {
            Object.keys(config.styleCombinations).forEach(categoryName => {
                categories.add(categoryName);
            });
        }
        return Array.from(categories);
    }, []);

    const filteredCombinations = useMemo(() => {
        if (!config.styleCombinations) return [];

        if (activeCategory === '全部') {
            // 如果是"全部"，则展平所有滤镜
            return Object.values(config.styleCombinations).flatMap(category => 
                Object.entries(category).map(([name, keywords]) => ({ name, keywords }))
            );
        }
        
        // 否则，只返回选定分类下的滤镜
        const categoryFilters = config.styleCombinations[activeCategory] || {};
        return Object.entries(categoryFilters).map(([name, keywords]) => ({ name, keywords }));

    }, [activeCategory]);
    
    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold">滤镜模式</h2>
                <p className="text-sm text-gray-400">选择一个预设滤镜，快速生成风格化提示词。</p>
            </div>
            
            <div className="p-4 overflow-x-auto">
                <div className="flex space-x-2">
                    {filterCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                                activeCategory === category 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredCombinations.map(({ name, keywords }) => (
                        <FilterCard
                            key={name}
                            filterName={name}
                            filterKeywords={keywords}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterModeView; 