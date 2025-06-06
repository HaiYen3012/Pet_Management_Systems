import React from 'react';
import useAuth from "hooks/useAuth";
import { useNavigate } from 'react-router-dom';

import "./HomePage.scss";
import thumbnail1 from 'assets/images/homePage-image/anhh4.jpg';
import thumbnail2 from 'assets/images/homePage-image/anhh5.jpg';
import thumbnail3 from 'assets/images/homePage-image/anhh6.jpg';
import thumbnail4 from 'assets/images/homePage-image/anhh7.jpg';
import thumbnail5 from 'assets/images/homePage-image/anhh9.jpg';
import thumbnail10 from 'assets/images/homePage-image/anhh10.jpg';
import thumnail1 from 'assets/images/homePage-image/catdog.jpg';
import thumnail2 from 'assets/images/homePage-image/anh1.jpg';
import thumnail3 from 'assets/images/homePage-image/anh2.jpg';
import thumnail4 from 'assets/images/homePage-image/anh3.jpg';



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
            <button onClick={() => handleLogin()} >Log in</button>
            <span>or</span>
            <button onClick={() => handleSignup()}>Sign up</button>
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
            <div className='Homepage-part1-left '>
                <img src={thumnail1} alt="" width="560" height="667" />
            </div>
            <div className='Homepage-part1-right'>
                <h1>
                    PET SERVICES MANAGER
                    <span> for customer</span>
                </h1>
                <br /> <br /> <br /> 
                <p>
                    Revolutionizing pet care, our platform lets you effortlessly organize all pet-related tasks and appointments in one place. From vet visits to grooming, medication reminders to training, our user-friendly interface makes pet care a breeze. Access valuable resources for your pet's health and happiness. Say goodbye to stress and hello to peace of mind. Join us today for an easier pet ownership experience!
                </p>
                <br /> <br />
                <div className='img-list'>
                    <img src={thumnail2} className='img-item' alt="" />
                    <img src={thumnail3} className='img-item' alt="" />
                    <img src={thumnail4} className='img-item' alt="" />
                </div>
                <br /> <br /> 
                <button onClick={() => handleLogin()} >Using service now !</button>
            </div>
            <br/><br/>
        </div> 
    )
}

const HomePart2 = () => {
    return (
        <div className='homepage-part2'>
            <br/> <br />
            <hr />
            <br /> <br/>
            <div className='homepage-part2-content'>
                <div className='homepage-part2-left'>
                    <img src={thumbnail5} alt="" />
                    <div className='img-list'>
                        <div>
                            <img src={thumbnail1} className='img-item' alt="" />
                            <span>Clean</span>
                        </div>
                        <div>
                            <img src={thumbnail3} className='img-item' alt="" />
                            <span>Healthy</span>
                        </div>
                        <div>
                            <img src={thumbnail2} className='img-item' alt="" />
                            <span>Storage</span>
                        </div>
                    </div>
                    <br /> <br /> 
                </div>
                <div className='homepage-part2-right'>
                    <img src={thumbnail4} alt="" />
                </div>
            </div>
            <br /><br />
        </div>
    )
}

const HomePart3 = () => {
    return (
        <div className='homepage-part3'>
            <hr /> <br /> <br />  
            <h1>Why should you rely on us</h1>
            <br /> <br /> 
            <img src={thumbnail10} alt='' />
            <br /> <br /> 
            <p>
                At our service, we prioritize sustainability, efficiency, and compassion in everything we do. 
                <br /><br />
                <ul>
                    <li><strong>Sustainability:</strong> We believe in recycling and using sustainable materials to help protect our planet. </li><br /> 
                    <li><strong>Reliability:</strong> From accurate documentation to punctual service delivery, you can rely on us to meet your needs with the utmost reliability and responsibility.</li><br /> 
                    <li><strong>Trust:</strong> We build trust through transparent transactions and fair trade practices. Our ethical approach ensures that every interaction is based on honesty and integrity.</li><br /> 
                    <li><strong>Community:</strong> We are deeply embedded in our community, providing not only services but also care and support. We believe in giving back to the community that supports us.</li><br /> 
                    <li><strong>Accountability:</strong> We hold ourselves accountable for the welfare of our clients and their interests. Our quality assurance practices are rigorous, ensuring that you receive only the best.</li><br /> 
                </ul>
            </p>
            <br /> <br />
        </div>
    )
}

const Homepage = () => {
    return (
        <div className='homepage'>
            <Header />
            <HomePart1 />
            <HomePart2 />
            <HomePart3 />
        </div>
    )
}

export default Homepage;
