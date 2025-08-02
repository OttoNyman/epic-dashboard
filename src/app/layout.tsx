import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoaderProvider } from "@/contexts/LoaderContext";
import Loader from "@/components/Loader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Container Management Dashboard",
	description: "A dashboard to manage Docker environments and containers.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<LoaderProvider>
					<Loader />
					<main className="mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
				</LoaderProvider>
			</body>
		</html>
	);
}
