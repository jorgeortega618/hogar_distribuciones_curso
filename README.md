# Dashboard Analítico Ejecutivo: Hogar Distribuciones SAS

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Recharts](https://img.shields.io/badge/Recharts-22b3e4?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

Una aplicación web de arquitectura moderna impulsada por **React** y construida con **Vite**. Diseñada específicamente para transformar bases de datos transaccionales estáticas de ventas (provenientes de Excel) en una experiencia visual, altamente interactiva y enfocada en métricas ejecutivas para la óptima toma de decisiones.

## 🚀 Características Principales

Esta SPA (*Single Page Application*) está orquestada con `react-router-dom` para dividir el análisis en 4 núcleos principales:

- **1. Resumen Ejecutivo (`/`):** Vista de alto nivel o "C-Level" que consolida las métricas financieras (Ingresos, Volumen, Ticket Promedio) apoyadas en gráficos de línea mensuales (Trend) y composición general por ciudad/categoría.
- **2. Análisis por Ciudades (`/ciudades`):** Profundización demográfica y geográfica. Incluye filtros laterales dinámicos, mapa de calor en matriz de doble entrada y gráfica de burbujas (simulación espacial) para identificar dominios del mercado.
- **3. Análisis de Productos (`/productos`):** Una suite de herramientas visuales complejas para el desglose del portafolio:
  - Curva Combinada (Regla de Pareto Top 15 Productos).
  - Scatter Chart (Relación Volumen - Precio Promedio).
  - Treemap de Árbol de Descomposición jerárquica (Categoría > Producto).
- **4. Insights y Hallazgos (`/insights`):** Un motor de resúmenes textuales de los datos. Calcula mediante código las tendencias matemáticas base para generar una narrativa en lenguaje natural ("El mejor producto fue X ganando Y", etc.)

## 🛠️ Stack Tecnológico

**Frontend:**
*   [React 18](https://reactjs.org/) (Hooks, `useMemo`, `useState` nativos para alta eficiencia sin librerías de estados pesadas).
*   [Vite](https://vitejs.dev/) (Rápido empaquetado y HMR).
*   [React Router v6](https://reactrouter.com/) (Enrutamiento dinámico SPA).
*   [Recharts](https://recharts.org/) (Motor de visualización SVG compuesto y fluido).
*   [Lucide React](https://lucide.dev/) (Íconos vectoriales modernos de bajo peso).
*   **Vanilla CSS:** Maquetación sin *frameworks* pesados, garantizando un control granular de UI/UX, utilizando el estándar CSS Modules (variables, layouts de grid).

**Data Processing Pipeline:**
*   [Python / Pandas] - Rutina integrada en `export_to_json.py` para normalizar el archivo bruto `datos_ventas_ciudad.xlsx` a la sintaxis universal `data.json` que React asimila en milisegundos.

## ⚙️ Configuración y Ejecución Local

1.  **Requisitos Previos:**
    *   Node.js (`v16+` recomendado)
    *   NPM
    *   Opcional: Entorno de Python (si deseas re-generar el dataset de origen).

2.  **Instalar las Dependencias de Node:**
    ```bash
    npm install
    ```

3.  **Renovación de Datos (Opcional):**
    Si modificas el archivo raíz `datos_ventas_ciudad.xlsx`, deberás correr el script en Python para actualizar la fuente de React.
    ```bash
    # Requiere tener pandas y openpyxl en tu entorno
    python export_to_json.py
    ```

4.  **Desplegar el Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
    Navegar a `http://localhost:5173/`

## 📦 Despliegue en Producción (Vercel)

El proyecto está listo y empaquetado para subirse en proveedores en la nube estáticos como **Vercel** o Netlify. 

Para construir los binarios altamente optimizados (`dist/`):
```bash
npm run build
```
## 🖌️ Diseño UI/UX
La interfaz usa un diseño de vanguardia y esquema oscuro corporativo ('Glassmorphism' moderado, colores gradados acentuados `#6366f1` / `#a855f7`) con el propósito de crear un entorno ejecutivo cómodo y distinguido.
