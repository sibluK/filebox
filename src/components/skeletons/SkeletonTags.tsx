import "../../styles/skeleton.css"

export default function SkeletonTags() {
    return (
        <div className="skeleton-tags-wrapper">
            {Array.from({ length: 10 }).map((_, index) => (
                <span key={index} className="skeleton-tag"></span>
            ))}
        </div>
    );
}