"use client";

import { useState, useEffect, useCallback } from "react";
import { useLoader } from "@/contexts/LoaderContext";
import ImagesManager from "@/components/ImagesManager";
import EnvironmentsManager from "@/components/EnvironmentsManager";
import ThemeToggle from "@/components/ThemeToggle";
import { DockerImage, RunningPod } from "@/types";
import { ImagesProvider } from "@/contexts/ImagesContext";
import { getStoragesAndImages, getRunningInstances } from "@/services/api";
import { StoragesProvider } from "@/contexts/StoragesContext";
import { RunningInstancesProvider } from "@/contexts/RunningInstancesContext";
import { RefreshProvider } from "@/contexts/RefreshContext";

export default function Home() {
	// State for data
	const [images, setImages] = useState<DockerImage[]>([]);
	const [storages, setStorages] = useState<string[]>([]);
	const [runningInstances, setRunningInstances] = useState<RunningPod[]>([]);

	// State for errors
	const [error, setError] = useState<string | null>(null);
	const { setLoading } = useLoader();

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
							<div className="flex justify-between items-start">
								<div className="text-center flex-1">
									<h1 className="text-4xl font-bold">
										Environments Dashboard
									</h1>
									<p className="text-lg text-gray-600 mt-2">
										http://epic-ai-tokarev.ddns.hysdev.com/
									</p>
								</div>
								<div className="mt-2">
									<ThemeToggle />
								</div>
							</div>

							<EnvironmentsManager />
							<ImagesManager />

							<footer className="mt-auto py-4 text-xs text-gray-400 border-t border-gray-100">
								<div className="grid items-center" style={{ gridTemplateColumns: '1fr 20px 1fr' }}>
									<span className="text-right">BE: S. Tokarev</span>
									<span className="text-center">|</span>
									<span className="text-left">UI: A. Krasnoiarskyi</span>
								</div>
							</footer>
						</div>
					</RefreshProvider>
				</RunningInstancesProvider>
			</StoragesProvider>
		</ImagesProvider>
	);
}
