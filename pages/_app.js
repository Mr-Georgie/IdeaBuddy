import { AppProvider } from "@/AppContext";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Outfit } from "next/font/google";
import Head from "next/head";
import "../styles/globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

function App({ Component, pageProps }) {
    return (
        <AppProvider>
            <UserProvider>
                <Head>
                    <link rel="icon" href="/favicon.png" />
                </Head>
                <main className={`${outfit.variable} font-body`}>
                    <Component {...pageProps} />
                    <AnalyticsProps />
                </main>
            </UserProvider>
        </AppProvider>
    );
}

export default App;
