export function Button({label, onClick}) {
    return <button onClick={onClick} type="button" 
        className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 transition-all duration-200 ease-in-out active:scale-95">
        {label}
    </button>
}