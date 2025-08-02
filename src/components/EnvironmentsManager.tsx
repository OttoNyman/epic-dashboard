"use client";

import { RunningPod } from "@/types";
import RunningInstancesList from "./RunningInstancesList";
import StartNewEnvironmentForm from "./StartNewEnvironmentForm";
import DeleteInstanceForm from "./DeleteInstanceForm";
import AddImageToEnvForm from "./AddImageToEnvForm";

interface Props {
	runningInstances: RunningPod[];
	storages: string[];
	onRefresh: () => void;
}

const EnvironmentsManager: React.FC<Props> = ({
	runningInstances,
	storages,
	onRefresh,
}) => {
	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Running Environments</h2>
				<button
					onClick={onRefresh}
					className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
				>
					Refresh
				</button>
			</div>

			<RunningInstancesList runningInstances={runningInstances} />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
				<StartNewEnvironmentForm
					storages={storages}
					onRefresh={onRefresh}
				/>

				<DeleteInstanceForm
					runningInstances={runningInstances}
					onRefresh={onRefresh}
				/>
			</div>
			<AddImageToEnvForm
				runningInstances={runningInstances}
				onRefresh={onRefresh}
			/>
		</div>
	);
};

export default EnvironmentsManager;
