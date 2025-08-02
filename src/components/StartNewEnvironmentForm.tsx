import { startNewEnvironment } from "@/services/api";
import React, { useMemo, useState } from "react";
import { useLoader } from "../contexts/LoaderContext";
import { useImages } from "../contexts/ImagesContext";
import { useStorages } from "../contexts/StoragesContext";
import { useRefresh } from "../contexts/RefreshContext";

const StartNewEnvironmentForm: React.FC = () => {
	const images = useImages();
	const storages = useStorages();
	const onRefresh = useRefresh();
	const { loading, setLoading } = useLoader();
	const [startTag, setStartTag] = useState("");
	const [startPort, setStartPort] = useState<string>("8888");
	const [startStorage, setStartStorage] = useState("");

	const handleStartNew = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!startTag || !startPort || !startStorage) {
			alert("Please fill all fields to start an environment.");
			return;
		}
		setLoading(true);
		try {
			await startNewEnvironment(startTag, +startPort, startStorage);
			alert("New environment started successfully!");
			onRefresh();
		} catch (error) {
			console.error(error);
			alert("Failed to start new environment.");
		} finally {
			setLoading(false);
		}
	};

	// Memoized lists for dropdowns
	const coreImages = useMemo(
		() => images.filter((img) => img.repository?.includes("library/epicflow")),
		[images]
	);

	return (
		<form
			onSubmit={handleStartNew}
			className="p-4 border rounded-lg space-y-4 flex flex-col h-full"
		>
			<h3 className="text-xl font-semibold">Start New Core Environment</h3>
			<div className="space-y-4 flex-grow">
				<div>
					<label htmlFor="start-tag" className="block text-sm font-medium">
						Core
					</label>
					<select
						id="start-tag"
						value={startTag}
						onChange={(e) => setStartTag(e.target.value)}
						className="w-full p-2 border rounded"
					>
						<option value="">Select Core...</option>
						{coreImages.map((img) => (
							<option key={img.id} value={img.tag}>
								{img.repository}:{img.tag}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="start-port" className="block text-sm font-medium">
						Port
					</label>
					<input
						id="start-port"
						type="number"
						value={startPort}
						onChange={(e) => setStartPort(e.target.value)}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div>
					<label htmlFor="start-storage" className="block text-sm font-medium">
						Storage
					</label>
					<select
						id="start-storage"
						value={startStorage}
						onChange={(e) => setStartStorage(e.target.value)}
						className="w-full p-2 border rounded"
					>
						<option value="">Select storage...</option>
						{storages.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>
			</div>
			<button
				type="submit"
				disabled={loading || !startTag || !startPort || !startStorage}
				className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 self-start"
			>
				Start
			</button>
		</form>
	);
};

export default StartNewEnvironmentForm;
