import React from "react";
import "../styles/file-visibility-selection.css";

interface FileVisibilitySelectionProps {
    setIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
    isPublic: boolean;
}

export default function FileVisibilitySelection({ setIsPublic, isPublic }: FileVisibilitySelectionProps) {
  return (
    <div className="file-visibility-wrapper">
      <div className="wrapper-header">
        <span className="wrapper-title">Visibility</span>
        <span className="wrapper-info">
          Set the visibility of this file. If set to public, other users will be
          able to see this on their home page.
        </span>
        <span className="wrapper-info">
            Default is <strong>private</strong>.
        </span>
      </div>
      <div className="visibility-options">
        <span
          className={`visibility-option ${
            isPublic ? "" : "selected-visibility-option gradient-button"
          }`}
          onClick={() => setIsPublic(false)}
        >
          Private
        </span>
        <span
          className={`visibility-option ${
            isPublic ? "selected-visibility-option gradient-button" : ""
          }`}
          onClick={() => setIsPublic(true)}
        >
          Public
        </span>
      </div>
    </div>
  );
}
