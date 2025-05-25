import React from "react";
import { TOOLBOX_ITEMS, DraggableToolboxItem } from "./useDashboardLogic"; // Import TOOLBOX_ITEMS

interface DashboardSidebarProps {
  uploadedData: any | null;
  aiAnalysis: any | null;
  loadingAI: boolean;
  aiError: string | null;
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  onAnalyzeData: () => Promise<void>;
  onDragStartToolbox: (
    e: React.DragEvent<HTMLDivElement>,
    item: DraggableToolboxItem
  ) => void;
  showDashboard: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  uploadedData,
  aiAnalysis,
  loadingAI,
  aiError,
  userPrompt,
  setUserPrompt,
  onAnalyzeData,
  onDragStartToolbox,
  showDashboard,
}) => {
  return (
    <aside className="w-80 bg-gray-100 p-4 border-r border-gray-200 overflow-y-auto flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">AI Actions</h2>
      {!uploadedData ? (
        <p className="text-gray-600">Upload data to enable AI features.</p>
      ) : (
        <>
          <label
            htmlFor="user-prompt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Optional: Ask specific questions about your data
          </label>
          <textarea
            id="user-prompt"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
            rows={3}
            placeholder="E.g., 'What are the sales trends over time?' or 'Suggest visualizations comparing product categories.'"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
          />

          <button
            onClick={onAnalyzeData}
            disabled={loadingAI}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAI ? "Analyzing..." : "Analyze Data with AI"}
          </button>
        </>
      )}

      {aiError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <strong>Error:</strong> {aiError}
        </div>
      )}

      {aiAnalysis && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">AI Insights:</h3>
          <div>
            <h4 className="font-medium text-gray-700">Summary:</h4>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">
              {aiAnalysis.summary}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Data Story:</h4>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">
              {aiAnalysis.dataStory}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Suggested Charts:</h4>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              {aiAnalysis.suggestedCharts.map((chart: any, index: number) => (
                <li key={index}>
                  <strong>{chart.title}</strong> ({chart.chartType}):{" "}
                  {chart.explanation}
                  <br />
                  <code className="text-xs bg-gray-100 p-1 rounded">
                    Data Keys:{" "}
                    {JSON.stringify({
                      dataKey: chart.dataKey,
                      categoryKey: chart.categoryKey,
                      xDataKey: chart.xDataKey,
                      yDataKey: chart.yDataKey,
                    })}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showDashboard && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800 border-t pt-4">
            Dashboard Toolbox
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {TOOLBOX_ITEMS.map((item) => (
              <div
                key={item.type}
                className="toolbox-item p-3 bg-white border border-gray-200 rounded-md shadow-sm cursor-grab hover:shadow-md transition-shadow duration-200 text-center text-blue-700 font-medium"
                draggable
                onDragStart={(e) => onDragStartToolbox(e, item)}
              >
                {item.displayName}
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default DashboardSidebar;
