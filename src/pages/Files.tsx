import React, { useEffect, useState } from "react"
import axios from 'axios'

export default function Files() {

    const [file, setFile] = useState<File | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

    async function handleFileUpload(e: React.FormEvent) {
        e.preventDefault();
        if (file) {
            try {
                const response = await axios.get("/generate-url");
                const url = response.data.url;
                await axios.put(url, file, {
                    headers: {
                        "Content-Type": file.type
                    }
                });

                // Extract the photo URL from the signed URL
                const photoUrl = url.split('?')[0];
                setUploadedFileUrl(photoUrl);
                console.log(photoUrl);
            } catch (error) {
                console.error("Failed to generate upload URL", error);
            }
        } else {
            console.log("No file selected");
        }
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }

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