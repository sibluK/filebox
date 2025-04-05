import { useEffect, useState } from "react";
import "../styles/file-tag-addition.css";
import { toast } from 'react-toastify';

interface FileTagAdditionProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FileTagAddition( { tags, setTags }: FileTagAdditionProps) {

    const [tag, setTag] = useState<string>("");

    function handleTagFormSubmit(e: React.FormEvent) {
        e.preventDefault();
 
        // Check if tag is empty
        if(tag.length === 0) {
            toast.error("Tag cannot be empty")
            return;
        }

        // Check if tag does not exist already
        if(tags.includes(tag)) { 
            toast.error("Tag already exists")
            return;
        }

        if(tag.length > 18) {
            toast.error("Tag cannot be longer than 18 characters")
            return;
        }

        // If tag is not empty add it to the list
        if(tag && tag.length > 0) {
            setTags((prevTags) => [...prevTags, tag]);
            setTag("");
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setTag(value);
    }

    function handleTagDeletion(index: number) {
        setTags(tags.filter((tag, idx) => idx !== index))
    }

    return (
        <div className="file-tag-addition-wrapper">
            <div className="wrapper-header">
                <span className="wrapper-title">Tags</span>
                <span className="wrapper-info">Tags will be used for optimizing the search of files</span>
            </div>

            {tags.length > 0 && (
                <div className="added-tags-wrapper">
                    {tags.map((tag, index) => (
                        <div key={index} className="tag-item" onClick={() => handleTagDeletion(index)}>
                            <span className="tag-name">{tag}</span>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="tag-form" onSubmit={handleTagFormSubmit}>
                <input
                    className="tag-input" 
                    type="text" 
                    placeholder="Enter a tag"
                    value={tag || ""}
                    onChange={handleInputChange}
                />
                <button onClick={handleTagFormSubmit} className="tag-submit-button gradient-button">
                    <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 45.402 45.402" xmlSpace="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"></path> </g> </g></svg>
                </button>
            </div>
        </div>
    );

}