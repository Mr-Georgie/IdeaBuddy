import { useAppContext } from "@/AppContext";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { ChatSidebar } from "components/ChatSidebar/ChatSidebar";
import { Message } from "components/Message/Message";
import { ObjectId } from "mongodb";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

export default function ChatPage({ chatId, messages }) {
    const { fetchingResponse, setFetchingResponse } = useAppContext();

    const inputRef = useRef(null);

    const [messageText, setMessageText] = useState("");
    const [newChatId, setNewChatId] = useState(null);
    const [openAIResponse, setOpenAIResponse] = useState("");
    const [newChatMessages, setNewChatMessages] = useState([]);
    const [removePlaceholder, setRemovePlaceholder] = useState(false);
    const [correspondingAIResponse, setCorrespondingAIResponse] = useState("");
    const onDarkMode = false;
    const router = useRouter();

    // when app route changes
    useEffect(() => {
        setNewChatMessages([]);
        setNewChatId(null);
        if (!chatId) {
            setRemovePlaceholder(false);
        }
    }, [chatId]);

    // if we've created a new chat
    useEffect(() => {
        if (!fetchingResponse && newChatId) {
            setNewChatId(null);
            router.push(`/chat/${newChatId}`);
        }
    }, [newChatId, fetchingResponse, router]);

    // re-render component when we've fetched message from db
    useEffect(() => {
        // ...
    }, [messages, newChatMessages]);

    // add message to existing chat when we are done
    // streaming and we have the chatId of the new chat just created
    useEffect(() => {
        const addMessageToChat = async (chatId) => {
            try {
                if (!fetchingResponse && openAIResponse && chatId) {
                    // console.log("trying to add message to chat");

                    const response = await fetch(`/api/chat/addMessageToChat`, {
                        headers: {
                            "content-type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify({
                            chatId,
                            role: "assistant",
                            content: openAIResponse,
                        }),
                    });

                    console.log("new chatId: ", chatId);

                    if (response.ok) {
                        console.log("Chat message added successfully");
                        setCorrespondingAIResponse(openAIResponse);
                        setOpenAIResponse("");
                    } else {
                        console.log(
                            "Failed to add chat message. Status:",
                            response.status,
                            await response.json().then((resp) => resp.message)
                        );
                    }
                } else {
                    console.log("Failed to add message to chat");
                    // console.log("chatId: ", chatId);
                    // console.log("fetchResponse: ", fetchingResponse);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        if (newChatId) {
            addMessageToChat(newChatId);
        } else {
            addMessageToChat(chatId);
        }
    }, [fetchingResponse, openAIResponse, newChatId]);

    // update UI with corresponding messages from Open AI
    useEffect(() => {
        if (!fetchingResponse && correspondingAIResponse && !newChatId) {
            setNewChatMessages((prevMessage) => {
                return [
                    ...prevMessage,
                    {
                        _id: uuid(),
                        role: "assistant",
                        content: correspondingAIResponse,
                    },
                ];
            });
            setCorrespondingAIResponse("");
        }
    }, [fetchingResponse, correspondingAIResponse, newChatId]);

    const handleInputChange = (e) => {
        setMessageText(e.target.value);
        autoExpandInput();
    };

    const autoExpandInput = () => {
        const input = inputRef.current;
        input.style.height = "auto";
        input.style.height = `${input.scrollHeight}px`;

        // Adjust width based on container width
        const containerWidth = 720;
        const newWidth = Math.min(input.scrollWidth, containerWidth);
        input.style.width = `${newWidth}px`;
    };

    const handleKeyDown = (e) => {
        // Trigger form submission on Enter key press
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the input field is empty before submitting
        if (messageText.trim() === "") {
            // Stop form submission logic and display an error message
            alert("Input field cannot be empty!");
            return;
        }

        setRemovePlaceholder(true);

        setFetchingResponse(true);

        try {
            setNewChatMessages((prevMessage) => {
                return [
                    ...prevMessage,
                    {
                        _id: uuid(),
                        role: "user",
                        content: messageText,
                    },
                ];
            });

            setMessageText("");

            const sendMessageResponse = await fetch(`/api/chat/sendMessage`, {
                headers: {
                    "content-type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ chatId, message: messageText }),
            });

            // Check if the response has the X-Chat-Id header
            const chatIdHeader = sendMessageResponse.headers?.get("X-Chat-Id");

            const reader = sendMessageResponse.body?.getReader();
            setOpenAIResponse("");

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    setFetchingResponse(false);

                    if (chatIdHeader) {
                        const chatId = chatIdHeader;
                        console.log("Received chatId:", chatId);
                        setNewChatId(chatId);
                    }

                    break;
                }

                var currentChunk = new TextDecoder().decode(value);
                setOpenAIResponse((prev) => prev + currentChunk);
            }
        } catch (error) {
            console.log("An error occurred: ", error);
        }
    };

    const allMessages = [...messages, ...newChatMessages];

    return (
        <div>
            <Head>
                <title>New chat</title>
            </Head>
            <div className="grid h-screen grid-cols-[250px_1fr]">
                <ChatSidebar chatId={chatId} />
                <div className="flex flex-col overflow-hidden bg-slate-50">
                    <div className="flex items-center justify-between bg-white p-4">
                        <div className="flex gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                />
                            </svg>
                            <div className="font-bold">Idea Buddy</div>
                        </div>
                        <div
                            className={`${
                                onDarkMode
                                    ? "transition-all duration-300"
                                    : "transition-all duration-300"
                            } flex gap-4 rounded-full border bg-[#F2F6FA] px-2 py-1`}
                        >
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`${
                                        onDarkMode
                                            ? "bg-transparent transition-colors duration-300"
                                            : "bg-white transition-colors duration-300"
                                    } h-6 w-6 cursor-pointer rounded-full p-1 `}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    // onClick={() => themeToggler(false)}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`${
                                        onDarkMode
                                            ? "bg-white transition-colors duration-300"
                                            : " transition-colors duration-300"
                                    } h-6 w-6 cursor-pointer rounded-full p-1`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    // onClick={() => themeToggler(true)}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {/* bg-gray-700 */}
                    {!removePlaceholder && allMessages.length === 0 ? (
                        <div className="flex flex-1 flex-col justify-between overflow-auto py-4">
                            <div className="my-20 flex flex-col items-center justify-center gap-3">
                                <span className="rounded-full bg-white p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-12 w-12"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                        />
                                    </svg>
                                </span>
                                <span>What new idea did you come up with?</span>
                            </div>
                            <div className="border-1 mx-6 my-4 rounded-lg border bg-white p-10 text-black md:mx-10 lg:mx-44 xl:mx-60">
                                <h4 className="pb-3 text-xl">Examples</h4>
                                <div className="flex flex-col font-light">
                                    <span className="">
                                        <i>-</i> I want to create a
                                        cross-selling e-commerce app that ...
                                    </span>
                                    <span className="">
                                        <i>-</i> I want to build an app that
                                        aggregates ...
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col-reverse overflow-auto py-4">
                            {/* // flex-col-reverse will make chat auto scroll as the browser would see content from bottom to top */}
                            {/* // mb-auto will make chat start from the top */}
                            <div className="mb-auto">
                                {allMessages.map((message) => (
                                    <>
                                        <Message
                                            key={message._id}
                                            role={message.role}
                                            content={message.content}
                                        />
                                        {message.role === "assistant" && (
                                            <div className="mx-6 flex justify-end gap-4 md:mx-10 lg:mx-44 xl:mx-60">
                                                <button
                                                    type="button"
                                                    className="btn-white mx-4 my-2 flex items-center gap-4 p-4"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="h-3 w-3"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                                        />
                                                    </svg>

                                                    <span className="text-xs">
                                                        Download Chat
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-white mx-4 my-2 flex items-center gap-4 p-4"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="h-3 w-3"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                                        />
                                                    </svg>

                                                    <span className="text-xs">
                                                        Regenerate
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ))}
                                {!!openAIResponse && (
                                    <>
                                        <Message
                                            role={"assistant"}
                                            content={openAIResponse}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="mx-6 py-10 md:mx-10 lg:mx-44 xl:mx-52">
                        {/* bg-gray-800 */}
                        <form onSubmit={handleSubmit}>
                            <fieldset
                                className="relative w-full rounded-2xl border border-gray-300 p-2 transition-all focus-within:border-indigo-500"
                                disabled={fetchingResponse}
                            >
                                <textarea
                                    ref={inputRef}
                                    value={messageText}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    style={{
                                        minHeight: "2.5rem",
                                        whiteSpace: "pre-wrap",
                                    }}
                                    placeholder={
                                        fetchingResponse
                                            ? ""
                                            : "Enter an idea here..."
                                    }
                                    className="textarea w-full"
                                />
                                <button
                                    type="submit"
                                    className="btn absolute bottom-0 right-2 -translate-y-1/2 transform"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                                        />
                                    </svg>
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const chatId = ctx.params?.chatId?.[0] || null;

    if (!chatId) {
        // If there's no chatId, it means it's a new chat creation page
        return {
            props: {
                chatId: null,
                title: "",
                messages: [],
            },
        };
    }

    const { user } = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("Ideadb");

    try {
        const chat = await db.collection("chats").findOne({
            userId: user.sub,
            _id: new ObjectId(chatId),
        });

        if (!chat) {
            throw new Error("Chat not found");
        }

        const messages = chat.messages || [];
        const messagesWithId = messages.map((message) => ({
            ...message,
            _id: uuid(),
        }));

        return {
            props: {
                chatId,
                title: chat.title || "",
                messages: messagesWithId,
            },
        };
    } catch (error) {
        console.error("Error fetching chat:", error);
        return {
            notFound: true,
        };
    }
};
