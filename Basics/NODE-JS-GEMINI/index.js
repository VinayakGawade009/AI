// import "dotenv/config"; you can add script in package.json because it's now inbuilt in Nodejs

// 1. Setup the Client
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    // 2. the brains
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

    // 3. Define the Prompt (The Input)
    const prompt = "Write a sonnet about a programmers life, but also make it rhyme.";

    // 4. Call the api
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        const text = response.text();

        console.log(text);
    } catch (error) {
        console.error("Error connecting to Gemini:", error.message);
    }
}

run();