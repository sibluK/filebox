import React, { useEffect, useState } from "react"
import axios from 'axios'
import FileUpload from "../components/FileUpload";

export default function Files() {

    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

    return (
        <>
            <FileUpload setFileURL={setUploadedFileUrl}/>

            {uploadedFileUrl && <img src={uploadedFileUrl} alt="Uploaded file" />}
        </>
    )
}