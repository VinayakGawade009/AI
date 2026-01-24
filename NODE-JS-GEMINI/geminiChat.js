import readline from "readline"; // The readline module is a built-in core module in Node.js -> A common use case is creating an interactive command-line interface -> allow to write in terminal -> have conversation inside my terminal
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" }); // its text only model

    const chat = model.startChat({
        history: [], // start with an empty history -> we can also pass previous conversation history
        generationConfig: {
            maxOutputTokens: 500, // how long do we want output of gemini to be
        },
    });

    async function askAndRespond() {
        rl.question("You: ", async (msg) => {
            if (msg.toLowerCase() === "exit") {
                rl.close();
            } else {
                const result = await chat.sendMessage(msg); // add in history and give output
                const response = await result.response;
                const text = await response.text();
                console.log("AI: ", text);
                askAndRespond();
            }
        });
    }

    askAndRespond(); // Start the conversation loop
}

run();

// In this we can notice that we have to wait after sending model a text for reply
// it takes some time to think and reply
// can we improve that -> yes -> use streaming for faster interactions -> already built into gemini sdk
// Streaming -> as soon as model has something to say it will give you till it stops