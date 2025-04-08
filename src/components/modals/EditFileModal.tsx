import { UserFile } from "../../types/types";
import "../../styles/modals.css"
import FileTagAddition from "../FileTagAddition";
import { memo, useEffect, useRef, useState } from "react";
import FileVisibilitySelection from "../FileVisibilitySelection";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

interface EditFileModalProps {
    isOpen: boolean;
    file: UserFile;
    handleClose: () => void;
    setFiles: React.Dispatch<React.SetStateAction<UserFile[]>>;
}

function EditFileModal({ isOpen, file, handleClose, setFiles }: EditFileModalProps) {

    if (!isOpen) return null;

    const [fileName, setFileName] = useState<string>(file.name)
    const [tags, setTags] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState<boolean | undefined>(file.is_public);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const editModalRef = useRef<HTMLDivElement>(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const { getToken } = useAuth();

    useEffect(() => {
        if(file) {
            setTags(file.tags.map((tag) => tag.tag_name));
        }
    }, [file])

    // Handle click outside of modal to close it
    useEffect(() => {
        function handleOutsideClick(e: Event) {
            if (editModalRef.current && !editModalRef.current.contains(e.target as Node)) {
                handleClose()
            }
        }

        document.addEventListener("mousedown", handleOutsideClick, true);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick, true);
        };

    }, [])

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFileName(e.target.value)
    }

    async function handleSave() {
        let hasChanged = false;
        const token = await getToken();
        setIsSaving(true);

        if(fileName !== file.name || isPublic !== file.is_public) {
            hasChanged = true;
        }
            
        const originalTags = file.tags.map(tag => tag.tag_name);
        const addedTags = tags.filter(tag => !originalTags.includes(tag));
        const removedTags = originalTags.filter(tag => !tags.includes(tag))

        if(addedTags.length > 0 || removedTags.length > 0) {
            hasChanged = true;
        }

        if(hasChanged) {

            if(file.name !== fileName || file.is_public !== isPublic) {
                await axios.put(`${backend_url}/users/files/${file.id}`, {
                    name: fileName,
                    is_public: isPublic,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            }

            if (addedTags.length > 0) {
                await axios.post(`${backend_url}/files/${file.id}/tags`, {
                    tags: addedTags,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
            }
    
            if (removedTags.length > 0) {
                await axios.delete(`${backend_url}/files/${file.id}/tags`, {
                    data: {
                        tags: removedTags,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
            }

            setFiles((prevFiles) => 
                prevFiles.map((f) => f.id === file.id ? { ...f, name: fileName, is_public: isPublic, tags: tags.map(tag => ({ id: 0, file_id: file.id, tag_name: tag })) } 
                    : f
                )
            )
            toast.success("Changes saved")
        }

        setIsSaving(false);
        

        if(!isSaving) {
            handleClose();
        }
        
    }

    return (
        <div ref={editModalRef} className="modal edit-file-modal">
            <div className="modal-body">
                <img className="edit-file-image" src={file.url} />
                <div className="edit-file-inputs">
                    <div className="edit-file-name-wrapper">
                        <label htmlFor="name">Name</label>
                        <input className="edit-file-name-input" onChange={handleInputChange} value={fileName} name="name" />
                    </div>
                    <form>
                        <FileTagAddition tags={tags} setTags={setTags}/>
                    </form>
                    
                    <FileVisibilitySelection isPublic={isPublic} setIsPublic={setIsPublic}/>
                </div>
            </div>

            <div className="modal-action-buttons">
                <button className={`save-edit-button modal-button gradient-button ${isSaving ? "disabled-button": ""}`} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <CircularProgress /> : "Save"}
                </button>
                <button className={`cancel-edit-button modal-button ${isSaving ? "disabled-button": ""} `} onClick={handleClose} disabled={isSaving}>Cancel</button>
            </div>
            
            <div className="modal-close" onClick={handleClose}>
                &times;
            </div>
        </div>
    );
}

export default memo(EditFileModal);