import { startNewEnvironment } from "@/services/api";
import React, { useMemo, useState } from "react";
import { useLoader } from "../contexts/LoaderContext";
import { useImages } from "../contexts/ImagesContext";
import { useStorages } from "../contexts/StoragesContext";
import { useRefresh } from "../contexts/RefreshContext";

// const EMPTY_STORAGE_VALUE = "__EMPTY_STORAGE__";

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
		const storageNotSelected = startStorage === "";
		if (!startTag || !startPort || storageNotSelected) {
			alert("Please fill all fields to start an environment.");
			return;
		}
		setLoading(true);
		try {
			// const storageParam =
			// 	startStorage === EMPTY_STORAGE_VALUE ? "" : startStorage;
			await startNewEnvironment(startTag, +startPort, startStorage);
			alert("New environment started successfully!");
			// Reset form to default values
			setStartTag("");
			setStartPort("8888");
			setStartStorage("");
			onRefresh();
		} catch (error) {
			console.error(error);
			const message =
				error instanceof Error && error.message
					? error.message
					: "Failed to start new environment.";
			alert(message);
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
			className="p-4 border rounded-lg space-y-4"
		>
			<h3 className="text-xl font-semibold">Start New Core Environment</h3>
			<div className="space-y-4">
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
						{/* <option value={EMPTY_STORAGE_VALUE}>Empty storage</option> */}
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
				disabled={loading || !startTag || !startPort || startStorage === ""}
				className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:bg-gray-400"
			>
				Start
			</button>
		</form>
	);
};

export default StartNewEnvironmentForm;
