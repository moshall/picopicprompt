import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { config } from '../data/config.js';

// --- 提前定义所有需要的函数和变量 ---

const groupOrder = ['一. 情感意图', '二. 内容主体', '三. 场景环境', '四. 光效色调', '五. 镜头语言', '六. 艺术风格'];
const keywordToGroupMap = {};

const addToMap = (data, groupName) => {
  if (Array.isArray(data)) {
    data.forEach(keyword => {
      keywordToGroupMap[keyword] = groupName;
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.values(data).forEach(value => addToMap(value, groupName));
  }
};

if (config.emotionKeywords) addToMap(config.emotionKeywords, '一. 情感意图');
if (config.characterDimensions) addToMap(config.characterDimensions, '二. 内容主体');
if (config.sceneTypes) addToMap(config.sceneTypes, '三. 场景环境');
if (config.sceneElements) addToMap(config.sceneElements, '三. 场景环境');
if (config.sceneEnvironment) addToMap(config.sceneEnvironment, '三. 场景环境');
if (config.colorPalettes) addToMap(config.colorPalettes, '四. 光效色调');
if (config.lighting) addToMap(config.lighting, '四. 光效色调');
if (config.cinematicLanguage) addToMap(config.cinematicLanguage, '五. 镜头语言');
if (config.artStyles) addToMap(config.artStyles, '六. 艺术风格');

const generateStructuredPromptString = (keywordsSet) => {
  if (!keywordsSet || keywordsSet.size === 0) return '';
  
  const groupedKeywords = groupOrder.reduce((acc, group) => {
    acc[group] = [];
    return acc;
  }, {});

  keywordsSet.forEach(keyword => {
    const group = keywordToGroupMap[keyword];
    if (groupedKeywords[group]) {
      groupedKeywords[group].push(keyword);
    }
  });

  let promptParts = [];
  groupOrder.forEach(group => {
    if (groupedKeywords[group].length > 0) {
      promptParts.push(`${group.split('. ')[1]}：${groupedKeywords[group].join(', ')}`);
    }
  });

  return promptParts.join('; ');
};


// --- 定义初始状态 ---

const PromptContext = createContext();

const initialIsAnimeMode = true;
const initialSelectedKeywords = new Set();
if (initialIsAnimeMode) {
  initialSelectedKeywords.add('二次元');
}

const initialState = {
  selectedKeywords: initialSelectedKeywords,
  negativeKeywords: new Set(['blur', 'bad quality', 'worst quality', 'lowres', 'text', 'watermark']),
  currentMode: 'manual',
  finalPrompt: generateStructuredPromptString(initialSelectedKeywords),
  finalNegativePrompt: 'blur, bad quality',
  selectedFilter: null,
  isAnimeMode: initialIsAnimeMode,
};


// --- Reducer 和 Provider ---

const promptReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_KEYWORD': {
      const newSelected = new Set(state.selectedKeywords);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      const newPrompt = generateStructuredPromptString(newSelected);
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
      };
    }

    case 'TOGGLE_NEGATIVE_KEYWORD': {
      const newNegative = new Set(state.negativeKeywords);
      if (newNegative.has(action.payload)) {
        newNegative.delete(action.payload);
      } else {
        newNegative.add(action.payload);
      }
      const newFinalNegativePrompt = Array.from(newNegative).join(', ');
      return {
        ...state,
        negativeKeywords: newNegative,
        finalNegativePrompt: newFinalNegativePrompt,
      };
    }

    case 'TOGGLE_KEYWORD_COMBINATION': {
      const newSelected = new Set(state.selectedKeywords);
      const comboKeywords = action.payload;
      
      // 以组合中的第一个关键词作为判断是否已选中的依据
      const isAlreadySelected = newSelected.has(comboKeywords[0]);
      
      if (isAlreadySelected) {
        // 如果已选中，则移除所有组合内的关键词
        comboKeywords.forEach(kw => newSelected.delete(kw));
      } else {
        // 如果未选中，则添加所有组合内的关键词
        comboKeywords.forEach(kw => newSelected.add(kw));
      }

      const newPrompt = generateStructuredPromptString(newSelected);
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
      };
    }
    
    case 'ADD_KEYWORD': {
      const newSelected = new Set(state.selectedKeywords);
      newSelected.add(action.payload);
      const newPrompt = generateStructuredPromptString(newSelected);
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
      };
    }
    
    case 'REMOVE_KEYWORD': {
      const newSelected = new Set(state.selectedKeywords);
      newSelected.delete(action.payload);
      const newPrompt = generateStructuredPromptString(newSelected);
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
      };
    }
    
    case 'ADD_NEGATIVE_KEYWORD': {
      const newNegative = new Set(state.negativeKeywords);
      newNegative.add(action.payload);
      const newFinalNegativePrompt = Array.from(newNegative).join(', ');
      return {
        ...state,
        negativeKeywords: newNegative,
        finalNegativePrompt: newFinalNegativePrompt,
      };
    }
    
    case 'REMOVE_NEGATIVE_KEYWORD': {
      const newNegative = new Set(state.negativeKeywords);
      newNegative.delete(action.payload);
      const newFinalNegativePrompt = Array.from(newNegative).join(', ');
      return {
        ...state,
        negativeKeywords: newNegative,
        finalNegativePrompt: newFinalNegativePrompt,
      };
    }
    
    case 'APPLY_FILTER': {
      const newSelected = new Set(action.payload);
      if (state.isAnimeMode) {
        newSelected.add('二次元');
      }
      const newPrompt = generateStructuredPromptString(newSelected);
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
        selectedFilter: action.filterName,
        currentMode: 'manual', // 切换到手动模式以便微调
      };
    }
    
    case 'CLEAR_ALL': {
      const newSelected = new Set();
      if (state.isAnimeMode) {
        newSelected.add('二次元');
      }
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: generateStructuredPromptString(newSelected),
        selectedFilter: null,
      };
    }
    
    case 'SET_MODE': {
      return {
        ...state,
        currentMode: action.payload,
      };
    }
    
    case 'UPDATE_PROMPT': {
      return {
        ...state,
        finalPrompt: action.payload,
      };
    }
    
    case 'UPDATE_NEGATIVE_PROMPT': {
      return {
        ...state,
        finalNegativePrompt: action.payload,
      };
    }
    
    case 'TOGGLE_ANIME_MODE': {
      const newIsAnimeMode = !state.isAnimeMode;
      const newSelected = new Set(state.selectedKeywords);

      if (newIsAnimeMode) {
        newSelected.add('二次元');
      } else {
        newSelected.delete('二次元');
      }

      const newPrompt = generateStructuredPromptString(newSelected);
      return {
        ...state,
        isAnimeMode: newIsAnimeMode,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
      };
    }
    
    case 'GENERATE_LUCKY': {
      // 随机生成逻辑
      const luckyKeywords = [];
      
      try {
        // 从情感关键词中随机选1个
        if (config.emotionKeywords && config.emotionKeywords.length > 0) {
          const randomEmotion = config.emotionKeywords[Math.floor(Math.random() * config.emotionKeywords.length)];
          luckyKeywords.push(randomEmotion);
        }
        
        // 从角色基础设定中选择
        const characterDim = config.characterDimensions?.['含人物角色场景'];
        if (characterDim) {
          // 基础原型
          if (characterDim.base_archetype) {
            luckyKeywords.push(characterDim.base_archetype[Math.floor(Math.random() * characterDim.base_archetype.length)]);
          }
          
          // 种族身份
          if (characterDim.species_identity) {
            luckyKeywords.push(characterDim.species_identity[Math.floor(Math.random() * characterDim.species_identity.length)]);
          }
          
          // 职业
          if (characterDim.class_occupation) {
            luckyKeywords.push(characterDim.class_occupation[Math.floor(Math.random() * characterDim.class_occupation.length)]);
          }
          
          // 姿势类型
          if (characterDim.pose_type) {
            const poseCategories = Object.keys(characterDim.pose_type);
            const randomCategory = poseCategories[Math.floor(Math.random() * poseCategories.length)];
            const poses = characterDim.pose_type[randomCategory];
            if (poses && poses.length > 0) {
              luckyKeywords.push(poses[Math.floor(Math.random() * poses.length)]);
            }
          }
        }
        
        // 场景类型
        if (config.sceneTypes && config.sceneTypes.length > 0) {
          luckyKeywords.push(config.sceneTypes[Math.floor(Math.random() * config.sceneTypes.length)]);
        }
        
        // 灯光
        if (config.lighting && config.lighting.length > 0) {
          luckyKeywords.push(config.lighting[Math.floor(Math.random() * config.lighting.length)]);
        }
        
        // 艺术风格
        if (config.artStyles) {
          const styleCategories = Object.keys(config.artStyles);
          const randomStyleCategory = styleCategories[Math.floor(Math.random() * styleCategories.length)];
          const styleData = config.artStyles[randomStyleCategory];
          
          if (typeof styleData === 'object') {
            const styleSubcategories = Object.keys(styleData);
            const randomSubcategory = styleSubcategories[Math.floor(Math.random() * styleSubcategories.length)];
            const styles = styleData[randomSubcategory];
            
            if (typeof styles === 'string') {
              // 如果是字符串，分割并随机选择
              const styleArray = styles.split(', ');
              luckyKeywords.push(styleArray[Math.floor(Math.random() * styleArray.length)]);
            }
          }
        }
        
        // 镜头语言
        if (config.cinematicLanguage) {
          // 镜头类型
          if (config.cinematicLanguage.camera_shot_type) {
            luckyKeywords.push(config.cinematicLanguage.camera_shot_type[Math.floor(Math.random() * config.cinematicLanguage.camera_shot_type.length)]);
          }
          
          // 镜头角度
          if (config.cinematicLanguage.camera_angle) {
            luckyKeywords.push(config.cinematicLanguage.camera_angle[Math.floor(Math.random() * config.cinematicLanguage.camera_angle.length)]);
          }
        }
        
        // 添加随机的画质相关词
        const qualityKeywords = ['杰作', '最佳画质', '高细节', '超高分辨率', '8K', '电影级', '大师作品'];
        const numToSelect = Math.floor(Math.random() * 3) + 1; // 随机选择1-3个画质词
        for (let i = 0; i < numToSelect; i++) {
          const randomIndex = Math.floor(Math.random() * qualityKeywords.length);
          // 确保不重复添加
          if (!luckyKeywords.includes(qualityKeywords[randomIndex])) {
            luckyKeywords.push(qualityKeywords[randomIndex]);
          }
        }
        
      } catch (error) {
        console.error('生成随机关键词时出错:', error);
        // 如果出错，提供默认的随机关键词
        luckyKeywords.push('杰作', '最佳画质', '少女', '动漫风格', '柔光');
      }
      
      const newSelected = new Set(luckyKeywords);
      if (state.isAnimeMode) {
        newSelected.add('二次元');
      }
      const newPrompt = generateStructuredPromptString(newSelected);
      
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
        selectedFilter: null,
      };
    }
    
    default:
      return state;
  }
};

