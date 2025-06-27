import React from 'react';
import Category from '../components/Category';
import { config } from '../data/config.js';

const ManualModeView = () => {
  // 根据新的逻辑链条重构分类
  const getGroupedCategories = () => {
    const groups = {
      '一. 情感意图': [],
      '二. 内容主体': [],
      '三. 场景环境': [],
      '四. 光效色调': [],
      '五. 镜头语言': [],
      '六. 艺术风格': [],
    };

    // 1. 情感意图
    if (config.emotionKeywords) {
      groups['一. 情感意图'].push({ title: '🎭 情感意图', data: config.emotionKeywords });
    }

    // 2. 内容主体
    if (config.characterDimensions) {
      const charaConfig = config.characterDimensions;
      if (charaConfig['含人物角色场景']) groups['二. 内容主体'].push({ title: '👤 人物', data: charaConfig['含人物角色场景'] });
      if (charaConfig['纯物品']) groups['二. 内容主体'].push({ title: '🏺 物品', data: charaConfig['纯物品'] });
      if (charaConfig['拟人化角色']) groups['二. 内容主体'].push({ title: '🦄 拟人角色', data: charaConfig['拟人化角色'] });
    }

    // 3. 场景环境
    if (config.sceneTypes) groups['三. 场景环境'].push({ title: '🏞️ 场景类型', data: config.sceneTypes });
    if (config.sceneElements) groups['三. 场景环境'].push({ title: '✨ 场景元素', data: config.sceneElements });
    if (config.sceneEnvironment) groups['三. 场景环境'].push({ title: '🌅 环境设定', data: config.sceneEnvironment });

    // 4. 光效色调
    if (config.colorPalettes) groups['四. 光效色调'].push({ title: '🎨 调色风格', data: config.colorPalettes });
    if (config.lighting) groups['四. 光效色调'].push({ title: '💡 灯光效果', data: config.lighting });
    
    // 5. 镜头语言
    if (config.cinematicLanguage) {
      groups['五. 镜头语言'].push({ title: '📷 镜头语言', data: config.cinematicLanguage });
    }

    // 6. 艺术风格
    if (config.artStyles) {
      groups['六. 艺术风格'].push({ title: '🎨 艺术风格', data: config.artStyles });
    }
    if (config.styleCombinations) {
      groups['六. 艺术风格'].push({ title: '🔮 风格组合滤镜', data: config.styleCombinations });
    }
    
    return Object.entries(groups).filter(([_, categories]) => categories.length > 0);
  };

  const groupedCategories = getGroupedCategories();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {groupedCategories.map(([groupTitle, categories], index) => (
        <div key={index} className="space-y-4">
          <h2 className="text-xl font-bold text-cyan-300 border-l-4 border-cyan-400 pl-4">
            {groupTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            {categories.map((category, catIndex) => (
              <Category
                key={catIndex}
                categoryTitle={category.title}
                categoryData={category.data}
                type="positive"
              />
            ))}
          </div>
        </div>
      ))}

      {/* 负面关键词区域 */}
      <div>
        <h2 className="text-xl font-bold text-red-400 border-l-4 border-red-500 pl-4 mb-4">
          负面关键词
        </h2>
        <Category
          categoryTitle="🚫 常用负面词 (Negative Prompt)"
          categoryData={[
            'blur', 'bad quality', 'worst quality', 'lowres', 'text', 'watermark',
            'signature', 'username', 'error', 'jpeg artifacts', 'blurry',
            'extra limbs', 'mutated hands', 'poorly drawn hands', 'poorly drawn face',
            'mutation', 'deformed', 'ugly', 'bad anatomy', 'bad proportions',
            'extra fingers', 'fewer fingers', 'cropped', 'out of frame'
          ]}
          type="negative"
        />
      </div>
    </div>
  );
};

export default ManualModeView; 