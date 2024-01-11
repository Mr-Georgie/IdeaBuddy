import { getSession } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
    const { isLoading, error, user } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <>
            <Head>
                <title>Idea Buddy | Login or Signup</title>
            </Head>
            <div className="grid min-h-screen w-full grid-cols-5">
                <div className="col-span-5 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 px-3 sm:px-0">
                        <div className="m-3 rounded-full border-4 border-black p-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className=" h-20 w-20"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                />
                            </svg>
                        </div>
                        <h1 className="py-3 text-3xl font-light sm:text-4xl">
                            Welcome to Idea Buddy!
                        </h1>
                        <div className=""></div>
                        <div className="flex w-full gap-5 sm:gap-6">
                            <Link
                                href="/api/auth/login"
                                className="btn w-full text-center"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/api/auth/signup"
                                className="btn w-full text-center"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx.req, ctx.res);
    if (!!session) {
        return {
            redirect: {
                destination: "/chat",
            },
        };
    }

    return {
        props: {},
    };
};
