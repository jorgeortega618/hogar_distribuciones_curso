import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Users, Settings, LogOut, Bell, Lightbulb } from 'lucide-react';

// Pages
import PageExecutive from './pages/PageExecutive';
import PageCity from './pages/PageCity';
import PageProduct from './pages/PageProduct';
import PageInsights from './pages/PageInsights';
import { getCities } from './utils/dataProcessor';

export default function App() {
  const [selectedCityHeader, setSelectedCityHeader] = React.useState('Todas');
  const cities = getCities();

  // We move the global "City" filter specifically to the Executive Page since City and Product pages 
  // explicitly define "Filtros a la izquierda". So the top-right filter only affects the Executive page.
  
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="brand-container">
            <div className="brand-icon">
              <LayoutDashboard size={20} color="white" />
            </div>
            <span className="brand-name">Hogar Distribuciones SAS</span>
          </div>
          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <Routes>
                {/* Only show top filter when on Executive view (which is global) */}
                <Route path="/" element={
                  <select 
                    className="filter-select"
                    value={selectedCityHeader}
                    onChange={e => setSelectedCityHeader(e.target.value)}
                  >
                    {cities.map(c => (
                      <option key={c} value={c}>
                        {c === 'Todas' ? 'Todas las ciudades' : c}
                      </option>
                    ))}
                  </select>
                } />
              </Routes>
            </div>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={20} color="#fff" />
            </div>
            <img 
               src="/assets/images_public/foto_perfil_jorge_ortega_2026.png" 
               alt="User Profile" 
               style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer', objectFit: 'cover' }}
            />
          </div>
        </header>

        <div className="main-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <nav className="nav-menu">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} title="Analítica (Resumen)">
                <LayoutDashboard size={22} />
              </NavLink>
              <NavLink to="/insights" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} title="Insights y Hallazgos Clave">
                <Lightbulb size={22} />
              </NavLink>
              <NavLink to="/ciudades" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} title="Análisis de Ciudades">
                <BarChart3 size={22} />
              </NavLink>
              <NavLink to="/productos" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} title="Análisis de Productos">
                <Users size={22} />
              </NavLink>
              <div className="nav-item" title="Configuración"><Settings size={22} /></div>
            </nav>
            <div style={{ marginTop: 'auto', padding: '0' }}>
              <div className="nav-item" title="Cerrar sesión"><LogOut size={22} /></div>
            </div>
          </aside>

          {/* Main Content Areas map to Routes */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <>
                  <header className="header" style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px' }}>Resumen Ejecutivo</h1>
                  </header>
                  <PageExecutive selectedCity={selectedCityHeader} />
                </>
              } />
              <Route path="/insights" element={
                <>
                  <header className="header" style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px' }}>Insights y Diagnóstico</h1>
                  </header>
                  <PageInsights />
                </>
              } />
              <Route path="/ciudades" element={
                <>
                  <header className="header" style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px' }}>Análisis por Ciudades</h1>
                  </header>
                  <PageCity />
                </>
              } />
              <Route path="/productos" element={
                 <>
                 <header className="header" style={{ marginBottom: '24px' }}>
                   <h1 style={{ fontSize: '24px' }}>Análisis de Productos</h1>
                 </header>
                 <PageProduct />
               </>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
