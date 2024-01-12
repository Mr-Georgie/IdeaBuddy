import { useAppContext } from "@/AppContext";
import { Navbar } from "@/components/Navbar/Navbar";
import { PlaceholderContent } from "@/components/PlaceholderContent";
import { SmallSidebar } from "@/components/SmallSidebar/SmallSidebar";
import { ChatSidebar } from "components/ChatSidebar/ChatSidebar";
import { Message } from "components/Message/Message";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

export default function ChatPage({ chatId }) {
    const {
        fetchingResponse,
        setFetchingResponse,
        isSidebarOpen,
        setIsSidebarOpen,
    } = useAppContext();

    const inputRef = useRef(null);

    const [messages, setMessages] = useState([]);

    const [messageText, setMessageText] = useState("");
    const [newChatId, setNewChatId] = useState(null);
    const [openAIResponse, setOpenAIResponse] = useState("");
    const [newChatMessages, setNewChatMessages] = useState([]);
    const [removePlaceholder, setRemovePlaceholder] = useState(false);
    const [correspondingAIResponse, setCorrespondingAIResponse] = useState("");

    const router = useRouter();

    // when app route changes
    useEffect(() => {
        setNewChatMessages([]);
        setIsSidebarOpen(false);
        setNewChatId(null);

        const fetchMessages = async () => {
            if (chatId) {
                const response = await fetch(`/api/chat/getChat`, {
                    headers: {
                        "content-type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        chatId,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.messages || []);
                } else {
                    console.log(
                        "Failed to fetch chat messages. Error:",
                        response.error,
                        await response.json().then((resp) => resp.message)
                    );
                }
            } else {
                setMessages([]);
                setRemovePlaceholder(false);
            }
        };

        fetchMessages();
    }, [chatId]); // eslint-disable-line react-hooks/exhaustive-deps

    // if we've created a new chat
    useEffect(() => {
        if (!fetchingResponse && newChatId) {
            setNewChatId(null);
            router.push(`/chat/${newChatId}`);
        }
    }, [newChatId, fetchingResponse, router]); // eslint-disable-line react-hooks/exhaustive-deps

    // re-render component when we've fetched message from db
    useEffect(() => {
        // ...
    }, [messages, newChatMessages]); // eslint-disable-line react-hooks/exhaustive-deps

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
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        addMessageToChat(chatId);

        // if (newChatId) {
        //     addMessageToChat(newChatId);
        // } else {
        //     addMessageToChat(chatId);
        // }
    }, [fetchingResponse, openAIResponse, newChatId, chatId]); // eslint-disable-line react-hooks/exhaustive-deps

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

            if (!sendMessageResponse.ok) {
                let json = await sendMessageResponse.json();
                alert(`An error occurred - ${json.message}`);
                return;
            }

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
            {isSidebarOpen && <SmallSidebar chatId={chatId} />}
            <div className="grid h-screen sm:grid-cols-[250px_1fr]">
                <ChatSidebar chatId={chatId} />
                <div className="flex flex-col overflow-hidden bg-slate-50 dark:bg-gray-600">
                    <Navbar />
                    {/* main chat content */}
                    {/* bg-gray-700 */}
                    {!removePlaceholder && allMessages.length === 0 ? (
                        <PlaceholderContent />
                    ) : (
                        <div className="safari-fix flex h-full flex-1 flex-col-reverse overflow-auto py-4">
                            {/* // flex-col-reverse will make chat auto scroll as the browser would see content from bottom to top */}
                            {/* // mb-auto will make chat start from the top */}
                            <div className="mb-auto">
                                {allMessages.map((message) => (
                                    <Message
                                        key={message._id}
                                        role={message.role}
                                        content={message.content}
                                    />
                                ))}
                                {!!openAIResponse && (
                                    <Message
                                        role={"assistant"}
                                        content={openAIResponse}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                    {/* footer */}
                    <div
                        className={`mx-6 py-10 md:mx-10 lg:mx-44 xl:mx-52 ${
                            fetchingResponse ? "hidden sm:block" : "block"
                        }`}
                    >
                        {/* form */}
                        {/* bg-gray-800 */}
                        <form onSubmit={handleSubmit}>
                            <fieldset
                                className="relative w-full rounded-2xl border border-gray-300 p-1 transition-all focus-within:border-indigo-500 sm:p-2"
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
            },
        };
    }

    return {
        props: {
            chatId,
        },
    };
};
