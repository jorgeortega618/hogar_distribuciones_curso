import pandas as pd
import sys
import io

file_path = r'c:\Users\jorge\proyectostech\dashboard_minería_datos_1\data\datos_ventas_ciudad.xlsx'

try:
    df = pd.read_excel(file_path)
    
    with open('data_summary.txt', 'w', encoding='utf-8') as f:
        f.write("=========================================\n")
        f.write("DATASET INFO\n")
        f.write("=========================================\n")
        
        buffer = io.StringIO()
        df.info(buf=buffer)
        f.write(buffer.getvalue())
        
        f.write("\n=========================================\n")
        f.write("MISSING VALUES\n")
        f.write("=========================================\n")
        f.write(str(df.isnull().sum()) + "\n")
        
        f.write("\n=========================================\n")
        f.write("DESCRIPTIVE STATISTICS\n")
        f.write("=========================================\n")
        f.write(str(df.describe(include='all')) + "\n")
        
        f.write("\n=========================================\n")
        f.write("FIRST 5 ROWS\n")
        f.write("=========================================\n")
        f.write(str(df.head(5)) + "\n")
        
    print("Successfully wrote summary to data_summary.txt")

except Exception as e:
    print(f"Error reading or processing the file: {e}")
