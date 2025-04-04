import React from "react";
import VisibilityOptions from "./VisibilityOptions";

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
      <VisibilityOptions is_public={isPublic} setIsPublic={setIsPublic} />
    </div>
  );
}
