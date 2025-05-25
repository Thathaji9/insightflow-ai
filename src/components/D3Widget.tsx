"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface D3WidgetProps {
  radius?: number;
  color?: string;
}

const D3Widget: React.FC<D3WidgetProps> = ({
  radius = 50,
  color = "#33AACC",
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = svgRef.current?.clientWidth || 200;
    const height = svgRef.current?.clientHeight || 200;

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    g.append("circle")
      .attr("r", radius)
      .attr("fill", color)
      .attr("stroke", d3.color(color)?.darker(0.5) || ("#2288AA" as any))
      .attr("stroke-width", 2);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("fill", "white")
      .style("font-size", "12px")
      .text(`Radius: ${radius}`);
  }, [radius, color]);

  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default D3Widget;
