import { useEffect, useState } from "react";
import '../styles/back-top.css'

export default function ScrollTopButton() {

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const SCROLL_THRESHOLD = 500;

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setIsVisible(currentY > SCROLL_THRESHOLD);
        }

        handleScroll();

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    return (
        <>
            {isVisible && (
                <svg className="back-top-button" onClick={scrollToTop} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"  fill="#000000" transform="matrix(-1, 0, 0, -1, 0, 0)">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                    <g id="SVGRepo_iconCarrier"> <title>arrow-down-square</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" > <g id="Icon-Set-Filled" transform="translate(-570.000000, -985.000000)" fill="#3282ec"> <path d="M592.535,1002.88 L586.879,1008.54 C586.639,1008.78 586.311,1008.85 586,1008.79 C585.689,1008.85 585.361,1008.78 585.121,1008.54 L579.465,1002.88 C579.074,1002.49 579.074,1001.855 579.465,1001.465 C579.855,1001.074 580.488,1001.074 580.879,1001.465 L585,1005.59 L585,995 C585,994.447 585.448,994 586,994 C586.553,994 587,994.447 587,995 L587,1005.59 L591.121,1001.465 C591.512,1001.074 592.146,1001.074 592.535,1001.465 C592.926,1001.855 592.926,1002.49 592.535,1002.88 L592.535,1002.88 Z M598,985 L574,985 C571.791,985 570,986.791 570,989 L570,1013 C570,1015.21 571.791,1017 574,1017 L598,1017 C600.209,1017 602,1015.21 602,1013 L602,989 C602,986.791 600.209,985 598,985 L598,985 Z" id="arrow-down-square"> </path> </g> </g> </g>
                </svg>
            )}
            
        </>
    );
}