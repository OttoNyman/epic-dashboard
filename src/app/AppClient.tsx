"use client";

import { LoaderProvider } from "@/components/LoaderContext";
import Loader from "@/components/Loader";

export default function AppClient({ children }: { children: React.ReactNode }) {
	return (
		<LoaderProvider>
			{children}
			<Loader />
		</LoaderProvider>
	);
}
