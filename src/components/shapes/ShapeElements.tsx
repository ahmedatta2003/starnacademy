import React from "react";

export const Square = ({ className = "", color = "turquoise" }: { className?: string; color?: string }) => (
  <div className={`rounded-lg ${className}`} style={{ backgroundColor: `hsl(var(--${color}))` }} />
);

export const RoundedTriangle = ({ className = "", color = "turquoise" }: { className?: string; color?: string }) => (
  <div 
    className={`${className}`} 
    style={{ 
      width: 0, 
      height: 0, 
      borderLeft: "20px solid transparent",
      borderRight: "20px solid transparent",
      borderBottom: `35px solid hsl(var(--${color}))`,
      borderRadius: "4px"
    }} 
  />
);

export const Semicircle = ({ className = "", color = "purple" }: { className?: string; color?: string }) => (
  <div 
    className={`rounded-full ${className}`} 
    style={{ backgroundColor: `hsl(var(--${color}))` }}
  />
);

export const SprocketStar = ({ className = "", color = "coral" }: { className?: string; color?: string }) => (
  <div 
    className={`${className}`}
    style={{ 
      width: "40px", 
      height: "40px",
      background: `hsl(var(--${color}))`,
      clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
    }}
  />
);

export const CodeBracket = ({ className = "" }: { className?: string }) => (
  <span className={`font-mono text-4xl opacity-10 ${className}`}>{"<>"}</span>
);

export const PlusSign = ({ className = "", color = "turquoise" }: { className?: string; color?: string }) => (
  <span className={`text-4xl font-bold ${className}`} style={{ color: `hsl(var(--${color}))` }}>+</span>
);
