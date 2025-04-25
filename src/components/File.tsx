import { toast } from "react-toastify";
import { FileProps } from "../interfaces/interfaces";
import '../styles/file.css';
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Download from "./buttons/Download";
import CopyClipboard from "./buttons/CopyClipboard";
import Edit from "./buttons/Edit";
import Delete from "./buttons/Delete";

export default function File({ file, setFiles, openEditModal }: FileProps) {
    
    const { getToken } = useAuth();

    const file_name = file.url.split('/').pop();
    const file_extension = file.type.split('/').pop()?.toLowerCase();

    const isImage = ['jpg', 'jpeg', 'png'].includes(file_extension || '');
    const isVideo = ['mp4'].includes(file_extension || '');

    const file_size_mb = (file.size / 1024 / 1024);

    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const visibleTags = file.tags.slice(0, 2).map(tag => tag.tag_name);
    const remainingTagsCount = file.tags.length - 2;

    async function handleFileDeletion() {
        const token = await getToken();
        if (confirm("Are you sure you want to delete this file?")) {
            try {
                const response = await axios.delete(`${backend_url}/users/files/${file.id}`, {
                    data: {
                        s3_key: file.s3_key
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                if (response.status === 200) {
                    toast.success("File deleted successfully");
                    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
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
            <div className="file-content" >
                {isImage && (
                    <img 
                        className="file-image lightbox-trigger" 
                        src={file.url} 
                        alt={file_name}
                        data-url={file.url}
                        data-type={file.type}
                        loading="eager"
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
                <div className="info-section">
                    <span className="info-header">Name:</span>
                    <span className="info-value">{file.name}</span>
                </div>
                <div className="info-section">
                    <span className="info-header">Downloads:</span>
                    <span className="info-value">{file.downloads}</span>
                </div>
                <div className="info-section">
                    <span className="info-header">Size:</span>
                    <span className="info-value">{file_size_mb.toFixed(2)} MB</span>
                </div>
                <div className="info-section">
                    <span className="info-header">Tags:</span>
                    {file.tags.length === 0 && (
                        <span className="info-value">No tags applied</span>
                    )}
                    <span className="info-value"></span>
                    <div className="tags-wrapper">
                        {visibleTags.map((tag, index) => (
                            <span key={index} className="info-value tag">{tag}</span>
                        ))}
                        {remainingTagsCount > 0 && (
                            <span className="info-value tag">+{remainingTagsCount} more</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="file-action-buttons">
                <Download file_name={file.name} file_id={file.id} file_url={file.url}/>
                <CopyClipboard file_url={file.url}/>
                <Edit handleClick={openEditModal}/>
                <Delete handleDeletion={handleFileDeletion}/>
            </div>
        </div>
    );
}