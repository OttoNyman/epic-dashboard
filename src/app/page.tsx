"use client";

import { useState, useEffect, useCallback } from "react";
import { useLoader } from "@/components/LoaderContext";
import Loader from "@/components/Loader";
import ImagesManager from "@/components/ImagesManager";
import EnvironmentsManager from "@/components/EnvironmentsManager";
import { DockerImage, RunningPod } from "@/types";
import { ImagesProvider } from "@/components/ImagesContext";
import { getStoragesAndImages, getRunningInstances } from "@/services/api";
import { StoragesProvider } from "@/components/StoragesContext";
import { RunningInstancesProvider } from "@/components/RunningInstancesContext";
import { RefreshProvider } from "@/components/RefreshContext";

export default function Home() {
	// State for data
	const [images, setImages] = useState<DockerImage[]>([]);
	const [storages, setStorages] = useState<string[]>([]);
	const [runningInstances, setRunningInstances] = useState<RunningPod[]>([]);

	// State for errors
	const [error, setError] = useState<string | null>(null);
	const { loading, setLoading } = useLoader();

	// Data fetching function
	const fetchData = useCallback(async () => {
		setLoading(true);
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
			setLoading(false);
		}
	}, [setLoading]);

	// Fetch data on initial component mount
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Main render logic
	if (loading) {
		return <Loader />;
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
		<ImagesProvider images={images}>
			<StoragesProvider storages={storages}>
				<RunningInstancesProvider runningInstances={runningInstances}>
					<RefreshProvider onRefresh={fetchData}>
						<div className="space-y-8 min-h-screen flex flex-col">
							<h1 className="text-4xl font-bold text-center">
								Environments Dashboard
							</h1>

							<EnvironmentsManager />
							<ImagesManager />

							<footer className="mt-auto py-4 text-xs text-gray-400 text-center border-t border-gray-100">
								BE: S. Tokarev &nbsp;|&nbsp; UI: A. Krasnoiarskyi
							</footer>
						</div>
					</RefreshProvider>
				</RunningInstancesProvider>
			</StoragesProvider>
		</ImagesProvider>
	);
}
