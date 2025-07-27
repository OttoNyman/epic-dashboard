import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
				<main className="container mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
			</body>
		</html>
	);
}
