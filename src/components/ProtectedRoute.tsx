import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {

    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    if (!isSignedIn) {
        navigate('/sign-in');
    }

    return children;
}