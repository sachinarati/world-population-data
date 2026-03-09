import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Ensure your data.json is in the src folder
import rawData from './data.json';

// --- Custom Component for Bigger Names and Flags ---
const CustomizedAxisTick = ({ x, y, payload }) => {
  const country = rawData.find(c => c.name.common === payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Country Name: Bigger, Bold, and Bright White */}
      <text 
        x={0} 
        y={0} 
        dy={15} 
        textAnchor="end" 
        fill="#ffffff" 
        fontSize={14} 
        fontWeight="600" 
        transform="rotate(-45)"
      >
        {payload.value}
      </text>
      
      {/* Flag: Positioned clearly below the rotated name */}
      {country?.flags?.png && (
        <image 
          href={country.flags.png} 
          x={-15} 
          y={55} 
          width="30" 
          height="20" 
          preserveAspectRatio="xMidYMid slice"
        />
      )}
    </g>
  );
};

function App() {
  const [count, setCount] = useState(10);

  // Sort by population and slice based on user selection
  const sortedData = [...rawData]
    .sort((a, b) => b.population - a.population)
    .slice(0, count)
    .map(c => ({
      name: c.name.common,
      value: c.population,
    }));

  // Logic to prevent crowding: each country gets 100px of width
  const chartWidth = count > 8 ? count * 100 : "100%";

  return (
    <div style={{ padding: '40px', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#38bdf8', fontSize: '2.5rem', marginBottom: '10px' }}>World Population Explorer</h1>
        <div style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#1e293b', borderRadius: '50px', border: '1px solid #334155' }}>
          <label style={{ marginRight: '15px', fontWeight: 'bold' }}>Top Countries:</label>
          <select 
            value={count} 
            onChange={(e) => setCount(Number(e.target.value))}
            style={{ padding: '5px 15px', borderRadius: '20px', backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8', cursor: 'pointer', outline: 'none' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </header>

      {/* Main Chart Container with Horizontal Scroll */}
      <div style={{ 
        width: '95%', 
        overflowX: 'auto', 
        backgroundColor: '#1e293b', 
        borderRadius: '15px', 
        padding: '30px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ width: chartWidth, height: 550, minWidth: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} margin={{ bottom: 100, left: 30, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              
              <XAxis 
                dataKey="name" 
                interval={0} 
                tick={<CustomizedAxisTick />} 
                height={140} 
              />
              
              <YAxis 
                stroke="#94a3b8" 
                width={90}
                tickFormatter={(v) => (v / 1000000).toFixed(0) + 'M'} 
              />
              
              <Tooltip 
                cursor={{ fill: '#2d3748' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #38bdf8', borderRadius: '10px' }}
                formatter={(value) => [Number(value).toLocaleString(), "Population"]}
              />
              
              <Bar 
                dataKey="value" 
                fill="#38bdf8" 
                radius={[8, 8, 0, 0]} 
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <footer style={{ marginTop: '50px', textAlign: 'center', opacity: 0.5 }}>
        <p>Built by Sachin Bavdhankar</p>
      </footer>
    </div>
  );
}

export default App;