import { GoogleGenAI } from "@google/genai";
import type { PoliticalViewpoint, GroundingSource, GenerateContentResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches the first article URL from a given RSS feed URL.
 * @param rssFeedUrl The URL of the RSS feed.
 * @returns The URL of the top story.
 */
export async function getTopStoryUrl(rssFeedUrl: string): Promise<string> {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(rssFeedUrl)}`;
    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        
        // Look for the first <link> or <guid> inside an <item>
        const firstItem = xmlDoc.querySelector('item');
        if (!firstItem) {
            // Fallback for Atom feeds
            const firstEntry = xmlDoc.querySelector('entry');
            if(firstEntry) {
                 const link = firstEntry.querySelector('link')?.getAttribute('href');
                 if (link) return link;
            }
            throw new Error("No items found in the RSS feed.");
        }
        
        const link = firstItem.querySelector('link')?.textContent;
        const guid = firstItem.querySelector('guid')?.textContent;

        const storyUrl = link || guid;

        if (!storyUrl) {
            throw new Error("Could not find a URL in the first RSS item.");
        }
        return storyUrl;

    } catch (error) {
        console.error("Error fetching or parsing RSS feed:", error);
        throw new Error("Could not retrieve the top story from the selected source.");
    }
}


/**
 * Attempts to fetch and parse content from a URL using a variety of direct methods
 * before falling back to a general search.
 * @param url The URL to fetch content from.
 * @returns The parsed content as a string, or null if all methods fail.
 */
async function fetchAndParseURLContent(url: string): Promise<string | null> {
    try {
        const cleanedUrl = new URL(url);
        // Clean URL by removing common tracking parameters
        const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'igshid', 'igsh', 'mc_cid', 'mc_eid'];
        const searchParams = cleanedUrl.searchParams;
        paramsToRemove.forEach(param => searchParams.delete(param));
        const cleanUrlString = cleanedUrl.toString().replace(/\?$/, '').replace(/\/$/, ''); // remove trailing slash and question mark

        const hostname = cleanedUrl.hostname.replace('www.', '');

        // 1. Direct API for Reddit
        if (hostname === 'reddit.com') {
            const jsonUrl = `${cleanUrlString}.json`;
            const response = await fetch(jsonUrl, { headers: { 'User-agent': 'Political-Persona-Bot/1.0' } });
            if (!response.ok) return null;
            const data = await response.json();
            const post = data[0]?.data?.children?.[0]?.data;
            if (!post) return null;
            const content = post.selftext ? `\n\nContent: ${post.selftext}` : '';
            return `Title: ${post.title}${content}`;
        }
        
        // 2. Direct API for Bluesky
        if (hostname === 'bsky.app') {
            const parts = cleanedUrl.pathname.split('/');
            if (parts.length < 5 || parts[1] !== 'profile' || parts[3] !== 'post') return null;
            const handle = parts[2];
            const rkey = parts[4];

            const resolveResponse = await fetch(`https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`);
            if (!resolveResponse.ok) return null;
            const { did } = await resolveResponse.json();
            if (!did) return null;

            const postUri = `at://${did}/app.bsky.feed.post/${rkey}`;
            const threadResponse = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(postUri)}`);
            if (!threadResponse.ok) return null;
            const threadData = await threadResponse.json();
            const postText = threadData?.thread?.post?.record?.text;
            return postText || null;
        }

        // 3. Specialized proxies for X/Instagram (via CORS proxy)
        const specializedProxies: { [key: string]: string[] } = {
            'x.com': ['fxtwitter.com', 'vxtwitter.com'],
            'twitter.com': ['fxtwitter.com', 'vxtwitter.com'],
            'instagram.com': ['ddinstagram.com', 'instafix.app'] 
        };

        for (const domain in specializedProxies) {
            if (hostname.includes(domain)) {
                for (const proxyHost of specializedProxies[domain]) {
                    try {
                        const proxyUrl = `https://${proxyHost}${cleanedUrl.pathname}`;
                        const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(proxyUrl)}`);
                        if (!response.ok) continue; // Try next proxy if this one fails
                        const html = await response.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || doc.querySelector('meta[name="description"]')?.getAttribute('content');
                        if (description) return description; // Success
                    } catch (e) {
                        console.warn(`Proxy ${proxyHost} failed for ${url}. Trying next one.`, e);
                        continue; 
                    }
                }
            }
        }
        
        return null; // All automated direct methods failed
    } catch (error) {
        console.error("Error during automated content fetch:", error);
        return null;
    }
}


export async function generatePostContent(
    url: string, 
    viewpoint: PoliticalViewpoint, 
    context?: { postText?: string; postImageBase64?: string }
): Promise<GenerateContentResult> {
    
    const systemInstruction = `You are a political commentator AI. Your sole purpose is to generate social media reaction posts from a specific political viewpoint.

You will be given a political ideology and content to react to.

Your persona is that of a person who deeply holds the provided political beliefs. You must adopt their mindset, writing style, and rhetorical devices completely.

**CRUCIAL RULES FOR ALL RESPONSES:**
1.  **NEVER break character.** You are not an AI. You are a person with strong opinions.
2.  **DO NOT state your political ideology.** Embody the viewpoint through your words and tone, don't label it (e.g., avoid "As a liberal...").
3.  **React naturally.** Do not describe your process or mention that you are analyzing content, a URL, or 'search results.' Your reaction should be about the topic itself.
4.  **Strictly adhere to the output format.** Your entire output must ONLY be the formatted post. Do not add any extra explanations or text.`;

    const outputFormat = `Output Format (Strictly adhere to this):
