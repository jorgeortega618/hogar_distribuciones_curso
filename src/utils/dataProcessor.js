import rawData from '../../data.json';

// Enrich dataset with calculated fields (like Category derived from Description)
export const processedData = rawData.map(item => {
  const desc = item.Descripcion.toLowerCase();
  
  let category = 'Otros';
  if (desc.includes('mantel')) {
    category = 'Mantelería';
  } else if (desc.includes('almohada') || desc.includes('sábana') || desc.includes('frazada')) {
    category = 'Ropa de Cama';
  } else if (desc.includes('cuchillo') || desc.includes('tenedor') || desc.includes('cuchara')) {
    category = 'Cubertería';
  } else if (desc.includes('tazón') || desc.includes('plato')) {
    category = 'Vajilla';
  } else {
    // Fallback if there's any other unforeseen item
    category = item.Descripcion.split(' ')[0] || 'Accesorios';
  }

  return {
    ...item,
    Categoria: category
  };
});

// Utility to get unique cities
export const getCities = () => ['Todas', ...new Set(processedData.map(item => item.Ciudad))].sort();

// General Number Formatters
export const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
export const formatNumber = (val) => new Intl.NumberFormat('es-CO').format(val);
