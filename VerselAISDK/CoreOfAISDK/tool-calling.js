// simplest tool calling model
import "dotenv/config";
import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import {z} from "zod";

const model = google("gemini-2.5-flash-lite");

const logToConsoleTool = tool({
    description: "Log a message to the console",
    parameters: z.object({
        message: z
            .string()
            .describe("The message to log to the console"),
    }),
    execute: async({ message }) => { // what the tool is going to do -> as its async function it can do anything -> it can write to the database, it can call apis
        console.log("Message from AI: ", message);
    },
});

const logToConsole = async (prompt) => {
    const {steps} = await generateText({
        model,
        prompt,
        system: 
            `Your only role in life is to log ` +
            `messages to the console. ` + 
            `Use the tool provided to log the ` +
            `prompt to the console.`,
        tools: {
            logToConsole: logToConsoleTool,
        },
    });

    // console.dir(steps[0]?.toolCalls, {depth: null});
    console.dir(steps[0]?.toolResults, {depth: null}); // this toolResult can be fed back to the llm to make it more powerful provide it more information especially when run over multiple steps

};

await logToConsole("Hello world!");

// We have created a tool by grabbing tool from ai
// we gave description, zod parameters and a function to execute note by the way the llm itself isn't executing this 
// it's giving us the tool calls that it wants to happen and we execute it
// That's why console log is happening on our console and not on gemini console
// we have passed it to genearateText with system prompt
// and given it a simple prompt to encourage it to use the tool.

// we can debug that by looking in steps and either looking at tool calls or tool results