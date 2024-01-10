import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export const Message = ({ role, content }) => {
    const { user } = useUser();

    return (
        <div
            className={`grid grid-cols-[30px_1fr] gap-5 ${
                role === "assistant"
                    ? "bg-white dark:border-gray-500 dark:bg-transparent "
                    : "bg-[#F2F6FA] dark:border-gray-500 dark:bg-transparent "
            } border-1 mx-6 my-4 rounded-lg border p-6 md:mx-10 lg:mx-44 xl:mx-60`}
        >
            <div className="">
                {role === "user" && !!user && (
                    <Image
                        src={user.picture}
                        width={40}
                        height={40}
                        alt="User avatar"
                        className="rounded-sm border"
                    />
                )}
                {role === "assistant" && (
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-sm bg-slate-800">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6 text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                            />
                        </svg>
                    </div>
                )}
            </div>
            <div className="prose">
                <div className="flex justify-between pb-3 font-semibold">
                    <span className="dark:text-white">
                        {role === "assistant" ? "Idea Buddy" : "You"}
                    </span>

                    {/* {role === "user" && (
                        <span className=" cursor-pointer rounded-sm border border-gray-300 p-2 opacity-60 hover:opacity-90">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-5 w-5 dark:text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                />
                            </svg>
                        </span>
                    )} */}
                </div>
                <ReactMarkdown className="w-full dark:text-white">
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};
