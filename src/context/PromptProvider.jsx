import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { config } from '../data/config.js';

// --- 新增：关键词到主分类的映射 ---
const keywordToGroupMap = {};
const groupOrder = ['一. 情感意图', '二. 内容主体', '三. 场景环境', '四. 光效色调', '五. 镜头语言', '六. 艺术风格'];

// 辅助函数：递归地将关键词添加到映射
const addToMap = (data, groupName) => {
  if (Array.isArray(data)) {
    data.forEach(keyword => {
      keywordToGroupMap[keyword] = groupName;
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.values(data).forEach(value => addToMap(value, groupName));
  }
};

// 填充映射
if (config.emotionKeywords) addToMap(config.emotionKeywords, '一. 情感意图');
if (config.characterDimensions) addToMap(config.characterDimensions, '二. 内容主体');
if (config.sceneTypes) addToMap(config.sceneTypes, '三. 场景环境');
if (config.sceneElements) addToMap(config.sceneElements, '三. 场景环境');
if (config.sceneEnvironment) addToMap(config.sceneEnvironment, '三. 场景环境');
if (config.colorPalettes) addToMap(config.colorPalettes, '四. 光效色调');
if (config.lighting) addToMap(config.lighting, '四. 光效色调');
if (config.cinematicLanguage) addToMap(config.cinematicLanguage, '五. 镜头语言');
if (config.artStyles) addToMap(config.artStyles, '六. 艺术风格');
// 画质词也归类，虽然不在六大分类标题中，但可用于排序
['杰作', '最佳画质', '高细节', '超高分辨率', '8K', '电影级', '大师作品'].forEach(k => keywordToGroupMap[k] = '0. 画质');
// --- 映射结束 ---

// 创建上下文
const PromptContext = createContext();

// 初始状态
const initialState = {
  selectedKeywords: new Set(),
  negativeKeywords: new Set(['blur', 'bad quality', 'worst quality', 'lowres', 'text', 'watermark']),
  currentMode: 'manual',
  finalPrompt: '二次元',
  finalNegativePrompt: 'blur, bad quality',
  selectedFilter: null,
  isAnimeMode: true,
};

// 关键词排序优先级
const keywordPriority = {
  '杰作': 0, '大师作品': 0, '最佳画质': 0, '高细节': 0, '超高分辨率': 0, '8K': 0, '电影级': 0,
  // 主体相关
  '女孩': 1, '男孩': 1, '少女': 1, '少年': 1, '人类': 1, '精灵': 1, '恶魔': 1, '天使': 1,
  // 姿势动作
  '站立': 2, '坐着': 2, '躺着': 2, '奔跑': 2, '跳跃': 2,
  // 细节
  '长发': 3, '短发': 3, '马尾': 3, '衬衫': 3, 'T恤': 3,
  // 风格
  '动漫风格': 4, '写实': 4, '插画': 4, '概念艺术': 4,
  // 场景
  '魔法森林': 5, '废土': 5, '赛博朋克城市': 5,
  // 灯光
  '柔光': 6, '硬光': 6, '体积光': 6, '霓虹闪烁': 6,
  // 镜头
  '特写': 7, '远景': 7, '广角镜头': 7,
};

// 获取关键词优先级
const getKeywordPriority = (keyword) => {
  // 使用新的分类映射来决定大致顺序
  const group = keywordToGroupMap[keyword];
  const groupIndex = group ? groupOrder.indexOf(group) : -1;
  return groupIndex !== -1 ? groupIndex : groupOrder.length;
};

// 生成结构化的Prompt字符串
const generateStructuredPromptString = (keywordsSet, isAnimeMode) => {
  if (keywordsSet.size === 0 && !isAnimeMode) return '';
  
  const groupedKeywords = groupOrder.reduce((acc, group) => {
    acc[group] = [];
    return acc;
  }, {});

  let qualityKeywords = [];

  // 1. 分组关键词
  keywordsSet.forEach(keyword => {
    const group = keywordToGroupMap[keyword];
    if (group === '0. 画质') {
      qualityKeywords.push(keyword);
    } else if (groupedKeywords[group]) {
      groupedKeywords[group].push(keyword);
    }
  });

  // 根据isAnimeMode状态，条件性地添加"二次元"
  if (isAnimeMode) {
    // 确保不重复添加
    if (!groupedKeywords['六. 艺术风格'].includes('二次元')) {
      groupedKeywords['六. 艺术风格'].push('二次元');
    }
  }

  // 2. 构建字符串
  let promptParts = [];

  // 首先添加高优先级的画质词
  if (qualityKeywords.length > 0) {
    promptParts.push(qualityKeywords.join(', '));
  }

  // 然后按顺序添加六大分类
  groupOrder.forEach(group => {
    if (groupedKeywords[group].length > 0) {
      promptParts.push(`${group.split('. ')[1]}：${groupedKeywords[group].join(', ')}`);
    }
  });

  return promptParts.join('; ');
};

// Reducer函数
const promptReducer = (state, action) => {
  switch (action.type) {
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

      const newPrompt = generateStructuredPromptString(newSelected, state.isAnimeMode);
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
      };
    }

    case 'ADD_KEYWORD': {
      const newSelected = new Set(state.selectedKeywords);
      newSelected.add(action.payload);
      const newPrompt = generateStructuredPromptString(newSelected, state.isAnimeMode);
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
      };
    }
    
    case 'REMOVE_KEYWORD': {
      const newSelected = new Set(state.selectedKeywords);
      newSelected.delete(action.payload);
      const newPrompt = generateStructuredPromptString(newSelected, state.isAnimeMode);
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
      };
    }
    
    case 'ADD_NEGATIVE_KEYWORD': {
      const newNegative = new Set(state.negativeKeywords);
      newNegative.add(action.payload);
      return {
        ...state,
        negativeKeywords: newNegative,
        finalNegativePrompt: generateStructuredPromptString(newNegative, state.isAnimeMode),
      };
    }
    
    case 'REMOVE_NEGATIVE_KEYWORD': {
      const newNegative = new Set(state.negativeKeywords);
      newNegative.delete(action.payload);
      return {
        ...state,
        negativeKeywords: newNegative,
        finalNegativePrompt: generateStructuredPromptString(newNegative, state.isAnimeMode),
      };
    }
    
    case 'APPLY_FILTER': {
      const newSelected = new Set(action.payload);
      const newPrompt = generateStructuredPromptString(newSelected, state.isAnimeMode);
      return {
        ...state,
        selectedKeywords: newSelected,
        finalPrompt: newPrompt,
        selectedFilter: action.filterName,
        currentMode: 'manual', // 切换到手动模式以便微调
      };
    }
    
    case 'CLEAR_ALL': {
      return {
        ...state,
        selectedKeywords: new Set(),
        finalPrompt: state.isAnimeMode ? '艺术风格：二次元' : '',
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
      const newPrompt = generateStructuredPromptString(state.selectedKeywords, newIsAnimeMode);
      return {
        ...state,
        isAnimeMode: newIsAnimeMode,
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
      const newPrompt = generateStructuredPromptString(newSelected, state.isAnimeMode);
      
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
  
  // 提供的方法
  const actions = {
    addKeyword: (keyword) => dispatch({ type: 'ADD_KEYWORD', payload: keyword }),
    removeKeyword: (keyword) => dispatch({ type: 'REMOVE_KEYWORD', payload: keyword }),
    addNegativeKeyword: (keyword) => dispatch({ type: 'ADD_NEGATIVE_KEYWORD', payload: keyword }),
    removeNegativeKeyword: (keyword) => dispatch({ type: 'REMOVE_NEGATIVE_KEYWORD', payload: keyword }),
    applyFilter: (keywords, filterName) => dispatch({ type: 'APPLY_FILTER', payload: keywords, filterName }),
    clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
    setMode: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    generateLucky: () => dispatch({ type: 'GENERATE_LUCKY' }),
    updatePrompt: (prompt) => dispatch({ type: 'UPDATE_PROMPT', payload: prompt }),
    updateNegativePrompt: (prompt) => dispatch({ type: 'UPDATE_NEGATIVE_PROMPT', payload: prompt }),
    toggleAnimeMode: () => dispatch({ type: 'TOGGLE_ANIME_MODE' }),
    toggleKeyword: (keyword) => {
      if (state.selectedKeywords.has(keyword)) {
        dispatch({ type: 'REMOVE_KEYWORD', payload: keyword });
      } else {
        dispatch({ type: 'ADD_KEYWORD', payload: keyword });
      }
    },
    toggleNegativeKeyword: (keyword) => {
      if (state.negativeKeywords.has(keyword)) {
        dispatch({ type: 'REMOVE_NEGATIVE_KEYWORD', payload: keyword });
      } else {
        dispatch({ type: 'ADD_NEGATIVE_KEYWORD', payload: keyword });
      }
    },
  };
  
  const value = {
    ...state,
    ...actions,
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