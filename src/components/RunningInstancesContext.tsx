import React, { createContext, useContext } from "react";
import { RunningPod } from "@/types";

const RunningInstancesContext = createContext<RunningPod[] | undefined>(
	undefined
);

export const RunningInstancesProvider: React.FC<{
	runningInstances: RunningPod[];
	children: React.ReactNode;
}> = ({ runningInstances, children }) => (
	<RunningInstancesContext.Provider value={runningInstances}>
		{children}
	</RunningInstancesContext.Provider>
);

export function useRunningInstances(): RunningPod[] {
	const ctx = useContext(RunningInstancesContext);
	if (!ctx)
		throw new Error(
			"useRunningInstances must be used within RunningInstancesProvider"
		);
	return ctx;
}
