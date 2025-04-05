import { toast } from "react-toastify";
import "../../styles/buttons.css";

interface DownloadProps {
    file_url: string;
}

export default function CopyClipboard({ file_url }: DownloadProps) {

    function handleFileCopyToClipboard() {
        navigator.clipboard.writeText(file_url);
        toast.success("Copied to clipboard")
    }

    return (
        <button className="file-action-button" onClick={handleFileCopyToClipboard}>
            <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <path d="M8.5 8.5H5.5V20.5H16.5V16.5M19.5 4.5H8.5V16.5H19.5V4.5Z" stroke="#ffffff" stroke-width="1.2"/> </g>
            </svg>
        </button>
    );
}