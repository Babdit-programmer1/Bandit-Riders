
import { GoogleGenAI, Type } from "@google/genai";
import { Delivery, BookingEstimate } from "../types";
import { calculateFare } from "../utils/fareCalculator";

export const getAIInsights = async (deliveries: Delivery[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `Analyze these professional dispatch records for a logistics command center. Provide 3 brief, high-level tactical observations regarding efficiency, risk, and route density. Avoid casual AI conversational filler. Deliveries: ${JSON.stringify(deliveries)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING, description: 'One of: efficiency, safety, earnings' }
            },
            required: ['title', 'content', 'category']
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [
      { title: "Grid Update", content: "Main arteries show standard congestion. No major diversions required.", category: "efficiency" },
      { title: "Environmental Log", content: "Visibility maintains optimal levels for high-speed transit.", category: "safety" },
      { title: "Demand Analysis", category: "earnings", content: "Peak session identified in central commercial zones." }
    ];
  }
};

export const getBookingEstimate = async (pickup: string, dropoff: string, items: string): Promise<BookingEstimate> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `Act as a logistics system telemetry engine. Calculate distance (km) and duration (mins) for a delivery from "${pickup}" to "${dropoff}" for items: "${items}". Provide a formal 'reasoning' string explaining the route variables (e.g. traffic load, route density, cargo handling requirements) in a professional logistics tone. No casual filler. Return JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.NUMBER },
            distance: { type: Type.STRING },
            duration: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ['price', 'distance', 'duration', 'reasoning']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    const distanceVal = parseFloat(result.distance) || 5;
    const durationVal = parseInt(result.duration) || 20;

    return {
      ...result,
      breakdown: calculateFare(distanceVal, durationVal)
    };
  } catch (error) {
    const defaultDist = 4.2;
    const defaultDur = 18;
    return {
      price: 1550,
      distance: "4.2 km",
      duration: "18 mins",
      reasoning: "Standard urban transit parameters applied to this route segment.",
      breakdown: calculateFare(defaultDist, defaultDur)
    };
  }
};
