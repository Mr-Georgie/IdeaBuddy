import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

export const runtime = "edge";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function POST(req) {
    try {
        const { chatId: chatIdFromParam, message } = await req.json();

        // validate message data
        if (!message || typeof message !== "string" || message.length > 250) {
            return new Response(
                {
                    message:
                        "message is required and must be less than 200 characters",
                },
                {
                    status: 422,
                }
            );
        }

        let chatId = chatIdFromParam;
        let newChatId;
        let chatMessages = [];

        if (chatId) {
            const response = await fetch(
                `${req.headers.get("origin")}/api/chat/addMessageToChat`,
                {
                    headers: {
                        "content-type": "application/json",
                        cookie: req.headers.get("cookie"),
                    },
                    method: "POST",
                    body: JSON.stringify({
                        chatId,
                        role: "user",
                        content: message,
                    }),
                }
            );

            const json = await response.json();
            chatMessages = json.chat.messages || [];
        } else {
            const createNewChatResponse = await fetch(
                `${req.headers.get("origin")}/api/chat/createNewChat`,
                {
                    headers: {
                        "content-type": "application/json",
                        cookie: req.headers.get("cookie"),
                    },
                    method: "POST",
                    body: JSON.stringify({ message }),
                }
            );

            const json = await createNewChatResponse.json();
            chatId = json._id;
            newChatId = chatId;
            chatMessages = json.messages || [];
        }

        const messagesToInclude = [];
        chatMessages.reverse();

        let usedTokens = 0;

        for (let chatMessage of chatMessages) {
            const messageTokens = chatMessage.content.length / 4;
            usedTokens = usedTokens + messageTokens;

            if (usedTokens <= 2000) {
                messagesToInclude.push(chatMessage);
            } else {
                break;
            }
        }

        messagesToInclude.reverse();
        // Truncate or limit the message to fit within the model's maximum context length
        // let truncatedMessage = message.substring(0, 4096);

        const openAIResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            stream: true,
            max_tokens: 2048,
            messages: [
                {
                    role: "system",
                    content:
                        "Your name is Idea Buddy. An incredibly intelligent and quick-thinking personal brainstorming partner created by Georgie Isiguzo.",
                },
                {
                    role: "system",
                    content:
                        "Users will share their ideas with you, and you will give them your critical evaluation of it.",
                },
                {
                    role: "system",
                    content:
                        "Include a suggested name for the idea, its relevance, opportunities, challenges, mitigation, mention already existing competitors/competition,",
                },
                {
                    role: "system",
                    content:
                        "and a roadmap to create an MVP for it and any other useful feedback that would help convince others to take a chance on the idea",
                },
                {
                    role: "system",
                    content:
                        "Your response must be well formatted as markdown with headings, sub-headings, spacings and new lines",
                },
                {
                    role: "system",
                    content:
                        "You should also be able to provide the right response when user supply follow up questions",
                },
                ...messagesToInclude.map((chatMessage) => ({
                    role: chatMessage.role,
                    content: chatMessage.content,
                })),
            ],
        });

        const stream = OpenAIStream(openAIResponse);

        const headers = {};

        if (newChatId) {
            // Include chatId in the response headers
            headers["Content-Type"] = "text/plain";
            headers["X-Chat-Id"] = newChatId;
        } else {
            // Exclude chatId in the response headers
            headers["Content-Type"] = "text/plain";
        }

        return new StreamingTextResponse(stream, { headers });
    } catch (error) {
        console.log("An error occurred in sendMessage: ", error);
        return new Response("Internal Server Error (sendMessage)", {
            status: 500,
        });
    }
}
