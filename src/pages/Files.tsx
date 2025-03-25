import React, { useEffect, useState } from "react"
import FileUpload from "../components/FileUpload";
import useUserFiles from "../hooks/useUserFiles";
import FileList from "../components/FileList";

export default function Files() {

    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

    const { files, loading, setFiles } = useUserFiles();

    return (
        <>
            <FileUpload setFileURL={setUploadedFileUrl} setFiles={setFiles}/>
            <div className="files-section">
                <h2>Your files ({files.length}):</h2>
                <FileList files={files} loading={loading}/>
            </div>

            
            {/*uploadedFileUrl && <img src={uploadedFileUrl} alt="Uploaded file" />*/}
        </>
    )
}