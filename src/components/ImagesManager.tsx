"use client";

import StoragesList from "./StoragesList";
import ImagesTable from "./ImagesTable";
import AddImages from "./AddImages";

const ImagesManager: React.FC = () => {
	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-4">Storages and Images</h2>
			<StoragesList />
			<ImagesTable />
			<AddImages />
		</div>
	);
};

export default ImagesManager;
