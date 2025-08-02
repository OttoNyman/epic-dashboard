"use client";

import React, { useState, useMemo } from "react";
import { DockerImage, RunningPod } from "@/types";
import {
	startNewEnvironment,
	addImageToPod,
	deleteInstance,
} from "@/services/api";
import { useLoader } from "./LoaderContext";

interface Props {
	runningInstances: RunningPod[];
	images: DockerImage[];
	storages: string[];
	onRefresh: () => void;
}

const DEFAULT_ENV_VARS = JSON.stringify(
	{
		BASE_RETRIEVER_URL: "http://epic-ai-tokarev.ddns.hysdev.com:7701",
		BASE_EMBEDDINGS_URL: "http://epic-ai-tokarev.ddns.hysdev.com:7702",
		AUTH_SUPERUSER_URL: "http://localhost/api/api/",
		BASE_URL_EF_SITE: "http://localhost/api/api/",
		IS_SUPERUSER_AUTH_BY_PASS: "False",
		PATH_KEY_superuser: "/etc/ssl/certs/private_key.pem",
		PATH_PEM_superuser: "/etc/ssl/certs/certificate.pem",
		SUPERUSER_LOGIN: "PO",
		SUPERUSER_PASSWORD: "Epica23!",
		LLM_TYPE: "OPENAI",
		OPENAI_API_KEY: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		OPENAI_API_MODEL: "gpt-4o",
		OPENAI_API_VERSION: "2024-02-15-preview",
		IS_SQL_FUNC_ENABLE: "1",
		LOG_LEVEL: "DEBUG",
		PROJECT_DATA_REPORT_COL_DIFFERENCE_SHORTAGE_DAME_NAME:
			"DueDateDifferenceShortageCalendarDays",
	},
	null,
	2
);

