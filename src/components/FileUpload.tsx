import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useRef, useState } from "react";

interface FileUploadProps {
    setFileURL: (url: string) => void;
}

export default function FileUpload({ setFileURL } : FileUploadProps) {

    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const { user } = useUser();

    async function handleFileUpload(e: React.FormEvent) {
        e.preventDefault();
        if (file) {
            try {
                // Get the url for uploading to S3 from the server 
                const response = await axios.get(`${backend_url}/generate-url`);
                const url = response.data.url;

                // Send the uploaded file to S3 bucket
                const s3response = await axios.put(url, file, {
                    headers: {
                        "Content-Type": file.type
                    }
                });

                if (s3response.status === 200) {
                    const file_url = url.split('?')[0];
                    const user_id = user?.id;
                    setFileURL(file_url);
                    setError("");
    
                    // Clear the file and the input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                    setFile(null);
 
                    // Send a request to the backend for storing the user id and the file link
                    await axios.post(`${backend_url}/users/files`, {
                        user_id,
                        file_url
                    });
                }

                // Get and set the file url for displaying the uploaded image


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