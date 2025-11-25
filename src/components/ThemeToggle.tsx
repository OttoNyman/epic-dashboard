"use client";

import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

const ThemeToggle: React.FC = () => {
	const [theme, setTheme] = useState<Theme>("system");

	useEffect(() => {
		// Load saved theme from localStorage
		const savedTheme = localStorage.getItem("theme") as Theme;
		if (savedTheme) {
			setTheme(savedTheme);
			applyTheme(savedTheme);
		} else {
			applyTheme("system");
		}
	}, []);

	const applyTheme = (newTheme: Theme) => {
		const root = document.documentElement;
		
		if (newTheme === "light") {
			root.setAttribute("data-theme", "light");
		} else if (newTheme === "dark") {
			root.setAttribute("data-theme", "dark");
		} else {
			// System theme - remove data-theme attribute to use CSS media query
			root.removeAttribute("data-theme");
		}
	};

	const handleThemeChange = (newTheme: Theme) => {
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		applyTheme(newTheme);
	};

	const getSliderPosition = () => {
		switch (theme) {
			case "light":
				return "translate-x-0";
			case "system":
				return "translate-x-5";
			case "dark":
				return "translate-x-10";
			default:
				return "translate-x-5";
		}
	};

	return (
		<div className="relative">
			{/* Слайдер с градиентом */}
			<div className="w-16 h-6 rounded-full theme-toggle-gradient border border-gray-300 border-opacity-30">
				{/* Движущийся индикатор */}
				<div 
					className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white bg-opacity-90 rounded-full transition-transform duration-300 ease-in-out theme-toggle-indicator ${getSliderPosition()}`}
				/>
			</div>
			
			{/* Невидимые кнопки для кликов */}
			<div className="absolute inset-0 flex">
				<button
					onClick={() => handleThemeChange("light")}
					className="flex-1 rounded-l-full"
					title="Светлая тема"
				/>
				<button
					onClick={() => handleThemeChange("system")}
					className="flex-1"
					title="Системная тема"
				/>
				<button
					onClick={() => handleThemeChange("dark")}
					className="flex-1 rounded-r-full"
					title="Тёмная тема"
				/>
			</div>
		</div>
	);
};

export default ThemeToggle;
