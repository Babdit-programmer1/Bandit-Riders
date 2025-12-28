
import { GoogleGenAI, Type } from "@google/genai";
import { Delivery, BookingEstimate } from "../types";
import { calculateFare } from "../utils/fareCalculator";

export const getAIInsights = async (deliveries: Delivery[]) => {
  // Always initialize GoogleGenAI inside the function to use the most recent API key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `Analyze these dispatch deliveries and provide 3 brief, actionable insights for the rider. Focus on efficiency, safety, and fuel optimization. Deliveries: ${JSON.stringify(deliveries)}`;

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

    // response.text is a property, not a method
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [
      { title: "Traffic Warning", content: "Heavy congestion reported on Maple Avenue.", category: "efficiency" },
      { title: "Safety First", content: "Light rain expected in 20 minutes.", category: "safety" },
      { title: "Earning Opportunity", content: "High demand detected in the Downtown area.", category: "earnings" }
    ];
  }
};

export const getBookingEstimate = async (pickup: string, dropoff: string, items: string): Promise<BookingEstimate> => {
  // Always initialize GoogleGenAI inside the function to use the most recent API key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `Act as a logistics engine. Estimate distance (km), duration (mins), and price ($) for a delivery from "${pickup}" to "${dropoff}" for items: "${items}". Return JSON.`;

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

    // response.text is a property, not a method
    const result = JSON.parse(response.text || '{}');
    
    // Extract numeric values to compute the required breakdown
    const distanceVal = parseFloat(result.distance) || 5;
    const durationVal = parseInt(result.duration) || 20;

    return {
      ...result,
      breakdown: calculateFare(distanceVal, durationVal)
    };
  } catch (error) {
    const defaultDist = 4.2;
    const defaultDur = 18;
    // reasoning is now part of the BookingEstimate interface in types.ts
    return {
      price: 15.50,
      distance: "4.2 km",
      duration: "18 mins",
      reasoning: "Standard base rate for inner city delivery.",
      breakdown: calculateFare(defaultDist, defaultDur)
    };
  }
};
