import images from "../assets/images";

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative flex items-center justify-center w-24 h-24">
                {/* Spinner */}
                <div className="absolute border-t-4 border-[#db2777] border-solid rounded-full w-24 h-24 animate-spin"></div>
                {/* Centered Image */}
                <img src={images?.svg?.logo} alt="Loading" className="absolute w-12 h-12" />
            </div>
        </div>
    );
};

export default LoadingSpinner;