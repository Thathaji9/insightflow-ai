import React from "react";
import TextWidget from "../../components/TextWidget";
import ChartWidget from "../../components/ChartWidget";
import TableWidget from "../../components/TableWidget";
import D3Widget from "../../components/D3Widget";
import ErrorBoundary from "../../components/ErrorBoundary";
import { DashboardWidget } from "./useDashboardLogic";

interface WidgetRendererProps {
  widget: DashboardWidget;
  handleEditWidget: (widget: DashboardWidget) => void;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  handleEditWidget,
}) => {
  const errorFallback = (
    <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
      <p className="font-semibold text-center">Widget Error</p>
      <p className="text-xs text-center mt-1">
        Failed to render widget. Check data format.
      </p>
      <button
        className="mt-2 text-blue-600 hover:underline text-xs"
        onClick={() => handleEditWidget(widget)}
      >
        Edit Widget
      </button>
    </div>
  );

  switch (widget.type) {
    case "text":
      return (
        <ErrorBoundary fallback={errorFallback}>
          <TextWidget content={widget.data?.content || "Edit me!"} />
        </ErrorBoundary>
      );
    case "chart":
      return (
        <ErrorBoundary fallback={errorFallback}>
          <ChartWidget data={widget.data} />
        </ErrorBoundary>
      );
    case "table":
      return (
        <ErrorBoundary fallback={errorFallback}>
          <TableWidget
            columns={widget.data?.columns || []}
            rows={widget.data?.rows || []}
          />
        </ErrorBoundary>
      );
    case "d3":
      return (
        <ErrorBoundary fallback={errorFallback}>
          <D3Widget radius={widget.data?.radius} color={widget.data?.color} />
        </ErrorBoundary>
      );
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Unknown Widget Type
        </div>
      );
  }
};

export default WidgetRenderer;
