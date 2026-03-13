import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Target, MapPin, Award } from 'lucide-react';
import { processedData, formatCurrency, formatNumber } from '../utils/dataProcessor';

export default function PageInsights() {
  
  const insights = useMemo(() => {
    // Basic sums
    const totalRevenue = processedData.reduce((acc, curr) => acc + curr.Total, 0);
    const totalVolume = processedData.reduce((acc, curr) => acc + curr.Cantidad, 0);
    const totalTransactions = processedData.length;

    // Grouping helpers
    const groupBy = (data, key) => {
      const g = {};
      data.forEach(d => {
        if (!g[d[key]]) g[d[key]] = { revenue: 0, volume: 0, count: 0 };
        g[d[key]].revenue += d.Total;
        g[d[key]].volume += d.Cantidad;
        g[d[key]].count += 1;
      });
      return Object.entries(g).map(([name, stats]) => ({ name, ...stats })).sort((a, b) => b.revenue - a.revenue);
    };

    const cities = groupBy(processedData, 'Ciudad');
    const products = groupBy(processedData, 'Descripcion');
    const categories = groupBy(processedData, 'Categoria');

    // Months (group by Año-Mes object to sort properly, then find min/max)
    const monthly = {};
    processedData.forEach(d => {
      const monthPeriod = d.Fecha.substring(0, 7); // YYYY-MM
      const label = `${d.Nombre_Mes} ${d.Año}`;
      if (!monthly[monthPeriod]) monthly[monthPeriod] = { label, revenue: 0 };
      monthly[monthPeriod].revenue += d.Total;
    });
    const monthlyList = Object.values(monthly).sort((a,b) => b.revenue - a.revenue);

    return {
      totalRevenue,
      totalVolume,
      totalTransactions,
      topCity: cities[0],
      topProduct: products[0],
      bottomProduct: products[products.length - 1],
      topCategory: categories[0],
      bestMonth: monthlyList[0],
      worstMonth: monthlyList[monthlyList.length - 1]
    };
  }, []);

  return (
    <div className="dashboard-grid">
      
      <div className="card col-span-12">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(99,102,241,0.1)', padding: '12px', borderRadius: '12px' }}>
            <Lightbulb color="#6366f1" size={28}/>
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Hallazgos Clave de Negocio</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Resumen automático generado a partir de {formatNumber(insights.totalTransactions)} transacciones registradas.</p>
          </div>
        </div>
        <p style={{ lineHeight: '1.6', fontSize: '15px', color: 'var(--text-main)', padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          Durante todo el periodo analizado, las ventas totales ascienden a <strong>{formatCurrency(insights.totalRevenue)}</strong> equivalentes a <strong>{formatNumber(insights.totalVolume)} unidades</strong> vendidas. El principal motor geográfico de los ingresos es <strong>{insights.topCity.name}</strong>, aportando <strong>{formatCurrency(insights.topCity.revenue)}</strong>, lo que demuestra ser la plaza más fuerte para la empresa.
        </p>
      </div>

      {/* Row of specific Insights */}
      <div className="card col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <MapPin color="#a855f7" size={20}/>
           <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Mercado Líder</span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          La ciudad con el mayor volumen de negocios es <strong>{insights.topCity.name}</strong>, sumando un total de {formatCurrency(insights.topCity.revenue)} en {insights.topCity.count} transacciones exitosas.
        </p>
      </div>

      <div className="card col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <Award color="#f59e0b" size={20}/>
           <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Producto Estrella</span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          El producto más rentable para la compañía es <strong>{insights.topProduct.name}</strong>, el cual generó ingresos por {formatCurrency(insights.topProduct.revenue)}.
        </p>
      </div>

      <div className="card col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <Target color="#10b981" size={20}/>
           <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Categoría Dominante</span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          La categoría "<strong>{insights.topCategory.name}</strong>" es la que más prefieren los clientes, representando un ingreso de {formatCurrency(insights.topCategory.revenue)}.
        </p>
      </div>

      {/* Temporal insights */}
      <div className="card col-span-6" style={{ background: 'rgba(16,185,129,0.02)', border: '1px solid rgba(16,185,129,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
           <div style={{ background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '8px' }}>
             <TrendingUp color="#10b981" size={24}/>
           </div>
           <div>
             <span style={{ fontWeight: 600, color: 'var(--success)', display: 'block' }}>Mejor Mes de Ventas</span>
             <span style={{ fontSize: '18px', fontWeight: 700 }}>{insights.bestMonth.label}</span>
           </div>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Este fue el pico histórico de ingresos, alcanzando <strong>{formatCurrency(insights.bestMonth.revenue)}</strong> en dicho mes. Sugerimos analizar las campañas de marketing o temporalidades de esa época para replicar el éxito.
        </p>
      </div>

      <div className="card col-span-6" style={{ background: 'rgba(239,68,68,0.02)', border: '1px solid rgba(239,68,68,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
           <div style={{ background: 'rgba(239,68,68,0.1)', padding: '8px', borderRadius: '8px' }}>
             <TrendingDown color="#ef4444" size={24}/>
           </div>
           <div>
             <span style={{ fontWeight: 600, color: 'var(--danger)', display: 'block' }}>Mes de Menor Rendimiento</span>
             <span style={{ fontSize: '18px', fontWeight: 700 }}>{insights.worstMonth.label}</span>
           </div>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Durante este mes se experimentó el volumen más bajo, consolidando apenas <strong>{formatCurrency(insights.worstMonth.revenue)}</strong>. Resulta prioritario identificar si respondió a estacionalidad o factores de mercado.
        </p>
      </div>

    </div>
  );
}
