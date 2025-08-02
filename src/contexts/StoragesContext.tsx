import React, { createContext, useContext } from "react";

const StoragesContext = createContext<string[] | undefined>(undefined);

export const StoragesProvider: React.FC<{
	storages: string[];
	children: React.ReactNode;
}> = ({ storages, children }) => (
	<StoragesContext.Provider value={storages}>
		{children}
	</StoragesContext.Provider>
);

export function useStorages(): string[] {
	const ctx = useContext(StoragesContext);
	if (!ctx) throw new Error("useStorages must be used within StoragesProvider");
	return ctx;
}
