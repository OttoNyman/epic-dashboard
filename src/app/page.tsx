"use client";

import { useState, useEffect, useCallback } from "react";
import ImagesManager from "@/components/ImagesManager";
import EnvironmentsManager from "@/components/EnvironmentsManager";
import { DockerImage, RunningPod } from "@/types";
import { getStoragesAndImages, getRunningInstances } from "@/services/api";

export default function Home() {
	// State for data
	const [storages, setStorages] = useState<string[]>([]);
	const [images, setImages] = useState<DockerImage[]>([]);
	const [runningInstances, setRunningInstances] = useState<RunningPod[]>([]);

	// State for loading and errors
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Data fetching function
	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const [storagesAndImagesData, runningInstancesData] = await Promise.all([
				getStoragesAndImages(),
				getRunningInstances(),
			]);
			setStorages(storagesAndImagesData.storages);
			setImages(storagesAndImagesData.images.images);
			setRunningInstances(runningInstancesData.stdout.pods);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unknown error occurred."
			);
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Fetch data on initial component mount
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Main render logic
	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-xl">Loading dashboard data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-screen text-center">
				<p className="text-xl text-red-500">Error: {error}</p>
				<button
					onClick={fetchData}
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<h1 className="text-4xl font-bold text-center">
				Environments Dashboard
			</h1>
			<EnvironmentsManager
				runningInstances={runningInstances}
				images={images}
				storages={storages}
				onRefresh={fetchData}
			/>
			<ImagesManager
				storages={storages}
				images={images}
				onRefresh={fetchData}
			/>
		</div>
	);
}
