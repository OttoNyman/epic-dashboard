"use client";

import RunningInstancesList from "./RunningInstancesList";
import StartNewEnvironmentForm from "./StartNewEnvironmentForm";
import DeleteInstanceForm from "./DeleteInstanceForm";
import AddImageToEnvForm from "./AddImageToEnvForm";
import { useRefresh } from "./RefreshContext";

const EnvironmentsManager: React.FC = () => {
	const onRefresh = useRefresh();

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

			<RunningInstancesList />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
				<StartNewEnvironmentForm />
				<DeleteInstanceForm />
			</div>
			<AddImageToEnvForm />
		</div>
	);
};

export default EnvironmentsManager;
