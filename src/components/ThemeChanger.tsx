import { useState } from "react";

export default function ThemeChanger() {

    const [theme, setTheme] = useState<string>(() => {
        return localStorage.getItem("theme") || "light";
    });

    const [animation, setAnimation] = useState<string>("");

        const body = document.body;
        if (theme === "light") {
            body.classList.remove("dark");
            
        } else {
            body.classList.add("dark");
        }


    function handleThemeChange() {
        if(theme === 'light') {
            setAnimation("theme-up");
            setTimeout(() => {
                localStorage.setItem('theme', 'dark');
                setTheme('dark');
                setAnimation("theme-down")
            }, 200)
        } else {
            setAnimation("theme-up");
            setTimeout(() => {
                localStorage.setItem("theme", "light");
                setTheme("light");
                setAnimation("theme-down");
            }, 200);
        }
    }

    return (
        <button onClick={handleThemeChange} className="toggle-theme-button">
            {theme === 'light' ? (
                <svg className={`moon-icon ${animation}`} xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            ) : (
                <svg className={`sun-icon ${animation}`} xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            )}
        </button>
    );
}