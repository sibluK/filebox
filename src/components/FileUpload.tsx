import axios from "axios";
import { useRef, useState } from "react";

interface FileUploadProps {
    setFileURL: (url: string) => void;
}

export default function FileUpload({ setFileURL } : FileUploadProps) {

    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFileUpload(e: React.FormEvent) {
        e.preventDefault();
        if (file) {
            try {
                // Get the url for uploading to S3 from the server 
                const response = await axios.get("https://filebox-pe5y.onrender.com/generate-url");
                const url = response.data.url;

                // Send the uploaded file to S3 bucket
                await axios.put(url, file, {
                    headers: {
                        "Content-Type": file.type
                    }
                });

                // Get and set the file url for displaying the uploaded image
                const photoUrl = url.split('?')[0];
                setFileURL(photoUrl);
                setError("");

                // Clear the file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                setFile(null);

            } catch (error) {
                console.error("Failed to generate upload URL", error);
                setError("Failed to generate upload URL")
            }
        } else {
            setError("No file selected")
        }
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError("");
        }
    }

    return (
        <>
            <div className="file-upload-wrapper">
                <form onSubmit={handleFileUpload}>
                    <input ref={fileInputRef} onChange={handleFileInput} type="file" accept="image/*"/>
                    <button type="submit">Upload</button>
                </form>
                {error && (
                    <div className="error-wrapper">
                        <span>{error}</span>
                    </div>
                )}

            </div>

        </>
    )

}