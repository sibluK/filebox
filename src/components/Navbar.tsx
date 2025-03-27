import { Link } from "react-router";
import "../styles/navbar.css";
import { SignedIn, UserButton, SignedOut } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-link logo-wrapper">
        <Link to={"/"}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
            <g id="SVGRepo_iconCarrier"> <path d="M17.5777 4.43152L15.5777 3.38197C13.8221 2.46066 12.9443 2 12 2C11.0557 2 10.1779 2.46066 8.42229 3.38197L6.42229 4.43152C4.64855 5.36234 3.6059 5.9095 2.95969 6.64132L12 11.1615L21.0403 6.64132C20.3941 5.9095 19.3515 5.36234 17.5777 4.43152Z" fill="#3282ec"/> <path d="M21.7484 7.96435L12.75 12.4635V21.904C13.4679 21.7252 14.2848 21.2965 15.5777 20.618L17.5777 19.5685C19.7294 18.4393 20.8052 17.8748 21.4026 16.8603C22 15.8458 22 14.5833 22 12.0585V11.9415C22 10.0489 22 8.86558 21.7484 7.96435Z" fill="#3282ec"/> <path d="M11.25 21.904V12.4635L2.25164 7.96434C2 8.86557 2 10.0489 2 11.9415V12.0585C2 14.5833 2 15.8458 2.5974 16.8603C3.19479 17.8748 4.27063 18.4393 6.42229 19.5685L8.42229 20.618C9.71524 21.2965 10.5321 21.7252 11.25 21.904Z" fill="#3282ec"/> </g>
          </svg>
          Filebox
        </Link>
      </div>
      <div className="nav-link">
        <Link className="animated-text-underline" to={"/"}>Home</Link>
      </div>
      <SignedOut>
        <div className="nav-link">
            <Link className="animated-text-underline" to={"/sign-up"}>Sign Up</Link>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="nav-link">
          <Link className="animated-text-underline" to={"/files"}>Files</Link>
        </div>
        <UserButton />
      </SignedIn>
    </nav>
  );
}
