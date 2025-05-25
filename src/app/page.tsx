"use client";

import WidgetConfigModal from "../components/WidgetConfigModal";
import { useDashboardLogic } from "../features/dashboard/useDashboardLogic";
import DashboardHeader from "../features/dashboard/DashboardHeader";
import DashboardSidebar from "../features/dashboard/DashboardSidebar";
import DashboardGrid from "../features/dashboard/DashboardGrid";

export default function HomePage() {
  const {
    uploadedData,
    aiAnalysis,
    loadingAI,
    aiError,
    userPrompt,
    setUserPrompt,
    fileInputRef,
    dashboardWidgets,
    editingWidget,
    draggingToolboxItem,
    showDashboard,
    gridKey,
    handleFileUpload,
    handleClearData,
    analyzeDataWithAI,
    onLayoutChange,
    onDragStartToolbox,
    onDropNewWidget,
    handleDragOver,
    handleEditWidget,
    handleSaveWidgetConfig,
    handleRemoveWidget,
  } = useDashboardLogic();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DashboardHeader
        uploadedData={uploadedData}
        fileInputRef={fileInputRef as any}
        onFileUpload={handleFileUpload}
        onClearData={handleClearData}
      />

      <main className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          uploadedData={uploadedData}
          aiAnalysis={aiAnalysis}
          loadingAI={loadingAI}
          aiError={aiError}
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          onAnalyzeData={analyzeDataWithAI}
          onDragStartToolbox={onDragStartToolbox}
          showDashboard={showDashboard}
        />

        <DashboardGrid
          dashboardWidgets={dashboardWidgets}
          onLayoutChange={onLayoutChange}
          onDropNewWidget={onDropNewWidget}
          handleDragOver={handleDragOver}
          droppingItem={
            draggingToolboxItem
              ? {
                  i: "__dropping__",
                  w: draggingToolboxItem.w,
                  h: draggingToolboxItem.h,
                }
              : undefined
          }
          handleEditWidget={handleEditWidget}
          handleRemoveWidget={handleRemoveWidget}
          gridKey={gridKey}
          showDashboard={showDashboard}
          uploadedData={uploadedData}
        />
      </main>

      {editingWidget && (
        <WidgetConfigModal
          widget={editingWidget}
          onSave={handleSaveWidgetConfig}
          onClose={() => handleEditWidget(null as any)}
        />
      )}
    </div>
  );
}
