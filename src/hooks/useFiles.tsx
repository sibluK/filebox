import axios from "axios";
import { useState, useEffect } from "react";
import { UserFile } from "../types/types";

interface useFilesProps {
    query: string;
    tag: string;
    limit: number;
    offset: number;
}

export default function useFiles({ query, tag, limit, offset }: useFilesProps) {
    const [files, setFiles] = useState<UserFile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const files_url = `${backend_url}/files`;

    useEffect(() => {
        const controller = new AbortController();

        const fetchFiles = async () => {
            try {
                setLoading(true);
                const files_response = await axios.get(files_url, {
                    signal: controller.signal,
                    params: {
                        query: query,
                        tag: tag,
                        limit: limit,
                        offset: offset
                    },
                });
                
                setFiles(files_response.data);
            } catch (error: any) {
                setError(error.message || "Failed to fetch files");
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();

        return () => {
            controller.abort();
        }

    }, [query, tag, limit, offset]);

    return { files, loading, error };
}