const EnvironmentsManager: React.FC<Props> = ({
	runningInstances,
	images,
	storages,
	onRefresh,
}) => {
	const { loading, setLoading } = useLoader();

	// State for "Start New" form
	const [startTag, setStartTag] = useState("");
	const [startPort, setStartPort] = useState<string>("8888");
	const [startStorage, setStartStorage] = useState("");

	// State for "Add Image to Env" form
	const [addPodId, setAddPodId] = useState("");
	const [addImageId, setAddImageId] = useState("");
	const [addImageType, setAddImageType] = useState<
		"client" | "server" | "feedback"
	>("client");
	const [envJson, setEnvJson] = useState(DEFAULT_ENV_VARS);

	// State for "Delete Instance" form
	const [deletePodId, setDeletePodId] = useState("");

	// Memoized lists for dropdowns
	const coreImages = useMemo(
		() => images.filter((img) => img.repository?.includes("library/epicflow")),
		[images]
	);
	const assistanceImages = useMemo(
		() => images.filter((img) => img.repository?.includes("virtualassistance")),
		[images]
	);

	// Handlers for starting a new environment
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

	// Handler for adding an image to a pod
	const handleAddImage = async (e: React.FormEvent) => {
		e.preventDefault();
		let env;
		try {
			env = JSON.parse(envJson);
		} catch {
			alert("Invalid JSON in Environment Variables.");
			return;
		}
		if (!addPodId || !addImageId) {
			alert("Please select a pod and an image.");
			return;
		}
		setLoading(true);
		try {
			await addImageToPod(addPodId, addImageId, addImageType, env);
			alert("Image added to env successfully!");
			onRefresh();
		} catch (error) {
			console.error(error);
			alert("Failed to add image to env.");
		} finally {
			setLoading(false);
		}
	};

	// Handler for deleting an instance
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

			{/* Running Instances Display */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
				{runningInstances.map((pod) => (
					<div key={pod.id} className="border border-gray-200 p-4 rounded-lg">
						<div className="mb-2">
							{pod.ports.map((p) => (
								<a
									key={p.host}
									href={`http://epic-ai-tokarev.ddns.hysdev.com:${p.host}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 underline mr-2"
								>
									{`Open :${p.host}`}
								</a>
							))}
						</div>
						<h3 className="font-bold text-lg">{pod.pod_name}</h3>
						<p className="text-sm font-mono break-all">
							Ports:{" "}
							{pod.ports.map((p) => `${p.host} → ${p.container}`).join(", ")}
						</p>
						{/* Поиск storageName по mounts */}
						{(() => {
							let storageName: string | null = null;
							outer: for (const container of pod.containers) {
								for (const m of container.mounts) {
									const idx = m.source.indexOf("Inited_storages/");
									if (idx !== -1) {
										const after = m.source.slice(
											idx + "Inited_storages/".length
										);
										const name = after.split("/")[0];
										storageName = name;
										break outer;
									}
								}
							}
							return storageName ? (
								<p className="text-sm font-mono break-all">
									Storage: {storageName}
								</p>
							) : null;
						})()}

						<p
							className="text-sm text-gray-600 font-mono truncate cursor-pointer select-none"
							title="Click to copy ID"
							onClick={() => navigator.clipboard.writeText(pod.id)}
							style={{
								textOverflow: "ellipsis",
								overflow: "hidden",
								whiteSpace: "nowrap",
							}}
						>
							ID: {pod.id}
						</p>
						<div className="mt-2">
							<h4 className="font-semibold">Containers:</h4>
							{pod.containers.map((container) => (
								<div key={container.container} className="ml-4 mt-1">
									<p>{container.container}</p>
									<details>
										<summary className="cursor-pointer text-xs text-gray-500">
											Mounts ({container.mounts.length})
										</summary>
										<ul className="list-disc list-inside text-xs font-mono pl-4">
											{container.mounts.map((m) => (
												<li key={m.source}>
													<code className="break-all">{m.source}</code> →{" "}
													<code className="break-all">{m.destination}</code>
												</li>
											))}
										</ul>
									</details>
								</div>
							))}
						</div>
					</div>
				))}
				{runningInstances.length === 0 && <p>No running instances found.</p>}
			</div>

			{/* Action Forms */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left Column: Start New & Delete */}
				<div className="flex flex-col justify-between min-h-[500px] h-full">
					{/* Start New Core Environment Form */}
					<form
						onSubmit={handleStartNew}
						className="p-4 border rounded-lg space-y-4"
					>
						<h3 className="text-xl font-semibold">
							Start New Core Environment
						</h3>
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
							<label
								htmlFor="start-storage"
								className="block text-sm font-medium"
							>
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
						<button
							type="submit"
							disabled={loading || !startTag || !startPort || !startStorage}
							className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
						>
							Start
						</button>
					</form>

					{/* Delete Instance Form */}
					<form
						onSubmit={handleDelete}
						className="p-4 border rounded-lg space-y-4"
					>
						<h3 className="text-xl font-semibold">Delete Instance</h3>
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
						<button
							type="submit"
							disabled={loading || !deletePodId}
							className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
						>
							Delete
						</button>
					</form>
				</div>

				{/* Right Column: Add Image to Env */}
				<form
					onSubmit={handleAddImage}
					className="p-4 border rounded-lg space-y-4"
				>
					<h3 className="text-xl font-semibold">Add Image to Env</h3>
					<div>
						<label htmlFor="add-pod" className="block text-sm font-medium">
							Env
						</label>
						<select
							id="add-pod"
							value={addPodId}
							onChange={(e) => setAddPodId(e.target.value)}
							className="w-full p-2 border rounded"
						>
							<option value="">Select an env...</option>
							{runningInstances.map((p) => (
								<option key={p.id} value={p.id}>
									{p.pod_name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label htmlFor="add-image" className="block text-sm font-medium">
							Image
						</label>
						<select
							id="add-image"
							value={addImageId}
							onChange={(e) => setAddImageId(e.target.value)}
							className="w-full p-2 border rounded"
						>
							<option value="">Select an image...</option>
							{assistanceImages.map((img) => (
								<option key={img.id} value={img.id}>
									{img.repository}:{img.tag}
								</option>
							))}
						</select>
					</div>
					<div>
						<label htmlFor="add-type" className="block text-sm font-medium">
							Type
						</label>
						<select
							id="add-type"
							value={addImageType}
							onChange={(e) =>
								setAddImageType(
									e.target.value as "client" | "server" | "feedback"
								)
							}
							className="w-full p-2 border rounded"
						>
							<option value="client">client</option>
							<option value="server">server</option>
							<option value="feedback">feedback</option>
						</select>
					</div>
					<div>
						<label htmlFor="add-env" className="block text-sm font-medium">
							Environment Variables (JSON)
						</label>
						<textarea
							id="add-env"
							value={envJson}
							onChange={(e) => setEnvJson(e.target.value)}
							rows={13}
							className="w-full p-2 border rounded font-mono text-sm"
						></textarea>
					</div>
					<button
						type="submit"
						disabled={loading || !addPodId || !addImageId || !addImageType}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
					>
						Add Image
					</button>
				</form>
			</div>
		</div>
	);
};

export default EnvironmentsManager;
