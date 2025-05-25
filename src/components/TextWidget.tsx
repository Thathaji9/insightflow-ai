import React from "react";

interface TextWidgetProps {
  content: string;
}

const TextWidget: React.FC<TextWidgetProps> = ({ content }) => {
  return (
    <div className="p-2 h-full overflow-auto text-gray-800">
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
};

export default TextWidget;
