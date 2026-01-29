import 'dotenv/config'; 
import { generateObject, tool } from "ai"; // <--- CHANGED: generateObject instead of generateText
import { google } from "@ai-sdk/google";
import { z } from "zod";
import axios from 'axios';

// 1. The Output Schema (The "Contract")
// We want the AI to give us a pure JSON object at the end.
const GetWeatherResultSchema = z.object({
  city: z.string().describe('name of the city'),
  degree_c: z.number().describe('temperature in celsius'),
  condition: z.string().optional().describe('weather condition'),
});

async function main() {
  try {
    const result = await generateObject({
      model: google("gemini-2.5-flash"),  // <--- The magic happens here -> the Vercel SDK automatically looks for a specific environment variable named GOOGLE_GENERATIVE_AI_API_KEY in your system. It does this to save you from writing boilerplate code.z
      prompt: "What is the weather of Pune?",
      
      // 2. Enforce the Schema
      schema: GetWeatherResultSchema,
      
      // 3. The Real Tools
      tools: {
        getWeather: tool({
          description: 'returns current weather for a city',
          parameters: z.object({
            city: z.string().describe('name of the city'),
          }),
          // --- REAL AXIOS LOGIC ---
          execute: async ({ city }) => {
            console.log(`[System] 🌍 Fetching real data for: ${city}...`);
            try {
              // We use the same URL format you had
              const url = `https://wttr.in/${city}?format=%C+%t`; 
              const response = await axios.get(url);
              
              // wttr.in returns text like: "Haze +31°C"
              // We return this raw text to the AI. 
              // The AI will then READ this text and extract the numbers for the JSON schema.
              return response.data; 
            } catch (error) {
              console.error("API Error:", error.message);
              return "Error fetching weather data.";
            }
          },
        }),
      },
      
      maxSteps: 5, // Allow the agent to think -> call -> read -> answer
    });

    // 4. Final Output
    console.log("\n--- FINAL JSON OUTPUT ---");
    console.log(result.object);
    console.log(`\nDegrees only: ${result.object.degree_c}°C`);

  } catch (error) {
    // This catches the API Key error if it happens again
    console.error("\n❌ CRITICAL ERROR:", error.message);
    if (error.message.includes("API key")) {
        console.error("👉 Tip: Check your .env file. Variable must be named 'GOOGLE_GENERATIVE_AI_API_KEY'");
    }
  }
}

main();key