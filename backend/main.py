from fastapi import FastAPI, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import Optional
import operator as op

app = FastAPI()

# Allow frontend (React/Vue/etc.) to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ops = {
    '==': op.eq,
    '!=': op.ne,
    '>': op.gt,
    '<': op.lt,
    '>=': op.ge,
    '<=': op.le
}

# Store uploaded df temporarily (demo only)
dataframes = {}

@app.post("/upload_csv")
async def upload_csv(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    # save in memory (session)
    dataframes[file.filename] = df

    return {
        "filename": file.filename,
        "columns": list(df.columns),
        "preview": df.head(5).to_dict(orient='records'),
        "summary": df.describe(include='all').fillna("").to_dict()
    }

@app.get("/filter")
async def filter_data(
    filename: str,
    column: str,
    operation: str,
    value: str
):
    if filename not in dataframes:
        return {"error": "file not found"}

    df = dataframes[filename]
    column_dtype = str(df[column].dtype)

    # Convert value based on dtype
    if "int" in column_dtype:
        value_casted = int(value)
    elif "float" in column_dtype:
        value_casted = float(value)
    elif "bool" in column_dtype:
        value_casted = value.lower() == "true"
    else:
        value_casted = value

    if operation == "contains":
        filtered = df[df[column].astype(str).str.contains(value_casted, case=False, na=False)]
    else:
        filtered = df[ops[operation](df[column], value_casted)]

    return {
        "rows": len(filtered),
        "filtered_data": filtered.to_dict(orient='records')
    }

@app.get("/visualize")
async def visualize_data(
    filename: str,
    x: str,
    y: Optional[str] = None,
    plot_type: str = "line"
):
    """
    Return JSON data to plot on frontend.
    Frontend can use chart.js or plotly to plot.
    """
    if filename not in dataframes:
        return {"error": "file not found"}
    df = dataframes[filename]

    if plot_type == "histogram":
        hist_values, bin_edges = pd.np.histogram(df[x].dropna(), bins=20)
        return {
            "bins": bin_edges.tolist(),
            "counts": hist_values.tolist()
        }

    # for line/scatter/bar
    if y is None or y not in df.columns:
        return {"error": "y column required for this plot"}

    return {
        "x": df[x].tolist(),
        "y": df[y].tolist()
    }