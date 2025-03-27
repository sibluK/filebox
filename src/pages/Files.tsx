import React, { useCallback, useEffect, useMemo, useState } from "react"
import FileUpload from "../components/FileUpload";
import useUserFiles from "../hooks/useUserFiles";
import FileList from "../components/FileList";
import Search from "../components/SearchBar"
import "../styles/files-page.css"
import { useUser } from "@clerk/clerk-react";

export default function Files() {

    const { files, loading, setFiles } = useUserFiles();
    const [query, setQuery] = useState<string>("");

    const { user } = useUser();

    const filteredFiles = useMemo(() => {
        return files.filter((file) => {
            const file_name = file.file_url.split('/').pop()?.toLowerCase();
            return query === "" || file_name?.includes(query.toLowerCase());
        });
    }, [query, files]);

    const handleQueryChange = useCallback((input: string) => {
        setQuery(input);
      }, [query])

    return (
        <>
            <FileUpload setFiles={setFiles}/>
            <div className="files-section">
                <div className="file-list-header">
                    <h2 className="text-gradient">{user?.firstName}'s files ({filteredFiles.length}):</h2>
                    <Search setQuery={handleQueryChange}/>
                </div>

                <FileList files={filteredFiles} loading={loading}/>
            </div>
        </>
    )
}