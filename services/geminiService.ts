import { GoogleGenAI } from "@google/genai";
import type { PoliticalViewpoint, GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePostContent(url: string, viewpoint: PoliticalViewpoint): Promise<{ text: string; shortText: string; sources: GroundingSource[] }> {
    const prompt = `Based on the content of the article at the URL "${url}", please perform the following task:
Act as a person who strongly identifies with the ${viewpoint.name} political ideology. This ideology is defined as: "${viewpoint.description}".

Generate two versions of a social media reaction post:
1.  A full post that is 250 words or less. It should clearly reflect the ${viewpoint.name} perspective, use a passionate and convincing tone, and be structured for high engagement on platforms like Facebook or Reddit.
2.  A short post that is 280 characters or less, summarizing the main point of the full post for platforms like X or Bluesky.

Do not break character or mention that you are an AI.

Please format your response EXACTLY as follows, with no extra text before or after:
FULL POST:
[Your full post here]
---
SHORT POST:
[Your short post here]`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error("API did not return any text. The content may be blocked.");
        }

        let fullPost: string;
        let shortPost: string;

        const separator = '---';
        const separatorIndex = text.indexOf(separator);

        if (separatorIndex !== -1 && text.includes('FULL POST:') && text.includes('SHORT POST:')) {
            const fullPart = text.substring(0, separatorIndex);
            const shortPart = text.substring(separatorIndex + separator.length);
            fullPost = fullPart.replace('FULL POST:', '').trim();
            shortPost = shortPart.replace('SHORT POST:', '').trim();
        } else {
            console.warn("Could not properly parse LLM response for full/short post. Using fallback to generate short post.");
            fullPost = text; // Assume the whole response is the full post
            
            try {
                const summarizationResponse = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Summarize the following text to be 280 characters or less for posting on social media like X or Bluesky. Output only the summarized text, without any introductory phrases:\n\n"${fullPost}"`,
                });
                shortPost = summarizationResponse.text;
                if (!shortPost) {
                     // If summarization fails, truncate as a final fallback.
                    shortPost = fullPost.length > 280 ? fullPost.substring(0, 277) + '...' : fullPost;
                }
            } catch (summarizeError) {
                console.error("Error generating summarized post:", summarizeError);
                // If summarization fails, truncate as a final fallback.
                shortPost = fullPost.length > 280 ? fullPost.substring(0, 277) + '...' : fullPost;
            }
        }
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sources: GroundingSource[] = groundingChunks?.map((chunk: any) => ({
            uri: chunk.web.uri,
            title: chunk.web.title,
        })).filter((source: GroundingSource) => source.uri && source.title) ?? [];

        // Deduplicate sources
        const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());
        
        return { text: fullPost, shortText: shortPost, sources: uniqueSources };

    } catch (error) {
        console.error("Error generating post content:", error);
        throw new Error("Failed to generate post content from the AI model.");
    }
}

export async function generatePostImage(postText: string): Promise<string> {
    // Step 1: Generate a safer, more abstract prompt for the image generator to avoid safety blocks.
    const imagePromptGeneratorPrompt = `Summarize the following text into a short, descriptive, and neutral prompt for an AI image generator. The prompt should describe a symbolic or metaphorical image representing the core idea of the text, avoiding any controversial, political, or sensitive terms. Focus only on visual elements that can be depicted in a photorealistic style. The prompt should be just a few words. Do not include any text in your response.

Text: "${postText}"`;

    let imagePrompt: string;
    try {
        const promptResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: imagePromptGeneratorPrompt,
        });
        imagePrompt = promptResponse.text;
        if (!imagePrompt) {
            // If the prompt generation fails, fallback to a generic, safe prompt
            imagePrompt = "An abstract image representing diverse opinions and discussion.";
        }
    } catch (error) {
        console.error("Error generating sanitized image prompt:", error);
        // Fallback to a generic prompt if this step fails
        imagePrompt = "An abstract image representing diverse opinions and discussion.";
    }
    
    // Step 2: Generate the image using the new, safer prompt.
    const finalImageGenerationPrompt = `Create a visually striking, symbolic, and photorealistic image based on the following description. Avoid using any text or words in the image itself.

Description: "${imagePrompt}"`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalImageGenerationPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        const base64ImageBytes: string | undefined = response.generatedImages?.[0]?.image?.imageBytes;

        if (!base64ImageBytes) {
            throw new Error("API did not return any image data.");
        }

        return `data:image/jpeg;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error("Error generating post image:", error);
        throw new Error("Failed to generate an image from the AI model.");
    }
}