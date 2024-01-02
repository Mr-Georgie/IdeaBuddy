import { getSession } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    const { isLoading, error, user } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <>
            <Head>
                <title>IdeaCHAT | Login or Signup</title>
            </Head>
            <div className="grid min-h-screen w-full grid-cols-5">
                <div className="col-span-2 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <h1 className="py-3 text-4xl font-light">
                            Welcome to IdeaCHAT
                        </h1>
                        <div className=""></div>
                        {!user && (
                            <>
                                <Link
                                    href="/api/auth/login"
                                    className="btn w-full py-3 text-center"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/api/auth/signup"
                                    className="btn mt-2 w-full py-3 text-center"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                        {!!user && (
                            <Link
                                href="/api/auth/logout"
                                className="btn w-full py-3 text-center"
                            >
                                Sign out
                            </Link>
                        )}
                    </div>
                </div>
                <div className="col-span-3 flex flex-col items-center justify-center bg-indigo-500">
                    <Image
                        src="ideas5.svg"
                        alt="apps context image"
                        width={400}
                        height={250}
                    />
                    <div className="mt-2 py-4 font-light text-white">
                        New to IdeaCHAT? Check out our{" "}
                        <Link href="/" className="font-bold underline">
                            User's Guide
                        </Link>
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
