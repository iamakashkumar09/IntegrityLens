import { NextResponse } from 'next/server';

export async function POST(request) {
  // In a real app, parse the formData:
  // const formData = await request.formData();
  
  // --- REAL PYTHON CONNECTION (Uncomment when ready) ---
  /*
  try {
    const pythonRes = await fetch('http://localhost:8000/predict', {
       method: 'POST',
       body: formData
    });
    const data = await pythonRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Model offline" }, { status: 500 });
  }
  */

  // --- MOCK RESPONSE ---
  // We use this dummy data to make the UI work without the python backend connected yet.
  const mockResponse = {
    score: 42,
    status: "Critical",
    summary: "Structural integrity is compromised. Significant spalling detected in the upper quadrant with associated moisture ingress (algae). Immediate professional inspection recommended.",
    defects: [
      { type: "Spalling", confidence: 94, count: 2 },
      { type: "Algae", confidence: 88, count: 1 },
      { type: "Major Crack", confidence: 76, count: 1 },
    ]
  };

  return NextResponse.json(mockResponse);
}