import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Users, Search, Award, LayoutGrid } from 'lucide-react';

// Import your local data
import rawData from './data.json';

// --- Premium Customized Tick ---
const CustomizedAxisTick = ({ x, y, payload }) => {
  const country = rawData.find(c => (c.name.common || c.name) === payload.value);
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} y={0} dy={15} 
        textAnchor="end" 
        fill="#94a3b8" 
        fontSize={12} 
        fontWeight="600" 
        transform="rotate(-45)"
      >
        {payload.value.length > 12 ? `${payload.value.substring(0, 10)}..` : payload.value}
      </text>
      {country?.flags?.png && (
        <image 
          href={country.flags.png} 
          x={-15} y={50} 
          width="24" height="16" 
          className="rounded-sm shadow-md"
        />
      )}
    </g>
  );
};

function App() {
  const [count, setCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Optimized Data Processing ---

const sortedData = useMemo(() => {
  if (!Array.isArray(rawData)) return [];
  const term = searchTerm.toLowerCase();

  // 1. Sort the ENTIRE dataset by population first
  const allSorted = [...rawData].sort((a, b) => b.population - a.population);

  let finalSelection = [];

  if (term) {
    // 2. Find the country that matches the search
    const match = allSorted.find(c => 
      (c.name.common || c.name || "").toLowerCase().includes(term)
    );

    // 3. Filter out that match from the main list (to avoid duplicates)
    const others = allSorted.filter(c => 
      (c.name.common || c.name || "").toLowerCase() !== (match?.name?.common || match?.name || "").toLowerCase()
    );

    if (match) {
      // 4. Force the match to index 0, then add the top remaining countries
      finalSelection = [match, ...others.slice(0, count - 1)];
    } else {
      finalSelection = others.slice(0, count);
    }
  } else {
    // 5. No search? Just show the standard Top X
    finalSelection = allSorted.slice(0, count);
  }

  return finalSelection.map(c => ({
    name: c.name.common || c.name,
    value: c.population,
    region: c.region,
    flag: c.flags?.png
  }));
}, [count, searchTerm, rawData]);

  const chartWidth = count > 10 ? count * 80 : "100%";

  if (!rawData) return <div className="bg-[#020617] min-h-screen flex items-center justify-center text-white">Loading Data...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-sky-500/30 overflow-x-hidden">
      
      {/* 1. Cinematic Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-sky-500/10 blur-[120px] rounded-full -z-10" />

      {/* 2. Professional Header */}
      <header className="max-w-6xl mx-auto pt-16 pb-12 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center gap-2 mb-4"
        >
          <span className="h-px w-8 bg-sky-500/50" />
          <span className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase">Global Analytics</span>
          <span className="h-px w-8 bg-sky-500/50" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8">
          WORLD<span className="text-sky-500">POPULATION</span>
        </h1>

        {/* 3. Interactive Dock */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-slate-900/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl max-w-3xl mx-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Filter nations..."
              className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="h-6 w-px bg-white/10 hidden md:block" />

          <div className="flex items-center gap-3">
            <LayoutGrid size={18} className="text-sky-500" />
            <select 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              className="bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer text-sm font-bold"
            >
              {[5, 10, 20, 50].map(num => (
                <option key={num} value={num}>Display Top {num}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* 4. The Visualization Canvas */}
      <main className="max-w-[95%] mx-auto pb-20">
        <motion.div 
          layout
          className="bg-slate-900/20 backdrop-blur-sm rounded-[2.5rem] border border-white/5 p-6 md:p-10 shadow-3xl overflow-x-auto custom-scrollbar"
        >
          <div style={{ width: chartWidth, height: 500 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart key={`chart-${searchTerm}`} data={sortedData} margin={{ bottom: 80, left: 20 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  interval={0} 
                  tick={<CustomizedAxisTick />} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v / 1000000).toFixed(0) + 'M'} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 10 }}
                  content={<CustomTooltip />}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  radius={[10, 10, 2, 2]} 
                  barSize={count > 20 ? 30 : 50}
                  animationDuration={1500}
                >
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} className="hover:brightness-125 transition-all duration-300" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </main>

      <footer className="text-center pb-10 opacity-30 text-xs font-medium tracking-widest">
        DESIGNED BY SACHIN BAVDHANKAR • 2026
      </footer>
    </div>
  );
}

// --- High-End Tooltip Component ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-2xl ring-1 ring-sky-500/20">
        <div className="flex items-center gap-3 mb-3">
          <img src={data.flag} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" />
          <div>
            <p className="text-[10px] uppercase font-bold text-sky-500 tracking-tighter">{data.region}</p>
            <p className="text-white font-black">{data.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <Users size={14} className="text-sky-400" />
          <span className="font-mono">{payload[0].value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default App;