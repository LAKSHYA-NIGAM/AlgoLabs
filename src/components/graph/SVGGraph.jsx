import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Editorial Clean SVG Graph Visualizer
 * Fully responsive and theme-aware with warm neutral aesthetics.
 */
export function SVGGraph({
  vertices = [],
  edges = [],
  edgeStatuses = {}, // edgeId -> 'unprocessed' | 'current' | 'accepted' | 'rejected'
  currentEdge = null,
  activeComponentColors = {},
  onNodeClick = null,
  onEdgeClick = null,
  selectedNodeId = null,
  isInteractive = false,
  width = 560,
  height = 400
}) {
  const { isDark } = useTheme();
  const vertexMap = new Map();
  vertices.forEach(v => vertexMap.set(v.id, v));

  return (
    <div className="relative w-full min-h-[300px] h-[350px] sm:h-[380px] bg-[#FFFFFF] dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] shadow-xs overflow-hidden flex items-center justify-center p-2 sm:p-4 transition-colors">
      {/* Subtle modern dot grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="editorial-dot-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1" fill={isDark ? '#4E564C' : '#999A91'} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#editorial-dot-pattern)" />
      </svg>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full select-none relative z-10"
      >
        {/* 1. EDGES LAYER */}
        <g className="edges-layer">
          {edges.map((edge) => {
            const u = vertexMap.get(edge.u);
            const v = vertexMap.get(edge.v);
            if (!u || !v) return null;

            const status = edgeStatuses[edge.id] || 'unprocessed';
            const isCurrent = currentEdge?.id === edge.id || status === 'current';
            const isAccepted = status === 'accepted';
            const isRejected = status === 'rejected';

            // Warm editorial edge palette
            let strokeColor = isDark ? '#3A4038' : '#D2CCC0';
            let strokeWidth = 2.2;
            let strokeDasharray = 'none';
            let opacity = 0.85;

            let badgeBg = isDark ? '#242823' : '#F6F5F0';
            let badgeBorder = isDark ? '#3A4038' : '#E4E3DC';
            let badgeText = isDark ? '#A6A79E' : '#77786F';

            if (isAccepted) {
              strokeColor = isDark ? '#8C9D81' : '#66765B';
              strokeWidth = 3.5;
              opacity = 1;
              badgeBg = isDark ? '#232C21' : '#EBF0E8';
              badgeBorder = isDark ? '#3A4836' : '#C5D1C1';
              badgeText = isDark ? '#8C9D81' : '#47533F';
            } else if (isCurrent) {
              strokeColor = '#B58A43';
              strokeWidth = 3.5;
              opacity = 1;
              badgeBg = isDark ? '#2F2618' : '#FDF6E8';
              badgeBorder = '#E5C48A';
              badgeText = isDark ? '#C79A4D' : '#8A6223';
            } else if (isRejected) {
              strokeColor = isDark ? '#D96A62' : '#B65E57';
              strokeWidth = 2;
              strokeDasharray = '5 4';
              opacity = 0.65;
              badgeBg = isDark ? '#2D1D1C' : '#FDF2F1';
              badgeBorder = isDark ? '#5E312F' : '#EFC8C5';
              badgeText = isDark ? '#F59690' : '#8A3B35';
            }

            // Midpoint coordinates for weight badge
            const midX = (u.x + v.x) / 2;
            const midY = (u.y + v.y) / 2;

            return (
              <g
                key={edge.id || `${edge.u}-${edge.v}`}
                className={`transition-all duration-200 ${isInteractive ? 'cursor-pointer hover:opacity-100' : ''}`}
                onClick={() => onEdgeClick && onEdgeClick(edge)}
              >
                {/* Edge line */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  opacity={opacity}
                  className="transition-all duration-200"
                />

                {/* Weight badge pill */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-14"
                    y="-10"
                    width="28"
                    height="20"
                    rx="10"
                    fill={badgeBg}
                    stroke={badgeBorder}
                    strokeWidth="1"
                    className="transition-colors duration-200"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill={badgeText}
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {edge.weight}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* 2. VERTICES LAYER */}
        <g className="vertices-layer">
          {vertices.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isEndpointOfCurrent = currentEdge && (currentEdge.u === node.id || currentEdge.v === node.id);

            let nodeFill = isDark ? '#1E211D' : '#FFFFFF';
            let nodeStroke = isDark ? '#3D443B' : '#E4E3DC';
            let strokeWidth = 2;
            let labelColor = isDark ? '#EDECE6' : '#252720';

            if (isEndpointOfCurrent) {
              nodeStroke = '#B58A43';
              strokeWidth = 3;
              nodeFill = isDark ? '#2F2618' : '#FDF6E8';
              labelColor = '#B58A43';
            } else if (isSelected) {
              nodeStroke = '#66765B';
              strokeWidth = 3;
              nodeFill = '#66765B';
              labelColor = '#FFFFFF';
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className={`transition-transform duration-150 ${isInteractive ? 'cursor-pointer hover:scale-105' : ''}`}
                onClick={() => onNodeClick && onNodeClick(node)}
              >
                {/* Active halo ring if endpoint of currently evaluated edge */}
                {isEndpointOfCurrent && (
                  <circle
                    r="25"
                    fill="none"
                    stroke="#B58A43"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ animationDuration: '10s' }}
                  />
                )}

                {/* Node circle */}
                <circle
                  r="19"
                  fill={nodeFill}
                  stroke={nodeStroke}
                  strokeWidth={strokeWidth}
                  className="transition-colors duration-200 shadow-xs"
                />

                {/* Node label */}
                <text
                  x="0"
                  y="4.5"
                  textAnchor="middle"
                  fill={labelColor}
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="'Manrope', sans-serif"
                  letterSpacing="-0.02em"
                  className="pointer-events-none select-none transition-colors duration-200"
                >
                  {node.label || node.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
