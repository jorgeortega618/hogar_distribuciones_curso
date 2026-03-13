import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, ZAxis, Legend
} from 'recharts';
import { Map, Flag, DollarSign, Activity } from 'lucide-react';
import { processedData, getCities, formatCurrency, formatNumber } from '../utils/dataProcessor';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4'];

export default function PageCity() {
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [selectedYear, setSelectedYear] = useState('Todos');

  const cities = getCities();
  const years = ['Todos', ...new Set(processedData.map(item => item.Año.toString()))].sort();

  // Filter Data
  const filteredData = useMemo(() => {
    return processedData.filter(d => {
      const matchCity = selectedCity === 'Todas' || d.Ciudad === selectedCity;
      const matchYear = selectedYear === 'Todos' || d.Año.toString() === selectedYear;
      return matchCity && matchYear;
    });
  }, [selectedCity, selectedYear]);

  // 4 KPIs
  const kpis = useMemo(() => {
    const revenue = filteredData.reduce((acc, curr) => acc + curr.Total, 0);
    const volume = filteredData.reduce((acc, curr) => acc + curr.Cantidad, 0);
    const avgTicket = filteredData.length > 0 ? revenue / filteredData.length : 0;
    const topCity = cities.filter(c => c !== 'Todas').sort((a, b) => {
      const revA = filteredData.filter(d => d.Ciudad === a).reduce((s, c) => s + c.Total, 0);
      const revB = filteredData.filter(d => d.Ciudad === b).reduce((s, c) => s + c.Total, 0);
      return revB - revA;
    })[0] || 'N/A';

    return { revenue, volume, avgTicket, topCity };
  }, [filteredData, cities]);

  // City Map Points (Simulated based on Colombian Cities)
  const mapData = useMemo(() => {
    const cityCoords = {
      'Bogotá': { x: 50, y: 40 },
      'Bogota': { x: 50, y: 40 },
      'Medellín': { x: 40, y: 60 },
      'Medellin': { x: 40, y: 60 },
      'Cali': { x: 35, y: 30 },
      'Barranquilla': { x: 45, y: 85 },
      'Cartagena': { x: 40, y: 80 },
      'Bucaramanga': { x: 52, y: 65 },
    };

    const grouped = {};
    filteredData.forEach(d => {
      if (!grouped[d.Ciudad]) grouped[d.Ciudad] = 0;
      grouped[d.Ciudad] += d.Total;
    });

    return Object.entries(grouped).map(([city, val]) => ({
      name: city,
      value: val,
      x: cityCoords[city]?.x || Math.random() * 80 + 10,
      y: cityCoords[city]?.y || Math.random() * 80 + 10
    }));
  }, [filteredData]);

  // City Ranking
  const cityRanking = useMemo(() => {
    const grouped = {};
    filteredData.forEach(d => {
      if (!grouped[d.Ciudad]) grouped[d.Ciudad] = 0;
      grouped[d.Ciudad] += d.Total;
    });
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // City-Category Matrix
  const matrixData = useMemo(() => {
    const grouped = {};
    const categories = new Set();

    filteredData.forEach(d => {
      categories.add(d.Categoria);
      if (!grouped[d.Ciudad]) grouped[d.Ciudad] = {};
      if (!grouped[d.Ciudad][d.Categoria]) grouped[d.Ciudad][d.Categoria] = 0;
      grouped[d.Ciudad][d.Categoria] += d.Total;
    });

    return {
      data: Object.entries(grouped).map(([city, cats]) => ({ city, ...cats })),
      cats: Array.from(categories).sort()
    };
  }, [filteredData]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>

      {/* Sidebar Local Filters */}
      <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '0' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Filtros de Análisis</h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Ciudad</label>
          <select
            className="filter-select" style={{ width: '100%' }}
            value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
          >
            {cities.map(c => <option key={c} value={c}>{c === 'Todas' ? 'Todas las ciudades' : c}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Año</label>
          <select
            className="filter-select" style={{ width: '100%' }}
            value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-grid">

        {/* 4 KPIs */}
        <div className="card col-span-3 kpi-card">
          <div className="kpi-title">Ingresos</div>
          <div className="kpi-value">{formatCurrency(kpis.revenue)}</div>
        </div>
        <div className="card col-span-3 kpi-card">
          <div className="kpi-title">Volumen</div>
          <div className="kpi-value">{formatNumber(kpis.volume)}</div>
        </div>
        <div className="card col-span-3 kpi-card">
          <div className="kpi-title">Mejor Ciudad</div>
          <div className="kpi-value" style={{ fontSize: '24px' }}>{kpis.topCity}</div>
        </div>
        <div className="card col-span-3 kpi-card">
          <div className="kpi-title">Ticket Promedio</div>
          <div className="kpi-value">{formatCurrency(kpis.avgTicket)}</div>
        </div>

        {/* 1. Map Scatter Simulation */}
        <div className="card col-span-6">
          <div className="card-header"><span className="card-title">Distribución Geográfica</span></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" dataKey="x" name="Longitud" hide domain={[0, 100]} />
                <YAxis type="number" dataKey="y" name="Latitud" hide domain={[0, 100]} />
                <ZAxis type="number" dataKey="value" range={[50, 2000]} name="Ingreso" />
                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }}
                  formatter={(val, name, props) => name === 'Ingreso' ? formatCurrency(val) : val}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Scatter name="Ciudades" data={mapData} fill="#6366f1">
                  {mapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. City Ranking */}
        <div className="card col-span-6">
          <div className="card-header"><span className="card-title">Ranking de Ciudades</span></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityRanking} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#2b3648', fontSize: 13, fontWeight: 500 }} width={80} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Stacked Bars Year/City */}
        <div className="card col-span-12">
          <div className="card-header"><span className="card-title">Composición por Ciudad y Año</span></div>
          <div className="chart-container" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matrixData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fill: '#8492a6', fontSize: 13 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8492a6', fontSize: 12 }} tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`} dx={-10} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />
                {matrixData.cats.map((cat, idx) => (
                  <Bar key={cat} dataKey={cat} stackId="a" fill={COLORS[idx % COLORS.length]} radius={idx === matrixData.cats.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} barSize={40} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Matrix Table as Heatmap replacement for matrix */}
        <div className="card col-span-12">
          <div className="card-header"><span className="card-title">Matriz Ciudad vs Categoría</span></div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ciudad</th>
                  {matrixData.cats.map(c => <th key={c}>{c}</th>)}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {matrixData.data.map((row, idx) => {
                  const rowTotal = matrixData.cats.reduce((sum, c) => sum + (row[c] || 0), 0);
                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{row.city}</td>
                      {matrixData.cats.map(c => (
                        <td key={c}>
                          {row[c] ? formatCurrency(row[c]) : '-'}
                        </td>
                      ))}
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(rowTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
