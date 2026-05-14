import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Delete, Eraser, History, Settings2, Command } from 'lucide-react';
import { cn } from '../lib/utils';
import { evaluateExpression } from '../lib/math';

const BUTTONS = [
  { label: 'MC', type: 'memory', value: 'MC' },
  { label: 'MR', type: 'memory', value: 'MR' },
  { label: 'M+', type: 'memory', value: 'M+' },
  { label: 'M-', type: 'memory', value: 'M-' },
  { label: 'MS', type: 'memory', value: 'MS' },

  { label: '2nd', type: 'function', value: '2nd' },
  { label: 'π', type: 'constant', value: 'pi' },
  { label: 'e', type: 'constant', value: 'e' },
  { label: 'C', type: 'clear', value: 'C' },
  { label: <Delete className="w-5 h-5" />, type: 'clear', value: 'DEL' },

  { label: 'x²', type: 'function', value: '^2' },
  { label: '1/x', type: 'function', value: '1/(' },
  { label: '|x|', type: 'function', value: 'abs(' },
  { label: 'exp', type: 'function', value: 'exp(' },
  { label: 'mod', type: 'operator', value: ' mod ' },

  { label: '2√x', type: 'function', value: 'sqrt(' },
  { label: '(', type: 'bracket', value: '(' },
  { label: ')', type: 'bracket', value: ')' },
  { label: 'n!', type: 'function', value: '!' },
  { label: '÷', type: 'operator', value: '/' },

  { label: 'xʸ', type: 'function', value: '^' },
  { label: '7', type: 'number', value: '7' },
  { label: '8', type: 'number', value: '8' },
  { label: '9', type: 'number', value: '9' },
  { label: '×', type: 'operator', value: '*' },

  { label: '10ˣ', type: 'function', value: '10^' },
  { label: '4', type: 'number', value: '4' },
  { label: '5', type: 'number', value: '5' },
  { label: '6', type: 'number', value: '6' },
  { label: '-', type: 'operator', value: '-' },

  { label: 'log', type: 'function', value: 'log10(' },
  { label: '1', type: 'number', value: '1' },
  { label: '2', type: 'number', value: '2' },
  { label: '3', type: 'number', value: '3' },
  { label: '+', type: 'operator', value: '+' },

  { label: 'ln', type: 'function', value: 'log(' },
  { label: '+/-', type: 'function', value: 'negate' },
  { label: '0', type: 'number', value: '0' },
  { label: '.', type: 'number', value: '.' },
  { label: '=', type: 'equals', value: '=' },
];

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState(0);

  const handleInput = useCallback((value: string) => {
    if (value === '=') {
      const evalResult = evaluateExpression(expression);
      setResult(evalResult);
      if (evalResult !== 'Error') {
        setHistory(prev => [expression + ' = ' + evalResult, ...prev].slice(0, 5));
      }
    } else if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
    } else if (value === 'negate') {
      if (expression) {
        if (expression.startsWith('-')) setExpression(expression.slice(1));
        else setExpression('-' + expression);
      }
    } else if (['MC', 'MR', 'M+', 'M-', 'MS'].includes(value)) {
      // Memory logic
      const currentVal = parseFloat(result) || parseFloat(expression) || 0;
      switch (value) {
        case 'MC': setMemory(0); break;
        case 'MR': setExpression(prev => prev + memory.toString()); break;
        case 'M+': setMemory(prev => prev + currentVal); break;
        case 'M-': setMemory(prev => prev - currentVal); break;
        case 'MS': setMemory(currentVal); break;
      }
    } else {
      setExpression(prev => prev + value);
    }
  }, [expression, result, memory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleInput(e.key);
      if (e.key === '.') handleInput('.');
      if (e.key === '+') handleInput('+');
      if (e.key === '-') handleInput('-');
      if (e.key === '*') handleInput('*');
      if (e.key === '/') handleInput('/');
      if (e.key === '(') handleInput('(');
      if (e.key === ')') handleInput(')');
      if (e.key === 'Enter' || e.key === '=') handleInput('=');
      if (e.key === 'Backspace') handleInput('DEL');
      if (e.key === 'Escape') handleInput('C');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Calculator */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
          {/* Display */}
          <div className="flex flex-col items-end gap-2 px-4 py-6 bg-zinc-950/50 rounded-xl border border-zinc-800/50 min-h-[140px] justify-center relative overflow-hidden group">
            <div className="absolute top-2 left-4 flex gap-1 items-center opacity-40 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] uppercase tracking-tighter font-mono">Precision: 64-bit</span>
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-zinc-500 font-mono text-sm h-6 overflow-hidden text-ellipsis w-full text-right">
              {expression || ' '}
            </div>
            <div className={cn(
              "font-mono text-4xl md:text-5xl font-medium tracking-tight text-right w-full overflow-hidden text-ellipsis transition-all duration-300",
              result ? "text-emerald-400" : "text-zinc-100"
            )}>
              {result || '0'}
            </div>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {BUTTONS.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleInput(typeof btn.value === 'string' ? btn.value : '')}
                className={cn(
                  "h-12 md:h-14 rounded-lg flex items-center justify-center font-mono text-sm md:text-base border transition-all active:scale-95 disabled:opacity-50",
                  btn.type === 'number' && "bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700",
                  btn.type === 'operator' && "bg-zinc-800/50 border-zinc-700 text-emerald-400 hover:bg-zinc-700",
                  btn.type === 'function' && "bg-zinc-800/30 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
                  btn.type === 'memory' && "bg-transparent border-transparent text-zinc-500 hover:text-zinc-100 text-xs",
                  btn.type === 'clear' && "bg-red-950/20 border-red-900/30 text-red-400 hover:bg-red-950/40",
                  btn.type === 'equals' && "bg-emerald-500 border-emerald-400 text-zinc-950 hover:bg-emerald-400 font-bold",
                  btn.type === 'bracket' && "bg-zinc-800/30 border-zinc-800 text-zinc-400 hover:bg-zinc-800",
                  btn.type === 'constant' && "bg-zinc-800/30 border-zinc-800 text-emerald-500/70 hover:text-emerald-400"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar: History & Settings */}
        <div className="flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full min-h-[400px]">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
              <History className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-semibold uppercase tracking-widest text-zinc-400">History</span>
            </div>
            <div className="flex flex-col gap-4">
              {history.length === 0 ? (
                <div className="text-zinc-600 text-sm italic font-mono">No recent calculations</div>
              ) : (
                history.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/50 text-right cursor-pointer hover:border-emerald-500/30 transition-colors group"
                    onClick={() => {
                        const [expr] = item.split(' = ');
                        setExpression(expr);
                        setResult('');
                    }}
                  >
                    <div className="text-xs text-zinc-500 font-mono mb-1 truncate">{item.split(' = ')[0]}</div>
                    <div className="text-emerald-400 font-mono font-medium group-hover:scale-105 transition-transform">{item.split(' = ')[1]}</div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
