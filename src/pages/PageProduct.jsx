import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, ZAxis, Legend, ComposedChart, Line, Treemap
} from 'recharts';
import { Box, PackageCheck, DollarSign, Target } from 'lucide-react';
import { processedData, getCities, formatCurrency, formatNumber } from '../utils/dataProcessor';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4'];

export default function PageProduct() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedCity, setSelectedCity] = useState('Todas');

  const categories = ['Todas', ...new Set(processedData.map(item => item.Categoria))].sort();
  const cities = getCities();

  // Filter Data
  const filteredData = useMemo(() => {
    return processedData.filter(d => {
      const matchCat = selectedCategory === 'Todas' || d.Categoria === selectedCategory;
      const matchCity = selectedCity === 'Todas' || d.Ciudad === selectedCity;
      return matchCat && matchCity;
    });
  }, [selectedCategory, selectedCity]);

  // 4 KPIs
  const kpis = useMemo(() => {
    const revenue = filteredData.reduce((acc, curr) => acc + curr.Total, 0);
    const volume = filteredData.reduce((acc, curr) => acc + curr.Cantidad, 0);
    const uniqueProducts = new Set(filteredData.map(c => c.Descripcion)).size;
    const avgPrice = volume > 0 ? revenue / volume : 0;
    return { revenue, volume, uniqueProducts, avgPrice };
  }, [filteredData]);

  // Pareto Chart (Revenue by Product + Cumulative %)
  const paretoData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(d => {
      if (!grouped[d.Descripcion]) grouped[d.Descripcion] = 0;
      grouped[d.Descripcion] += d.Total;
    });
    
    let sorted = Object.entries(grouped)
      .sort((a,b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
      
    const totalRev = sorted.reduce((sum, item) => sum + item.value, 0);
    let cumulative = 0;
    
    return sorted.slice(0, 15).map(item => { // limit to top 15 for readability
      cumulative += item.value;
      return {
        ...item,
        cumulativePercentage: totalRev > 0 ? (cumulative / totalRev) * 100 : 0
      };
    });
  }, [filteredData]);

  // Scatter Price vs Volume (Group by Product)
  const scatterData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(d => {
      if (!grouped[d.Descripcion]) grouped[d.Descripcion] = { vol: 0, rev: 0 };
      grouped[d.Descripcion].vol += d.Cantidad;
      grouped[d.Descripcion].rev += d.Total;
    });
    return Object.entries(grouped).map(([name, stats]) => ({
      name,
      volume: stats.vol,
      avgPrice: stats.vol > 0 ? stats.rev / stats.vol : 0,
      totalRevenue: stats.rev
    }));
  }, [filteredData]);

  // Top / Bottom Products
  const topBottomProducts = useMemo(() => {
    const sorted = [...scatterData].sort((a,b) => b.totalRevenue - a.totalRevenue);
    return {
      top: sorted.slice(0, 5),
      bottom: sorted.slice(-5).reverse() // worst 5, reversed so worst is first
    };
  }, [scatterData]);

  // Heatmap Simulación (Tabla CSS) Mes-Año  
  const heatmapData = useMemo(() => {
    const yearsSet = new Set();
    const map = {};
    filteredData.forEach(d => {
      const gYear = d.Año.toString();
      const gMonth = d.Nombre_Mes;
      yearsSet.add(gYear);
      if (!map[gMonth]) map[gMonth] = {};
      if (!map[gMonth][gYear]) map[gMonth][gYear] = 0;
      map[gMonth][gYear] += d.Total;
    });
    
    const monthsOrder = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return {
      years: Array.from(yearsSet).sort(),
      months: monthsOrder.filter(m => map[m]),
      data: map
    };
  }, [filteredData]);

  // Treemap (Jerarquía: Categoria -> Producto)
  const treemapData = useMemo(() => {
    const categoriesMap = {};
    filteredData.forEach(d => {
      if (!categoriesMap[d.Categoria]) categoriesMap[d.Categoria] = {};
      if (!categoriesMap[d.Categoria][d.Descripcion]) categoriesMap[d.Categoria][d.Descripcion] = 0;
      categoriesMap[d.Categoria][d.Descripcion] += d.Total;
    });

    const rootChildren = Object.entries(categoriesMap).map(([cat, prods]) => ({
      name: cat,
      children: Object.entries(prods).map(([prodName, value]) => ({
        name: prodName,
        size: value
      }))
    }));
    return rootChildren;
  }, [filteredData]);

  // Custom Treemap Content
  const CustomizedContent = (props) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
    if (depth === 1) { // It's a category
        const catColor = COLORS[index % COLORS.length];
        return (
            <g>
               <rect x={x} y={y} width={width} height={height} style={{ fill: catColor, stroke: '#fff', strokeWidth: 2, strokeOpacity: 0.8 }} />
               {width > 50 && height > 30 && <text x={x + 10} y={y + 20} fill="#fff" fontSize={14} fontWeight={600} opacity={0.9}>{name}</text>}
            </g>
        );
    }
    return null;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>
      
      {/* Sidebar Local Filters */}
      <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '0' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Filtros de Análisis</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom:'8px', fontWeight: '500' }}>Categoría</label>
          <select 
            className="filter-select" style={{ width: '100%' }}
            value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-muted)', marginBottom:'8px', fontWeight: '500' }}>Ciudad</label>
          <select 
            className="filter-select" style={{ width: '100%' }}
            value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
          >
            {cities.map(c => <option key={c} value={c}>{c === 'Todas' ? 'Todas las ciudades' : c}</option>)}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-grid">
        
        {/* 4 KPIs */}
        <div className="card col-span-3 kpi-card">
          <div className="kpi-title">Ingresos</div>
          <div className="kpi-value">{formatCurrency(kpis.revenue)}</div>
          <DollarSign color="#6366f1" size={24} style={{position: 'absolute', right: 24, top: 24, opacity: 0.2}}/>
        </div>
        <div className="card col-span-3 kpi-card">
          <div className="kpi-title">Volumen (Uds)</div>
          <div className="kpi-value">{formatNumber(kpis.volume)}</div>
          <PackageCheck color="#a855f7" size={24} style={{position: 'absolute', right: 24, top: 24, opacity: 0.2}}/>
        </div>
        <div className="card col-span-3 kpi-card">
          <div className="kpi-title">Productos Únicos</div>
          <div className="kpi-value">{formatNumber(kpis.uniqueProducts)}</div>
          <Box color="#ec4899" size={24} style={{position: 'absolute', right: 24, top: 24, opacity: 0.2}}/>
        </div>
        <div className="card col-span-3 kpi-card">
          <div className="kpi-title">Precio Promedio Unit.</div>
          <div className="kpi-value">{formatCurrency(kpis.avgPrice)}</div>
          <Target color="#10b981" size={24} style={{position: 'absolute', right: 24, top: 24, opacity: 0.2}}/>
        </div>

        {/* 1. Pareto Chart */}
        <div className="card col-span-12">
          <div className="card-header"><span className="card-title">Análisis de Pareto (Top 15 Productos)</span></div>
          <div className="chart-container" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={paretoData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8492a6', fontSize: 11}} dy={10} width={100} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#8492a6', fontSize: 12}} tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#8492a6', fontSize: 12}} tickFormatter={(val) => `${val.toFixed(0)}%`} dx={10} domain={[0, 100]} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(99,102,241,0.05)'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value, name) => name === 'cumulativePercentage' ? `${value.toFixed(1)}%` : formatCurrency(value)}
                />
                <Bar yAxisId="left" dataKey="value" name="Ingreso" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={35} />
                <Line yAxisId="right" type="monotone" dataKey="cumulativePercentage" name="% Acumulado" stroke="#f43f5e" strokeWidth={3} dot={{r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff'}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Scatter Price vs Volume */}
        <div className="card col-span-8">
          <div className="card-header"><span className="card-title">Relación Volumen vs Precio Promedio</span></div>
          <div className="chart-container" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" dataKey="volume" name="Volumen (uds)" tick={{fill: '#8492a6', fontSize: 12}} dy={10} />
                <YAxis type="number" dataKey="avgPrice" name="Precio Promedio" tick={{fill: '#8492a6', fontSize: 12}} tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} dx={-10} />
                <ZAxis type="number" dataKey="totalRevenue" range={[50, 600]} name="Ingreso Total" />
                <RechartsTooltip cursor={{strokeDasharray: '3 3'}} 
                   formatter={(val, name) => {
                       if (name === 'Precio Promedio' || name === 'Ingreso Total') return formatCurrency(val);
                       return val;
                   }}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Scatter name="Productos" data={scatterData} fill="#ec4899" fillOpacity={0.6}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Top / Bottom Products */}
        <div className="card col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div className="card-header" style={{marginBottom: '12px'}}><span className="card-title" style={{color: 'var(--success)'}}>Top 5 (Mejor Rendimiento)</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topBottomProducts.top.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px' }}>
                        <span style={{fontSize: '13px', fontWeight: 600, width: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{p.name}</span>
                        <span style={{fontSize: '13px', fontWeight: 700, color: 'var(--success)'}}>{formatCurrency(p.totalRevenue)}</span>
                    </div>
                ))}
            </div>
          </div>
          <div>
            <div className="card-header" style={{marginBottom: '12px'}}><span className="card-title" style={{color: 'var(--danger)'}}>Bottom 5 (Menor Rendimiento)</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topBottomProducts.bottom.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(239,68,68,0.05)', borderRadius: '8px' }}>
                        <span style={{fontSize: '13px', fontWeight: 600, width: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{p.name}</span>
                        <span style={{fontSize: '13px', fontWeight: 700, color: 'var(--danger)'}}>{formatCurrency(p.totalRevenue)}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Heatmap Mes-Año Simulation */}
        <div className="card col-span-6">
          <div className="card-header"><span className="card-title">Heatmap: Ingresos por Mes-Año</span></div>
          <div className="data-table-wrapper" style={{ flex: 1 }}>
              <table className="data-table" style={{tableLayout: 'fixed'}}>
                <thead>
                  <tr>
                    <th>Mes</th>
                    {heatmapData.years.map(y => <th key={y} style={{textAlign: 'center'}}>{y}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.months.map((m, idx) => (
                    <tr key={idx}>
                      <td style={{fontWeight: 600}}>{m}</td>
                      {heatmapData.years.map(y => {
                        const val = heatmapData.data[m][y] || 0;
                        // Determine background opacity based on value (max typical monthly value around ~3-4M for 1000 records)
                        // A simple heuristic for heatmap cell styling
                        const opacity = val > 0 ? Math.min(0.8, Math.max(0.1, val / 1500000)) : 0;
                        return (
                          <td key={y} style={{textAlign: 'center', background: `rgba(99, 102, 241, ${opacity})`, color: opacity > 0.5 ? '#fff' : 'var(--text-main)', border: '2px solid white', borderRadius: '8px'}}>
                            {val > 0 ? formatCurrency(val) : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>

        {/* 5. Decomposition Tree / Treemap */}
        <div className="card col-span-6">
          <div className="card-header"><span className="card-title">Árbol de Descomposición (Categoría &gt; Prod)</span></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                content={<CustomizedContent />}
              >
                <RechartsTooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
               />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
