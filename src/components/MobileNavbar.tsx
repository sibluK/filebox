import { Link } from "react-router";
import "../styles/navbar.css";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import ThemeChanger from "./ThemeChanger";
import { useEffect, useRef } from "react";

interface MobileNavbarProps {
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MobileNavbar({ isMenuOpen, setIsMenuOpen } : MobileNavbarProps) {
  
    const mobileNavRef = useRef<HTMLDivElement>(null);

    function handleClose() {
        setIsMenuOpen(false);
    }

    useEffect(() => {
        function handleOutsideClick(e: Event) {
            if(mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
                handleClose();
            }
        }

        document.addEventListener('mousedown', handleOutsideClick, true);
        document.addEventListener('scroll', handleClose, true);
        document.addEventListener('resize', handleClose, true);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick, true);
            document.removeEventListener('scroll', handleClose, true)
            document.removeEventListener('resize', handleClose, true);
        }
    }, [])

    return (
    <>
        {isMenuOpen && (
            <nav ref={mobileNavRef} className="mobile-navbar">
                <div className="nav-link" onClick={handleClose}>
                    <Link to={"/"}>Home</Link>
                </div>
                <SignedOut>
                    <div className="nav-link" onClick={handleClose}>
                        <Link to={"/sign-up"}>Sign Up</Link>
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className="nav-link" onClick={handleClose}>
                        <Link to={"/files"}>Files</Link>
                    </div>
                </SignedIn>

                <ThemeChanger />
            </nav>
        )} 
    </>
  );
}
