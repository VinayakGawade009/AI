import { generateObject } from "ai";
import {z} from "zod";
import "dotenv/config";
import { google } from "@ai-sdk/google";
import { readFileSync } from "fs";

const model = google("gemini-3-flash-preview");

const schema = z.object({
    total: z
        .number()
        .describe("The total amount of the invoice."),
    currency: z
        .string()
        .describe("The currency of the total amount."),
    invoiceNumber: z
        .string()
        .describe("The invoice number."),
    companyAddress: z
        .string()
        .describe(
            "The address of the company or person issuing the invoice.",
        ),
    companyName: z
        .string()
        .describe(
            "The name of the company issuing the invoice.",
        ),
    invoiceAddress: z
        .string()
        .describe(
            "The address of the company or person receiving the invoice."
        )
})
.describe("The extracted data from the invoice.");

export const extractDataFromInvoice = async (invoicePath) => {
    const {object} = await generateObject({
        model,
        system:
            `You will receive an invoice. ` +
            `Please extract the data from the invoice.`,
        schema,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "file",
                        data: readFileSync(invoicePath),
                        mediaType: "application/pdf"
                    },
                ],
            },
        ],
    });

    return object;
};

const result = await extractDataFromInvoice(
    "./invoice1.pdf"
);

console.dir(result, {depth: null});