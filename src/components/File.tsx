import { toast } from "react-toastify";
import { FileProps } from "../interfaces/interfaces";
import '../styles/file.css';
import { useState } from "react";

export default function File({ file }: FileProps) {

    const [toggler, setToggler] = useState(false);

    const file_name = file.file_url.split('/').pop();
    const file_extension = file.file_type.split('/').pop()?.toLowerCase();

    const isImage = ['jpg', 'jpeg', 'png'].includes(file_extension || '');
    const isVideo = ['mp4'].includes(file_extension || '');

    const file_size_mb = (file.file_size / 1024 / 1024);

    async function handleFileDownload() {
        try {
            const response = await fetch(file.file_url);
            const blob = await response.blob();

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            const fileName = file.file_url.split('/').pop() || 'download';
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
        navigator.clipboard.writeText(file.file_url);
        toast.success("Copied to clipboard")
    }

    return (
        <div className="file-wrapper">
        <div className="file-content" onClick={() => setToggler(!toggler)}>
            {isImage && (
                <img 
                    className="file-image lightbox-trigger" 
                    src={file.file_url} 
                    alt={file_name}
                    data-url={file.file_url}
                    data-type={file.file_type}
                />
            )}
            {isVideo && (
                <video 
                    className="file-video lightbox-trigger" 
                    data-url={file.file_url}
                    data-type={file.file_type}
                >
                    <source src={file.file_url} type={file.file_type} />
                    Your browser does not support the video tag.
                </video>
            )}
            {!isImage && !isVideo && (
                <iframe
                    className="file-preview lightbox-trigger"
                    src={file.file_url}
                    data-url={file.file_url}
                    data-type={file.file_type}
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
                        Download
                    </button>
                    <button className="gradient-button" onClick={handleFileCopyToClipboard}>
                        <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                            <g id="SVGRepo_iconCarrier"> <path d="M8.5 8.5H5.5V20.5H16.5V16.5M19.5 4.5H8.5V16.5H19.5V4.5Z" stroke="#ffffff" stroke-width="1.2"/> </g>
                        </svg>
                        Copy URL
                    </button>
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