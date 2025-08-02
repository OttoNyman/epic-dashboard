import React, { createContext, useContext } from "react";
import { DockerImage } from "@/types";

interface ImagesContextType {
	images: DockerImage[];
}

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export const ImagesProvider: React.FC<{
	images: DockerImage[];
	children: React.ReactNode;
}> = ({ images, children }) => (
	<ImagesContext.Provider value={{ images }}>{children}</ImagesContext.Provider>
);

export function useImages(): DockerImage[] {
	const ctx = useContext(ImagesContext);
	if (!ctx) throw new Error("useImages must be used within ImagesProvider");
	return ctx.images;
}
