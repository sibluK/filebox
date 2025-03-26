import React, { useCallback, useEffect, useMemo, useState } from "react"
import FileUpload from "../components/FileUpload";
import useUserFiles from "../hooks/useUserFiles";
import FileList from "../components/FileList";
import Search from "../components/SearchBar"
import "../styles/files-page.css"

export default function Files() {

    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
    const { files, loading, setFiles } = useUserFiles();
    const [query, setQuery] = useState<string>("");

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
            <FileUpload setFileURL={setUploadedFileUrl} setFiles={setFiles}/>
            <div className="files-section">
                <div className="file-list-header">
                    <h2>Your files ({files.length}):</h2>
                    <Search setQuery={handleQueryChange}/>
                </div>

                <FileList files={filteredFiles} loading={loading}/>
            </div>

            
            {/*uploadedFileUrl && <img src={uploadedFileUrl} alt="Uploaded file" />*/}
        </>
    )
}