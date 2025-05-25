import React from "react";

interface TableWidgetProps {
  columns: string[];
  rows: Record<string, any>[];
}

const TableWidget: React.FC<TableWidgetProps> = ({ columns, rows }) => {
  if (!rows || rows.length === 0) {
    return (
      <div className="p-2 h-full flex items-center justify-center text-gray-500">
        <p>No data available for this table.</p>
      </div>
    );
  }

  return (
    <div className="p-2 h-full overflow-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td
                  key={`<span class="math-inline">\{rowIndex\}\-</span>{colIndex}`}
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                >
                  {String(row[col] || "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableWidget;
