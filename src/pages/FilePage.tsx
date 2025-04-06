import { useParams } from "react-router";

export default function FilePage() {

    const { id: file_id, name: file_name } = useParams();

    return (
        <>
            <h3>{file_id}</h3>
        </>
    );
}