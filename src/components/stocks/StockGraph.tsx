import { FC, useRef, useEffect, useState } from "react";

import { STOCK_CONFIG, STOCK_COLORS } from "~/constants";
import { StockPrice } from "~/services/stocks";

interface StockGraphProps {
  priceHistory: StockPrice[];
  width?: number;
  height?: number;
  color?: string;
  fillContainer?: boolean;
}

export const StockGraph: FC<StockGraphProps> = ({ 
  priceHistory, 
  width = STOCK_CONFIG.GRAPH_WIDTH, 
  height = STOCK_CONFIG.GRAPH_HEIGHT,
  fillContainer = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Handle container sizing when fillContainer is true
  useEffect(() => {
    if (!fillContainer || !containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [fillContainer]);

  // Determine final dimensions
  const getFinalDimensions = () => {
    if (fillContainer) {
      return {
        width: containerSize.width || STOCK_CONFIG.GRAPH_WIDTH,
        height: containerSize.height || STOCK_CONFIG.GRAPH_HEIGHT
      };
    }

    return { width, height };
  };

  const { width: finalWidth, height: finalHeight } = getFinalDimensions();

  if (priceHistory.length < 2) {
    return (
      <div 
        ref={containerRef}
        className="flex items-center justify-center rounded-sm"
        style={{
          width: fillContainer ? "100%" : width,
          height: fillContainer ? "100%" : height,
          border: `1px solid ${STOCK_COLORS.BORDER}`
        }}
      >
        <div className="text-sm text-neutral-500">No data</div>
      </div>
    );
  }

  // Find min and max prices for scaling
  const prices = priceHistory.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Calculate bar dimensions
  const barWidth = Math.max(1, finalWidth / priceHistory.length - 1);
  const barSpacing = 1;

  // Generate bars
  const bars = priceHistory.map((price, index) => {
    const x = index * (barWidth + barSpacing);
    const barHeight = ((price.price - minPrice) / priceRange) * finalHeight;
    const y = finalHeight - barHeight;
    
    // Determine bar color based on price change
    let barColor: string = STOCK_COLORS.NEUTRAL;
    if (index > 0) {
      const prevPrice = priceHistory[index - 1].price;
      barColor = price.price >= prevPrice ? STOCK_COLORS.POSITIVE : STOCK_COLORS.NEGATIVE;
    }
    
    return {
      x,
      y,
      width: barWidth,
      height: barHeight,
      color: barColor,
      price: price.price
    };
  });

  return (
    <div 
      ref={containerRef}
      className="flex items-center"
      style={{ 
        width: fillContainer ? "100%" : width,
        height: fillContainer ? "100%" : height
      }}
    >
      <svg 
        width={finalWidth} 
        height={finalHeight} 
        className="rounded max-w-full max-h-full"
        style={{ 
          border: `1px solid ${STOCK_COLORS.BORDER}`
        }}
      >
        {/* Render bars */}
        {bars.map((bar, index) => (
          <rect
            key={index}
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            fill={bar.color}
            stroke={STOCK_COLORS.BORDER}
            strokeWidth="0.5"
            rx="1"
          />
        ))}
        
        {/* Optional: Add a subtle grid for reference */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={STOCK_COLORS.BORDER} strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}; 