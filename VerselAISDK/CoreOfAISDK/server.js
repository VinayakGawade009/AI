import "dotenv/config";
import { google } from "@ai-sdk/google";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { once } from "node:events";
import { generateText } from "ai";

// CORRECTION: The model is 1.5, not 2.5
const model = google("gemini-2.5-flash");

export const startServer = async () => {
    const app = new Hono();

    app.post("/api/get-completions", async (ctx) => {
        const messages = await ctx.req.json();

        const result = await generateText({
            model,
            messages,
        });

        // This returns the full list of messages (User + AI Response)
        return ctx.json(result.response.messages);
    });

    const server = serve({
        fetch: app.fetch,
        port: 4317,
        hostname: "0.0.0.0",
    });

    // Wait for the "listening" event to fire so we don't crash
    await once(server, "listening");

    return server;
};