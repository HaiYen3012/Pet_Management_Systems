import { Link } from "react-router-dom"

export default function PetHeader(props) {
    return (
        <header 
            className="flex flex-col items-start px-8 py-6 w-full shadow-sm border-b"
            style={{
                background: 'linear-gradient(135deg, #FFFEF7 0%, #FFF9E6 100%)',
                borderBottomColor: '#F5F5DC'
            }}
        >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm">
                <Link 
                    to={'/pet'}
                    className="flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 hover:shadow-md"
                    style={{
                        color: '#666',
                        background: 'rgba(245, 215, 110, 0.1)',
                        border: '1px solid rgba(245, 215, 110, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(245, 215, 110, 0.2)'
                        e.target.style.color = '#4A4A4A'
                        e.target.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(245, 215, 110, 0.1)'
                        e.target.style.color = '#666'
                        e.target.style.transform = 'translateY(0)'
                    }}
                >
                    <span>🏠</span>
                    <span className="font-medium">Home</span>
                </Link>
                
                <div 
                    className="mx-1 text-lg"
                    style={{ color: '#F5D76E' }}
                >
                    /
                </div>
                
                <div 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                        color: '#4A4A4A',
                        background: 'rgba(245, 215, 110, 0.15)',
                        border: '1px solid rgba(245, 215, 110, 0.3)'
                    }}
                >
                    🐾 Thông tin chi tiết thú cưng
                </div>
            </nav>

            {/* Main Title */}
            <div className="mt-4 flex items-center gap-3">
                <div 
                    className="w-1 h-8 rounded-full"
                    style={{
                        background: 'linear-gradient(135deg, #F5D76E 0%, #F2C94C 100%)'
                    }}
                ></div>
                <h1 
                    className="text-2xl font-semibold leading-8"
                    style={{ color: '#2D2D2D' }}
                >
                    Thông tin chi tiết của{' '}
                    <span 
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xl font-bold"
                        style={{
                            background: 'linear-gradient(135deg, #F5D76E 0%, #F2C94C 100%)',
                            color: '#2D2D2D',
                            boxShadow: '0 2px 8px rgba(245, 215, 110, 0.3)'
                        }}
                    >
                        💝 {props.petName || "thú cưng"}
                    </span>
                </h1>
            </div>

            {/* Decorative elements */}
            <div className="mt-3 flex gap-2">
                {['🐕', '🐱', '🐾'].map((emoji, index) => (
                    <div
                        key={index}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm animate-pulse"
                        style={{
                            background: `rgba(245, 215, 110, ${0.1 + index * 0.05})`,
                            animationDelay: `${index * 0.2}s`,
                            animationDuration: '2s'
                        }}
                    >
                        {emoji}
                    </div>
                ))}
            </div>
        </header>
    )
}