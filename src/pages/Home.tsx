import SearchBar from "../components/SearchBar";
import { useCallback, useEffect, useMemo, useState } from "react";
import usePopularTags from "../hooks/usePopularTags";
import "../styles/home-page.css"
import useFiles from "../hooks/useFiles";
import FileLoading from "../components/FileLoading";
import FileCard from "../components/FileCard";
import { UserFile } from "../types/types";
import Masonry from "react-masonry-css";
import "../styles/masonry.css";

export default function Home() {

    const [query, setQuery] = useState<string>("")
    const [tag, setTag] = useState<string>("")
    const [offset, setOffset] = useState<number>(0)
    const [loadedFiles, setLoadedFiles] = useState<UserFile[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const limit = 10;

    const { tags } = usePopularTags();
    const { files, loading, hasMore } = useFiles({ query, tag, limit, offset });

    useEffect(() => {
        if (files.length > 0) {
            setLoadedFiles((prevFiles) => [...prevFiles, ...files]);
        }
    }, [files]);

    useEffect(() => {
        function handleScroll() {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 2000) {
                if (!isFetching && !loading && hasMore) {
                    setIsFetching(true);
                    setOffset((prevOffset) => prevOffset + limit);
                }
            }
        }

        const debounceScroll = debounce(handleScroll, 200);

        window.addEventListener("scroll", debounceScroll);
        return () => window.removeEventListener("scroll", debounceScroll);
    }, [isFetching, loading, hasMore, limit]);

    useEffect(() => {
        if (!loading) {
            setIsFetching(false);
        }
    }, [loading]);

    const handleQueryChange = useCallback((input: string) => {
        setQuery(input);
        setOffset(0);
        setLoadedFiles([]);
    }, [query])

    function handleTagClick(selectedTag: string) {
        if (selectedTag !== tag) {
            setTag(selectedTag);
            setOffset(0); 
            setLoadedFiles([]);
        } else {
            setTag("");
            setOffset(0);
            setLoadedFiles([]);
        }
    }

    function debounce(func: Function, wait: number) {
        let timeout: any;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    const memoizedTags = useMemo(() => {
        return tags.map((t, index) => (
            <span
                onClick={() => handleTagClick(t.tag_name)}
                key={index}
                className={`popular-tag tag ${tag === t.tag_name ? 'selected-tag' : ""}`}
            >
                {t.tag_name}
            </span>
        ))
    }, [tags, tag])

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    }

    return (
        <div className="home-page">
            <div className="home-page-header-container">
                <div className="header">
                    <SearchBar handleQuery={handleQueryChange}/>
                </div>
                <div className="popular-tags-wrapper">
                    {memoizedTags}
                </div>
            </div>
            {loadedFiles.length === 0 && !loading && (
                <span className="loading-text">No files found for '{query}'</span>
            )}

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid-column"
            >
                {loadedFiles.map((file, index) => (
                    <FileCard key={index} file={file} />
                ))}
            </Masonry>

            {loading && <FileLoading />}
            {!hasMore && !loading && loadedFiles.length > 0 && (
                <span className="loading-text">No more files to load</span>
            )}
        </div>
    )
}