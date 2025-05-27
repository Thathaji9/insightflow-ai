import { useState, useRef, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import type { Layout } from 'react-grid-layout';

interface ParsedData {
  headers: string[];
  rows: Record<string, any>[];
}

interface ChartSuggestion {
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  title: string;
  explanation: string;
  dataKey?: string;
  categoryKey?: string;
  xDataKey?: string;
  yDataKey?: string;
  dataset?: number[] | { x: number; y: number }[];
  labels?: string[];
}

interface AiAnalysisResult {
  summary: string;
  suggestedCharts: ChartSuggestion[];
  dataStory: string;
}

export interface DashboardWidget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'text' | 'chart' | 'table' | 'd3';
  data?: any;
}

export interface DraggableToolboxItem {
  type: 'text' | 'chart' | 'table' | 'd3';
  w: number;
  h: number;
  displayName: string;
  defaultData?: any;
}

export const TOOLBOX_ITEMS: DraggableToolboxItem[] = [
  { type: 'text', w: 2, h: 1, displayName: 'Text Widget', defaultData: { content: 'New Text Block' } },
  { type: 'chart', w: 4, h: 3, displayName: 'Chart Widget', defaultData: { chartType: 'bar', dataset: [10, 20, 30], title: 'New Chart', labels: ['A', 'B', 'C'] } },
  { type: 'table', w: 5, h: 4, displayName: 'Table Widget', defaultData: { columns: ['Col A', 'Col B'], rows: [{ 'Col A': 'Data 1', 'Col B': 'Data 2' }] } },
  { type: 'd3', w: 3, h: 3, displayName: 'D3 Widget', defaultData: { radius: 50, color: '#FF5733' } },
];


