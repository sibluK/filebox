import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import usePopularTags from "../hooks/usePopularTags";
import "../styles/home-page.css"
import useFiles from "../hooks/useFiles";
import FileLoading from "../components/FileLoading";
import FileCard from "../components/FileCard";

export default function Home() {

    const [query, setQuery] = useState<string>("")
    const [tag, setTag] = useState<string>("")
    const [limit, setLimit] = useState<number>(20)
    const [offset, setOffset] = useState<number>(0)

    const { tags } = usePopularTags();
    const { files, loading } = useFiles({ query, tag, limit, offset });

    function handleTagClick(selectedTag: string) {
        if(selectedTag !== tag) {
            setTag(selectedTag);
        } else {
            setTag("")
        }
    }

    function isTagSelected(selectedTag: string) {
        return tag === selectedTag;
    }

    return (
        <div className="home-page">
            <div className="home-page-header-container">
                <div className="header">
                    <span className="text-gradient">Popular tags</span>
                    <SearchBar handleQuery={setQuery}/>
                </div>
                <div className="popular-tags-wrapper">
                    {tags.map((t) => (
                        <span 
                            onClick={() => handleTagClick(t.tag_name)} 
                            key={t.id} 
                            className={`popular-tag tag ${isTagSelected(t.tag_name) ? 'selected-tag' : tag !== "" ? 'not-selected-tag' : ""}`}
                        >
                        {t.tag_name}
                        </span>
                    ))}
                </div>
            </div>
            {loading && <FileLoading />}
            {!loading && files.length === 0 && <span className="loading-text">No files found</span>}
            {!loading && files.length > 0 && (
                <div className="file-cards-wrapper">
                    {files.map((file, index) => (
                        <FileCard key={index} file={file}/>
                    ))}
                </div>
            )}
        </div>
    )
}