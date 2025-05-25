import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GOOGLE_GEMINI_API_KEY is not set in .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export async function POST(request: Request) {
    if (!API_KEY) {
      return NextResponse.json({ error: "Server configuration error: API key missing." }, { status: 500 });
    }
  
    try {
      const { data, userPrompt } = await request.json();
  
      if (!data || !Array.isArray(data) || data.length === 0) {
        return NextResponse.json({ error: "No data provided for analysis." }, { status: 400 });
      }
  
      const dataSample = data.slice(0, Math.min(data.length, 50));
      const dataString = JSON.stringify(dataSample, null, 2);

      const prompt = `Analyze the following dataset. Provide the analysis in a single JSON object with the following structure:
      {
        "summary": "A concise summary of key trends and insights.",
        "dataStory": "A short narrative or data story based on the insights.",
        "suggestedCharts": [
          {
            "chartType": "bar" | "line" | "pie" | "scatter" | "area",
            "title": "A suggested chart title",
            "explanation": "Brief explanation why this chart type is suitable.",
            "dataKey": "Optional: If chart uses one column from input data (e.g., 'Sales'), specify it here.",
            "categoryKey": "Optional: If chart needs a categorical axis (e.g., 'Product'), specify it here.",
            "dataset": [
              // Sample array of numbers for the chart.
              // If the chart needs pairs (e.g., scatter), provide [{x: val, y: val}]
              // For pie, provide numbers for slices.
              // For bar/line, provide numbers for values.
            ],
            "labels": [
              // Optional: Corresponding labels for the dataset (e.g., names for pie slices, categories for bar chart X-axis)
            ]
          }
        ]
      }
  
      Consider the data structure and suggest appropriate charts. If you suggest a chart type like bar or line, ensure the 'dataset' is extracted numerical values and 'labels' are categorical values from the provided sample data. For a pie chart, 'labels' should be the names of the slices and 'dataset' their corresponding values. If a direct numerical dataset isn't obvious, explain.
  
      Here is the data (first ${dataSample.length} rows):
      ${dataString}
  
      ${userPrompt ? `User's specific request: ${userPrompt}` : ''}
  
      Return the response strictly as a single JSON object. Do not include any markdown backticks or extra text outside the JSON.
      `;
  
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      let parsedAiResponse;
      try {
        parsedAiResponse = JSON.parse(text);
      } catch (jsonError) {
        console.error("Failed to parse AI response as JSON directly. Attempting extraction:", text, jsonError);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedAiResponse = JSON.parse(jsonMatch[0]);
          } catch (fallbackJsonError) {
            console.error("Fallback JSON parse failed:", fallbackJsonError);
            return NextResponse.json({ error: "AI response was not valid JSON, and fallback parsing failed." }, { status: 500 });
          }
        } else {
          return NextResponse.json({ error: "AI response was not valid JSON and no JSON object could be extracted." }, { status: 500 });
        }
      }
  
      return NextResponse.json(parsedAiResponse);
  
    } catch (error: any) {
      console.error("Error calling Gemini API:", error.message, error.stack);
      return NextResponse.json({ error: "Failed to get AI response. " + error.message }, { status: 500 });
    }
  }