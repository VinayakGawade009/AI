import "dotenv/config";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const model = google("gemini-2.5-flash")

export const summarizeText = async (input) => {
    const { text } = await generateText({
        model, 
        messages: [
            {
                role: "system",
                content: 
                    `You are a text summarizer.` +
                    `Summarize the text you receive.`+
                    `Be concise.`+
                    `Return only the summary` +
                    `Do not use the phrase "here is a summary".` +
                    `Highlight relevant phrase in bold.` +
                    `The summary should be two sentences long.`,
            },
            {
                role: "user",
                content: input,
            },
        ],
    });

    return text;
};

const anwser = await summarizeText("Hot swapping model.");

console.log(anwser);