// Provider组件
export const PromptProvider = ({ children }) => {
  const [state, dispatch] = useReducer(promptReducer, initialState);
  
  // 将所有独立的 add/remove 函数统一为 toggle
  const toggleKeyword = (keyword) => {
    dispatch({ type: 'TOGGLE_KEYWORD', payload: keyword });
  };

  const toggleNegativeKeyword = (keyword) => {
    dispatch({ type: 'TOGGLE_NEGATIVE_KEYWORD', payload: keyword });
  };

  const toggleKeywordCombination = (combo) => {
    dispatch({ type: 'TOGGLE_KEYWORD_COMBINATION', payload: combo });
  };
  
  const applyFilter = (keywords, filterName) => {
    dispatch({ type: 'APPLY_FILTER', payload: keywords, filterName });
  };
  
  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  const setMode = (mode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  const updatePrompt = (prompt) => {
    dispatch({ type: 'UPDATE_PROMPT', payload: prompt });
  };

  const updateNegativePrompt = (prompt) => {
    dispatch({ type: 'UPDATE_NEGATIVE_PROMPT', payload: prompt });
  };

  const toggleAnimeMode = () => {
    dispatch({ type: 'TOGGLE_ANIME_MODE' });
  };

  const generateLucky = () => {
    dispatch({ type: 'GENERATE_LUCKY' });
  };
  
  const value = {
    ...state,
    toggleKeyword,
    toggleNegativeKeyword,
    toggleKeywordCombination,
    applyFilter,
    clearAll,
    setMode,
    updatePrompt,
    updateNegativePrompt,
    toggleAnimeMode,
    generateLucky,
  };
  
  return (
    <PromptContext.Provider value={value}>
      {children}
    </PromptContext.Provider>
  );
};

// Hook来使用上下文
export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
}; 