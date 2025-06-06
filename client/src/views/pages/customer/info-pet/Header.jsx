import { Link } from "react-router-dom"
export default function PetHeader(props) {
    return (
        <header className="flex flex-col items-start px-6 py-4 w-full bg-white max-md:px-5 max-md:max-w-full">
            <div className="flex gap-2 text-sm leading-5 text-black text-opacity-50">
                <Link to={'/pet'}>
                    <div>Home</div>
                </Link>
                
                <div>/</div>
                <div>Thông tin chi tiết thú cưng</div>
            </div>
            <div className="mt-3.5 text-xl font-medium leading-7 text-black text-opacity-80">
                Thông tin chi tiết của {props.petName || "thú cưng"}
            </div>
        </header>
    )
}