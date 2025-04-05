import { useEffect, useState } from "react";
import axios from 'axios';
import { FileTag } from '../types/types'

export default function usePopularTags() {
    const [tags, setTags] = useState<FileTag[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const popular_tags_url = `${backend_url}/tags/popular`;

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const popular_tags = await axios.get(popular_tags_url);
                setTags(popular_tags.data);
            }
            catch (error: any) {
                setError(error.message || "Failed to fetch popular tags");
                setLoading(false);
            }
            finally {
                setLoading(false);
            }
        }

        fetchFiles();

    }, [])
    
    return { tags, loading, error }
}