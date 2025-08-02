"use client";

import { useLoader } from "../contexts/LoaderContext"; // Предполагается, что вы используете этот контекст
import { useState, useEffect } from "react";

// Встроенные стили для градиентного лоадера
const styles = `
.loader-wrapper-gradient {
    position: relative;
    width: 2000px;
    height: 2000px;
    animation: appear-smooth 10s ease-out forwards;
}

.gradient-orb {
    width: 100%;
    height: 100%;
    background: conic-gradient(
        from 180deg at 50% 50%,
        #2a8af6 0deg,
        #a335f2 120deg,
        #f23557 240deg,
        #2a8af6 360deg
    );
    border-radius: 50%;
    filter: blur(40px);
    animation: rotate-gradient 3s linear infinite;
}

.gradient-orb-core {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    background: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    filter: blur(5px);
    opacity: 0.5;
}

@keyframes appear-smooth {
    from {
        transform: scale(0);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes rotate-gradient {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
`;

const Loader = () => {
	const { loading } = useLoader();
	const [showComponent, setShowComponent] = useState(false);

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		if (loading) {
			setShowComponent(true);
		} else {
			timeout = setTimeout(() => {
				setShowComponent(false);
			}, 1000); //Must match `duration-1000`
		}
		return () => clearTimeout(timeout);
	}, [loading]);

	if (!showComponent) return null;

	return (
		<>
			<style>{styles}</style>
			<div
				className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000 ${
					loading ? "opacity-100" : "opacity-0"
				}`}
			>
				<div
					className={`absolute inset-0 bg-black/5 transition-all duration-[10000ms]`}
					style={{
						backdropFilter: loading ? "blur(2px)" : "blur(0px)",
						transition: "backdrop-filter 3s",
					}}
				></div>

				<div className="loader-wrapper-gradient">
					<div className="gradient-orb"></div>
					<div className="gradient-orb-core"></div>
				</div>
			</div>
		</>
	);
};

export default Loader;
