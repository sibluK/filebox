import "../styles/tooltip.css";

interface TooltipProps {
    children: React.ReactNode;
    text: string;
}

export default function Tooltip({ children, text }: TooltipProps) {

    return (
        <div className="tooltip-wrapper">
            <div className="tooltip-children">
                {children}
                <div className="tooltip-content">
                    {text}
                </div>
            </div>
            
        </div>
    );
}