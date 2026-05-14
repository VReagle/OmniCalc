import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Activity, FunctionSquare, Info, RefreshCw } from 'lucide-react';
import { getPoint } from '../lib/math';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Grapher() {
  const [func, setFunc] = useState('sin(x)');
  const [range, setRange] = useState({ min: -10, max: 10, step: 0.1 });
  const [isHovered, setIsHovered] = useState(false);

  const data = useMemo(() => {
    const points = [];
    for (let x = range.min; x <= range.max; x += range.step) {
      const y = getPoint(func, x);
      if (!isNaN(y) && isFinite(y)) {
        points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(4)) });
      }
    }
    return points;
  }, [func, range]);

  const yDomain = useMemo(() => {
    if (data.length === 0) return [-10, 10];
    const ys = data.map(p => p.y);
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const padding = (max - min) * 0.1 || 1;
    return [Math.max(-100, min - padding), Math.min(100, max + padding)];
  }, [data]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 h-full">
        {/* Config Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
              <FunctionSquare className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold uppercase tracking-widest text-zinc-100">Function Grapher</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Equation</label>
                <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-mono">y = </div>
                   <input
                    type="text"
                    value={func}
                    onChange={(e) => setFunc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-12 pr-4 py-3 font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="e.g., x^2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">X Min</label>
                  <input
                    type="number"
                    value={range.min}
                    onChange={(e) => setRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 font-mono text-zinc-100 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">X Max</label>
                  <input
                    type="number"
                    value={range.max}
                    onChange={(e) => setRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 font-mono text-zinc-100 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Resolution (Step)</label>
                <select
                  value={range.step}
                  onChange={(e) => setRange(prev => ({ ...prev, step: Number(e.target.value) }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 font-mono text-zinc-100 focus:outline-none"
                >
                  <option value={1}>Coarse (1.0)</option>
                  <option value={0.5}>Standard (0.5)</option>
                  <option value={0.1}>Fine (0.1)</option>
                  <option value={0.05}>Extreme (0.05)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-800 opacity-60">
                <div className="flex gap-2 items-start text-[10px] text-zinc-400 font-mono leading-relaxed uppercase">
                   <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                   <span>Supports trigonometric (sin, cos, tan), logarithmic (log, ln), exponential, and basic arithmetic.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tools Box */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
             <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase text-emerald-400">Live Insights</span>
             </div>
             <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                   <span className="text-zinc-500">Points Computed:</span>
                   <span className="text-emerald-400">{data.length}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-zinc-500">Processing:</span>
                   <span className="text-emerald-400">{"< 1ms"}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Main Graph View */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
            <RefreshCw className="w-4 h-4 cursor-pointer hover:rotate-180 transition-transform duration-500" onClick={() => setRange({min: -10, max: 10, step: 0.1})} />
          </div>

          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#27272a" 
                  vertical={true}
                />
                <XAxis 
                  dataKey="x" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickFormatter={(val) => val.toString()}
                  axisLine={{ stroke: '#3f3f46' }}
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={10} 
                  domain={yDomain}
                  axisLine={{ stroke: '#3f3f46' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    borderColor: '#27272a',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono'
                  }}
                  itemStyle={{ color: '#10b981' }}
                  cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <ReferenceLine y={0} stroke="#3f3f46" strokeWidth={2} />
                <ReferenceLine x={0} stroke="#3f3f46" strokeWidth={2} />
                <Line 
                  type="monotone" 
                  dataKey="y" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-zinc-800 pt-8">
            {[
              { label: 'Oscillation', val: 'sin(x) * x' },
              { label: 'Quadratic', val: 'x^2 - 4x + 1' },
              { label: 'Exponential', val: '2^x' }
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setFunc(preset.val)}
                className="px-4 py-2 border border-zinc-800 rounded-lg text-[10px] uppercase tracking-wider font-mono hover:bg-zinc-800 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
