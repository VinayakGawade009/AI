import "dotenv/config";
import {streamText} from "ai";
import { google } from "@ai-sdk/google";


const model = google("gemini-2.5-flash");

export const answerMyQuestion = async (prompt) => {
    const {textStream} = await streamText({
        model, 
        prompt,
    });

    for await (const text of textStream) {
        process.stdout.write(text);
    }

    return textStream;
};

await answerMyQuestion(
    "what is the color of the sum?"
);