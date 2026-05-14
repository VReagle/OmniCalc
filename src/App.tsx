import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator as CalcIcon, LineChart as GraphIcon, Command, Cpu } from 'lucide-react';
import Calculator from './components/Calculator';
import Grapher from './components/Grapher';
import { cn } from './lib/utils';

type Tab = 'calculator' | 'grapher';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-x-hidden">
      {/* Navigation Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center rotate-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Cpu className="text-zinc-950 w-6 h-6" />
             </div>
             <div>
                <h1 className="font-sans font-bold text-lg tracking-tight leading-none mb-1">OmniCalc</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono">Advanced Computing Environment</p>
             </div>
          </div>

          <nav className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
            {[
              { id: 'calculator', label: 'Calculator', icon: CalcIcon },
              { id: 'grapher', label: 'Graphing', icon: GraphIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "relative px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors duration-200 outline-none",
                  activeTab === tab.id ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-zinc-800 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">System Status</span>
                <span className="text-xs text-emerald-400 font-mono uppercase flex items-center gap-1.5">
                   Operational
                   <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                </span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-12 bg-[radial-gradient(circle_at_50%_-20%,#064e3b_0%,transparent_50%)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTab === 'calculator' ? <Calculator /> : <Grapher />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 px-12">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-6 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
               <span>v4.2.0-stable</span>
               <span>IEEE 754-2019</span>
               <span>64-bit precision</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
               <Command className="w-3 h-3" />
               <span>Ready for input</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
