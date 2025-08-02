"use client";

import React, { createContext, useState, useContext } from "react";

const LoaderContext = createContext({
	loading: false,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setLoading: (val: boolean) => {},
});

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [loading, setLoading] = useState(false);
	return (
		<LoaderContext.Provider value={{ loading, setLoading }}>
			{children}
		</LoaderContext.Provider>
	);
};
