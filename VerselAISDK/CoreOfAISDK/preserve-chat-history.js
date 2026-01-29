import { startServer } from "./server.js"; // Make sure to add .js extension

const messageToSend = [
    {
        role: "user",
        content: "What's the capital of Wales?",
    },
];

// 1. Start the local backend server
await startServer();


// 2. Send the message to your new API
const response = await fetch(
    "http://127.0.0.1:4317/api/get-completions",
    {
        method: "POST",
        body: JSON.stringify(messageToSend),
        headers: {
            "Content-Type": "application/json",
        },
    },
);

// 3. Get the result
// CORRECTION: Removed 'as CoreMessage[]' (That was TypeScript)
const newMessages1 = await response.json();

const allMessages = [
    ...messageToSend,
    ...newMessages1,
];
console.log("AI Answer:", newMessages1[0].content);

const messageToSend2 = {
    role: "user",
    content: "What is the population there?"
};
allMessages.push(messageToSend2);

const response2 = await fetch(
    "http://127.0.0.1:4317/api/get-completions",
    {
        method: "POST",
        body: JSON.stringify(allMessages),
        headers: {
            "Content-Type": "application/json",
        },
    },
);

const newMessages2 = await response2.json()
console.log("AI Answer: ", newMessages2[0].content);
// console.dir(allMessages, {depth: null});