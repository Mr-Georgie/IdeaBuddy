import { useAppContext } from "@/AppContext";
import Link from "next/link";

export const SidebarItem = ({ chats, chatId }) => {
    const { fetchingResponse } = useAppContext();

    function truncateText(text) {
        const maxLength = 20;
        if (text.length > maxLength) {
            // If the text is longer than the maxLength, truncate it
            return text.slice(0, maxLength) + "...";
        } else {
            // If the text is already within the maxLength, return it unchanged
            return text;
        }
    }

    return chats.map((chat) =>
        !fetchingResponse ? (
            <Link
                key={chat._id}
                href={`/chat/${chat._id}`}
                className={`side-menu-item ${
                    chatId === chat._id
                        ? "rounded-lg bg-indigo-500 text-white hover:bg-indigo-500"
                        : ""
                }`}
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
                        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                </svg>
                <div className="flex">
                    <span title={chat.title} className="text-sm">
                        {truncateText(chat.title)}
                    </span>
                </div>
            </Link>
        ) : (
            <div
                title={"Still fetching response from AI"}
                key={chat._id}
                className={`side-menu-item ${
                    chatId === chat._id
                        ? "rounded-lg bg-indigo-500 text-white hover:bg-indigo-500"
                        : ""
                } cursor-not-allowed opacity-50`}
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
                        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                </svg>
                <div className="flex">
                    <span title={chat.title} className="text-sm">
                        {truncateText(chat.title)}
                    </span>
                </div>
            </div>
        )
    );
};
