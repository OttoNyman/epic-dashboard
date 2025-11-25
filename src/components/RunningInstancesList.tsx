import React, { useCallback } from "react";
import { useRunningInstances } from "../contexts/RunningInstancesContext";
import { useLoader } from "../contexts/LoaderContext";
import { useRefresh } from "../contexts/RefreshContext";
import { deleteInstance } from "@/services/api";

const RunningInstancesList: React.FC = () => {
	const runningInstances = useRunningInstances();
	const { loading, setLoading } = useLoader();
	const onRefresh = useRefresh();

	const handleRemove = useCallback(
		async (podId: string, podName: string) => {
			const confirmed = window.confirm(
				`Remove environment "${podName}" (${podId})?`
			);
			if (!confirmed) return;

			setLoading(true);
			try {
				await deleteInstance(podId);
				alert("Environment deleted.");
				onRefresh();
			} catch (error) {
				console.error(error);
				alert("Failed to delete environment.");
			} finally {
				setLoading(false);
			}
		},
		[onRefresh, setLoading]
	);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
			{runningInstances.map((pod) => (
				<div
					key={pod.id}
					className="relative group border border-gray-200 p-4 rounded-lg"
				>
					<button
						type="button"
						disabled={loading}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleRemove(pod.id, pod.pod_name);
						}}
						className="absolute top-2 right-2 hidden h-7 w-7 items-center justify-center rounded-full bg-white text-red-500 shadow hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 group-hover:flex cursor-pointer"
						aria-label={`Remove environment ${pod.pod_name}`}
					>
						&times;
					</button>
					<div className="mb-2">
						{pod.ports.map((p) => (
							<a
								key={p.host}
								href={`http://epic-ai-tokarev.ddns.hysdev.com:${p.host}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 underline mr-2"
							>
								{`Open :${p.host}`}
							</a>
						))}
					</div>
					<h3 className="font-bold text-lg">{pod.pod_name}</h3>
					<p className="text-sm font-mono break-all">
						Ports:{" "}
						{pod.ports.map((p) => `${p.host} → ${p.container}`).join(", ")}
					</p>
					{(() => {
						let storageName: string | null = null;
						outer: for (const container of pod.containers) {
							for (const m of container.mounts) {
								const idx = m.source.indexOf("Inited_storages/");
								if (idx !== -1) {
									const after = m.source.slice(idx + "Inited_storages/".length);
									const name = after.split("/")[0];
									storageName = name;
									break outer;
								}
							}
						}
						return storageName ? (
							<p className="text-sm font-mono break-all">
								Storage: {storageName}
							</p>
						) : null;
					})()}
					<p
						className="text-sm text-gray-600 font-mono truncate cursor-pointer select-none"
						title="Click to copy ID"
						onClick={() => navigator.clipboard.writeText(pod.id)}
						style={{
							textOverflow: "ellipsis",
							overflow: "hidden",
							whiteSpace: "nowrap",
						}}
					>
						ID: {pod.id}
					</p>
					<div className="mt-2">
						<h4 className="font-semibold">Containers:</h4>
						{pod.containers.map((container) => (
							<div key={container.container} className="ml-4 mt-1">
								<p>{container.container}</p>
								<details>
									<summary className="cursor-pointer text-xs text-gray-500">
										Mounts ({container.mounts.length})
									</summary>
									<ul className="list-disc list-inside text-xs font-mono pl-4">
										{container.mounts.map((m) => (
											<li key={m.source}>
												<code className="break-all">{m.source}</code> →{" "}
												<code className="break-all">{m.destination}</code>
											</li>
										))}
									</ul>
								</details>
							</div>
						))}
					</div>
				</div>
			))}
			{runningInstances.length === 0 && <p>No running instances found.</p>}
		</div>
	);
};

export default RunningInstancesList;
