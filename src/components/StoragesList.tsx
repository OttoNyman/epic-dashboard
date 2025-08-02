import { useStorages } from "@/contexts/StoragesContext";
import React from "react";

const StoragesList: React.FC = () => {
	const storages = useStorages();
	return (
		<>
			<h3 className="text-xl font-semibold mb-2">Available Storages</h3>
			
			<ul className="list-disc list-inside mb-6 p-4 bg-gray-100 rounded text-sm">
				{storages.map((storage) => (
					<li key={storage}>{storage}</li>
				))}
			</ul>
		</>
	);
};

export default StoragesList;
