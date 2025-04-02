import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { memo, useRef, useState } from "react";
import "../styles/file-upload.css"
import { UserFile }  from "../types/types"
import { toast } from 'react-toastify';

interface FileUploadProps {
    setFiles: React.Dispatch<React.SetStateAction<UserFile[]>>;
}

export default memo(function FileUpload({ setFiles } : FileUploadProps) {

    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const { user } = useUser();
    const { getToken } = useAuth();

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(e.dataTransfer.files[0]);
                fileInputRef.current.files = dataTransfer.files;
            }
        }
    };

    async function handleFileUpload(e: React.FormEvent) {
        e.preventDefault();
        if (file) {

            const file_size_mb = file.size / 1024 / 1024;
            const max_file_size = 5;

            if(file_size_mb > max_file_size) {
                setError("File is too large. Max size is 5 MB")
                toast.error("File is too large. Max size is 5 MB")
                return;
            }

            try {

                // Get the token from Clerk
                const token = await getToken();

                // Get the url for uploading to S3 from the server 
                const response = await axios.get(`${backend_url}/generate-url`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
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
                    const file_url = url.split('?')[0];
                    const s3_key = file_url.split('/').pop() || "";
                    const name = file.name.split('.')[0];
                    const type = file.type;
                    const size = file.size;
                    const now = new Date();
                    const added_at = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ` +
                                      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                
                    setError("");
    
                    // Clear the file and the input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                    setFile(null);
 
                    // Send a request to the backend to store the file info
                    await axios.post(`${backend_url}/users/files`, {
                        user_id,
                        file_url,
                        s3_key,
                        name,
                        type,
                        size,
                        added_at
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // Update the files state
                    try {
                        const response = await axios.get(`${backend_url}/users/${user_id}/files`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        const files = response.data;
                        setFiles(files);
                        toast.success(
                            <div className="file-upload-toast">
                                <p>File uploaded successfully!</p>
                                <p>{file_size_mb.toFixed(2)} MB</p>
                            </div>
                        );
                    } catch (error) {
                        console.error("Error fetching files:", error);
                        toast.error("Failed to update files. Please try again.");
                    }
                }

            } catch (error) {
                setError("Failed to generate upload URL.")
                toast.error("Something went wrong. Try again later...")
            }
        } else {
            setError("No file selected...")
            toast.error("No file selected...")
        }
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError("");

            const file = e.target.files[0];
            const allowedTypes = [
                // Images
                'image/png',
                'image/jpeg',
                // Videos
                'video/mp4',
            ];

            if (allowedTypes.some(type => file.type.startsWith(type))) {
                setFile(file);
                setError("");
            } else {
                setError("File type not supported");
                toast.error("Please upload a supported file type");
            }
        }
    }

    return (
        <>
            <div className="file-upload-wrapper">
                <form className="form" onSubmit={handleFileUpload}>
                    <label 
                        htmlFor="file-input" 
                        className={`drop-container ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <span className="drop-title">Drop files here</span>
                        or
                        <input 
                            type="file" 
                            accept=".png,.jpg,.jpeg,.mp4" 
                            id="file-input" 
                            ref={fileInputRef} 
                            onChange={handleFileInput}
                        />
                        <span className="mime-types">.png .jpg .jpeg .mp4</span>
                    </label>
                    {file && (
                        <div>
                            Apply tags to the file:
                        </div>
                    )}
                    <button type="submit" className="submit-file-button gradient-button">
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                            <g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10V11H17C18.933 11 20.5 12.567 20.5 14.5C20.5 16.433 18.933 18 17 18H16C15.4477 18 15 18.4477 15 19C15 19.5523 15.4477 20 16 20H17C20.0376 20 22.5 17.5376 22.5 14.5C22.5 11.7793 20.5245 9.51997 17.9296 9.07824C17.4862 6.20213 15.0003 4 12 4C8.99974 4 6.51381 6.20213 6.07036 9.07824C3.47551 9.51997 1.5 11.7793 1.5 14.5C1.5 17.5376 3.96243 20 7 20H8C8.55228 20 9 19.5523 9 19C9 18.4477 8.55228 18 8 18H7C5.067 18 3.5 16.433 3.5 14.5C3.5 12.567 5.067 11 7 11H8V10ZM15.7071 13.2929L12.7071 10.2929C12.3166 9.90237 11.6834 9.90237 11.2929 10.2929L8.29289 13.2929C7.90237 13.6834 7.90237 14.3166 8.29289 14.7071C8.68342 15.0976 9.31658 15.0976 9.70711 14.7071L11 13.4142V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13.4142L14.2929 14.7071C14.6834 15.0976 15.3166 15.0976 15.7071 14.7071C16.0976 14.3166 16.0976 13.6834 15.7071 13.2929Z" fill="#ffffff"/> </g>
                        </svg>
                        Upload
                    </button>
                </form>
            </div>

        </>
    )
})