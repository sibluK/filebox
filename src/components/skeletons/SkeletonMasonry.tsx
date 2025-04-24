import Masonry from "react-masonry-css";
import "../../styles/masonry.css";

export default function SkeletonMasontry() {

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    }

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
        >
            {Array.from({ length: 6}).map((_, index) => (
                <div key={index} className="skeleton-image"></div>
            ))}
        </Masonry>

    );
}