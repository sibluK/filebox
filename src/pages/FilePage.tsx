import { useParams } from "react-router";
import { useEffect } from "react";
import useSingleFile from "../hooks/useSingleFIle";
import Download from "../components/buttons/Download";
import "../styles/file-page.css"
import CopyClipboard from "../components/buttons/CopyClipboard";
import UserInfo from "../components/UserInfo";
import Masonry from "react-masonry-css";
import "../styles/masonry.css";
import FileCard from "../components/FileCard";
import FileLoading from "../components/FileLoading";

export default function FilePage() {

    const { id: file_id } = useParams();

    useEffect(() => {
        console.log(file_id)
    }, [file_id])

    const { file, fileLoading, relatedFiles, relatedLoading } = useSingleFile({ file_id });

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    }

    function scrollToTop() {
        scrollTo({ top: 0, left: 0})
    }

    return (
        <>
            <div className="file-page">
                {fileLoading && <FileLoading />}
                {file && !fileLoading && (
                <div className="file-info-wrapper">
                    <img 
                        className="file-info-image lightbox-trigger"
                        src={file?.url}
                        alt={file?.name}
                        data-url={file.url}
                        data-type={file.type}
                    />
                    <div className="file-info-details">
                        <div className="detail-wrapper">
                            <UserInfo user_id={file.user_id} />
                        </div>
                        <div className="detail-wrapper">
                            <div className="detail-title">Title</div>
                            <div className="detail-value">{file.name}</div>
                        </div>
                        <div className="detail-wrapper">
                            <div className="detail-title">Uploaded date</div>
                            <div className="detail-value">{file.added_at}</div>
                        </div>
                        <div className="detail-wrapper">
                            <div className="detail-title">Downloads</div>
                            <div className="detail-value">{file.downloads}</div>
                        </div>
                        <div className="detail-wrapper">
                            <div className="detail-title">Tags</div>
                            <div className="tags-wrapper">
                                {file?.tags.map((tag) => (
                                    <span key={tag} className="popular-tag tag">{tag}</span>
                                ))}
                            </div>
                            
                        </div>
                        <div className="file-info-actions">
                            <span className="detail-title">Actions</span>
                            <div>
                                <Download file_name={file.name} file_id={file.id} file_url={file.url} />
                                <CopyClipboard file_url={file.url} />
                            </div>
                            
                        </div>
                    </div>
                </div>
                )}
                
                <div className="related-files-wrapper">
                    <h2 className="text-gradient">Related images</h2>
                    <div className="related-files-list">
                        {relatedLoading && <FileLoading />}
                        {relatedFiles && !relatedLoading && relatedFiles.length === 0 && <div className="loading-text">No related files found</div>}
                        {relatedFiles && !relatedLoading && relatedFiles.length > 0 && (
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="masonry-grid"
                                columnClassName="masonry-grid-column"
                            >
                                {relatedFiles.map((file, index) => (
                                    <div onClick={scrollToTop}>
                                        <FileCard key={index} file={file} />
                                    </div>
                                    
                                ))}
                            </Masonry>
                        )}
                                    
                                    
                    </div>
                </div>
            </div>
        </>
    );
}