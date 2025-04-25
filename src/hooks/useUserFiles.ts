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
        const controller = new AbortController();

        const fetchFiles = async () => {
            try {
                const token = await getToken();
                const user_files = await axios.get(user_files_url, {
                    signal: controller.signal,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const filesWithTags: UserFile[] = [];

                for(const file of user_files.data) {
                    const tagsResponse = await axios.get(`${backend_url}/files/${file.id}/tags`, {
                        signal: controller.signal,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    filesWithTags.push({ ...file, tags: tagsResponse.data })
                }

                setFiles(filesWithTags);
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

        return () => {
            controller.abort();
        }

    }, [user])
    
    return { files, loading, error, setFiles }
}