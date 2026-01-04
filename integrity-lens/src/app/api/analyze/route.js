// app/api/analyze/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Receive the form data from the Frontend
    const formData = await request.formData();
    const file = formData.get("file"); // "file" must match the key used in UploadZone

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. Prepare to send it to Python
    // We need to create a NEW FormData to send to the Python backend
    const backendFormData = new FormData();
    backendFormData.append("file", file); 

    // 3. Call the Python API (FastAPI running on port 8000)
    const pythonResponse = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: backendFormData,
      // Note: Do NOT set Content-Type header manually here, 
      // fetch sets the multipart boundary automatically.
    });

    if (!pythonResponse.ok) {
      throw new Error(`Python API Error: ${pythonResponse.statusText}`);
    }

    // 4. Get the JSON from Python and return it to the Frontend
    const data = await pythonResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json(
      { error: "Failed to analyze image", details: error.message },
      { status: 500 }
    );
  }
}