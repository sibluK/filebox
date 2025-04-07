import "../styles/file-visibility-selection.css";

interface VisibilityOptionsProps {
    is_public: boolean;
    setIsPublic: (is_public: boolean) => void;
}

export default function VisibilityOptions({ is_public, setIsPublic }: VisibilityOptionsProps) {

    return (
        <div className="visibility-options">
            <span
                className={`visibility-option ${is_public === false ? "selected-visibility-option" : ""}`}
                onClick={() => setIsPublic(false)}>Private
            </span>
            <span
                className={`visibility-option ${is_public === true ? "selected-visibility-option" : ""}`}
                onClick={() => setIsPublic(true)}>Public
            </span>
        </div>
    );
}
