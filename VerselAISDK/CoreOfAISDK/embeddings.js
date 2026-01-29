// Embedding some words in very simple vector database

import "dotenv/config";
import { google } from "@ai-sdk/google";
import { 
    embed, // Generate an embedding for a single value using an embedding model.
    embedMany, // Embed several values using an embedding model.
    cosineSimilarity, // calculates the cosine similarity between two vectors. A high value (close to 1) indicates that the vectors are very similar, while a low value (close to -1) indicates that they are different.
} from "ai";


const model = google.embedding(
    "text-embedding-004"
);

const values = ["Dog", "Cat", "Car", "Bike"];

const { embeddings } = await embedMany({
    model,
    values,
});

// console.dir(embeddings, {depth: null});

const vectorDatabase = embeddings.map( // mapping through embeddings
    (embedding, index) => ({
        value: values[index], // and storing to the value it represents
        embedding,
    }), // in real world we will store this in a database
);
 

const searchTerm = await embed({
    model,
    // value: "Canine", // dog breed
    // value: "Feline", // cat breed
    value: "tyre", // cat breed
});

const entries = vectorDatabase.map((entry) => {
    return {
        value: entry.value, // return the value
        similarity: cosineSimilarity( // return how similar it is
            entry.embedding, // member of our vectore database
            searchTerm.embedding,
        ),
    };
});

const sortedEntries = entries.sort( // this should sort most similar one to the top
    (a, b) => b.similarity - a.similarity,
);

console.dir(sortedEntries, {depth: null});

// We grabbed list of desired values
// created embedding for each one
// loaded those into vectore database
// we embedded a vector for our searchTerm
// Then we mapped over our vectore database using cosineSimilarity to compare the vectore for the search term for the one in our database