import "../styles/pagination.css"

interface PaginationProps {
    page: number;
    goToNextPage: () => void;
    goBackPage: () => void;
}

export default function Pagination({ page, goToNextPage, goBackPage }: PaginationProps) {

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