import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import "dotenv/config";

const model = google("gemini-3-flash-preview");

export const classifySentiment = async (text) => {
    const {object} = await generateObject({
        model,
        output: "enum",
        enum: ["positive", "negative", "neutral"],
        prompt: text,
        system:
            `Classify the sentiment of the text as either ` + 
            `positive, negative, or neutral.`,
    });

    return object;
};

const result = await classifySentiment(
    // `I'm not sure how I feel`,
    // `This is terrible`,
    `This is very good`,
);

console.log(result); // neutral