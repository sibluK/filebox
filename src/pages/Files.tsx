import { useCallback, useEffect, useMemo, useState } from "react"
import FileUpload from "../components/FileUpload";
import useUserFiles from "../hooks/useUserFiles";
import FileList from "../components/FileList";
import Search from "../components/SearchBar"
import "../styles/files-page.css"
import { useUser } from "@clerk/clerk-react";
import VisibilityOptions from "../components/VisibilityOptions";

export default function Files() {

    const { files, loading, setFiles } = useUserFiles();
    const [visibilityFilter, setVisibilityFilter] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");

    const { user } = useUser();

    const filteredFiles = useMemo(() => {
        return files.filter((file) => {
            // Check if the file name or tags match the query
            const matchesQuery = file.name.toLowerCase().includes(query.toLowerCase()) || file.tags.some(tag => tag.tag_name.toLowerCase().includes(query.toLowerCase()));
            
            // Check if the file visibility matches the selected filter
            const matchesVisibility = visibilityFilter === file.is_public;
            return matchesQuery && matchesVisibility;
        });
    }, [query, files, visibilityFilter]);

    const handleQueryChange = useCallback((input: string) => {
        setQuery(input);
      }, [query])

    useEffect(() => {
        console.log("Filtered files:", filteredFiles);
    }, [filteredFiles])

    return (
        <>
            <FileUpload setFiles={setFiles}/>
            <div className="files-section">
                <div className="file-list-header">
                    <div className="file-list-header-options">
                        <h2 className="text-gradient">{user?.firstName}'s files ({filteredFiles.length}):</h2>
                        <VisibilityOptions is_public={visibilityFilter} setIsPublic={setVisibilityFilter}/>
                    </div>
                    <Search setQuery={handleQueryChange}/>
                </div>

                <FileList files={filteredFiles} loading={loading} setFiles={setFiles}/>
            </div>
        </>
    )
}