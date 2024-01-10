import { useAppContext } from "@/AppContext";
import { useState } from "react";

export const Navbar = () => {
    const [onDarkMode, setOnDarkMode] = useState(false);
    const { isSidebarOpen, setIsSidebarOpen } = useAppContext();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const themeToggler = (bool) => {
        if (bool) {
            document.documentElement.classList.add("dark");
            setOnDarkMode(bool);
        } else {
            document.documentElement.classList.remove("dark");
            setOnDarkMode(bool);
        }
    };

    return (
        <>
            <div className="hidden items-center justify-between bg-white p-4 sm:flex dark:bg-gray-600 dark:text-white">
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
                <div className="flex gap-4">
                    <div
                        className={`${
                            onDarkMode
                                ? "transition-all duration-300"
                                : "transition-all duration-300"
                        } flex gap-4 rounded-full border bg-[#F2F6FA] px-2 py-1 dark:bg-gray-600`}
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
                                onClick={() => themeToggler(false)}
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
                                        ? "bg-white text-gray-600 transition-colors duration-300"
                                        : " transition-colors duration-300"
                                } h-6 w-6 cursor-pointer rounded-full p-1`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                onClick={() => themeToggler(true)}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        </div>
                    </div>

                    <button
                        type="button"
                        title="share chat"
                        className="btn-chat p-2 px-3"
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
                                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between bg-white p-4 shadow-lg sm:hidden dark:bg-gray-600 dark:text-white">
                {/* hamburger */}
                <button className="btn-white" onClick={toggleSidebar}>
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
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                        />
                    </svg>
                </button>
                {/* logo */}
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
                <div className="flex gap-4">
                    <div
                        className={`${
                            onDarkMode
                                ? "transition-all duration-300"
                                : "transition-all duration-300"
                        } flex gap-4 rounded-full border bg-[#F2F6FA] px-2 py-1 dark:bg-gray-600`}
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
                                onClick={() => themeToggler(false)}
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
                                        ? "bg-white text-gray-600 transition-colors duration-300"
                                        : " transition-colors duration-300"
                                } h-6 w-6 cursor-pointer rounded-full p-1`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                onClick={() => themeToggler(true)}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* share button */}
                    <button
                        type="button"
                        title="share chat"
                        className="btn-chat hidden p-2 px-3"
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
                                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};
