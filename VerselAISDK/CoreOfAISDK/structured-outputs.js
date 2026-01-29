import "dotenv/config";
import {z} from "zod";
import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
import { streamObject } from "ai";

const model = google("gemini-2.5-flash");

const schema = z.object({
    recipe: z.object({
        name: z.string().describe("The title of the recipe"),
        ingredients: z.array(
            z.object({
                name: z.string(),
                amount: z.string(),
            }),
        ).describe("The ingredients needed for the recipe"),
        steps: z.array(z.string()).describe("The steps to make the recipe"),
    }),
});

// export const createRecipe = async (prompt) => {
//     const {object} = await generateObject({
//         model,
//         schema,
//         prompt,
//         schemaName: "Recipe",
//         // schemaDescription: "",
//         system: 
//             `You are helping a user create a recipe.` + 
//             `Use British English variants of ingredient names,` +
//             `like Coriander over Cilantro.`,
//     });

//     return object.recipe;
// };

export const createRecipe = async (prompt) => {
    const result = await streamObject({
        model,
        prompt,
        schemaName: "Recipe",
        schema,
        // schemaDescription: "",
        system: 
            `You are helping a user create a recipe.` + 
            `Use British English variants of ingredient names,` +
            `like Coriander over Cilantro.`,
    });

    for await (const obj of result.partialObjectStream) {
        console.clear();
        console.dir(obj, { depth: null, colors: true });
    }
    
    const finalObject = await result.object;
    return finalObject.recipe;
};

const recipe = await createRecipe(
    "How to make baba ganoush?",
);

// console.log(recipe);