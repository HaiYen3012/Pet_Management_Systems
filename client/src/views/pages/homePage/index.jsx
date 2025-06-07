import React from 'react';
import useAuth from "hooks/useAuth";
import { useNavigate } from 'react-router-dom';

import "./HomePage.scss";

// URLs ảnh thú cưng đẹp
const mainPetImage = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=560&h=667&fit=crop&crop=entropy&auto=format&q=80';
const serviceImage1 = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&h=150&fit=crop&crop=entropy&auto=format&q=80';
const serviceImage2 = 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=150&h=150&fit=crop&crop=entropy&auto=format&q=80';
const serviceImage3 = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop&crop=entropy&auto=format&q=80';
const teamImage = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80';

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        logout();
        navigate('/login');
    }

    const handleSignup = () => {
        navigate('/register');
    }
    return (
        <div className='header'>
            <button onClick={() => handleLogin()} >Đăng nhập</button>
            <span>hoặc</span>
            <button onClick={() => handleSignup()}>Đăng ký</button>
        </div>
    )
}

const HomePart1 = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <div className='Homepage-part1'>
            <div className='Homepage-part1-left'>
                <img src={mainPetImage} alt="Thú cưng đáng yêu" width="560" height="667" />
            </div>
            <div className='Homepage-part1-right'>
                <h1>
                    QUẢN LÝ DỊCH VỤ THÚ CƯNG
                    <span> dành cho khách hàng yêu thương</span>
                </h1>
                <br /> <br />
                <p>
                    Nền tảng chăm sóc thú cưng toàn diện - nơi bạn có thể quản lý mọi nhu cầu của boss nhỏ từ khám sức khỏe, grooming, đến lịch tiêm phòng. Giao diện thân thiện, dễ sử dụng giúp bạn yên tâm chăm sóc "con cưng" một cách tốt nhất!
                </p>
                <br />
                <div className='img-list'>
                    <img src={serviceImage1} className='img-item' alt="Chăm sóc sức khỏe" />
                    <img src={serviceImage2} className='img-item' alt="Grooming chuyên nghiệp" />
                    <img src={serviceImage3} className='img-item' alt="Dịch vụ cao cấp" />
                </div>
                <br />
                <button onClick={() => handleLogin()}>Bắt đầu ngay! 🐾</button>
            </div>
        </div> 
    )
}

const HomePart2 = () => {
    return (
        <div className='homepage-part2'>
            <br/><br/>
            <hr />
            <br/><br/>
            <h1>Tại sao chọn chúng tôi? 🌟</h1>
            <br/><br/>
            <div className='homepage-part2-content'>
                <div className='services-grid'>
                    <div className='service-item'>
                        <h3>🏥 Chăm sóc sức khỏe</h3>
                        <p>Đội ngũ bác sĩ thú y giàu kinh nghiệm, luôn sẵn sàng chăm sóc boss của bạn</p>
                    </div>
                    <div className='service-item'>
                        <h3>✨ Grooming chuyên nghiệp</h3>
                        <p>Dịch vụ làm đẹp cao cấp, giúp thú cưng luôn xinh xắn và sạch sẽ</p>
                    </div>
                    <div className='service-item'>
                        <h3>💖 Yêu thương tận tâm</h3>
                        <p>Chúng tôi hiểu rằng thú cưng không chỉ là động vật mà còn là thành viên trong gia đình bạn</p>
                    </div>
                </div>
            </div>
            <br/><br/>
        </div>
    )
}

const Homepage = () => {
    return (
        <div className='homepage'>
            <Header />
            <HomePart1 />
            <HomePart2 />
        </div>
    )
}

export default Homepage;