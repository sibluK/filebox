import { useCallback } from "react";
import { useSearchParams } from "react-router";

interface FileFilters {
    search?: string;
    tag?: string;
}

export default function useFileFilters() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const setFilters = useCallback(({ search, tag }: FileFilters) => {
        const newSearchParams = new URLSearchParams(searchParams);
        
        if (search !== undefined) {
            if (search) {
                newSearchParams.set('search', search);
            } else {
                newSearchParams.delete('search');
            }
        }
        
        if (tag !== undefined) {
            if (tag) {
                newSearchParams.set('tag', tag);
            } else {
                newSearchParams.delete('tag');
            }
        }
        
        if (newSearchParams.toString()) {
            setSearchParams(newSearchParams);
        } else {
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    return {
        query: searchParams.get('search') || "",
        tag: searchParams.get('tag') || "",
        setFilters,
    };
}

