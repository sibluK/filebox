import React, { useEffect, useState } from "react"
import axios from 'axios'
import FileUpload from "../components/FileUpload";
import useUserFiles from "../hooks/useUserFiles";

export default function Files() {

    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

    const { files } = useUserFiles();

    useEffect(() => {
        console.log(files);
    }, [])

    return (
        <>
            <FileUpload setFileURL={setUploadedFileUrl}/>

            {uploadedFileUrl && <img src={uploadedFileUrl} alt="Uploaded file" />}
        </>
    )
}