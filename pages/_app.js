import { UserProvider } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import "../styles/globals.css";

function App({ Component, pageProps }) {
    return (
        <UserProvider>
            <Head>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default App;
