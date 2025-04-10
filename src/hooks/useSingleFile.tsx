import axios from "axios";
import { useState, useEffect } from "react";
import { UserFile } from "../types/types";

interface useSingleFileProps {
    file_id: number | undefined;
}

export default function useSingleFile({ file_id }: useSingleFileProps) {
    const [file, setFile] = useState<UserFile>();
    const [relatedFiles, setRelatedFiles] = useState<UserFile[]>();
    const [fileLoading, setFileLoading] = useState<boolean>(true);
    const [relatedLoading, setRelatedLoading] = useState<boolean>(true);
    const [fileError, setFileError] = useState<string>("");
    const [relatedError, setRelatedError] = useState<string>("");

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const file_url = `${backend_url}/files/${file_id}`;
    const related_url = `${backend_url}/files/${file_id}/related`

    useEffect(() => {

        if (!file_id) return;

        const fileController = new AbortController();
        const relatedController = new AbortController();

        const fetchFiles = async () => {
            try {
                setFileLoading(true);
                const file_response = await axios.get(file_url, {
                    signal: fileController.signal,
                });
                
                setFile(file_response.data);
            } catch (error: any) {
                setFileError(error.message || "Failed to fetch file");
            } finally {
                setFileLoading(false);
            }
        };

        const fetchRelatedFiles = async () => {
            try {
                setRelatedLoading(true);
                const related_response = await axios.get(related_url, {
                    signal: relatedController.signal,
                });

                setRelatedFiles(related_response.data);
            } catch (error: any) {
                setRelatedError(error.message || "Failed to fetch related files");
            } finally {
                setRelatedLoading(false);
            }
        }

        fetchFiles();
        fetchRelatedFiles();

        return () => {
            fileController.abort();
            relatedController.abort();
        }

    }, [file_id]);

    return { file, relatedFiles, fileLoading, relatedLoading, fileError, relatedError };
}