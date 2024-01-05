import { useUser } from "@auth0/nextjs-auth0/client";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export const Message = ({ role, content, streaming }) => {
    const { user } = useUser();

    return (
        <div
            className={`grid grid-cols-[30px_1fr] gap-5 ${
                role === "assistant" ? "bg-white" : "bg-[#F2F6FA]"
            } border-1 mx-6 my-4 rounded-lg border p-6 md:mx-10 lg:mx-32`}
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
                        <FontAwesomeIcon
                            icon={faRobot}
                            className="text-indigo-200"
                        />
                    </div>
                )}
            </div>
            <div className="prose">
                <div className="flex justify-between pb-3 font-semibold">
                    <span>{role === "assistant" ? "Idea Buddy" : "You"}</span>

                    {role === "user" && (
                        <span className="cursor-pointer rounded-sm border border-gray-300 p-2 hover:opacity-40">
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
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                />
                            </svg>
                        </span>
                    )}
                </div>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
};
