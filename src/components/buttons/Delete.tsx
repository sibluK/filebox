import "../../styles/buttons.css";

interface DeleteProps {
    handleDeletion: () => void;
}

export default function Delete({ handleDeletion }: DeleteProps) {

    return (
        <button className="delete-button file-action-button" onClick={handleDeletion}>
            <svg width="25px" height="25px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"  fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="icomoon-ignore"> </g> <path d="M26.129 5.871h-5.331v-1.066c0-1.178-0.955-2.132-2.133-2.132h-5.331c-1.178 0-2.133 0.955-2.133 2.132v1.066h-5.331v1.066h1.099l1.067 20.259c0 1.178 0.955 2.133 2.133 2.133h11.729c1.178 0 2.133-0.955 2.133-2.133l1.049-20.259h1.051v-1.066zM12.268 4.804c0-0.588 0.479-1.066 1.066-1.066h5.331c0.588 0 1.066 0.478 1.066 1.066v1.066h-7.464v-1.066zM22.966 27.14l-0.002 0.027v0.028c0 0.587-0.478 1.066-1.066 1.066h-11.729c-0.587 0-1.066-0.479-1.066-1.066v-0.028l-0.001-0.028-1.065-20.203h15.975l-1.046 20.204z" fill="#ffffff"> </path> <path d="M15.467 9.069h1.066v17.060h-1.066v-17.060z" fill="#ffffff"> </path> <path d="M13.358 26.095l-1.091-17.027-1.064 0.068 1.091 17.027z" fill="#ffffff"> </path> <path d="M20.805 9.103l-1.064-0.067-1.076 17.060 1.064 0.067z" fill="#ffffff"> </path> </g></svg>
        </button>
    );
}