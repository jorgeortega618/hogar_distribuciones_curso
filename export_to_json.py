import pandas as pd
import json

file_path = r'c:\Users\jorge\proyectostech\dashboard_minería_datos_1\data\datos_ventas_ciudad.xlsx'
output_path = r'c:\Users\jorge\proyectostech\dashboard_minería_datos_1\data.json'

try:
    # Read the excel file
    df = pd.read_excel(file_path)
    
    # Convert datetime to string to avoid JSON serialization issues
    if 'Fecha' in df.columns:
        df['Fecha'] = df['Fecha'].dt.strftime('%Y-%m-%d')
        
    # Export to JSON
    # orient='records' creates a list of dictionaries
    df.to_json(output_path, orient='records', force_ascii=False, indent=2)
    print(f"Successfully exported {len(df)} records to {output_path}")

except Exception as e:
    print(f"Error exporting data: {e}")
