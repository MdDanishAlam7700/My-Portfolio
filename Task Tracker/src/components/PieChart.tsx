'use client';
import React, { useState } from 'react';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

const DonutChart = ({ data, size = 220 }: DonutChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((acc, item) => acc + item.value, 0);
  
  if (total === 0) {
    return (
      <div style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%', 
        border: '1px dashed var(--glass-border)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '0.7rem', 
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        background: 'radial-gradient(circle, rgba(0,255,242,0.02) 0%, transparent 70%)'
      }}>
        <div style={{ animation: 'pulse 2s infinite' }}>System Idle</div>
      </div>
    );
  }

  let cumulativeAngle = 0;
  const strokeWidth = 5; // Thicker ring for more presence
  const radius = 16 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{ 
      position: 'relative', 
      width: size, 
      height: size,
      padding: '10px'
    }}>
      {/* Background Glow Ring */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '50%',
        boxShadow: hoveredIndex !== null 
          ? `0 0 30px ${data[hoveredIndex].color}15` 
          : '0 0 20px rgba(0,255,242,0.05)',
        transition: 'all 0.5s ease'
      }} />

      <svg viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Hollow base ring */}
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="transparent"
          stroke="var(--surface-high)"
          strokeWidth={strokeWidth}
          style={{ opacity: 0.3 }}
        />

        {data.map((item, index) => {
          if (item.value === 0) return null;
          
          const percentage = (item.value / total);
          const dashArray = `${percentage * circumference} ${circumference}`;
          const dashOffset = - (cumulativeAngle / 100) * circumference;
          cumulativeAngle += percentage * 100;

          const isHovered = hoveredIndex === index;

          return (
            <circle
              key={index}
              cx="16"
              cy="16"
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ 
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isHovered 
                  ? `drop-shadow(0 0 8px ${item.color})` 
                  : `drop-shadow(0 0 3px ${item.color}80)`,
                cursor: 'pointer',
                opacity: hoveredIndex !== null && !isHovered ? 0.4 : 1
              }}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      
      {/* Central Intelligence Display */}
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        textAlign: 'center',
        background: 'var(--surface-low)',
        width: '58%',
        height: '58%',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: hoveredIndex !== null 
          ? `1px solid ${data[hoveredIndex].color}40` 
          : '1px solid var(--glass-border)',
        boxShadow: hoveredIndex !== null 
          ? `inset 0 0 15px ${data[hoveredIndex].color}20` 
          : 'none',
        transition: 'all 0.3s ease'
      }}>
        {hoveredIndex !== null ? (
          <div key="hovered-display" style={{ animation: 'fadeInScale 0.3s ease-out', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <p style={{ 
              margin: 0,
              fontSize: '1.2rem', 
              fontWeight: '900', 
              color: data[hoveredIndex].color
            }}>
              {data[hoveredIndex].value}
            </p>
            <p style={{ 
              margin: 0,
              fontSize: '0.45rem', 
              color: 'var(--text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              fontWeight: 'bold',
              maxWidth: '60px',
              lineHeight: '1.2'
            }}>
              {data[hoveredIndex].label}
            </p>
          </div>
        ) : (
          <div key="total-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <p style={{ 
              margin: 0,
              fontSize: '1.8rem', 
              fontWeight: '900', 
              color: 'var(--foreground)', 
              lineHeight: '1'
            }}>
              {total}
            </p>
            <p style={{ 
              margin: 0,
              fontSize: '0.55rem', 
              color: 'var(--neon-cyan)', 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              fontWeight: '800'
            }}>
              Total
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default DonutChart;
