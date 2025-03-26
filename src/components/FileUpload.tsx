import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { memo, useRef, useState } from "react";
import "../styles/file-upload.css"
import { UserFile }  from "../types/types"
import { toast } from 'react-toastify';

interface FileUploadProps {
    setFileURL: (url: string) => void;
    setFiles: React.Dispatch<React.SetStateAction<UserFile[]>>;
}

export default memo(function FileUpload({ setFileURL, setFiles } : FileUploadProps) {

    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const { user } = useUser();

    async function handleFileUpload(e: React.FormEvent) {
        e.preventDefault();
        if (file) {

            const file_size_mb = file.size / 1024 / 1024;
            const max_file_size = 5;

            if(file_size_mb > max_file_size) {
                //setError("File is too large. Max size is 10MB")
                toast.error("File is too large. Max size is 5MB")
                return;
            }

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
                    // Set fields for file
                    const user_id = user?.id || "";
                    const file_type = file.type;
                    const file_url = url.split('?')[0];
                    const file_size = file.size;
                    const now = new Date();
                    const added_at = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ` +
                                      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                

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
                        file_url,
                        file_type,
                        file_size,
                        added_at
                    });

                    // Update the files state
                    setFiles((prevFiles: UserFile[]) => [
                        ...prevFiles,
                         { user_id, file_url, file_type, file_size, added_at }
                    ]);

                    toast.success(
                        <div className="file-upload-toast">
                            <p>File uploaded successfully!</p>
                            <p>{file_size_mb.toFixed(2)} MB</p>
                        </div>
                    );
                }

            } catch (error) {
                console.error("Failed to generate upload URL", error);
                setError("Failed to generate upload URL")
            }
        } else {
            //setError("No file selected")
            toast.error("No file selected...")
        }
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            console.log(e.target.files[0].size / 1024 / 1024)
            setError("");
        }
    }

    return (
        <>
            <div className="file-upload-wrapper">
                <form className="form" onSubmit={handleFileUpload}>
                    <label htmlFor="file-input" className="drop-container">
                        <span className="drop-title">Drop files here</span>
                        or
                        <input type="file" accept="*" id="file-input" ref={fileInputRef} onChange={handleFileInput}/>
                    </label>
                    <button type="submit" className="submit-file-button">Upload</button>
                </form>
                {error && (
                    <div className="error-wrapper">
                        <span>{error}</span>
                    </div>
                )}
            </div>

        </>
    )
})