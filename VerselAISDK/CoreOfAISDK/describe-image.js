import "dotenv/config";
import { google } from "@ai-sdk/google";
import { readFileSync } from "fs";
import { generateText } from "ai";

const model = google("gemini-3-flash-preview");

const systemPrompt = 
    `You will receive an image. ` +
    `Please create an alt text for the image. ` +
    `Be concise. ` + 
    `Use adjectives only when necessary. ` +
    `Do not pass 160 characters. ` + 
    `Use simple language. `;

export const describeImage = async (imageURL) => {
    const { text } = await generateText({
        model,
        system: systemPrompt,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "image",
                        image: new URL(imageURL),
                    },
                ],
            },
        ],
    });

    return text;
};

const description = await describeImage(
     "https://i.pinimg.com/736x/9f/0a/5b/9f0a5bae546d495995ff730ae8ac4709.jpg"
);

console.log(description);