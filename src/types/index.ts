export interface DockerImage {
	id: string;
	repository: string;
	tag: string;
	size: number;
	created: number;
	containers: string;
}

export interface ImagesAndStorages {
	storages: string[];
	images: {
		images: DockerImage[];
	};
}

export interface RunningContainer {
	container: string;
	mounts: {
		source: string;
		destination: string;
	}[];
}

export interface RunningPod {
	id: string;
	pod_name: string;
	ports: {
		host: number;
		container: number;
	}[];
	containers: RunningContainer[];
}

export interface RunningInstancesResponse {
	stdout: {
		pods: RunningPod[];
	};
}

export interface StartNewResponse {
	pod_name: string;
	port: string;
	storage_path: string;
	network: string;
	ip_address: string | null;
	containers: {
		name: string;
		id: string;
	}[];
}

export interface AddImageToPodResponse {
	// Define structure based on actual API response if available
	[key: string]: unknown;
}
