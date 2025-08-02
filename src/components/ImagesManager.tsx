"use client";

import React, { useState, useMemo } from "react";
import { DockerImage } from "@/types";
import { addCoreImage, addGitlabImage } from "@/services/api";
import { useLoader } from "./LoaderContext";

type SortDirection = "asc" | "desc";

interface Props {
	storages: string[];
	images: DockerImage[];
	onRefresh: () => void;
}

const ArrowIcon = ({ direction }: { direction: "asc" | "desc" }) => (
	<svg
		width="8"
		height="8"
		viewBox="0 0 12 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style={{
			display: "inline",
			transform: direction === "asc" ? "rotate(0deg)" : "rotate(180deg)",
		}}
	>
		<path d="M6 3L10 9H2L6 3Z" fill="#222" />
	</svg>
);

const ImagesManager: React.FC<Props> = ({ storages, images, onRefresh }) => {
	const [coreImageLink, setCoreImageLink] = useState("");
	const [gitlabImageLink, setGitlabImageLink] = useState("");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [sortColumn, setSortColumn] = useState<string>("created");
	const { loading, setLoading } = useLoader();

	const sortedImages = useMemo(() => {
		return [...images].sort((a, b) => {
			let aValue = a[sortColumn as keyof DockerImage];
			let bValue = b[sortColumn as keyof DockerImage];
			if (
				sortColumn === "created" ||
				sortColumn === "size" ||
				sortColumn === "containers"
			) {
				aValue = Number(aValue);
				bValue = Number(bValue);
			}
			if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
			if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});
	}, [images, sortDirection, sortColumn]);

	const handleSort = (column: string) => {
		if (sortColumn === column) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	const handleSubmitCoreImage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!coreImageLink) return;
		setLoading(true);
		try {
			await addCoreImage(coreImageLink);
			alert("Core image added successfully!");
			setCoreImageLink("");
			onRefresh();
		} catch (error) {
			console.error(error);
			alert("Failed to add core image.");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmitGitlabImage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!gitlabImageLink) return;
		setLoading(true);
		try {
			await addGitlabImage(gitlabImageLink);
			alert("Epica image added successfully!");
			setGitlabImageLink("");
			onRefresh();
		} catch (error) {
			console.error(error);
			alert("Failed to add Epica image.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-4">Storages and Images</h2>

			{/* Storages List */}
			<h3 className="text-xl font-semibold mb-2">Available Storages</h3>
			<ul className="list-disc list-inside mb-6 p-4 bg-gray-100 rounded text-sm">
				{storages.map((storage) => (
					<li key={storage}>{storage}</li>
				))}
			</ul>

			{/* Docker Images Table */}
			<h3 className="text-xl font-semibold mb-2">Docker Images</h3>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-200">
					<thead>
						<tr className="bg-gray-100">
							<th
								className="py-2 px-2 border-b w-32 text-left cursor-pointer select-none"
								onClick={() => handleSort("id")}
							>
								ID
								{sortColumn === "id" && (
									<span className="inline-block align-middle ml-1">
										<ArrowIcon direction={sortDirection} />
									</span>
								)}
							</th>
							<th
								className="py-2 px-2 border-b text-left cursor-pointer select-none"
								onClick={() => handleSort("repository")}
							>
								Repository
								{sortColumn === "repository" && (
									<span className="inline-block align-middle ml-1">
										<ArrowIcon direction={sortDirection} />
									</span>
								)}
							</th>
							<th
								className="py-2 px-2 border-b cursor-pointer text-left select-none"
								onClick={() => handleSort("tag")}
							>
								Tag
								{sortColumn === "tag" && (
									<span className="inline-block align-middle ml-1">
										<ArrowIcon direction={sortDirection} />
									</span>
								)}
							</th>
							<th
								className="py-2 px-2 border-b text-left cursor-pointer select-none"
								onClick={() => handleSort("size")}
							>
								Size (MB)
								{sortColumn === "size" && (
									<span className="inline-block align-middle ml-1">
										<ArrowIcon direction={sortDirection} />
									</span>
								)}
							</th>
							<th
								className="py-2 px-2 border-b w-56 text-left cursor-pointer select-none"
								onClick={() => handleSort("created")}
							>
								Created
								{sortColumn === "created" && (
									<span className="inline-block align-middle ml-1">
										<ArrowIcon direction={sortDirection} />
									</span>
								)}
							</th>
							<th
								className="py-2 px-2 border-b text-left cursor-pointer select-none"
								onClick={() => handleSort("containers")}
							>
								Containers
								{sortColumn === "containers" && (
									<span className="inline-block align-middle ml-1">
										<ArrowIcon direction={sortDirection} />
									</span>
								)}
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedImages.map((img) => (
							<tr key={img.id} className="hover:bg-gray-100 text-sm">
								<td
									className="py-2 px-2 border-b font-mono truncate max-w-[7rem] relative group cursor-pointer hover:bg-blue-50"
									title="Click to copy ID"
									onClick={() => navigator.clipboard.writeText(img.id)}
								>
									<span title={img.id} style={{ userSelect: "all" }}>
										{img.id}
									</span>
								</td>
								<td className="py-2 px-2 border-b">{img.repository}</td>
								<td className="py-2 px-2 border-b">{img.tag}</td>
								<td className="py-2 px-2 border-b">
									{(img.size / 1024 / 1024).toFixed(1)}
								</td>
								<td className="py-2 px-2 border-b">
									{(() => {
										const d = new Date(img.created * 1000);
										const day = String(d.getDate()).padStart(2, "0");
										const month = String(d.getMonth() + 1).padStart(2, "0");
										const year = d.getFullYear();
										const hours = String(d.getHours()).padStart(2, "0");
										const minutes = String(d.getMinutes()).padStart(2, "0");
										return `${day}/${month}/${year}, ${hours}:${minutes}`;
									})()}
								</td>
								<td className="py-2 px-2 border-b">{img.containers}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Add Image Forms */}
			<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
				<form onSubmit={handleSubmitCoreImage} className="space-y-3">
					<label htmlFor="core-image" className="block text-md font-medium">
						Add Core Image (
						<a
							href="https://build-win-vm1.epicflow.hysdev.com/project/EpicFlow?mode=builds"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 underline hover:text-blue-700"
						>
							TeamCity
						</a>
						)
					</label>
					<input
						id="core-image"
						type="text"
						value={coreImageLink}
						onChange={(e) => setCoreImageLink(e.target.value)}
						placeholder="Enter TeamCity image URL"
						className="w-full p-2 border border-gray-300 rounded"
						disabled={loading}
					/>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
						disabled={loading || !coreImageLink}
					>
						Add
					</button>
				</form>

				<form onSubmit={handleSubmitGitlabImage} className="space-y-3">
					<label htmlFor="gitlab-image" className="block text-md font-medium">
						Add Epica image (
						<a
							href="https://gitlab.hysdev.com/epicflownextgen/virtualassistance/container_registry/128"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 underline hover:text-blue-700"
						>
							GitLab
						</a>
						)
					</label>
					<input
						id="gitlab-image"
						type="text"
						value={gitlabImageLink}
						onChange={(e) => setGitlabImageLink(e.target.value)}
						placeholder="Enter GitLab image URL"
						className="w-full p-2 border border-gray-300 rounded"
						disabled={loading}
					/>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
						disabled={loading || !gitlabImageLink}
					>
						Add
					</button>
				</form>
			</div>
		</div>
	);
};

export default ImagesManager;
