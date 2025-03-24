import React, { useEffect, useState } from "react"
import axios from 'axios'

export default function Files() {

    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

    return (
        <>
            <form onSubmit={handleFileUpload}>
                <input onChange={handleFileInput} type="file" accept="image/*"/>
                <button type="submit">Upload</button>
            </form>

            {uploadedFileUrl && <img src={uploadedFileUrl} alt="Uploaded file" />}
        </>
    )
}