import axios from "axios";
import { useState } from "react";

interface FileUploadProps {
    setFileURL: (url: string) => void;
}

export default function FileUpload({ setFileURL } : FileUploadProps) {

    const [file, setFile] = useState<File | null>(null);

    async function handleFileUpload(e: React.FormEvent) {
        e.preventDefault();
        if (file) {
            try {
                const response = await axios.get("https://filebox-pe5y.onrender.com/generate-url");
                const url = response.data.url;
                await axios.put(url, file, {
                    headers: {
                        "Content-Type": file.type
                    }
                });

                const photoUrl = url.split('?')[0];
                setFileURL(photoUrl);
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

        </>
    )

}