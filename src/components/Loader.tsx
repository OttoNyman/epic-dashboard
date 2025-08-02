"use client";

import { useLoader } from "./LoaderContext";
const Loader = () => {
	const { loading } = useLoader();
	if (!loading) return null;
	return (
		<div className="fixed inset-0 bg-gray-200 bg-opacity-60 flex items-center justify-center z-50">
			<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
		</div>
	);
};
export default Loader;
