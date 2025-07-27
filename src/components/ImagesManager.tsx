"use client";

import React, { useState, useMemo } from "react";
import { DockerImage } from "@/types";
import { addCoreImage, addGitlabImage } from "@/services/api";

type SortDirection = "asc" | "desc";

interface Props {
	storages: string[];
	images: DockerImage[];
	onRefresh: () => void;
}

const ImagesManager: React.FC<Props> = ({ storages, images, onRefresh }) => {
	const [coreImageLink, setCoreImageLink] = useState("");
	const [gitlabImageLink, setGitlabImageLink] = useState("");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const sortedImages = useMemo(() => {
		return [...images].sort((a, b) => {
			if (a.tag < b.tag) return sortDirection === "asc" ? -1 : 1;
			if (a.tag > b.tag) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});
	}, [images, sortDirection]);

	const handleSortByTag = () => {
		setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
	};

	const handleSubmitCoreImage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!coreImageLink) return;
		setIsSubmitting(true);
		try {
			await addCoreImage(coreImageLink);
			alert("Core image added successfully!");
			setCoreImageLink("");
			onRefresh();
		} catch (error) {
			console.error(error);
			alert("Failed to add core image.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSubmitGitlabImage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!gitlabImageLink) return;
		setIsSubmitting(true);
		try {
			await addGitlabImage(gitlabImageLink);
			alert("Epica image added successfully!");
			setGitlabImageLink("");
			onRefresh();
		} catch (error) {
			console.error(error);
			alert("Failed to add Epica image.");
		} finally {
			setIsSubmitting(false);
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
							<th className="py-2 px-2 border-b w-32">ID</th>
							<th className="py-2 px-4 border-b">Repository</th>
							<th
								className="py-2 px-4 border-b cursor-pointer"
								onClick={handleSortByTag}
							>
								Tag
								<span className="inline-block align-middle ml-1">
									{sortDirection === "asc" ? (
										<svg
											width="12"
											height="12"
											viewBox="0 0 20 20"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											style={{ display: "inline" }}
										>
											<path
												d="M6 12L10 8L14 12"
												stroke="#222"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									) : (
										<svg
											width="12"
											height="12"
											viewBox="0 0 20 20"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											style={{ display: "inline" }}
										>
											<path
												d="M6 8L10 12L14 8"
												stroke="#222"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									)}
								</span>
							</th>
							<th className="py-2 px-4 border-b">Size (MB)</th>
							<th className="py-2 px-6 border-b w-56">Created</th>
							<th className="py-2 px-4 border-b">Containers</th>
						</tr>
					</thead>
					<tbody>
						{sortedImages.map((img) => (
							<tr key={img.id} className="hover:bg-gray-100 text-sm">
								<td className="py-2 px-2 border-b font-mono truncate max-w-[7rem] relative group">
									<span
										title={img.id}
										style={{ userSelect: "all", cursor: "pointer" }}
									>
										{img.id}
									</span>
								</td>
								<td className="py-2 px-4 border-b">{img.repository}</td>
								<td className="py-2 px-4 border-b">{img.tag}</td>
								<td className="py-2 px-4 border-b">
									{(img.size / 1024 / 1024).toFixed(1)}
								</td>
<td className="py-2 px-6 border-b w-56">
	{(() => {
		const d = new Date(img.created * 1000);
		const day = String(d.getDate()).padStart(2, '0');
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const year = d.getFullYear();
		const hours = String(d.getHours()).padStart(2, '0');
		const minutes = String(d.getMinutes()).padStart(2, '0');
		return `${day}/${month}/${year}, ${hours}:${minutes}`;
	})()}
</td>
								<td className="py-2 px-4 border-b">{img.containers}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Add Image Forms */}
			<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
				<form onSubmit={handleSubmitCoreImage} className="space-y-3">
					<label htmlFor="core-image" className="block text-md font-medium">
						Add Core Image (TeamCity link)
					</label>
					<input
						id="core-image"
						type="text"
						value={coreImageLink}
						onChange={(e) => setCoreImageLink(e.target.value)}
						placeholder="Enter TeamCity image URL"
						className="w-full p-2 border border-gray-300 rounded"
						disabled={isSubmitting}
					/>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
						disabled={isSubmitting || !coreImageLink}
					>
						Add
					</button>
				</form>

				<form onSubmit={handleSubmitGitlabImage} className="space-y-3">
					<label htmlFor="gitlab-image" className="block text-md font-medium">
						Add Epica image (GitLab link)
					</label>
					<input
						id="gitlab-image"
						type="text"
						value={gitlabImageLink}
						onChange={(e) => setGitlabImageLink(e.target.value)}
						placeholder="Enter GitLab image URL"
						className="w-full p-2 border border-gray-300 rounded"
						disabled={isSubmitting}
					/>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
						disabled={isSubmitting || !gitlabImageLink}
					>
						Add
					</button>
				</form>
			</div>
		</div>
	);
};

export default ImagesManager;
