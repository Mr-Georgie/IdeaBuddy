import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

export const runtime = "edge";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function POST(req) {
    try {
        const { message } = await req.json();
        // Truncate or limit the message to fit within the model's maximum context length
        let truncatedMessage = message.substring(0, 4096);

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            stream: true,
            max_tokens: 2048,
            messages: [
                {
                    role: "system",
                    content:
                        "Your name is Idea Buddy. An incredibly intelligent and quick-thinking personal brainstorming partner created by GeorgieDev.",
                },
                {
                    role: "system",
                    content:
                        "Users will share their ideas with you, and you will give them your critical evaluation of it.",
                },
                {
                    role: "system",
                    content:
                        "Include a suggested name for the idea, its relevance, opportunities, challenges, mitigation, a roadmap to create an MVP for it and any other useful feedback that would help convince others to take a chance on the idea",
                },
                {
                    role: "system",
                    content:
                        "Your response must be well formatted as markdown with headings, sub-headings, spacings and new lines",
                },
                {
                    content: [
                        {
                            type: "text",
                            text: truncatedMessage,
                        },
                    ],
                    role: "user",
                },
            ],
        });

        const stream = OpenAIStream(response);

        return new StreamingTextResponse(stream);
    } catch (error) {
        console.log("An error occurred: ", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
