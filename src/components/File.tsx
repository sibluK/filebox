import { toast } from "react-toastify";
import { FileProps } from "../interfaces/interfaces";
import '../styles/file.css';
import { useState } from "react";
import axios from "axios";

export default function File({ file }: FileProps) {

    const [toggler, setToggler] = useState(false);

    const file_name = file.url.split('/').pop();
    const file_extension = file.type.split('/').pop()?.toLowerCase();

    const isImage = ['jpg', 'jpeg', 'png'].includes(file_extension || '');
    const isVideo = ['mp4'].includes(file_extension || '');

    const file_size_mb = (file.size / 1024 / 1024);

    const backend_url = import.meta.env.VITE_BACKEND_URL;

    async function handleFileDownload() {
        try {
            const response = await fetch(file.url);
            const blob = await response.blob();

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            const fileName = file.url.split('/').pop() || 'download';
            link.download = fileName;

            document.body.appendChild(link)
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            toast.success("Download started")
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download file');
        }
    }

    function handleFileCopyToClipboard() {
        navigator.clipboard.writeText(file.url);
        toast.success("Copied to clipboard")
    }

    async function handleFileDeletion() {
        if (confirm("Are you sure you want to delete this file?")) {
            try {
                const response = await axios.delete(`${backend_url}/users/files/${file.id}`, {
                    data: {
                        s3_key: file.s3_key
                    }
                });
    
                if (response.status === 200) {
                    toast.success("File deleted successfully");
                } else {
                    toast.error("Failed to delete file");
                }
            } catch (error) {
                console.error("Error deleting file:", error);
                toast.error("An error occurred while deleting the file.");
            }
        }
    }

    return (
        <div className="file-wrapper">
            <div className="file-content" onClick={() => setToggler(!toggler)}>
                {isImage && (
                    <img 
                        className="file-image lightbox-trigger" 
                        src={file.url} 
                        alt={file_name}
                        data-url={file.url}
                        data-type={file.type}
                    />
                )}
                {isVideo && (
                    <video 
                        className="file-video lightbox-trigger" 
                        data-url={file.url}
                        data-type={file.type}
                    >
                        <source src={file.url} type={file.type} />
                        Your browser does not support the video tag.
                    </video>
                )}
                {!isImage && !isVideo && (
                    <iframe
                        className="file-preview lightbox-trigger"
                        src={file.url}
                        data-url={file.url}
                        data-type={file.type}
                        title={file_name}
                    />
                )}
            </div>

            <div className="file-information-wrapper">
                <div className="file-action-buttons">
                    <button className="gradient-button" onClick={handleFileDownload}>
                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                            <g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="none"/> <path stroke-width="2" d="M5 12V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V12" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"/> <path stroke-width="2" d="M12 3L12 15M12 15L16 11M12 15L8 11" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"/> </g>
                        </svg>
                    </button>
                    <button className="gradient-button" onClick={handleFileCopyToClipboard}>
                        <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                            <g id="SVGRepo_iconCarrier"> <path d="M8.5 8.5H5.5V20.5H16.5V16.5M19.5 4.5H8.5V16.5H19.5V4.5Z" stroke="#ffffff" stroke-width="1.2"/> </g>
                        </svg>
                    </button>
                    <button className="gradient-button delete-button" onClick={handleFileDeletion}>
                        <svg width="25px" height="25px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"  fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="icomoon-ignore"> </g> <path d="M26.129 5.871h-5.331v-1.066c0-1.178-0.955-2.132-2.133-2.132h-5.331c-1.178 0-2.133 0.955-2.133 2.132v1.066h-5.331v1.066h1.099l1.067 20.259c0 1.178 0.955 2.133 2.133 2.133h11.729c1.178 0 2.133-0.955 2.133-2.133l1.049-20.259h1.051v-1.066zM12.268 4.804c0-0.588 0.479-1.066 1.066-1.066h5.331c0.588 0 1.066 0.478 1.066 1.066v1.066h-7.464v-1.066zM22.966 27.14l-0.002 0.027v0.028c0 0.587-0.478 1.066-1.066 1.066h-11.729c-0.587 0-1.066-0.479-1.066-1.066v-0.028l-0.001-0.028-1.065-20.203h15.975l-1.046 20.204z" fill="#ffffff"> </path> <path d="M15.467 9.069h1.066v17.060h-1.066v-17.060z" fill="#ffffff"> </path> <path d="M13.358 26.095l-1.091-17.027-1.064 0.068 1.091 17.027z" fill="#ffffff"> </path> <path d="M20.805 9.103l-1.064-0.067-1.076 17.060 1.064 0.067z" fill="#ffffff"> </path> </g></svg>
                    </button>
                </div>
                <div className="info-section">
                    <span className="info-header">ID:</span>
                    <span className="info-value">{file.id}</span>
                </div>
                <div className="info-section">
                    <span className="info-header">Name:</span>
                    <span className="info-value">{file_name}</span>
                </div>
                <div className="info-section">
                    <span className="info-header">Uploaded at:</span>
                    <span className="info-value">{file.added_at}</span>
                </div>
                <div className="info-section">
                    <span className="info-header">Size:</span>
                    <span className="info-value">{file_size_mb.toFixed(2)} MB</span>
                </div>
            </div>
        </div>
    );
}