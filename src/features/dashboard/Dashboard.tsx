"use client";

import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import type { Layout } from "react-grid-layout";
import { DashboardWidget } from "./useDashboardLogic";
import WidgetRenderer from "./WidgetRenderer";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  dashboardWidgets: DashboardWidget[];
  onLayoutChange: (layout: Layout[]) => void;
  onDropNewWidget: (
    layout: Layout[],
    droppedLayoutItem: Layout,
    event: Event
  ) => void;
  handleDragOver: (e: React.DragEvent) => void;
  droppingItem: { i: string; w: number; h: number } | undefined;
  handleEditWidget: (widget: DashboardWidget) => void;
  handleRemoveWidget: (id: string) => void;
  gridKey: number;
  showDashboard: boolean; // Add this prop
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  dashboardWidgets,
  onLayoutChange,
  onDropNewWidget,
  handleDragOver,
  droppingItem,
  handleEditWidget,
  handleRemoveWidget,
  gridKey,
  showDashboard,
}) => {
  return (
    <section
      className="flex-1 p-6 overflow-y-auto bg-white"
      onDragOver={handleDragOver}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {showDashboard ? "Your Dynamic Dashboard" : "Data Preview"}
      </h2>

      {!showDashboard && (
        <div className="text-center text-gray-600 p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-full">
          <p className="mb-4 text-lg">
            Start by uploading a CSV or JSON data file.
          </p>
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 text-xl font-medium"
          >
            Select File to Upload
          </label>
          <p className="mt-4 text-sm text-gray-500">
            Supports .csv and .json formats.
          </p>
        </div>
      )}

      {showDashboard && (
        <>
          {dashboardWidgets.length === 0 ? (
            <div className="text-center text-gray-600 p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-full">
              <p className="mb-4 text-lg">Your dashboard is empty!</p>
              <p className="mb-4 text-md">
                Drag widgets from the "Dashboard Toolbox" on the left, or
                analyze data to get AI-suggested charts.
              </p>
            </div>
          ) : (
            <ResponsiveGridLayout
              key={gridKey}
              className="layout"
              layouts={{
                lg: dashboardWidgets.map((w) => ({
                  i: w.i,
                  x: w.x,
                  y: w.y,
                  w: w.w,
                  h: w.h,
                })),
              }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={100}
              onLayoutChange={onLayoutChange}
              compactType="vertical"
              preventCollision={false}
              draggableHandle=".widget-drag-handle"
              isDroppable={true}
              onDrop={onDropNewWidget}
              droppingItem={droppingItem}
            >
              {dashboardWidgets.map((widget) => (
                <div
                  key={widget.i}
                  className="widget-item relative bg-white border border-gray-300 rounded-lg shadow-md group"
                >
                  <div className="widget-drag-handle absolute top-0 left-0 p-1 cursor-grab text-gray-400 hover:text-gray-600 transition-colors">
                    <span className="drag-icon">⋮⋮</span>
                  </div>
                  <div className="absolute top-0 right-0 p-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md"
                      onClick={() => handleEditWidget(widget)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                      onClick={() => handleRemoveWidget(widget.i)}
                    >
                      &times;
                    </button>
                  </div>
                  <h3 className="widget-title text-sm font-semibold pt-6 px-2 pb-1 text-gray-700 truncate">
                    {widget.data?.title ||
                      `${
                        widget.type.charAt(0).toUpperCase() +
                        widget.type.slice(1)
                      } Widget`}
                  </h3>
                  <div className="h-[calc(100%-40px)] w-full">
                    <WidgetRenderer
                      widget={widget}
                      handleEditWidget={handleEditWidget}
                    />
                  </div>
                </div>
              ))}
            </ResponsiveGridLayout>
          )}
        </>
      )}
    </section>
  );
};

export default DashboardGrid;
