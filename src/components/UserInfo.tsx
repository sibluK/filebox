import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/user-info.css"

export default function UserInfo({ user_id }: { user_id: string }) {

    const [userInfo, setUserInfo] = useState<{ name: string; profileImageUrl: string } | null>(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const response = await axios.get(`${backend_url}/users/${user_id}/info`);
                setUserInfo(response.data);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        }

        fetchUserInfo();
    }, [user_id]);

    if (!userInfo) return <CircularProgress color="secondary"/>;

    return (
        <div className="user-info-wrapper">
            {userInfo ? (
                <>
                    <img src={userInfo.profileImageUrl} alt={userInfo.name} />
                    <p>{userInfo.name}</p>
                </>
            ) : (
                <CircularProgress color="secondary"/>
            )}
            
        </div>
    );
}