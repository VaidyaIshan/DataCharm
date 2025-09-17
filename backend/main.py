from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import math
from io import StringIO
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_for_json(obj):
    """
    Recursively clean data structure for JSON serialization
    """
    if isinstance(obj, dict):
        return {k: clean_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_for_json(item) for item in obj]
    elif isinstance(obj, (np.integer, int)):
        return int(obj)
    elif isinstance(obj, (np.floating, float)):
        if math.isnan(obj) or math.isinf(obj):
            return None
       
        if abs(obj) > 1e308: 
            return None
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, (np.str_, str)):
        return str(obj)
    elif pd.isna(obj):
        return None
    else:
        return obj

@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...)):
    """
    Accept CSV upload and return first 5 rows as JSON-safe dict.
    """
    try:
       
        content = await file.read()
        df = pd.read_csv(StringIO(content.decode("utf-8")))
        
       
        head_df = df.head(5)
        

        data_dict = head_df.to_dict(orient="records")
        
 
        cleaned_data = clean_for_json(data_dict)
        
       
        try:
            json.dumps(cleaned_data)
        except (ValueError, TypeError) as e:
          
            cleaned_data = []
            for row in data_dict:
                clean_row = {}
                for key, value in row.items():
                    try:
                       
                        json.dumps(value)
                        clean_row[key] = value
                    except (ValueError, TypeError):
                        clean_row[key] = str(value) if value is not None else None
                cleaned_data.append(clean_row)
        
        return JSONResponse(content={"head": cleaned_data})
    
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"error": f"Failed to process CSV: {str(e)}"}
        )