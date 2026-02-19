'use client';

import React from 'react';

type BlueprintBackgroundProps = {
  type: string;
};

export default function BlueprintBackground({ type }: BlueprintBackgroundProps) {
  const t = type.toLowerCase();
  
  const svgProps: React.SVGProps<SVGSVGElement> = {
    viewBox: "0 0 400 400",
    className: "w-full h-full absolute inset-0 transition-opacity duration-700",
    preserveAspectRatio: "xMidYMid slice",
    stroke: "currentColor"
  };

  const createGear = (teeth: number, innerRadius: number, outerRadius: number, holeRadius: number) => {
    let path = "";
    const angle = (Math.PI * 2) / (teeth * 2);
    for (let i = 0; i < teeth * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const a = angle * i;
        const x = (Math.cos(a) * r).toFixed(3);
        const y = (Math.sin(a) * r).toFixed(3);
        path += `${i === 0 ? 'M' : 'L'}${x},${y} `;
    }
    path += "Z ";
    path += `M${holeRadius},0 A${holeRadius},${holeRadius} 0 1,1 -${holeRadius},0 A${holeRadius},${holeRadius} 0 1,1 ${holeRadius},0 Z`;
    return path;
  };

  return (
    <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 text-primary">
      <style>{`
          @keyframes bp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes bp-pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
          .bp-spin { animation: bp-spin 20s linear infinite; transform-origin: center; }
          .bp-pulse { animation: bp-pulse 3s ease-in-out infinite; }
      `}</style>
      
      {t.includes("mantenimiento") && (
        <svg {...svgProps}>
          <g transform="translate(200, 200)" className="bp-spin">
            <path d={createGear(20, 80, 100, 30)} fill="none" strokeWidth="2" />
          </g>
        </svg>
      )}
      {t.includes("carga") && (
        <svg {...svgProps}>
          <path d="M240 20 L140 180 H260 L160 380" fill="none" strokeWidth="6" className="bp-pulse" />
        </svg>
      )}
      {t.includes("control") && (
        <svg {...svgProps}>
          <g transform="translate(200, 200)" className="bp-spin">
            {[...Array(6)].map((_, i) => (
              <circle key={i} cx={Math.cos(i * (Math.PI / 3)) * 100} cy={Math.sin(i * (Math.PI / 3)) * 100} r="10" fill="currentColor" />
            ))}
          </g>
        </svg>
      )}
      {t.includes("rehabilitacion") && (
        <svg {...svgProps}>
          <rect x="100" y="100" width="200" height="200" fill="none" strokeWidth="2" strokeDasharray="10 10" className="bp-spin" />
        </svg>
      )}
      {t.includes("telemetria") && (
        <svg {...svgProps}>
           <circle cx="200" cy="200" r="150" fill="none" strokeWidth="1" strokeDasharray="5 5" className="bp-spin" />
           <line x1="200" y1="50" x2="200" y2="350" strokeWidth="1" />
           <path d="M50,200 C100,100 250,300 350,200" strokeWidth="2" fill="none" className="bp-pulse" />
        </svg>
      )}
      {t.includes("logistica") && (
        <svg {...svgProps}>
           <path d="M50 150 L150 150 L180 200 L50 200 Z" fill="none" strokeWidth="2" />
           <path d="M180 200 L350 200" fill="none" strokeWidth="2" className="bp-pulse" />
           <circle cx="100" cy="220" r="20" strokeWidth="2" fill="none" className="bp-spin" />
           <circle cx="280" cy="220" r="20" strokeWidth="2" fill="none" className="bp-spin" />
        </svg>
      )}
    </div>
  );
}
