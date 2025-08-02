import React, { useMemo, useState } from "react";
import { addImageToPod } from "@/services/api";
import { useLoader } from "./LoaderContext";
import { useImages } from "./ImagesContext";
import { useRunningInstances } from "./RunningInstancesContext";
import { useRefresh } from "./RefreshContext";

const DEFAULT_ENV_VARS = JSON.stringify(
	{
		SUPERUSER_LOGIN: "PO",
		SUPERUSER_PASSWORD: "Epica23!",
		BASE_RETRIEVER_URL: "http://epic-ai-tokarev.ddns.hysdev.com:7701",
		BASE_EMBEDDINGS_URL: "http://epic-ai-tokarev.ddns.hysdev.com:7702",
		AUTH_SUPERUSER_URL: "http://localhost/api/api/",
		BASE_URL_EF_SITE: "http://localhost/api/api/",
		IS_SUPERUSER_AUTH_BY_PASS: "False",
		PATH_KEY_superuser: "/etc/ssl/certs/private_key.pem",
		PATH_PEM_superuser: "/etc/ssl/certs/certificate.pem",
		LLM_TYPE: "OPENAI",
		OPENAI_API_KEY: "",
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

const AddImageToEnvForm: React.FC = () => {
	const images = useImages();
	const runningInstances = useRunningInstances();
	const onRefresh = useRefresh();
	const { loading, setLoading } = useLoader();
	const [addPodId, setAddPodId] = useState("");
	const [addImageId, setAddImageId] = useState("");
	const [addImageType, setAddImageType] = useState<
		"client" | "server" | "feedback"
	>("client");
	const defaultEnvObj = useMemo(() => JSON.parse(DEFAULT_ENV_VARS), []);
	const [envObj, setEnvObj] = useState<{ [key: string]: string }>(
		defaultEnvObj
	);
	const assistanceImages = useMemo(
		() => images.filter((img) => img.repository?.includes("virtualassistance")),
		[images]
	);

	const handleAddImage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!addPodId || !addImageId) {
			alert("Please select a pod and an image.");
			return;
		}
		setLoading(true);
		try {
			await addImageToPod(addPodId, addImageId, addImageType, envObj);
			alert("Image added to env successfully!");
			onRefresh();
		} catch (error) {
			console.error(error);
			alert("Failed to add image to env.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleAddImage} className="p-4 border rounded-lg space-y-4">
			<h3 className="text-xl font-semibold">Add Image to Env</h3>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="space-y-4">
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
				</div>
				<div className="bg-gray-50 p-4 rounded border border-gray-200">
					<div className="text-sm font-medium mb-2">Environment Variables</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
						{Object.entries(envObj).map(([key, value]) => {
							if (key === "IS_SUPERUSER_AUTH_BY_PASS") {
								return (
									<div key={key} className="flex flex-col mb-1">
										<label
											className="text-xs text-gray-500 font-mono truncate"
											title={key}
										>
											{key}
										</label>
										<select
											value={value}
											onChange={(e) =>
												setEnvObj({ ...envObj, [key]: e.target.value })
											}
											className="p-1 text-xs rounded border border-gray-300 font-mono bg-white"
											style={{ minWidth: 0 }}
										>
											<option value="False">False</option>
											<option value="True">True</option>
										</select>
									</div>
								);
							}
							if (key === "LOG_LEVEL") {
								let selectValue: string;
								if (value === "ERROR" || value === "DEBUG") {
									selectValue = value;
								} else {
									selectValue = "CUSTOM";
								}
								return (
									<div key={key} className="flex flex-col mb-1">
										<label
											className="text-xs text-gray-500 font-mono truncate"
											title={key}
										>
											{key}
										</label>
										<select
											value={selectValue}
											onChange={(e) => {
												const v = e.target.value;
												if (v === "CUSTOM") {
													setEnvObj({
														...envObj,
														[key]:
															envObj[key] === "ERROR" || envObj[key] === "DEBUG"
																? ""
																: envObj[key],
													});
												} else {
													setEnvObj({ ...envObj, [key]: v });
												}
											}}
											className="p-1 text-xs rounded border border-gray-300 font-mono bg-white"
											style={{ minWidth: 0 }}
										>
											<option value="DEBUG">DEBUG</option>
											<option value="ERROR">ERROR</option>
											<option value="CUSTOM">Other...</option>
										</select>
										{selectValue === "CUSTOM" && (
											<input
												type="text"
												value={value}
												onChange={(e) =>
													setEnvObj({ ...envObj, [key]: e.target.value })
												}
												className="p-1 text-xs rounded border border-gray-300 font-mono bg-white mt-1"
												style={{ minWidth: 0 }}
												placeholder="Enter value"
											/>
										)}
									</div>
								);
							}
							if (key === "SUPERUSER_LOGIN") {
								let selectValue: string;
								if (value === "PO" || value === "Admin") {
									selectValue = value;
								} else {
									selectValue = "CUSTOM";
								}
								return (
									<div key={key} className="flex flex-col mb-1">
										<label
											className="text-xs text-gray-500 font-mono truncate"
											title={key}
										>
											{key}
										</label>
										<select
											value={selectValue}
											onChange={(e) => {
												const v = e.target.value;
												if (v === "CUSTOM") {
													setEnvObj({
														...envObj,
														[key]:
															envObj[key] === "PO" || envObj[key] === "Admin"
																? ""
																: envObj[key],
													});
												} else {
													setEnvObj({ ...envObj, [key]: v });
												}
											}}
											className="p-1 text-xs rounded border border-gray-300 font-mono bg-white"
											style={{ minWidth: 0 }}
										>
											<option value="PO">PO</option>
											<option value="Admin">Admin</option>
											<option value="CUSTOM">Other...</option>
										</select>
										{selectValue === "CUSTOM" && (
											<input
												type="text"
												value={value}
												onChange={(e) =>
													setEnvObj({ ...envObj, [key]: e.target.value })
												}
												className="p-1 text-xs rounded border border-gray-300 font-mono bg-white mt-1"
												style={{ minWidth: 0 }}
												placeholder="Enter value"
											/>
										)}
									</div>
								);
							}
							if (key === "SUPERUSER_PASSWORD") {
								let selectValue: string;
								const pass2 = "fG4Ev3r_3p1kF'F.yE38rJ,su'D1sE#";
								const pass2Esc = "fG4Ev3r_3p1kF&#39;F.yE38rJ,su&#39;D1sE#";
								if (value === "Epica23!" || value === pass2) {
									selectValue = value;
								} else {
									selectValue = "CUSTOM";
								}
								return (
									<div key={key} className="flex flex-col mb-1">
										<label
											className="text-xs text-gray-500 font-mono truncate"
											title={key}
										>
											{key}
										</label>
										<select
											value={selectValue}
											onChange={(e) => {
												const v = e.target.value;
												if (v === "CUSTOM") {
													setEnvObj({
														...envObj,
														[key]:
															envObj[key] === "Epica23!" ||
															envObj[key] === pass2
																? ""
																: envObj[key],
													});
												} else if (v === pass2Esc) {
													setEnvObj({ ...envObj, [key]: pass2 });
												} else {
													setEnvObj({ ...envObj, [key]: v });
												}
											}}
											className="p-1 text-xs rounded border border-gray-300 font-mono bg-white"
											style={{ minWidth: 0 }}
										>
											<option value="Epica23!">Epica23!</option>
											<option value={pass2Esc}>{pass2}</option>
											<option value="CUSTOM">Other...</option>
										</select>
										{selectValue === "CUSTOM" && (
											<input
												type="text"
												value={value}
												onChange={(e) =>
													setEnvObj({ ...envObj, [key]: e.target.value })
												}
												className="p-1 text-xs rounded border border-gray-300 font-mono bg-white mt-1"
												style={{ minWidth: 0 }}
												placeholder="Enter value"
											/>
										)}
									</div>
								);
							}
							return (
								<div key={key} className="flex flex-col mb-1">
									<label
										className="text-xs text-gray-500 font-mono truncate"
										title={key}
									>
										{key}
									</label>
									<input
										type="text"
										value={value}
										onChange={(e) =>
											setEnvObj({ ...envObj, [key]: e.target.value })
										}
										className="p-1 text-xs rounded border border-gray-300 font-mono bg-white"
										style={{ minWidth: 0 }}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
			<button
				type="submit"
				disabled={loading || !addPodId || !addImageId || !addImageType}
				className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
			>
				Add Image
			</button>
		</form>
	);
};

export default AddImageToEnvForm;
