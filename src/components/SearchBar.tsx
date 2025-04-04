import { useRef, useCallback, ChangeEvent } from "react";
import "../styles/search-bar.css"

interface SearchBarProps {
    handleQuery: (query: string) => void;
}

export default function SearchBar({ handleQuery }: SearchBarProps) {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSearchInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        handleQuery(e.target.value);
    }, [handleQuery]);

    const handleClearQuery = useCallback(() => {
        handleQuery("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }, [handleQuery]);

    return (
        <div className="search-bar-wrapper">
            <input
                className="search-bar"
                onChange={handleSearchInput}
                ref={inputRef}
                type="text"
                placeholder="Search"
            />
            {inputRef.current && inputRef.current.value.length > 0 && (
                <svg className="clear-input" onClick={handleClearQuery} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier"> <path d="M9 9L15 15" stroke="#3282ec" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/> <path d="M15 9L9 15" stroke="#3282ec" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/> <circle cx="12" cy="12" r="9" stroke="#3282ec" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/> </g>
                </svg>
            )}
        </div>
    )
}