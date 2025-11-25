import {
	ImagesAndStorages,
	RunningInstancesResponse,
	StartNewResponse,
	AddImageToPodResponse,
	ApiErrorResponse,
} from "@/types";

const API_BASE_URL = "htt"+"p://epic-ai-tokarev.ddns.hysdev.com:8000";

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
	return (
		typeof value === "object" &&
		value !== null &&
		"error" in value &&
		typeof (value as Record<string, unknown>).error === "string"
	);
};

export const getStoragesAndImages = async (): Promise<ImagesAndStorages> => {
	const response = await fetch(`${API_BASE_URL}/get_list_storages_and_images`);
	if (!response.ok) throw new Error("Failed to fetch storages and images.");
	return response.json();
};

export const getRunningInstances =
	async (): Promise<RunningInstancesResponse> => {
		const response = await fetch(`${API_BASE_URL}/get_all_running_instanses`);
		if (!response.ok) throw new Error("Failed to fetch running instances.");
		return response.json();
	};

export const addCoreImage = async (link: string): Promise<unknown> => {
	const response = await fetch(`${API_BASE_URL}/add_core_image`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ link }),
	});
	if (!response.ok) throw new Error("Failed to add core image.");
	return response.json();
};

export const addGitlabImage = async (link: string): Promise<unknown> => {
	const response = await fetch(`${API_BASE_URL}/add_gitlab_image`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ link }),
	});
	if (!response.ok) throw new Error("Failed to add GitLab image.");
	return response.json();
};

export const startNewEnvironment = async (
	tag: string,
	port: number,
	storage: string
): Promise<StartNewResponse> => {
	const params = new URLSearchParams({
		tag,
		port: String(port),
		storage,
	});
	const response = await fetch(`${API_BASE_URL}/start_new?${params.toString()}`);
	if (!response.ok) throw new Error("Failed to start new environment.");

	const data = await response.json();
	if (isApiErrorResponse(data)) {
		throw new Error(data.error || "Failed to start new environment.");
	}

	return data as StartNewResponse;
};

export const addImageToPod = async (
	pod_id: string,
	image_id: string,
	type: "client" | "server" | "feedback",
	env: object
): Promise<AddImageToPodResponse> => {
	const response = await fetch(`${API_BASE_URL}/add_image_to_pod`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ pod_id, image_id, type, env }),
	});
	if (!response.ok) throw new Error("Failed to add image to pod.");
	return response.json();
};

export const deleteInstance = async (podId: string): Promise<unknown> => {
	const response = await fetch(
		`${API_BASE_URL}/delete_instanse?pod_id=${podId}`
	);
	if (!response.ok) throw new Error("Failed to delete instance.");
	return response.json();
};
