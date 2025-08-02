import React, { createContext, useContext } from "react";

const RefreshContext = createContext<(() => void) | undefined>(undefined);

export const RefreshProvider: React.FC<{
	onRefresh: () => void;
	children: React.ReactNode;
}> = ({ onRefresh, children }) => (
	<RefreshContext.Provider value={onRefresh}>
		{children}
	</RefreshContext.Provider>
);

export function useRefresh(): () => void {
	const ctx = useContext(RefreshContext);
	if (!ctx) throw new Error("useRefresh must be used within RefreshProvider");
	return ctx;
}
