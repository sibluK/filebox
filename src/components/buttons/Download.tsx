import { toast } from "react-toastify";
import "../../styles/buttons.css";
import axios from "axios";

interface DownloadProps {
    file_id: number;
    file_url: string;
    file_name: string;
}

export default function Download({ file_id, file_url, file_name }: DownloadProps) {

    async function handleFileDownload() {
        try {
            const response = await fetch(file_url, {
                cache: 'no-cache',
            });
            const blob = await response.blob();
    
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
    
            link.download = file_name;
    
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            const backend_url = import.meta.env.VITE_BACKEND_URL;
            await axios.post(`${backend_url}/files/downloads/${file_id}`);
    
            toast.success("Download started");
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download file');
        }
    }

    return (
        <button className="file-action-button" onClick={handleFileDownload}>
            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="none"/> <path stroke-width="1" d="M5 12V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V12" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"/> <path stroke-width="1" d="M12 3L12 15M12 15L16 11M12 15L8 11" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"/> </g>
            </svg>
        </button>
    );
}