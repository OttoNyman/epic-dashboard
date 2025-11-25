import { useLoader } from "@/contexts/LoaderContext";
import { useRefresh } from "@/contexts/RefreshContext";
import { addCoreImage, addGitlabImage } from "@/services/api";
import React, { useState } from "react";

const AddImages: React.FC = () => {
	const onRefresh = useRefresh();
	const { loading, setLoading } = useLoader();
	const [coreImageLink, setCoreImageLink] = useState("");
	const [gitlabImageLink, setGitlabImageLink] = useState("");

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
		<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
			<form onSubmit={handleSubmitCoreImage} className="space-y-3">
				<label htmlFor="core-image" className="block text-md font-medium">
					Add Core Image (
					<a
						href="https://build-win-vm1.epicflow.hysdev.com/project/EpicFlow?mode=builds"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:text-blue-700"
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
					className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:bg-gray-400"
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
						className="text-blue-500 hover:text-blue-700"
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
					className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:bg-gray-400"
					disabled={loading || !gitlabImageLink}
				>
					Add
				</button>
			</form>
		</div>
	);
};

export default AddImages;
