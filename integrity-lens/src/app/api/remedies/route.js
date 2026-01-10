import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // 1. API KEY
        const apiKey = "AIzaSyC1ZuEZavuWNHC0Cp1W5S9vMFrBzs58pCI";

        const body = await req.json();
        const { defectType, score } = body;

        console.log(` Remedy Request (Gemini 2.5): ${defectType}`);

        // 2. USE GEMINI 2.5 FLASH
        // We use the 'v1beta' endpoint which supports the newer 2.5 family
        const modelId = "gemini-2.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Act as a structural engineer. The wall defect is "${defectType}" with severity ${score}. Provide a 3-sentence repair guide. Plain text only.`
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(` Gemini 2.5 Error:`, errorText);
            throw new Error(`Google Refused: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const remedyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No remedy generated.";

        console.log("Success! Gemini 2.5 remedy sent.");

        return NextResponse.json({ remedies: remedyText });

    } catch (error) {
        console.error(" Server Error:", error.message);
        return NextResponse.json(
            { error: "Failed to generate remedy.", details: error.message },
            { status: 500 }
        );
    }
}