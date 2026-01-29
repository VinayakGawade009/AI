import dotenv from "dotenv"
import {generateText} from "ai";
import { google } from "@ai-sdk/google";

dotenv.config();

const model = google("gemini-2.5-flash");

export const answerMyQuestion = async (prompt) => {
    const {text} = await generateText({
        model, 
        prompt,
    });

    return text;
};

const answer = await answerMyQuestion(
    "what is the chemical formula for dihydrogen monoxide?"
);

console.log(answer);