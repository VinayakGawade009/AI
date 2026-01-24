import * as fs from "fs"; // file system -> read files form computer ->Large Language Models (LLMs) output text but cannot directly perform actions in the real world. The fs module serves as a tool, or an "arm" of the agent, allowing it to perform concrete operations in the host system. 

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) { // path of file, type of file
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

async function run() {
    // 2. the brains
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // its primarily multimodel -> text + image

    // 3. Define the Prompt (The Input)
    const prompt = "What is the difference between the two images? Understand whats written on the paper.";

    // const imageParts = [fileToGenerativePart("pythagoras.png", "image/png")];
    const imageParts = [fileToGenerativePart("pen.png", "image/png"), fileToGenerativePart("pen-and-page.png", "image/png")];


    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;

    const text = response.text();

    console.log(text);

}

run();