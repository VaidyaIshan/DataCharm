"use client";
import { useState } from "react";

export default function CsvUploader() {
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload-csv/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error(await res.text());
      return;
    }

    const json = await res.json();
    const rows = json.head;

    if (rows.length > 0) {
      setColumns(Object.keys(rows[0]));
    }

    setData(rows);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <label className="block mb-3 font-medium text-white">
        Upload CSV File
      </label>
      <input
        type="file"
        accept=".csv"
        onChange={handleUpload}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-lime-500 file:text-black
                   hover:file:bg-indigo-100"
      />

      {data && (
        
        <div className="mt-10">
 <h1 className="font-bold text-4xl text-white">Data Overview</h1>           <div className="overflow-x-auto mt-6 border rounded-lg shadow-sm">
         
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-600">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-black divide-y divide-gray-100">
              {data.map((row, i) => (
                <tr key={i} className=" text-black">
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-2 text-sm text-white  whitespace-nowrap"
                    >
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
       
      )}
    </div>
  );
}