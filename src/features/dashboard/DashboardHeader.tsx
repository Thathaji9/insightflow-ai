import React from "react";

interface DashboardHeaderProps {
  uploadedData: any | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearData: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  uploadedData,
  fileInputRef,
  onFileUpload,
  onClearData,
}) => {
  return (
    <header className="w-full bg-blue-600 text-white p-4 shadow-md flex justify-between items-center z-10">
      <h1 className="text-2xl font-bold">InsightFlow AI</h1>
      <div className="flex items-center space-x-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-200"
        >
          Upload Data
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv, .json"
          onChange={onFileUpload}
          ref={fileInputRef}
          className="hidden"
        />
        {uploadedData && (
          <button
            onClick={onClearData}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Clear All
          </button>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
