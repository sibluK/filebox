import { useUser } from "@clerk/clerk-react"

export default function Home() {

    const { user } = useUser();

    return (
        <>
            <p>Welcome, {user?.firstName}</p>
        </>
    )
}