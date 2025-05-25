"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface Widget {
  i: string;
  type: "text" | "chart" | "table" | "d3";
  data?: any;
}

interface WidgetConfigModalProps {
  widget: Widget;
  onSave: (updatedData: any) => void;
  onClose: () => void;
}

const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({
  widget,
  onSave,
  onClose,
}) => {
  const [currentData, setCurrentData] = useState(widget.data);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentData(widget.data);
    setValidationError(null);
  }, [widget]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentData({ ...currentData, content: e.target.value });
  };

  const handleChartChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "dataset") {
      try {
        const parsedDataset = JSON.parse(`[${value}]`).filter(Number);
        if (!Array.isArray(parsedDataset) || parsedDataset.some(isNaN)) {
          throw new Error(
            "Invalid dataset format. Use comma-separated numbers."
          );
        }
        setCurrentData({ ...currentData, [name]: parsedDataset });
        setValidationError(null);
      } catch (error: any) {
        setValidationError(error.message || "Invalid dataset format.");
      }
    } else {
      setCurrentData({ ...currentData, [name]: value });
      setValidationError(null);
    }
  };

  const handleTableChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    try {
      const parsedValue = JSON.parse(value);
      if (name === "columns") {
        if (
          !Array.isArray(parsedValue) ||
          parsedValue.some((item) => typeof item !== "string")
        ) {
          throw new Error("Columns must be a JSON array of strings.");
        }
      } else if (name === "rows") {
        if (
          !Array.isArray(parsedValue) ||
          !parsedValue.every(
            (item) => typeof item === "object" && item !== null
          )
        ) {
          throw new Error("Rows must be a JSON array of objects.");
        }
        if (currentData.columns && parsedValue.length > 0) {
          const firstRowKeys = Object.keys(parsedValue[0]);
          if (
            !currentData.columns.every((col: string) =>
              firstRowKeys.includes(col)
            )
          ) {
            console.warn("Table rows might not match all defined columns.");
          }
        }
      }
      setCurrentData({ ...currentData, [name]: parsedValue });
      setValidationError(null);
    } catch (error: any) {
      setValidationError(error.message || `Invalid JSON for ${name}.`);
    }
  };

  const handleD3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "radius") {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue <= 0) {
        setValidationError("Radius must be a positive number.");
        setCurrentData({ ...currentData, [name]: value });
      } else {
        setCurrentData({ ...currentData, [name]: numValue });
        setValidationError(null);
      }
    } else {
      setCurrentData({ ...currentData, [name]: value });
      setValidationError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) {
      alert("Please fix the validation errors before saving.");
      return;
    }
    onSave(currentData);
  };

  const renderConfigForm = () => {
    switch (widget.type) {
      case "text":
        return (
          <div className="flex flex-col space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Content:
            </label>
            <textarea
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={5}
              value={currentData?.content || ""}
              onChange={handleTextChange}
            />
          </div>
        );
      case "chart":
        return (
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="chartTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Title:
              </label>
              <input
                type="text"
                id="chartTitle"
                name="title"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={currentData?.title || ""}
                onChange={handleChartChange}
              />
            </div>
            <div>
              <label
                htmlFor="chartType"
                className="block text-sm font-medium text-gray-700"
              >
                Chart Type:
              </label>
              <select
                id="chartType"
                name="chartType"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={currentData?.chartType || "bar"}
                onChange={handleChartChange}
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="dataset"
                className="block text-sm font-medium text-gray-700"
              >
                Dataset (comma-separated numbers):
              </label>
              <textarea
                id="dataset"
                name="dataset"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={
                  Array.isArray(currentData?.dataset)
                    ? currentData.dataset.join(",")
                    : ""
                }
                onChange={handleChartChange}
                placeholder="e.g., 10,20,30,40"
              />
              {validationError && (
                <p className="text-red-500 text-sm mt-1">{validationError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="labels"
                className="block text-sm font-medium text-gray-700"
              >
                Labels (comma-separated strings, optional):
              </label>
              <textarea
                id="labels"
                name="labels"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                value={
                  Array.isArray(currentData?.labels)
                    ? currentData.labels.join(",")
                    : ""
                }
                onChange={(e) =>
                  setCurrentData({
                    ...currentData,
                    labels: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                placeholder="e.g., Jan,Feb,Mar,Apr"
              />
            </div>
          </div>
        );
      case "table":
        return (
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="tableColumns"
                className="block text-sm font-medium text-gray-700"
              >
                Columns (JSON Array of Strings):
              </label>
              <textarea
                id="tableColumns"
                name="columns"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
                rows={3}
                value={JSON.stringify(
                  currentData?.columns || ["Column 1", "Column 2"],
                  null,
                  2
                )}
                onChange={handleTableChange}
                placeholder='["Product", "Quantity", "Price"]'
              />
            </div>
            <div>
              <label
                htmlFor="tableRows"
                className="block text-sm font-medium text-gray-700"
              >
                Rows (JSON Array of Objects):
              </label>
              <textarea
                id="tableRows"
                name="rows"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
                rows={10}
                value={JSON.stringify(
                  currentData?.rows || [
                    { "Column 1": "Data A", "Column 2": "Data B" },
                  ],
                  null,
                  2
                )}
                onChange={handleTableChange}
                placeholder='[{"Product":"Laptop","Quantity":10,"Price":1200}, {"Product":"Mouse","Quantity":50,"Price":25}]'
              />
              {validationError && (
                <p className="text-red-500 text-sm mt-1">{validationError}</p>
              )}
            </div>
          </div>
        );
      case "d3":
        return (
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="d3Radius"
                className="block text-sm font-medium text-gray-700"
              >
                Radius (number):
              </label>
              <input
                type="number"
                id="d3Radius"
                name="radius"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={currentData?.radius || 50}
                onChange={handleD3Change}
                min={1}
              />
              {validationError && (
                <p className="text-red-500 text-sm mt-1">{validationError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="d3Color"
                className="block text-sm font-medium text-gray-700"
              >
                Color (hex or name):
              </label>
              <input
                type="text"
                id="d3Color"
                name="color"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={currentData?.color || "#33AACC"}
                onChange={handleD3Change}
              />
            </div>
          </div>
        );
      default:
        return <p>No configuration available for this widget type.</p>;
    }
  };

  return (
    <Dialog.Root open={!!widget} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-xl focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
            Configure{" "}
            {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Widget
          </Dialog.Title>
          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto max-h-[calc(85vh-100px)] pr-2"
          >
            {renderConfigForm()}
            <div className="flex justify-end space-x-3 mt-6">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-md transition duration-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!validationError}
              >
                Save Changes
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 inline-flex h-8 w-8 appearance-none items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus:shadow-[0_0_0_2px] focus:shadow-gray-300 focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default WidgetConfigModal;
