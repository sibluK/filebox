import { useCallback, useMemo, useState } from "react"
import FileUpload from "../components/FileUpload";
import useUserFiles from "../hooks/useUserFiles";
import FileList from "../components/FileList";
import Search from "../components/SearchBar"
import "../styles/files-page.css"
import { useUser } from "@clerk/clerk-react";
import VisibilityOptions from "../components/VisibilityOptions";

export default function Files() {

    const { files, loading, setFiles } = useUserFiles();
    const [visibilityFilter, setVisibilityFilter] = useState<boolean | undefined>(false);
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
    }, [files, query, visibilityFilter]);

    const handleQueryChange = useCallback((input: string) => {
        setQuery(input);
      }, [query])

    return (
        <>
            <FileUpload setFiles={setFiles}/>
            <div className="files-section">
                <div className="file-list-header">
                    <div className="file-list-header-options">
                        <h2 className="text-gradient">{user?.firstName}'s files ({filteredFiles.length}):</h2>
                        <VisibilityOptions is_public={visibilityFilter} setIsPublic={setVisibilityFilter}/>
                    </div>
                    <Search handleQuery={handleQueryChange}/>
                </div>

                {!loading && filteredFiles.length === 0 && (
                    <div className="loading-text">
                        No {visibilityFilter ? "public" : "private"} files
                    </div>
                )}

                <FileList files={filteredFiles} loading={loading} setFiles={setFiles}/>

            </div>
        </>
    )
}