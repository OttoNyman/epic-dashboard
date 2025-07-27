import {
	ImagesAndStorages,
	RunningInstancesResponse,
	StartNewResponse,
	AddImageToPodResponse,
} from "@/types";

const API_BASE_URL = "http://epic-ai-tokarev.ddns.hysdev.com:8000";

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
	const response = await fetch(
		`${API_BASE_URL}/start_new?tag=${tag}&port=${port}&storage=${storage}`
	);
	if (!response.ok) throw new Error("Failed to start new environment.");
	return response.json();
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
