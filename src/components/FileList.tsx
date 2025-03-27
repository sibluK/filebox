import { FilesProps } from "../interfaces/interfaces";
import File from "../components/File"
import "../styles/file-list.css"
import FileLoading from "./FileLoading";

export default function FileList({ files, loading }: FilesProps) {

    const reversedFiles = [...files].reverse();

    return (
        <>
            {!loading ? (
                <div className="file-list-wrapper">
                    {reversedFiles.map((file, index) => (
                        <File key={index} file={file}/>
                    ))}
                </div>
            ) : (
                <FileLoading />
            )}
        </>
    )
}