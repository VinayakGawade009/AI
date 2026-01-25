import "dotenv/config"
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

async function run() {
  // 1. Define the Schema (The Blueprint)
  // We want an array of objects, where each object has a name, symbol, and price.
  const schema = {
    description: "List of stock data",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        companyName: {
          type: SchemaType.STRING,
          description: "Full name of the company",
          nullable: false,
        },
        symbol: {
          type: SchemaType.STRING,
          description: "Stock ticker symbol",
          nullable: false,
        },
        currentPrice: {
          type: SchemaType.NUMBER,
          description: "Approximate price in USD",
          nullable: false,
        },
      },
      required: ["companyName", "symbol", "currentPrice"],
    },
  };


  // 2. Configure the Model to use this Schema
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json", // <--- CRITICAL: Force JSON
      responseSchema: schema,               // <--- CRITICAL: Attach the blueprint
    },
  });

  const prompt = "Give me 3 tech companies popular in India.";

  const result = await model.generateContent(prompt);
  
  // 3. Parse the result (It comes back as a JSON string)
  const jsonResponse = JSON.parse(result.response.text());
  
  // 4. Now you can use it like normal Data!
  console.log("First Company:", jsonResponse[0].companyName); 
  console.log("Full Data:", jsonResponse);
}

run();