import Head from "next/head";
import Link from "next/link";

export default function About() {
    return (
        <>
            <Head>
                <title>About Idea Buddy</title>
            </Head>
            <div className="min-h-screen w-full">
                <div className="flex items-center justify-center">
                    <div className="flex flex-col gap-4 px-3 sm:px-0">
                        <div className="my-8 flex flex-col items-center">
                            <div className="m-3 rounded-full border-2 border-black p-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className=" h-8 w-8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                    />
                                </svg>
                            </div>
                            <h1 className="py-3 font-bold sm:text-lg">
                                About Idea Buddy
                            </h1>
                        </div>
                        <div className="">
                            Idea Buddy is an intelligent and quick-thinking
                            personal brainstorming partner designed to provide
                            {""}
                            <br />
                            critical evaluation and feedback on ideas.
                            <br />
                            <br />
                            Find some useful links below:
                        </div>
                        <div className="flex w-full flex-col gap-5 sm:gap-6">
                            <Link
                                href="https://github.com/Mr-Georgie/IdeaBuddy"
                                className=" text-indigo-400 underline"
                            >
                                https://github.com/Mr-Georgie/IdeaBuddy
                            </Link>
                            <Link
                                href="https://georgeisiguzo.netlify.app/"
                                className=" text-indigo-400 underline"
                            >
                                Developer's portfolio
                            </Link>
                            <Link
                                href="https://www.udemy.com/course/nextjs-chatgpt/"
                                className=" text-indigo-400 underline"
                            >
                                Udemy Course to create something similar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