export const useDashboardLogic = () => {
  const [uploadedData, setUploadedData] = useState<ParsedData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);
  const [draggingToolboxItem, setDraggingToolboxItem] = useState<DraggableToolboxItem | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => {
    try {
      const savedWidgets = localStorage.getItem('insightflowDashboardWidgets');
      if (savedWidgets) {
        const parsedWidgets: DashboardWidget[] = JSON.parse(savedWidgets);
        setDashboardWidgets(parsedWidgets);
        if (parsedWidgets.length > 0) {
          setShowDashboard(true);
        }
      }
    } catch (e) {
      console.error("Failed to load dashboard from localStorage:", e);
      localStorage.removeItem('insightflowDashboardWidgets');
      setDashboardWidgets([]);
      setShowDashboard(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('insightflowDashboardWidgets', JSON.stringify(dashboardWidgets));
    if (dashboardWidgets.length === 0 && gridKey !== 0) {
      setGridKey(0);
    } else if (dashboardWidgets.length > 0 && gridKey === 0) {
      setGridKey(prev => prev + 1);
    }
  }, [dashboardWidgets, gridKey]);


  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedData(null);
    setAiAnalysis(null);
    setAiError(null);
    setDashboardWidgets([]);
    setShowDashboard(false);

    const parseFile = (readerResult: string) => {
      try {
        const json = JSON.parse(readerResult);
        if (Array.isArray(json) && json.length > 0 && typeof json[0] === 'object' && json[0] !== null) {
          const headers = Object.keys(json[0]);
          setUploadedData({ headers, rows: json });
        } else {
          alert('Invalid JSON format. Expected a non-empty array of objects.');
        }
      } catch (error) {
        alert('Error parsing JSON file. Please ensure it is valid JSON.');
        console.error('JSON parsing error:', error);
      }
    };

    if (file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => parseFile(e.target?.result as string);
      reader.readAsText(file);
    } else if (file.type === 'text/csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          if (results.errors.length > 0) {
            console.error('CSV Parsing Errors:', results.errors);
            alert('Error parsing CSV file. Check console for details.');
            return;
          }
          if (results.data.length > 0) {
            const headers = Object.keys(results.data[0]);
            setUploadedData({ headers, rows: results.data as Record<string, any>[] });
          } else {
            alert('CSV file is empty or has no data rows after headers.');
          }
        },
        error: (error: any) => {
          alert(`Error reading CSV file: ${error.message}`);
          console.error('CSV read error:', error);
        }
      });
    } else {
      alert('Unsupported file type. Please upload a CSV or JSON file.');
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, []);

  const handleClearData = useCallback(() => {
    setUploadedData(null);
    setAiAnalysis(null);
    setAiError(null);
    setUserPrompt('');
    setDashboardWidgets([]);
    setShowDashboard(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const deriveChartData = useCallback((
    suggestedChart: ChartSuggestion,
    allData: Record<string, any>[]
  ): { dataset: number[] | { x: number; y: number }[]; labels?: string[]; } => {
    if (suggestedChart.dataset && suggestedChart.dataset.length > 0) {
      return { dataset: suggestedChart.dataset, labels: suggestedChart.labels };
    }

    if (suggestedChart.chartType === 'scatter' && suggestedChart.xDataKey && suggestedChart.yDataKey && allData.length > 0) {
      const scatterDataset: { x: number; y: number }[] = [];
      allData.forEach(row => {
        const xValue = typeof row[suggestedChart.xDataKey!] === 'number' ? row[suggestedChart.xDataKey!] : parseFloat(row[suggestedChart.xDataKey!]);
        const yValue = typeof row[suggestedChart.yDataKey!] === 'number' ? row[suggestedChart.yDataKey!] : parseFloat(row[suggestedChart.yDataKey!]);

        if (!isNaN(xValue) && !isNaN(yValue)) {
          scatterDataset.push({ x: xValue, y: yValue });
        }
      });
      return { dataset: scatterDataset };
    }

    if (suggestedChart.dataKey && allData.length > 0) {
      const valueMap: { [key: string]: number } = {};
      const labelsSet = new Set<string>();

      allData.forEach(row => {
        const rawValue = row[suggestedChart.dataKey!];
        const category = suggestedChart.categoryKey ? String(row[suggestedChart.categoryKey!]) : `Item ${Object.keys(valueMap).length + 1}`;

        const value = typeof rawValue === 'number' ? rawValue : parseFloat(rawValue);

        if (!isNaN(value)) {
          labelsSet.add(category);
          valueMap[category] = (valueMap[category] || 0) + value;
        }
      });

      const derivedLabels = Array.from(labelsSet);
      const derivedDataset = derivedLabels.map(label => valueMap[label] || 0);

      if (derivedDataset.length === 0 && allData.length > 0 && suggestedChart.dataKey) {
        console.warn(`No numerical data found for dataKey: ${suggestedChart.dataKey}. Defaulting to empty dataset.`);
      }

      return { dataset: derivedDataset, labels: derivedLabels.length > 0 ? derivedLabels : undefined };
    }

    return { dataset: [], labels: [] };
  }, []);

  const analyzeDataWithAI = useCallback(async () => {
    if (!uploadedData) {
      setAiError("Please upload data first.");
      return;
    }

    setLoadingAI(true);
    setAiError(null);
    setAiAnalysis(null);
    setDashboardWidgets([]);
    setShowDashboard(false);

    try {
      const response = await fetch('/api/analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: uploadedData.rows, userPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: AiAnalysisResult = await response.json();
      setAiAnalysis(result);
      setShowDashboard(true);

      const initialWidgets: DashboardWidget[] = result.suggestedCharts
        .filter(chart => ['bar', 'line', 'pie', 'scatter', 'area'].includes(chart.chartType))
        .map((chart, index) => {
          const { dataset: derivedDataset, labels: derivedLabels } = deriveChartData(chart, uploadedData!.rows);
          return {
            i: `ai-chart-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`,
            x: (index * 4) % 12,
            y: Math.floor(index / 3) * 3,
            w: 4,
            h: 3,
            type: 'chart',
            data: {
              chartType: chart.chartType,
              dataset: derivedDataset,
              title: chart.title,
              labels: derivedLabels,
              dataKey: chart.dataKey,
              categoryKey: chart.categoryKey,
              xDataKey: chart.xDataKey,
              yDataKey: chart.yDataKey,
            },
          };
        });
      setDashboardWidgets(prev => [...prev, ...initialWidgets]);

    } catch (error: any) {
      console.error("Error analyzing data with AI:", error);
      let userFacingError = `Failed to get AI insights: ${error.message}`;
      if (error.message.includes("404 Not Found") || error.message.includes("is not found")) {
        userFacingError = "AI model not found or inaccessible. Please ensure your API key and model name are correct (e.g., 'gemini-1.0-pro') and available in your region.";
      } else if (error.message.includes("JSON parse failed")) {
        userFacingError = "AI response was malformed. Please try again. (Developer note: Check AI prompt for strict JSON output)";
      }
      setAiError(userFacingError);
    } finally {
      setLoadingAI(false);
    }
  }, [uploadedData, userPrompt, deriveChartData]);

  const onLayoutChange = useCallback((newLayout: Layout[]) => {
    setDashboardWidgets(prevWidgets =>
      prevWidgets.map(widget => {
        const layoutItem = newLayout.find(item => item.i === widget.i);
        if (layoutItem) {
          return { ...widget, x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h };
        }
        return widget;
      })
      .filter(widget => newLayout.some(item => item.i === widget.i))
    );
  }, []);

  const onDragStartToolbox = useCallback((e: React.DragEvent<HTMLDivElement>, item: DraggableToolboxItem) => {
    setDraggingToolboxItem(item);
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: item.type, w: item.w, h: item.h }));
    e.dataTransfer.effectAllowed = "copy";
  }, []);

  const onDropNewWidget = useCallback((layout: Layout[], layoutItem: Layout, _event: Event) => {
    if (!draggingToolboxItem) {
      console.warn("Drop event occurred but no toolbox item was being dragged.", _event, layout);
      return;
    }

    const newId = `widget-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const newWidget: DashboardWidget = {
      i: newId,
      x: layoutItem.x,
      y: layoutItem.y,
      w: draggingToolboxItem.w,
      h: draggingToolboxItem.h,
      type: draggingToolboxItem.type,
      data: JSON.parse(JSON.stringify(draggingToolboxItem.defaultData || {})),
    };

    setDashboardWidgets(prevWidgets => [...prevWidgets, newWidget]);
    setDraggingToolboxItem(null);
  }, [draggingToolboxItem]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleEditWidget = useCallback((widget: DashboardWidget) => {
    setEditingWidget(widget);
  }, []);

  const handleSaveWidgetConfig = useCallback((updatedData: any) => {
    if (editingWidget) {
      setDashboardWidgets(prevWidgets =>
        prevWidgets.map(w =>
          w.i === editingWidget.i ? { ...w, data: updatedData } : w
        )
      );
      setEditingWidget(null);
    }
  }, [editingWidget]);

  const handleRemoveWidget = useCallback((id: string) => {
    setDashboardWidgets(prevWidgets => prevWidgets.filter(w => w.i !== id));
    if (editingWidget && editingWidget.i === id) {
      setEditingWidget(null);
    }
  }, [editingWidget]);


  return {
    uploadedData, setUploadedData, aiAnalysis, setAiAnalysis, loadingAI, setLoadingAI,
    aiError, setAiError, userPrompt, setUserPrompt, fileInputRef,
    dashboardWidgets, setDashboardWidgets, editingWidget, setEditingWidget,
    draggingToolboxItem, setDraggingToolboxItem, showDashboard, setShowDashboard, gridKey,
    handleFileUpload, handleClearData, deriveChartData, analyzeDataWithAI,
    onLayoutChange, onDragStartToolbox, onDropNewWidget, handleDragOver,
    handleEditWidget, handleSaveWidgetConfig, handleRemoveWidget,
  };
};