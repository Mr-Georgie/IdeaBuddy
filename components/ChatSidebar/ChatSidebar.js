import { useAppContext } from "@/AppContext";
import { useUser } from "@auth0/nextjs-auth0/client";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SidebarItem } from "../SidebarItem/SidebarItem";

export const ChatSidebar = ({ chatId }) => {
    const {
        fetchingResponse,
        todaysChatList,
        setTodaysChatList,
        last7DaysChatList,
        setLast7DaysChatList,
        olderChatList,
        setOlderChatList,
        searchResult,
        setSearchResult,
    } = useAppContext();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadChatList = async () => {
            const response = await fetch(`/api/chat/getChatList`, {
                method: "POST",
            });
            const json = await response.json();

            if (json?.chats) {
                const today = new Date();
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);

                const chatsToday = json.chats.filter(
                    (chat) => new Date(chat.time) >= today.setHours(0, 0, 0, 0)
                );

                const chatsLast7Days = json.chats.filter(
                    (chat) =>
                        new Date(chat.time) >=
                            sevenDaysAgo.setHours(0, 0, 0, 0) &&
                        new Date(chat.time) < today.setHours(0, 0, 0, 0)
                );

                const chatsOlder = json.chats.filter(
                    (chat) =>
                        new Date(chat.time) < sevenDaysAgo.setHours(0, 0, 0, 0)
                );

                setTodaysChatList(chatsToday);
                setLast7DaysChatList(chatsLast7Days);
                setOlderChatList(chatsOlder);
            }
        };
        loadChatList();

        if (searchTerm.length > 0) {
            searchChats(searchTerm);
        } else {
            // If search term is empty, reset the search result
            setSearchResult([]);
        }
    }, [todaysChatList, last7DaysChatList, olderChatList, searchTerm, chatId]);

    const searchChats = (term) => {
        const todayMatches = todaysChatList.filter((chat) =>
            chat.title.includes(term)
        );
        const last7DaysMatches = last7DaysChatList.filter((chat) =>
            chat.title.includes(term)
        );
        const olderMatches = olderChatList.filter((chat) =>
            chat.title.includes(term)
        );

        const combinedResult = [
            ...todayMatches,
            ...last7DaysMatches,
            ...olderMatches,
        ];
        setSearchResult(combinedResult);
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const { user } = useUser();

    return (
        <div className="flex flex-col overflow-hidden border-r">
            {!fetchingResponse ? (
                <Link
                    href=""
                    className="btn-white mx-4 mt-2 flex items-center gap-4 text-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 text-indigo-500"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                            clipRule="evenodd"
                        />
                    </svg>

                    <span className="">New Idea?</span>
                </Link>
            ) : (
                <div
                    title={"Still fetching response from AI"}
                    className="btn-white mx-4 mt-2 flex cursor-not-allowed items-center gap-4 text-sm opacity-50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 text-indigo-500"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                            clipRule="evenodd"
                        />
                    </svg>

                    <span className="">New Idea?</span>
                </div>
            )}
            <div className="mx-4 my-2 flex gap-4">
                <div className="relative w-full rounded-2xl border p-2 transition-all duration-300 focus-within:border-indigo-500">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 transform">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6 opacity-30"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </span>
                    <input
                        type="text"
                        className="w-full rounded-full bg-transparent py-0 pl-8 pr-4 focus:outline-none"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        disabled={fetchingResponse}
                    />
                </div>
            </div>
            <div className="mb-8 mt-12 flex flex-1 flex-col gap-3 overflow-auto">
                {searchTerm ? (
                    <div className="mx-4 rounded-2xl bg-[#F2F6FA] pb-2">
                        <h5 className="border-b p-3 text-xs font-light">
                            Search results
                        </h5>
                        <SidebarItem chats={searchResult} chatId={chatId} />
                    </div>
                ) : (
                    <></>
                )}
                {!searchTerm ? (
                    <div className="mx-4 rounded-2xl bg-[#F2F6FA] pb-2">
                        <h5 className="border-b p-3 text-xs font-light">
                            Today's ideas
                        </h5>
                        <SidebarItem chats={todaysChatList} chatId={chatId} />
                    </div>
                ) : (
                    <></>
                )}
                {last7DaysChatList.length && !searchTerm ? (
                    <div className="mx-4 rounded-2xl bg-[#F2F6FA] pb-2">
                        <h5 className="border-b p-3 text-xs font-light">
                            Previous 7 days
                        </h5>
                        <SidebarItem
                            chats={last7DaysChatList}
                            chatId={chatId}
                        />
                    </div>
                ) : (
                    <></>
                )}
                {olderChatList.length && !searchTerm ? (
                    <div className="mx-4 rounded-2xl bg-[#F2F6FA] pb-2">
                        <h5 className="border-b p-3 text-xs font-light">
                            Older ideas
                        </h5>
                        <SidebarItem chats={olderChatList} chatId={chatId} />
                    </div>
                ) : (
                    <></>
                )}
            </div>

            <div className="">
                <div className="btn-white mx-4 my-2 flex gap-4 text-sm">
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
                            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                    </svg>
                    {!fetchingResponse ? (
                        <Link href="/" className="">
                            About
                        </Link>
                    ) : (
                        <div
                            title="Still fetching response from AI"
                            className="cursor-not-allowed opacity-50"
                        >
                            About
                        </div>
                    )}
                </div>
                <div className="btn-white mx-4 my-2 flex gap-4 text-sm">
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
                            d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                        />
                    </svg>
                    {!fetchingResponse ? (
                        <Link href="/api/auth/logout" className="">
                            Logout
                        </Link>
                    ) : (
                        <div
                            title="Still fetching response from AI"
                            className="cursor-not-allowed opacity-50"
                        >
                            Logout
                        </div>
                    )}
                </div>
                <div className="mt-3 border-b border-t p-4">
                    {!!user ? (
                        <div className="flex cursor-pointer gap-4 hover:opacity-80">
                            <Image
                                src={user.picture}
                                width={40}
                                height={40}
                                alt="User avatar"
                                className="rounded-sm border"
                            />
                            <div className="flex flex-col ">
                                <div>{user.name}</div>
                                <div className="text-[10px] font-light">
                                    click to see account details
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-sm bg-slate-800">
                            <FontAwesomeIcon
                                icon={faUser}
                                className="text-indigo-200"
                            />
                            <div>User</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
