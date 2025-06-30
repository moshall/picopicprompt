import React from 'react';
import { PromptProvider, usePrompt } from './context/PromptProvider';
import ModeSelector from './components/ModeSelector';
import PromptDisplay from './components/PromptDisplay';
import ManualModeView from './views/ManualModeView';
import FilterModeView from './views/FilterModeView';
import LuckyModeView from './views/LuckyModeView';

// 主要应用内容组件
const AppContent = () => {
  const { currentMode } = usePrompt();

  const renderCurrentView = () => {
    switch (currentMode) {
      case 'manual':
        return <ManualModeView />;
      case 'filter':
        return <FilterModeView />;
      case 'lucky':
        return <LuckyModeView />;
      default:
        return <ManualModeView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 头部标题 */}
      <header className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              🎨 PicoPico文生图 Prompt 生成器
            </h1>
            <p className="text-gray-300 text-lg">
              使用滤镜模式请先选择滤镜，再手动选择内容主体获得最佳效果
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span>✨ 三种生成模式</span>
              <span>•</span>
              <span>🎯 智能关键词排序</span>
              <span>•</span>
              <span>📋 一键复制功能</span>
              <span>•</span>
              <span>🎨 丰富滤镜库</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        
        {/* 新的统一工作区面板 */}
        <div className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700">
          {/* 面板头部：模式选择器 */}
          <div className="p-6 border-b border-gray-700">
            <ModeSelector />
          </div>

          {/* 面板内容：两栏布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-6">
            {/* 左侧栏：功能区 */}
            <div className="lg:col-span-3">
              <section>
                {renderCurrentView()}
              </section>
            </div>
            
            {/* 右侧栏：结果展示区 */}
            <div className="lg:col-span-2">
              <section>
                <PromptDisplay />
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="text-gray-400 text-sm">
              <p>🎯 支持 Stable Diffusion, Midjourney, DALL-E 等 AI 绘画工具</p>
              <p>💡 基于专业关键词数据库，智能生成高质量 Prompt</p>
            </div>
            
            <div className="flex justify-center space-x-6 text-xs text-gray-500">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Made with React + Tailwind CSS</span>
              <span>•</span>
              <span>静态部署友好</span>
            </div>

            <div className="text-gray-500 text-xs">
              © 2024 AIPG-WebApp. 开源项目，欢迎贡献！
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// 主App组件
const App = () => {
  return (
    <PromptProvider>
      <AppContent />
    </PromptProvider>
  );
};

export default App;
