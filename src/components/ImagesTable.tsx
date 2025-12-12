import React, { useMemo, useState } from "react";
import { DockerImage } from "@/types";
import { useImages } from "@/contexts/ImagesContext";
import { deleteImage } from "@/services/api";
import { useRefresh } from "@/contexts/RefreshContext";
import { useLoader } from "@/contexts/LoaderContext";

type SortDirection = "asc" | "desc";

const ArrowIcon = ({ direction }: { direction: SortDirection }) => (
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

const ImagesTable: React.FC = () => {
	const images = useImages();
	const onRefresh = useRefresh();
	const { loading, setLoading } = useLoader();
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [sortColumn, setSortColumn] = useState<string>("created");

	const handleSort = (column: string) => {
		if (sortColumn === column) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	const handleDeleteImage = async (imageId: string, imageName: string) => {
		if (
			!confirm(
				`Remove image "${imageName}" (${imageId.substring(0, 12)}...)?`
			)
		) {
			return;
		}
		setLoading(true);
		try {
			await deleteImage(imageId);
			alert("Image removed successfully!");
			onRefresh();
		} catch (error) {
			console.error(error);
			alert("Failed to remove image.");
		} finally {
			setLoading(false);
		}
	};

	const sortedImages = useMemo(() => {
		return images.toSorted((a, b) => {
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

	return (
		<>
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
						{sortedImages.map((img) => {
							const canDelete = Number(img.containers) === 0;
							const imageName = `${img.repository}:${img.tag}`;
							
							return (
								<tr key={img.id} className="hover:bg-gray-100 text-sm relative group/image-row">
									<td
										className="py-2 px-2 border-b font-mono truncate max-w-[7rem] relative cursor-pointer hover:bg-blue-50"
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
									<td className="py-2 px-2 border-b relative">
										<span>{img.containers}</span>
										{/* Delete button - appears on hover */}
										<button
											type="button"
											disabled={!canDelete || loading}
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteImage(img.id, imageName);
											}}
											className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/image-row:opacity-100 transition-opacity h-7 w-7 flex items-center justify-center rounded-full shadow focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-default ${
												canDelete
													? "bg-white text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
													: "bg-gray-200 text-gray-400 cursor-default group-hover/image-row:opacity-50"
											}`}
											title={
												canDelete
													? `Remove image ${imageName}`
													: `Cannot remove: ${img.containers} container(s) in use`
											}
											aria-label={`Remove image ${imageName}`}
										>
											<span className="text-lg leading-none">&times;</span>
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default ImagesTable;
