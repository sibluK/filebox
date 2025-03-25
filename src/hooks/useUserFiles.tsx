import { useEffect, useState } from "react";
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";

export default function useUserFiles() {
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const { user } = useUser();
    const user_files_url = `${import.meta.env.BACKEND_URL}/users/${user?.id}/files`

    useEffect(() => {
        axios.get(user_files_url)
        .then(response => {
            setFiles(response.data)
            setLoading(false);
        })
        .catch((e) => {
            setError(e)
            setLoading(false);
        }) 
    }, [])


    return { files, loading, error}

}