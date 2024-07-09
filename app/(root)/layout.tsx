import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import TopBar from "@/components/shared/TopBar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";
import BottomBar from "@/components/shared/BottomBar";
import NextTopLoader from "nextjs-toploader";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Quirklr",
    description: "A Quirky Social Media Application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
            }}
        >
            <html lang="en">
                <body className={inter.className}>
                    <NextTopLoader showSpinner={false} />
                    <TopBar />
                    <main className="flex flex-row">
                        <LeftSideBar />
                        <section className="main-container">
                            <div className="w-full max-w-4xl">{children}</div>
                        </section>
                        <RightSideBar />
                    </main>
                    <BottomBar />
                </body>
            </html>
        </ClerkProvider>
    );
}
