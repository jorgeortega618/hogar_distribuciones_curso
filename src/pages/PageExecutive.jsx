import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, Activity, ShoppingCart, TrendingUp, Box, MapPin } from 'lucide-react';
import { processedData, formatCurrency, formatNumber } from '../utils/dataProcessor';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4'];

export default function PageExecutive({ selectedCity }) {

  // Filter Data
  const filteredData = useMemo(() => {
    return selectedCity === 'Todas' ? processedData : processedData.filter(d => d.Ciudad === selectedCity);
  }, [selectedCity]);

  // 6 KPIs
  const kpis = useMemo(() => {
    const revenue = filteredData.reduce((acc, curr) => acc + curr.Total, 0);
    const volume = filteredData.reduce((acc, curr) => acc + curr.Cantidad, 0);
    const transactions = filteredData.length;
    const avgTicket = transactions > 0 ? revenue / transactions : 0;
    
    // Additional metrics for Page 1
    const uniqueProducts = new Set(filteredData.map(c => c.Descripcion)).size;
    const uniqueCities = new Set(filteredData.map(c => c.Ciudad)).size;
    
    return { revenue, volume, transactions, avgTicket, uniqueProducts, uniqueCities };
  }, [filteredData]);

  // Sales Trend (Monthly Area Chart)
  const salesTrend = useMemo(() => {
    const grouped = {};
    filteredData.forEach(item => {
      const monthPeriod = item.Fecha.substring(0, 7);
      if (!grouped[monthPeriod]) grouped[monthPeriod] = 0;
      grouped[monthPeriod] += item.Total;
    });
    return Object.entries(grouped)
        .sort((a,b) => a[0].localeCompare(b[0]))
        .map(([date, total]) => ({ date, total }));
  }, [filteredData]);

  // Columns by Year (Yearly Bar Chart)
  const yearlySales = useMemo(() => {
    const grouped = {};
    filteredData.forEach(item => {
      const year = item.Año;
      if (!grouped[year]) grouped[year] = 0;
      grouped[year] += item.Total;
    });
    return Object.entries(grouped)
        .sort((a,b) => a[0].localeCompare(b[0]))
        .map(([year, total]) => ({ year, total }));
  }, [filteredData]);

  // Top Products (Horizontal Bar Chart)
  const topProducts = useMemo(() => {
    const grouped = {};
    filteredData.forEach(item => {
      if (!grouped[item.Descripcion]) grouped[item.Descripcion] = 0;
      grouped[item.Descripcion] += item.Total;
    });
    return Object.entries(grouped)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Participation by City (Pie)
  const cityParticipation = useMemo(() => {
    const grouped = {};
    filteredData.forEach(item => {
      if (!grouped[item.Ciudad]) grouped[item.Ciudad] = 0;
      grouped[item.Ciudad] += item.Total;
    });
    return Object.entries(grouped)
      .sort((a,b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Participation by Category (Pie)
  const categoryParticipation = useMemo(() => {
    const grouped = {};
    filteredData.forEach(item => {
      if (!grouped[item.Categoria]) grouped[item.Categoria] = 0;
      grouped[item.Categoria] += item.Total;
    });
    return Object.entries(grouped)
      .sort((a,b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  return (
    <>
      <div className="dashboard-grid">
        
        {/* 6 KPI Cards */}
        <div className="card col-span-4 kpi-card gradient-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="kpi-title">Ingresos Totales</div>
              <div className="kpi-value">{formatCurrency(kpis.revenue)}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 }}>
              <DollarSign color="white" size={24}/>
            </div>
          </div>
        </div>

        <div className="card col-span-4 kpi-card gradient-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="kpi-title">Volumen Total</div>
              <div className="kpi-value">{formatNumber(kpis.volume)} <span style={{fontSize: 14, fontWeight: 500}}>uds</span></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 }}>
              <Activity color="white" size={24}/>
            </div>
          </div>
        </div>

        <div className="card col-span-4 kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="kpi-title">Transacciones</div>
              <div className="kpi-value">{formatNumber(kpis.transactions)}</div>
            </div>
            <div style={{ background: 'rgba(99,102,241,0.1)', padding: 10, borderRadius: 12 }}>
              <ShoppingCart color="#6366f1" size={24}/>
            </div>
          </div>
        </div>

        <div className="card col-span-4 kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="kpi-title">Ticket Promedio</div>
              <div className="kpi-value">{formatCurrency(kpis.avgTicket)}</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.1)', padding: 10, borderRadius: 12 }}>
              <TrendingUp color="#10b981" size={24}/>
            </div>
          </div>
        </div>

        <div className="card col-span-4 kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="kpi-title">Productos Únicos</div>
              <div className="kpi-value">{formatNumber(kpis.uniqueProducts)}</div>
            </div>
            <div style={{ background: 'rgba(236,72,153,0.1)', padding: 10, borderRadius: 12 }}>
              <Box color="#ec4899" size={24}/>
            </div>
          </div>
        </div>

        <div className="card col-span-4 kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="kpi-title">Cobertura Ciudades</div>
              <div className="kpi-value">{formatNumber(kpis.uniqueCities)}</div>
            </div>
            <div style={{ background: 'rgba(6,182,212,0.1)', padding: 10, borderRadius: 12 }}>
              <MapPin color="#06b6d4" size={24}/>
            </div>
          </div>
        </div>

        {/* 1. Monthly Line Trend */}
        <div className="card col-span-8">
          <div className="card-header">
            <span className="card-title">Tendencia Mensual de Ingresos</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#8492a6', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8492a6', fontSize: 12}} tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} dx={-10}/>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Yearly Columns */}
        <div className="card col-span-4">
          <div className="card-header">
            <span className="card-title">Tendencia Anual</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#8492a6', fontSize: 13}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8492a6', fontSize: 12}} tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} dx={-10} width={60}/>
                <RechartsTooltip 
                    cursor={{fill: 'rgba(99,102,241,0.05)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="total" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Top Products */}
        <div className="card col-span-4">
          <div className="card-header">
            <span className="card-title">Top 5 Productos En Ingresos</span>
          </div>
            <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0"/>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#2b3648', fontSize: 12, fontWeight: 500}} width={120} />
                <RechartsTooltip 
                    cursor={{fill: 'rgba(99,102,241,0.05)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. City Participation Pie */}
        <div className="card col-span-4">
          <div className="card-header">
            <span className="card-title">Participación % Ciudad</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cityParticipation}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {cityParticipation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Category Participation Pie */}
        <div className="card col-span-4">
          <div className="card-header">
            <span className="card-title">Participación % Categoría</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryParticipation}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryParticipation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </>
  );
}
