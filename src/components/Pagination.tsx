import { memo } from "react";
import "../styles/pagination.css"

interface PaginationProps {
    page: number;
    goToNextPage: () => void;
    goBackPage: () => void;
}

function Pagination({ page, goToNextPage, goBackPage }: PaginationProps) {

    return (
        <div className="pagination-wrapper">
            {page > 1 && (
                <button onClick={goBackPage}>Back</button>
            )}
            <span>{page}</span>
            <button onClick={goToNextPage}>Next</button>
        </div>
    );
}

export default memo(Pagination);