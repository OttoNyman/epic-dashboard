import React, { useState } from "react";
import { useLoader } from "./LoaderContext";
import { deleteInstance } from "@/services/api";
import { useRunningInstances } from "./RunningInstancesContext";
import { useRefresh } from "./RefreshContext";

const DeleteInstanceForm: React.FC = () => {
	const runningInstances = useRunningInstances();
	const onRefresh = useRefresh();
	const { loading, setLoading } = useLoader();
	const [deletePodId, setDeletePodId] = useState("");

	const handleDelete = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!deletePodId) {
			alert("Please select running instance to delete.");
			return;
		}
		if (
			window.confirm(`Are you sure you want to delete instance ${deletePodId}?`)
		) {
			setLoading(true);
			try {
				await deleteInstance(deletePodId);
				alert("Instance deleted successfully!");
				setDeletePodId("");
				onRefresh();
			} catch (error) {
				console.error(error);
				alert("Failed to delete instance.");
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<form
			onSubmit={handleDelete}
			className="p-4 border rounded-lg space-y-4 flex flex-col h-full"
		>
			<h3 className="text-xl font-semibold">Delete Instance</h3>
			<div className="space-y-4 flex-grow">
				<div>
					<label htmlFor="delete-pod" className="block text-sm font-medium">
						Env
					</label>
					<select
						id="delete-pod"
						value={deletePodId}
						onChange={(e) => setDeletePodId(e.target.value)}
						className="w-full p-2 border rounded"
					>
						<option value="">Select instance to delete...</option>
						{runningInstances.map((p) => (
							<option key={p.id} value={p.id}>
								{p.pod_name} ({p.id.substring(0, 12)})
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="flex-grow" />
			<button
				type="submit"
				disabled={loading || !deletePodId}
				className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 self-start"
			>
				Delete
			</button>
		</form>
	);
};

export default DeleteInstanceForm;