LONGFORM REACTION:
[Your full post here, 250 words or less]
---
SHORTFORM REACTION:
[Your short post here, 280 characters or less]`;

    let contents: any;
    const sources: GroundingSource[] = [];
    const config: any = {
        systemInstruction,
    };
    
    const hasUserContext = context && (context.postText || context.postImageBase64);

    if (hasUserContext) {
        const parts = [];
        const postText = context?.postText;
        
        parts.push({ text: `Content to React To (from URL: ${url}):` });
        
        if (postText) {
            parts.push({ text: `Post Text: "${postText}"` });
        }
        if (context?.postImageBase64) {
            const urlParts = context.postImageBase64.split(',');
            if (urlParts.length !== 2) throw new Error("Invalid image data URL format provided.");
            
            const mimeTypeMatch = urlParts[0].match(/data:(.*);base64/);
            if (!mimeTypeMatch || mimeTypeMatch.length < 2) throw new Error("Could not extract MIME type from image data URL.");
            
            const mimeType = mimeTypeMatch[1];
            const base64Data = urlParts[1];

            parts.push({
                inlineData: {
                    mimeType,
                    data: base64Data,
                },
            });
        }
        
        const contextTaskPrompt = `Political Viewpoint Persona: ${viewpoint.name}
Ideology Description: "${viewpoint.description}"

Task: Generate two versions of a passionate and convincing reaction post based on the provided context.

${outputFormat}`;
        
        parts.push({ text: contextTaskPrompt });
        contents = { parts };
       
    } else {
        const scrapedContent = await fetchAndParseURLContent(url);
        
        if (scrapedContent) {
            const directTaskPrompt = `Political Viewpoint Persona: ${viewpoint.name}
Ideology Description: "${viewpoint.description}"

Task: Generate two versions of a passionate and convincing reaction post based on the following content.

Content from URL (${url}):
"""
${scrapedContent}
"""

${outputFormat}`;
            contents = directTaskPrompt;
        } else {
            const researchTaskPrompt = `Political Viewpoint Persona: ${viewpoint.name}
Ideology Description: "${viewpoint.description}"

Task: Research the topic and themes of the content at the URL provided below. Synthesize information from multiple sources to form a comprehensive understanding. Then, using that understanding, generate a passionate and convincing reaction post from the specified political viewpoint.

URL: ${url}

${outputFormat}`;
            contents = researchTaskPrompt;
            config.tools = [{ googleSearch: {} }];
        }
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config,
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        if (!hasUserContext && config.tools && (!groundingChunks || groundingChunks.length === 0)) {
             const isSocial = /instagram\.com|twitter\.com|x\.com|facebook\.com|tiktok\.com|threads\.net|bsky\.app|linkedin\.com/i.test(url);
             if (isSocial) {
                 return { text: '', shortText: '', sources: [], requiresContext: true };
             }
        }
        
        const text = response.text;
        if (!text) {
            throw new Error("API did not return any text. The content may be blocked.");
        }

        let fullPost: string;
        let shortPost: string;

        const separator = '---';
        const separatorIndex = text.indexOf(separator);

        if (separatorIndex !== -1 && text.includes('LONGFORM REACTION:') && text.includes('SHORTFORM REACTION:')) {
            const fullPart = text.substring(0, separatorIndex);
            const shortPart = text.substring(separatorIndex + separator.length);
            fullPost = fullPart.replace('LONGFORM REACTION:', '').trim();
            shortPost = shortPart.replace('SHORTFORM REACTION:', '').trim();
        } else {
            console.warn("Could not properly parse LLM response for full/short post. Using fallback to generate short post.");
            fullPost = text.replace('LONGFORM REACTION:', '').replace('SHORTFORM REACTION:', '').replace(separator, '').trim();
            
            try {
                const summarizationResponse = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Summarize the following text to be 280 characters or less for posting on social media like X or Bluesky. Output only the summarized text, without any introductory phrases:\n\n"${fullPost}"`,
                });
                shortPost = summarizationResponse.text;
                if (!shortPost) {
                    shortPost = fullPost.length > 280 ? fullPost.substring(0, 277) + '...' : fullPost;
                }
            } catch (summarizeError) {
                console.error("Error generating summarized post:", summarizeError);
                shortPost = fullPost.length > 280 ? fullPost.substring(0, 277) + '...' : fullPost;
            }
        }
        
        if (config.tools && groundingChunks && groundingChunks.length > 0) {
            const groundingSources: GroundingSource[] = groundingChunks?.map((chunk: any) => ({
                uri: chunk.web.uri,
                title: chunk.web.title,
            })).filter((source: GroundingSource) => source.uri && source.title) ?? [];
            sources.push(...groundingSources);
        } else {
             try {
                sources.push({ uri: url, title: `Original Content at ${new URL(url).hostname}` });
            } catch(e) {
                sources.push({ uri: url, title: `Original Content` });
            }
        }

        const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());
        
        return { text: fullPost, shortText: shortPost, sources: uniqueSources };

    } catch (error) {
        console.error("Error generating post content:", error);
        throw new Error("Failed to generate post content from the AI model.");
    }
}

export async function generatePostImage(postText: string): Promise<string> {
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
            imagePrompt = "An abstract image representing diverse opinions and discussion.";
        }
    } catch (error) {
        console.error("Error generating sanitized image prompt:", error);
        imagePrompt = "An abstract image representing diverse opinions and discussion.";
    }
    
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