import { FilesProps } from "../interfaces/interfaces";
import File from "../components/File"
import "../styles/file-list.css"
import FileLoading from "./FileLoading";
import { useMemo, useState } from "react";
import { UserFile } from "../types/types";
import EditFileModal from "./modals/EditFileModal";

export default function FileList({ files, loading, setFiles }: FilesProps) {

    const reversedFiles = useMemo(() => {
        return [...files].reverse();
    }, [files])

    const [selectedFile, setSelectedFile] = useState<UserFile | null>(null);

    function openEditModal(file: UserFile) {
        setSelectedFile(file);
    }

    function closeEditModal() {
        setSelectedFile(null);
    }

    return (
        <>
            {!loading ? (
                <div className="file-list-wrapper">
                    {reversedFiles.map((file, index) => (
                        <File 
                            openEditModal={() => openEditModal(file)} 
                            key={index} 
                            file={file} 
                            setFiles={setFiles}
                        />
                    ))}
                </div>
            ) : (
                <FileLoading />
            )}

            {selectedFile && (
                <EditFileModal 
                    isOpen={!!selectedFile} 
                    file={selectedFile} 
                    handleClose={closeEditModal} 
                    setFiles={setFiles}
                />
            )}
            
        </>
    )
}