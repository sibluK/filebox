import { Link } from "react-router";
import "../styles/navbar.css";
import { SignedIn, SignInButton, UserButton, SignedOut } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-link">
        <Link to={"/"}>Home</Link>
      </div>
      <div className="nav-link">
        <Link to={"/files"}>Files</Link>
      </div>
      <SignedOut>
        <div className="nav-link">
            <Link to={"/sign-up"}>Sign Up</Link>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}
