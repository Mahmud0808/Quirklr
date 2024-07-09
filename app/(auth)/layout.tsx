import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { dark } from "@clerk/themes";
import NextTopLoader from "nextjs-toploader";
import "../globals.css";

export const metadata = {
    title: "Quirklr",
    description: "A Quirky Social Media Application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
            }}
        >
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <NextTopLoader showSpinner={false} />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
