import { FilesProps } from "../interfaces/interfaces";
import File from "../components/File"
import "../styles/file-list.css"

export default function FileList({ files, loading }: FilesProps) {

    const reversedFiles = [...files].reverse();

    return (
        <div className="file-list-wrapper">
            {!loading ? (
                reversedFiles.map((file, index) => (
                    <File key={index} file={file}/>
                ))
            ) : (
                <div>Loading files...</div>
            )}

        </div>
    )
}