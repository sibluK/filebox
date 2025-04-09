import { useRef, useCallback, ChangeEvent, memo } from "react";
import "../styles/search-bar.css"

interface SearchBarProps {
    handleQuery: (query: string) => void;
}

function SearchBar({ handleQuery }: SearchBarProps) {

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
            <svg className="search-icon" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#3282ec" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z" fill="#3282ec"></path> </g></svg>
        </div>
    )
}

export default memo(SearchBar)