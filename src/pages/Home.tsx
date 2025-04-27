import SearchBar from "../components/SearchBar";
import { useCallback, useEffect, useRef, useState } from "react";
import usePopularTags from "../hooks/usePopularTags";
import "../styles/home-page.css"
import useFiles from "../hooks/useFiles";
import FileCard from "../components/FileCard";
import { UserFile } from "../types/types";
import Masonry from "react-masonry-css";
import "../styles/masonry.css";
import SkeletonTags from "../components/skeletons/SkeletonTags";
import SkeletonMasontry from "../components/skeletons/SkeletonMasonry";
import useFileFilters from "../hooks/useFileFilters";
import ListEndMarker from "../components/ListEndMarker";
import useFeaturedFile from "../hooks/useFeaturedFiles";
import SkeletonImage from "../components/skeletons/SkeletonImage";
import { useNavigate } from "react-router";
import FileLoading from "../components/FileLoading";

export default function Home() {
    
    const [offset, setOffset] = useState<number>(0);
    const [loadedFiles, setLoadedFiles] = useState<UserFile[]>([]);

    const limit = 10;
    const timeoutRef = useRef(0);
    const navigate = useNavigate();

    const { query, tag, setFilters } = useFileFilters();
    const { tags } = usePopularTags();
    const { files, loading, hasMore } = useFiles({ query, tag, limit, offset });
    const { featuredFiles, loading: featuredFilesLoading } = useFeaturedFile();
    
    const handleScroll = useCallback(() => {
        const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
        const documentHeight = document.documentElement.offsetHeight;
        const scrollThreshold = documentHeight - 2000;

        if (scrollPosition >= scrollThreshold) {
            if (!loading && hasMore) {

                setOffset((prevOffset) => prevOffset + limit);
            }
        }
    }, [loading, hasMore, limit]);

    const debouncedScroll = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
            handleScroll();
        }, 200);
    }, [handleScroll]);

    useEffect(() => {
        window.addEventListener('scroll', debouncedScroll);
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            window.removeEventListener('scroll', debouncedScroll);
        };
    }, [debouncedScroll]);

    useEffect(() => {
        setOffset(0);
        setLoadedFiles([]);
    }, [query, tag]);

    useEffect(() => {
        if (files.length > 0) {
            setLoadedFiles((prevFiles) => [...prevFiles, ...files]);
        }
    }, [files]);

    const handleTagClick = (selectedTag: string) => {
        if (selectedTag.toLowerCase() !== tag) {
            setFilters({ tag: selectedTag.toLowerCase() });
            setOffset(0);
            setLoadedFiles([]);
        } else {
            setFilters({ tag: "" });
            setOffset(0);
            setLoadedFiles([]);
        }
    };

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    };

    return (
        <div className="home-page">

            <div className="featured-file-wrapper">
                <div className="featured-section-info">
                     <h1 className="text-gradient">Featured</h1>
                     <p>Discover a curated selection of standout images handpicked for their creativity, impact, and style.
                         These featured pieces showcase some of the best and most inspiring moments captured by our community.</p>
                    <button className="gradient-button">Explore</button>
                </div>
                {!featuredFilesLoading && featuredFiles ? (
                    <div className="featured-section-image-accordion">
                        <img 
                            src={featuredFiles[0].url} 
                            alt={featuredFiles[0].name}
                            className="featured-section-image"
                            onClick={() => navigate(`/featured`)}
                         />

                        <img 
                            src={featuredFiles[1].url} 
                            alt={featuredFiles[1].name}
                            className="featured-section-image"
                            onClick={() => navigate(`/featured`)}
                        />

                        <img 
                            src={featuredFiles[2].url} 
                            alt={featuredFiles[2].name}
                            className="featured-section-image"
                            onClick={() => navigate(`/featured`)}
                        />
                    </div>
                ) : (
                    <FileLoading/>
                )}
            </div>

            <div className="home-page-header-container">
                <div className="header">
                    <SearchBar />
                </div>
                {tags.length === 0 ? (
                    <SkeletonTags />
                ) : (
                    <div className="popular-tags-wrapper">
                        {tags.map((t, index) => (
                            <span
                                onClick={() => handleTagClick(t.tag_name)}
                                key={index}
                                className={`popular-tag tag ${tag === t.tag_name.toLowerCase() ? "selected-tag" : ""}`}
                            >
                                {t.tag_name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {loadedFiles.length === 0 && !hasMore && !loading && (
                <span className="loading-text">No files found for '{query}'</span>
            )}

            {loadedFiles.length === 0 && hasMore ? (
                <SkeletonMasontry />
            ) : (
                <>
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="masonry-grid"
                        columnClassName="masonry-grid-column"
                    >
                        {loadedFiles.map((file, index) => (
                            <FileCard key={index} file={file} />
                        ))}
                    </Masonry>
                    <ListEndMarker />
                </>
                
            )}
        </div>
    );
}