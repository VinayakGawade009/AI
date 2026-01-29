import readline from "readline"; // The readline module is a built-in core module in Node.js -> A common use case is creating an interactive command-line interface -> allow to write in terminal -> have conversation inside my terminal
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let isAwaitingResponse = false; // Flag to indicate if we're waiting for a response
async function run() {
    const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" }); // its text only model

    const chat = model.startChat({
        history: [], // start with an empty history -> we can also pass previous conversation history
        generationConfig: {
            maxOutputTokens: 500, // how long do we want output of gemini to be
        },
    });

    // Function to get user input and send it to the model using streaming
    async function askAndRespond() {
        if (!isAwaitingResponse) {
            // Check if not currently awaiting a response
            rl.question("You: ", async (msg) => {
                if (msg.toLowerCase() === "exit") {
                    rl.close();
                } else {
                    isAwaitingResponse = true; // Set flag to true as we start receiving the stream
                    try {
                        const result = await chat.sendMessageStream(msg); // multitern 
                        let text = "";
                        process.stdout.write("AI: ");
                        for await (const chunk of result.stream) {
                            const chunkText = await chunk.text(); // Assuming chunk.text() returns a Promise
                            process.stdout.write(chunkText);
                            text += chunkText;
                        }
                        isAwaitingResponse = false; // Reset flag after stream is complete
                        askAndRespond(); // Ready for the next input
                    } catch (error) {
                        console.error("Error: ", error);
                        isAwaitingResponse = false; // Ensure flag is reset on error too
                    }
                }
            });
        } else {
            console.log("Please wait for the current response to complete.");
        }
    }

    askAndRespond(); // Start the conversation loop
}

run();

// Streaming -> as soon as model has something to say it will give you till it stops