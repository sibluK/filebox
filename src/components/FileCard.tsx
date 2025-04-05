import { UserFile } from "../types/types";
import "../styles/file-card.css";
import Download from "./buttons/Download";
import CopyClipboard from "./buttons/CopyClipboard";

interface FileCardProps {
    file: UserFile;
}

export default function FileCard({ file }: FileCardProps) {
    
    return (
        <div className="file-card-wrapper">
            <img className="file-card-image" src={file.url} alt={file.name}/>
            <span className="file-card-name">{file.name}</span>
            <div className="file-card-actions-wrapper">
                <Download file_url={file.url}/>
                <CopyClipboard file_url={file.url}/>
            </div>
        </div>
    );
}