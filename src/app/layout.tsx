import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { CartProvider } from "./CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Obchod pana Lišáka",
    description:
        "Obchod pana Lišáka nabízí šírokou škálu produktů pro každého.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <CartProvider>
                    <Navbar />

                    {children}
                </CartProvider>
            </body>
        </html>
    );
}
