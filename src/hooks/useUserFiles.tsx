import { useEffect, useState } from "react";
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import { UserFile } from '../types/types'

export default function useUserFiles() {
    const [files, setFiles] = useState<UserFile[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const { user } = useUser();
    const backend_url = import.meta.env.VITE_BACKEND_URL
    const user_files_url = `${backend_url}/users/${user?.id}/files`

    useEffect(() => {
        if (user) {
            axios.get(user_files_url)
            .then(response => {
                setFiles(response.data)
                setLoading(false);
            })
            .catch((error) => {
                setError(error)
                setLoading(false);
            }) 
        }
    }, [user])
    
    return { files, loading, error, setFiles }
}