import { FileProps } from "../interfaces/interfaces";
import '../styles/file.css';

export default function File({ file }: FileProps) {
    const file_name = file.file_url.split('/').pop();
    const file_extension = file.file_type.split('/').pop()?.toLowerCase();

    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(file_extension || '');
    const isVideo = ['mp4', 'webm', 'ogg'].includes(file_extension || '');

    return (
        <div className="file-wrapper">
            <div className="file-content">
                {isImage && <img className="file-image" src={file.file_url} alt={file_name} />}
                {isVideo && (
                    <video className="file-video" controls>
                        <source src={file.file_url} type={file.file_type} />
                        Your browser does not support the video tag.
                    </video>
                )}
                {!isImage && !isVideo && (
                    <iframe className="file-iframe" src={file.file_url} title={file_name} />
                )}
            </div>

            <div className="file-information-wrapper">
                <div className="info-section">
                    <span className="info-header">File name:</span>
                    <span className="info-value">{file_name}</span>
                </div>

            </div>
        </div>
    );
}