
"use client"

import React from "react"

export function BlueprintBackground({ type }: { type: string }) {
  const t = type.toLowerCase()

  const styles = (
    <style jsx global>{`
      @keyframes spin-fast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes spin-rev-fast { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      @keyframes pulse-intense { 
        0%, 100% { opacity: 0.5; transform: scale(1); filter: brightness(1); } 
        50% { opacity: 1; transform: scale(1.15); filter: brightness(1.5) drop-shadow(0 0 10px #00f2ff); } 
      }
      @keyframes scan-sweep { 
        0% { transform: translateY(-100%); opacity: 0; } 
        30% { opacity: 1; } 
        70% { opacity: 1; } 
        100% { transform: translateY(200%); opacity: 0; } 
      }
      @keyframes float-heavy { 
        0%, 100% { transform: translateY(0) rotateX(10deg); } 
        50% { transform: translateY(-20px) rotateX(-10deg); } 
      }
      @keyframes sound-blast { 
        0% { r: 10; opacity: 1; stroke-width: 3; } 
        100% { r: 180; opacity: 0; stroke-width: 1; } 
      }
      @keyframes flicker-tech {
        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 0.8; }
        20%, 24%, 55% { opacity: 0.2; }
      }
      .bp-spin { animation: spin-fast 12s linear infinite; transform-origin: center; }
      .bp-spin-rev { animation: spin-rev-fast 15s linear infinite; transform-origin: center; }
      .bp-pulse { animation: pulse-intense 2.5s ease-in-out infinite; transform-origin: center; }
      .bp-scan-line { animation: scan-sweep 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      .bp-float { animation: float-heavy 5s ease-in-out infinite; transform-origin: center; }
      .bp-sound { animation: sound-blast 1.8s ease-out infinite; transform-origin: center; }
      .bp-flicker { animation: flicker-tech 4s infinite rough; }
      .neon-glow { filter: drop-shadow(0 0 5px hsl(var(--primary))) drop-shadow(0 0 15px hsla(var(--primary), 0.5)); }
      .tech-grid { stroke: hsl(var(--primary)); stroke-width: 0.5; opacity: 0.3; }
    `}</style>
  )

  const svgProps = {
    viewBox: "0 0 400 400",
    className: "w-full h-full opacity-70 mix-blend-screen absolute inset-0",
    preserveAspectRatio: "xMidYMid slice",
    stroke: "hsl(var(--primary))"
  }
  
  // Mantenimiento
  if (t.includes("mantenimiento")) {
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
      <>
        {styles}
        <svg {...svgProps} strokeLinecap="round" strokeLinejoin="round">
            <defs>
                <pattern id="grid-pat-maint" width="20" height="20" patternUnits="userSpaceOnUse">
                   <path d="M 0 10 H 20 M 10 0 V 20" fill="none" strokeWidth="0.5" opacity="0.2"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pat-maint)" opacity="0.8"/>
            
            <g transform="translate(200, 200)">
                {/* Main Gear */}
                <g className="bp-spin" style={{ animationDuration: '20s' }}>
                    <path d={createGear(20, 80, 100, 30)} strokeWidth="2" fill="hsla(var(--primary), 0.05)" className="neon-glow" />
                    <circle cx="0" cy="0" r="60" strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />
                </g>
                
                {/* Small Gear 1 */}
                <g transform="translate(135, 0) rotate(9)" className="bp-spin-rev" style={{ animationDuration: '10s' }}>
                    <path d={createGear(10, 25, 35, 10)} strokeWidth="1.5" fill="hsla(var(--primary), 0.1)" className="neon-glow bp-pulse" />
                </g>
                
                {/* Small Gear 2 */}
                <g transform="translate(-105, 95) rotate(-18)" className="bp-spin-rev" style={{ animationDuration: '12s' }}>
                     <path d={createGear(12, 30, 42, 12)} strokeWidth="1.5" fill="hsla(var(--primary), 0.1)" className="neon-glow" />
                </g>
            </g>

            <text x="20" y="380" fill="hsl(var(--primary))" fontFamily="Orbitron, monospace" fontSize="12" className="bp-flicker">
                SYS_DIAG // MECH_OPS
            </text>
        </svg>
      </>
    )
  }

  // Energia, electrico
  if (t.includes("energia") || t.includes("elect")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
           <defs>
               <pattern id="circuit-pat" width="100" height="100" patternUnits="userSpaceOnUse">
                   <path d="M0 50 H100 M50 0 V100 M20 20 H80 M20 80 H80" strokeWidth="0.5" opacity="0.2" fill="none"/>
                   <circle cx="50" cy="50" r="5" fill="hsl(var(--primary))" opacity="0.3"/>
               </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#circuit-pat)" opacity="0.5"/>
           <path d="M240 20 L140 180 H260 L160 380" strokeWidth="6" fill="none" className="bp-pulse neon-glow" style={{ filter: "drop-shadow(0 0 20px hsl(var(--primary)))" }} strokeLinejoin="round" />
           <g className="bp-flicker neon-glow" strokeWidth="2" fill="none">
               <path d="M140 180 Q100 150 120 100" opacity="0.6"/>
               <path d="M260 180 Q300 210 280 260" opacity="0.6"/>
           </g>
           <rect x="20" y="350" width="100" height="30" fill="hsla(var(--primary), 0.1)" className="neon-glow"/>
           <text x="30" y="370" fill="hsl(var(--primary))" fontFamily="Orbitron, monospace" fontSize="12" fontWeight="bold" className="bp-flicker">HIGH VOLTAGE</text>
        </svg>
      </>
    )
  }

  // Inspecciones - cctv, scan, camara
  if (t.includes("inspeccion") || t.includes("cctv") || t.includes("scan")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
          <rect x="40" y="20" width="320" height="360" rx="20" strokeWidth="2" fill="none" className="neon-glow" opacity="0.6" />
          <g transform="translate(200 200)" opacity="0.4" className="neon-glow">
            {[...Array(8)].map((_, i) => (
                <ellipse key={i} cx="0" cy={i*15 - 60} rx={60 - i*5} ry={20 + i*2} strokeWidth="1" fill="none" strokeDasharray="5 5" className="bp-spin-rev" style={{animationDuration: `${20+i*2}s`}}/>
            ))}
          </g>
          <rect x="40" y="-10" width="320" height="10" fill="hsl(var(--primary))" className="bp-scan-line neon-glow" style={{ filter: "blur(4px) brightness(2)" }} />
          <rect x="60" y="40" width="10" height="10" fill="hsl(var(--primary))" className="bp-pulse" />
          <text x="80" y="50" fill="hsl(var(--primary))" fontFamily="Orbitron, monospace" fontSize="12" className="bp-flicker">SCANNING ID...</text>
        </svg>
      </>
    )
  }

  // Gestión de Activos - datos, red
  if (t.includes("gestion") || t.includes("activos") || t.includes("datos")) {
    const nodes = [
        {x: 200, y: 50, r: 15}, {x: 50, y: 250, r: 10}, {x: 350, y: 250, r: 10},
        {x: 120, y: 150, r: 8}, {x: 280, y: 150, r: 8}, {x: 200, y: 350, r: 12}
    ];
    return (
      <>
        {styles}
        <svg {...svgProps}>
          <g className="bp-spin" style={{transformOrigin:'200px 200px'}}>
            <circle cx="200" cy="200" r="180" strokeWidth="0.5" fill="none" strokeDasharray="10 20" opacity="0.4" />
            <circle cx="200" cy="200" r="100" strokeWidth="1" fill="none" strokeDasharray="50 50" className="neon-glow" opacity="0.6"/>
          </g>
          <g className="neon-glow" strokeWidth="1.5" opacity="0.7">
             <path d="M200 50 L50 250 L350 250 Z" className="bp-pulse" fill="hsla(var(--primary), 0.05)"/>
             <path d="M120 150 L280 150 M200 50 L200 350" />
             <path d="M50 250 L200 350 L350 250" />
          </g>
          {nodes.map((n, i) => (
            <g key={i} className="bp-pulse" style={{animationDelay: `${i*0.3}s`}}>
                <circle cx={n.x} cy={n.y} r={n.r} fill="hsl(var(--primary))" className="neon-glow" />
                <circle cx={n.x} cy={n.y} r={n.r*2} strokeWidth="1" fill="none" opacity="0.5" className="bp-sound" />
            </g>
          ))}
          <g transform="translate(200 200)" className="bp-flicker neon-glow">
             <path d="M-30 -10 Q0 -40 30 -10 M-20 5 Q0 -15 20 5 M-10 20 Q0 10 10 20" strokeWidth="3" fill="none" strokeLinecap="round" />
             <circle cx="0" cy="35" r="5" fill="hsl(var(--primary))" />
          </g>
        </svg>
      </>
    )
  }

  // Soporte 24/7 - audio, sonido
  if (t.includes("soporte") || t.includes("asistencia") || t.includes("audio")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
          <circle cx="200" cy="200" r="30" fill="hsl(var(--primary))" className="bp-pulse neon-glow" />
          {[...Array(6)].map((_, i) => (
            <circle key={i} cx="200" cy="200" r="40" strokeWidth="2" fill="none" className="bp-sound neon-glow" style={{animationDelay: `${i * 0.4}s`, animationDuration: '3s'}} />
          ))}
          <g transform="translate(50 350) scale(1 -1)" className="neon-glow" fill="hsl(var(--primary))" opacity="0.7">
             {[...Array(15)].map((_, i) => {
                 const h = (Math.sin(i * 0.5) * 50) + 70;
                 const randomDuration = 0.5 + ((Math.sin(i * 2) + 1) / 2);
                 return (
                     <rect key={i} x={i * 20} y="0" width="12" height={h} className="bp-pulse">
                        <animate attributeName="height" values={`${h};${h*1.5};${h}`} dur={`${randomDuration}s`} repeatCount="indefinite"/>
                     </rect>
                 )
             })}
          </g>
          <text x="200" y="50" textAnchor="middle" fill="hsl(var(--primary))" fontFamily="Orbitron, monospace" fontSize="16" className="bp-flicker">EMERGENCY BROADCAST SYSTEM</text>
        </svg>
      </>
    )
  }

  // Auditoria, Optimizacion - edificio, domotica
  if (t.includes("auditoria") || t.includes("optimizacion") || t.includes("edificio")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
          <g transform="translate(200 300) scale(1 0.5)" className="neon-glow" opacity="0.5">
             <circle cx="0" cy="0" r="150" strokeWidth="2" fill="none" className="bp-spin"/>
             <circle cx="0" cy="0" r="100" strokeWidth="1" fill="none" className="bp-spin-rev"/>
          </g>
          <g transform="translate(200 180)" className="bp-float neon-glow">
             <path d="M0 -120 L100 -60 L100 60 L0 120 L-100 60 L-100 -60 Z" strokeWidth="3" fill="hsla(var(--primary),0.05)" />
             <path d="M0 -120 V0 M0 0 L100 60 M0 0 L-100 60 M100 -60 L0 0 L-100 -60" strokeWidth="1.5" fill="none" />
             <circle cx="0" cy="0" r="20" fill="hsl(var(--primary))" className="bp-pulse">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
             </circle>
             {[0, 90, 180, 270].map((deg, i) => (
                 <g key={i} transform={`rotate(${deg}) translate(0 -140)`}>
                    <circle cx="0" cy="0" r="5" fill="hsl(var(--primary))" className="bp-pulse" style={{animationDelay: `${i*0.5}s`}}/>
                    <line x1="0" y1="0" x2="0" y2="20" strokeWidth="1" opacity="0.5"/>
                 </g>
             ))}
          </g>
          <text x="20" y="40" fill="hsl(var(--primary))" fontFamily="Orbitron, monospace" fontSize="14" className="bp-flicker" opacity="0.8">SMART_BUILDING // OS: ONLINE</text>
        </svg>
      </>
    )
  }

  // Suministro - intrusion, seguridad
  if (t.includes("suministro") || t.includes("componentes") || t.includes("seguridad")) {
    return (
      <>
        {styles}
        <svg {...svgProps}>
           <g className="bp-spin neon-glow" style={{transformOrigin:'200px 200px'}}>
             <circle cx="200" cy="200" r="160" strokeWidth="2" fill="none" strokeDasharray="20 40" opacity="0.6" />
             <circle cx="200" cy="200" r="180" strokeWidth="1" fill="none" strokeDasharray="5 15" opacity="0.4" />
           </g>
           <g className="bp-pulse neon-glow" transform="translate(200 200) scale(1.2)">
               <path d="M0 -100 L80 -60 V60 Q80 120 0 160 Q-80 120 -80 60 V-60 Z" strokeWidth="4" fill="hsla(var(--primary),0.1)" />
               <g transform="translate(0 10)">
                   <rect x="-30" y="-10" width="60" height="50" rx="5" fill="hsl(var(--primary))" />
                   <path d="M-20 -10 V-30 Q-20 -50 0 -50 Q20 -50 20 -30 V-10" strokeWidth="6" fill="none" strokeLinecap="round" />
                   <circle cx="0" cy="15" r="8" fill="var(--card)" />
               </g>
           </g>
           <text x="200" y="50" textAnchor="middle" fontFamily="Orbitron, monospace" fontSize="16" fontWeight="bold" className="bp-flicker">
               <tspan fill="hsl(var(--primary))">SYSTEM ARMED</tspan>
           </text>
        </svg>
      </>
    )
  }

  // Default fallback
  return (
    <>
      {styles}
      <svg {...svgProps} opacity="0.5">
        <defs>
            <pattern id="grid-pat" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
               <path d="M 0 20 H 40 M 20 0 V 40" fill="none" strokeWidth="1" opacity="0.4" className="neon-glow"/>
               <circle cx="20" cy="20" r="2" fill="hsl(var(--primary))" opacity="0.6" className="bp-pulse"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pat)" />
        <g className="bp-spin" style={{transformOrigin:'center'}}>
            <circle cx="200" cy="200" r="150" strokeWidth="2" fill="none" strokeDasharray="50 50" className="neon-glow" opacity="0.7"/>
        </g>
        <g className="bp-spin-rev" style={{transformOrigin:'center'}}>
            <circle cx="200" cy="200" r="100" strokeWidth="3" fill="none" strokeDasharray="20 20" className="neon-glow" opacity="0.5"/>
        </g>
        <circle cx="200" cy="200" r="40" fill="hsla(var(--primary),0.1)" strokeWidth="2" className="bp-pulse neon-glow"/>
      </svg>
    </>
  )
}
