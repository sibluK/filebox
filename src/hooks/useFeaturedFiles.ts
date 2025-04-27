import axios from "axios";
import { useEffect, useState } from "react";
import { UserFile } from "../types/types";

export default function useFeaturedFiles() {

    const [featuredFiles, setFeaturedFiles] = useState<UserFile[]>();
    const [loading, setLoading] = useState<boolean>(true);

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const featured_file_url = backend_url + "/files/featured";

    useEffect(() => {
        const controller = new AbortController();

        const fetchFeaturedFile = async () => {
            try {
                const response = await axios.get(featured_file_url, {
                    signal: controller.signal
                })
                setFeaturedFiles(response.data);
            } catch(error) {
                console.log("Error fetchin featured file: " + error);
            } finally {
                setLoading(false);
            }
        }

        fetchFeaturedFile();

        return () => {
            controller.abort();
        }
        
    }, [])

    return { featuredFiles, loading }
}