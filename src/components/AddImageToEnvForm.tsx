import React, { useMemo, useState } from "react";
import { addImageToPod } from "@/services/api";
import { useLoader } from "../contexts/LoaderContext";
import { useImages } from "../contexts/ImagesContext";
import { useRunningInstances } from "../contexts/RunningInstancesContext";
import { useRefresh } from "../contexts/RefreshContext";

const DEFAULT_ENV_VARS = JSON.stringify(
	{
		SUPERUSER_LOGIN: "PO",
		SUPERUSER_PASSWORD: "Epica23!",
		EPICSTAFF_BASIC_LOGIN: "sergey.tokarev@hys-enterprise.com",
		EPICSTAFF_BASIC_PASSWORD: "",
		LLM_API_BASE: "http://epic-ai-tokarev.ddns.hysdev.com:3000/api",
		LLM_MODEL: "openai/accounts/fireworks/models/gpt-oss-120b",
		LLM_API_KEY: "",
		BASE_RETRIEVER_URL: "http://epic-ai-tokarev.ddns.hysdev.com:7701",
		BASE_EMBEDDINGS_URL: "http://epic-ai-tokarev.ddns.hysdev.com:7702",
		AUTH_SUPERUSER_URL: "http://localhost/api/api/",
		BASE_URL_EF_SITE: "http://localhost/api/api/",
		IS_SUPERUSER_AUTH_BY_PASS: "False",
		PATH_KEY_superuser: "/etc/ssl/certs/private_key.pem",
		PATH_PEM_superuser: "/etc/ssl/certs/certificate.pem",
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
	const [customVars, setCustomVars] = useState<{ key: string; value: string }[]>(
		[]
	);
	const assistanceImages = useMemo(
		() => images.filter((img) => img.repository?.includes("virtualassistance")),
		[images]
	);

	const handleAddCustomVar = () => {
		setCustomVars([...customVars, { key: "", value: "" }]);
	};

	const handleCustomVarChange = (
		idx: number,
		field: "key" | "value",
		val: string
	) => {
		const updated = [...customVars];
		updated[idx][field] = val;
		setCustomVars(updated);
	};

	const handleRemoveCustomVar = (idx: number) => {
		const updated = [...customVars];
		updated.splice(idx, 1);
		setCustomVars(updated);
	};

	const mergedEnvObj = {
		...envObj,
		...Object.fromEntries(
			customVars.filter((v) => v.key).map((v) => [v.key, v.value])
		),
	};

	const handleAddImage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!addPodId || !addImageId) {
			alert("Please select a pod and an image.");
			return;
		}
		setLoading(true);
		try {
			await addImageToPod(addPodId, addImageId, addImageType, mergedEnvObj);
			alert("Image added to env successfully!");
			// Reset form to default values
			setAddPodId("");
			setAddImageId("");
			setAddImageType("client");
			setEnvObj(defaultEnvObj);
			setCustomVars([]);
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
			<h3 className="text-xl font-semibold">Add Image to Environment</h3>
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
				<div className="env-vars-section p-4 rounded border">
					<div className="text-sm font-medium mb-2">Environment Variables</div>
					<div className="space-y-2">
						<div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-600 pb-1 border-b">
							<div>Key</div>
							<div>Value</div>
						</div>
						<div className="space-y-2">
						{Object.entries(envObj).map(([key, value]) => {
							if (key === "IS_SUPERUSER_AUTH_BY_PASS") {
								return (
									<div key={key} className="grid grid-cols-2 gap-2 items-center">
										<div
											className="text-xs text-gray-700 font-mono truncate"
											title={key}
										>
											{key}
										</div>
										<select
											value={value}
											onChange={(e) =>
												setEnvObj({ ...envObj, [key]: e.target.value })
											}
											className="p-1 text-xs rounded border border-gray-300 font-mono bg-white w-full"
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
									<div key={key} className="grid grid-cols-2 gap-2 items-start">
										<div
											className="text-xs text-gray-700 font-mono truncate"
											title={key}
										>
											{key}
										</div>
										<div className="space-y-1">
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
												className="p-1 text-xs rounded border border-gray-300 font-mono bg-white w-full"
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
													className="p-1 text-xs rounded border border-gray-300 font-mono bg-white w-full truncate"
													placeholder="Enter value"
													title={value}
												/>
											)}
										</div>
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
									<div key={key} className="grid grid-cols-2 gap-2 items-start">
										<div
											className="text-xs text-gray-700 font-mono truncate"
											title={key}
										>
											{key}
										</div>
										<div className="space-y-1">
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
												className="p-1 text-xs rounded border border-gray-300 font-mono bg-white w-full"
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
													className="p-1 text-xs rounded border border-gray-300 font-mono bg-white w-full truncate"
													placeholder="Enter value"
													title={value}
												/>
											)}
										</div>
									</div>
								);
							}
							if (key === "SUPERUSER_PASSWORD") {
								let selectValue: string;
								const pass1 = "Epica23!";
								const pass2 = "fG4Ev3r_3p1kF'F.yE38rJ,su'D1sE#";
								if (value === pass1 || value === pass2) {
									selectValue = value;
								} else {
									selectValue = "CUSTOM";
								}
								return (
									<div key={key} className="grid grid-cols-2 gap-2 items-start">
										<div
											className="text-xs text-gray-700 font-mono truncate"
											title={key}
										>
											{key}
										</div>
										<div className="space-y-1">
											<select
												value={selectValue}
												onChange={(e) => {
													const v = e.target.value;
													if (v === "CUSTOM") {
														setEnvObj({
															...envObj,
															[key]:
																envObj[key] === pass1 || envObj[key] === pass2
																	? ""
																	: envObj[key],
														});
													} else {
														setEnvObj({ ...envObj, [key]: v });
													}
												}}
												className="p-1 text-xs rounded border border-gray-300 font-mono bg-white w-full"
											>
												<option value={pass1}>{pass1}</option>
												<option value={pass2} title={pass2}>
													{pass2}
												</option>
												<option value="CUSTOM">Other...</option>
											</select>
											{selectValue === "CUSTOM" && (
												<input
													type="text"
													value={value}
													onChange={(e) =>
														setEnvObj({ ...envObj, [key]: e.target.value })
													}
													className="p-1 text-xs rounded border border-gray-300 font-mono bg-white w-full truncate"
													placeholder="Enter value"
													title={value}
												/>
											)}
										</div>
									</div>
								);
							}
							if (key === "EPICSTAFF_BASIC_LOGIN") {
								return (
									<div key={key} className="grid grid-cols-2 gap-2 items-center">
										<div
											className="text-xs text-gray-700 font-mono truncate"
											title={key}
										>
											{key}
										</div>
										<input
											type="text"
											value={value}
											onChange={(e) =>
												setEnvObj({ ...envObj, [key]: e.target.value })
											}
											className="p-1 text-xs rounded border border-gray-300 font-mono bg-white w-full"
											placeholder="Enter login"
											title={value}
										/>
									</div>
								);
							}
							return (
								<div key={key} className="grid grid-cols-2 gap-2 items-center">
									<div
										className="text-xs text-gray-700 font-mono truncate"
										title={key}
									>
										{key}
									</div>
									<input
										type="text"
										value={value}
										onChange={(e) =>
											setEnvObj({ ...envObj, [key]: e.target.value })
										}
										className="p-1 text-xs rounded border border-gray-300 font-mono bg-white w-full truncate"
										title={value}
									/>
								</div>
							);
						})}
						{/* Custom variables */}
						{customVars.map((v, idx) => (
							<div key={idx} className="grid grid-cols-2 gap-2 items-center">
								<input
									type="text"
									value={v.key}
									onChange={(e) =>
										handleCustomVarChange(idx, "key", e.target.value)
									}
									className="p-1 text-xs rounded border border-gray-300 font-mono bg-white w-full truncate"
									placeholder="Custom key"
									title={v.key}
								/>
								<div className="flex gap-1 items-center">
									<input
										type="text"
										value={v.value}
										onChange={(e) =>
											handleCustomVarChange(idx, "value", e.target.value)
										}
										className="p-1 text-xs rounded border border-gray-300 font-mono bg-white flex-1 truncate"
										placeholder="Custom value"
										title={v.value}
									/>
									<button
										type="button"
										onClick={() => handleRemoveCustomVar(idx)}
										className="text-red-500 px-2 text-sm hover:bg-red-100 rounded cursor-pointer"
										title="Remove"
									>
										×
									</button>
								</div>
							</div>
						))}
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={handleAddCustomVar}
								className="text-sky-500 text-xs px-2 py-1 rounded hover:bg-sky-100 justify-self-start font-mono cursor-pointer"
								title="Add variable"
							>
								+ Add variable
							</button>
							<div></div>
						</div>
						</div>
					</div>
				</div>
			</div>
			<button
				type="submit"
				disabled={loading || !addPodId || !addImageId || !addImageType}
				className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:bg-gray-400"
			>
				Add Image
			</button>
		</form>
	);
};

export default AddImageToEnvForm;
