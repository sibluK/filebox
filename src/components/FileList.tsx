import { FilesProps } from "../interfaces/interfaces";
import File from "../components/File"
import "../styles/file-list.css"
import FileLoading from "./FileLoading";
import FsLightbox from "fslightbox-react";
import { useState } from "react";

export default function FileList({ files, loading }: FilesProps) {

    const reversedFiles = [...files].reverse();
    const [toggler, setToggler] = useState(false);
    const sources = []

    files.map((file) => {
        sources.push(file.file_url)
    })

    return (
        <>
            {!loading ? (
                <div className="file-list-wrapper">
                    {reversedFiles.map((file, index) => (
                        <div onClick={() => setToggler(!toggler)}>
                            <File key={index} file={file}/>
                        </div>

                    ))}
                </div>
            ) : (
                <FileLoading />
            )}

            <FsLightbox
				toggler={toggler}
				sources={sources}
            />
        </>
    )
}