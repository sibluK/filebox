import { useEffect, useState } from "react";
import axios from 'axios';
import { useUser, useAuth } from "@clerk/clerk-react";
import { UserFile } from '../types/types'

export default function useUserFiles() {
    const [files, setFiles] = useState<UserFile[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const { user } = useUser();
    const { getToken } = useAuth();
    const backend_url = import.meta.env.VITE_BACKEND_URL
    const user_files_url = `${backend_url}/users/${user?.id}/files`

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const token = await getToken();
                const files = await axios.get(user_files_url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const tags = await axios.get
                setFiles(files.data);
            }
            catch (error: any) {
                setError(error.message || "Failed to fetch files");
                setLoading(false);
            }
            finally {
                setLoading(false);
            }
        }

        if(user) {
            fetchFiles();
        }

    }, [user])
    
    return { files, loading, error, setFiles }
}