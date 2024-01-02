import { ChatSidebar } from "components/ChatSidebar/ChatSidebar";
import { Message } from "components/Message/Message";
import Head from "next/head";
import { useState } from "react";
import { v4 as uuid } from "uuid";

export default function ChatPage() {
    const [messageText, setMessageText] = useState("");
    const [openAIResponse, setOpenAIResponse] = useState("");
    const [newChatMessages, setNewChatMessages] = useState([]);
    const [fetchingResponse, setFetchingResponse] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFetchingResponse(true);

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

        try {
            const response = await fetch(`/api/chat/sendMessage`, {
                headers: {
                    "content-type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                console.error(
                    `Error: ${response.status} - ${response.statusText}`
                );
                return;
            }

            const data = response.body;

            console.log("got the response body");

            if (!data) {
                return;
            }
            const reader = data.getReader();
            setOpenAIResponse("");

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    setFetchingResponse(false);
                    break;
                }

                var currentChunk = new TextDecoder().decode(value);
                setOpenAIResponse((prev) => prev + currentChunk);

                // setFetchingResponse(false);
            }
        } catch (error) {
            console.log("An error occurred: ", error);
        }
    };

    return (
        <div>
            <Head>
                <title>New chat</title>
            </Head>
            <div className="grid h-screen grid-cols-[300px_1fr]">
                <ChatSidebar />
                <div className="flex flex-col overflow-hidden bg-slate-200">
                    <div className="border bg-white p-4">Chat</div>
                    {/* bg-gray-700 */}
                    {true && (
                        <div className="flex-1 overflow-auto py-4">
                            {newChatMessages.map((message) => (
                                <Message
                                    key={message._id}
                                    role={message.role}
                                    content={message.content}
                                    streaming={fetchingResponse}
                                />
                            ))}
                            {!!openAIResponse && (
                                <>
                                    <Message
                                        role={"assistant"}
                                        content={openAIResponse}
                                    />
                                    {!fetchingResponse && (
                                        <div className="mx-6 flex justify-end gap-4 md:mx-10 lg:mx-32">
                                            <button
                                                type="button"
                                                className="btn-white mx-4 my-2 flex gap-4 p-4"
                                            >
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
                                                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                                    />
                                                </svg>

                                                <span className="">
                                                    Download Chat
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-white mx-4 my-2 flex gap-4 p-4"
                                            >
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
                                                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                                    />
                                                </svg>

                                                <span className="">
                                                    Regenerate
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {false && (
                        <div className="flex-1 overflow-auto py-4">
                            <div className="border-1 mx-32 my-4 rounded-lg border bg-slate-700 p-10 text-white">
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
                            <div className="border-1 mx-32 my-4 rounded-lg border bg-slate-500 p-10 text-white">
                                <h4 className="pb-3 text-xl">Capabilities</h4>
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
                            <div className="border-1 mx-32 my-4 rounded-lg border bg-slate-300 p-10 text-black">
                                <h4 className="pb-3 text-xl">Limitations</h4>
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
                    )}
                    <div className="mx-6 py-10 md:mx-10 lg:mx-32">
                        {/* bg-gray-800 */}
                        <form onSubmit={handleSubmit}>
                            <fieldset
                                className="flex gap-3"
                                disabled={fetchingResponse}
                            >
                                <textarea
                                    value={messageText}
                                    onChange={(e) =>
                                        setMessageText(e.target.value)
                                    }
                                    placeholder={
                                        fetchingResponse
                                            ? ""
                                            : "Enter an idea..."
                                    }
                                    className="textarea w-full"
                                />
                                <button type="submit" className="btn">
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
                                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
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
