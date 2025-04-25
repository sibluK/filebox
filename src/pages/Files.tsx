import { useMemo, useState } from "react"
import FileUpload from "../components/FileUpload";
import useUserFiles from "../hooks/useUserFiles";
import FileList from "../components/FileList";
import Search from "../components/SearchBar"
import "../styles/files-page.css"
import { useUser } from "@clerk/clerk-react";
import VisibilityOptions from "../components/VisibilityOptions";
import useFileFilters from "../hooks/useFileFilters";

export default function Files() {

    const { files, loading, setFiles } = useUserFiles();
    const [visibilityFilter, setVisibilityFilter] = useState<boolean | undefined>(false);

    const { query } = useFileFilters();

    const { user } = useUser();

    const filteredFiles = useMemo(() => {
        return files.filter((file) => {
            const safeQuery = query || "";

            const matchesQuery = file.name.toLowerCase().includes(safeQuery.toLowerCase()) || file.tags.some(tag => tag.tag_name.toLowerCase().includes(safeQuery.toLowerCase())) || safeQuery.length === 0;

            const matchesVisibility = visibilityFilter === file.is_public;
            return matchesQuery && matchesVisibility;
        });
    }, [files, query, visibilityFilter]);

    const numberOfDownloads = useMemo(() => {
        return files.reduce((total, curr: any) => (
            parseInt(curr.downloads) + total
        ), 0)
    }, [files])

    const numberOfMbs = useMemo(() => {
        return files.reduce((total, curr:any) => {
            const size = parseInt(curr.size) || 0;
            return total + size;
        }, 0) / 1024 / 1024;
    }, [files])

    return (
        <>
            <FileUpload setFiles={setFiles}/>

            <div className="user-stats-wrapper">
                <div className="stat-wrapper">
                     <span className="stat-title">
                        Uploaded
                    </span>
                    <span className="stat-value text-gradient">
                        {files.length}
                    </span>
                </div>
                <div className="stat-wrapper">
                     <span className="stat-title">
                       Used
                    </span>
                    <span className="stat-value text-gradient">
                        {numberOfMbs.toFixed(2)} MB
                    </span>
                </div>
                <div className="stat-wrapper">
                    <span className="stat-title">
                        Downloads
                    </span>
                    <span className="stat-value text-gradient">
                        {numberOfDownloads}
                    </span>
                </div>
            </div>
            <div className="files-section">
                <div className="file-list-header">
                    <div className="file-list-header-options">
                        <h2 className="text-gradient">{user?.firstName}'s files:</h2>
                        <VisibilityOptions is_public={visibilityFilter} setIsPublic={setVisibilityFilter}/>
                    </div>
                    <Search />
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