import { UserFile } from "../types/types";
import "../styles/file-card.css";
import Download from "./buttons/Download";
import CopyClipboard from "./buttons/CopyClipboard";
import { useNavigate } from "react-router";
import { memo } from "react";

interface FileCardProps {
    file: UserFile;
}

function FileCard({ file }: FileCardProps) {
    
    const navigate = useNavigate();

    const file_extension = file.type.split('/').pop()?.toLowerCase();

    const isImage = ['jpg', 'jpeg', 'png'].includes(file_extension || '');
    const isVideo = ['mp4'].includes(file_extension || '');

    function handleFileClick() {
        navigate(`/files/${file.id}/${file.name}`)
    }

    return (
        <div className="file-card-wrapper masonry-item">
                {isImage && (
                    <img 
                        className="file-card-image" 
                        src={file.url} 
                        alt={file.name}
                        data-url={file.url}
                        data-type={file.type}
                        onClick={handleFileClick}
                        loading="eager"
                    />
                )}
                {isVideo && (
                        <video 
                            className="file-card-image" 
                            data-url={file.url}
                            data-type={file.type}
                            onClick={handleFileClick}
                        >
                            <source src={file.url} type={file.type} />
                        </video>
                )}
            
            <span className="file-card-name" onClick={handleFileClick}>{file.name}</span>
            <div className="file-card-actions-wrapper">
                <Download file_name={file.name} file_id={file.id} file_url={file.url}/>
                <CopyClipboard file_url={file.url}/>
            </div>
            {isVideo && (
                <svg className="video-file-mark" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#3282ec" stroke="#3282ec" stroke-width="17.919999999999998"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.024"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"></style> <g> <path className="st0" d="M378.409,0H208.294h-13.176l-9.314,9.314L57.017,138.102l-9.315,9.314v13.176v265.513 c0,47.361,38.528,85.896,85.896,85.896h244.811c47.361,0,85.888-38.535,85.888-85.896V85.895C464.298,38.528,425.77,0,378.409,0z M432.494,426.104c0,29.877-24.214,54.092-54.084,54.092H133.598c-29.877,0-54.091-24.215-54.091-54.092V160.591h83.717 c24.884,0,45.07-20.179,45.07-45.07V31.804h170.115c29.87,0,54.084,24.214,54.084,54.091V426.104z"></path> <path className="st0" d="M228.222,229.171c-0.705-0.406-1.557-0.426-2.262-0.035c-0.712,0.391-1.117,1.131-1.117,1.948v56.73v56.752 c0,0.817,0.405,1.544,1.117,1.928c0.705,0.412,1.557,0.391,2.262,0l95.042-56.766c0.677-0.405,1.082-1.131,1.082-1.914 c0-0.775-0.404-1.522-1.082-1.906L228.222,229.171z"></path> </g> </g></svg>
            )}
        </div>
    );
}

export default memo(FileCard);