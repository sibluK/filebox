import { memo } from "react";
import "../styles/file-loading.css"

function FileLoading() {
    return (
        <div className="container">
            <div className="folder">
                <div className="top"></div>
                <div className="bottom"></div>
            </div>
            <div className="title">Getting files ready...</div>
        </div>
    );
}

export default memo(FileLoading);