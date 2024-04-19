import { X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import './CoursesSidebar.css';
import coin from '../Shop/spinningCoin.gif';

interface CoursesSidebarProps {
    onClose: () => void;
}

interface Prof {
    username: string;
    role: string;
    profile: {
        firstName: string;
        lastName: string;
        email: string;
    };
    currency: number | null;
    resetPasswordConfig: boolean;
}

const Profile: React.FC<CoursesSidebarProps> = ({ onClose }) => {
    const [profile, setProfile] = useState<Prof | null>(null);
    // const [resetPasswordConfig, setResetPasswordConfig] = useState<boolean>(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('Fetching Profile details...');
    const [stringOfExclamation, setStringOfExclamation] = useState('!');

    useEffect(() => {
        if (isLoading) {
            const t1 = setTimeout(() => {
                setLoaderMessage('Just a bit longer');
            }, 3000);

            const t2 = setTimeout(() => {
                setLoaderMessage('Almost done');
            }, 6000);

            const t3 = setInterval(() => {
                setStringOfExclamation((prev) => prev.length < 3 ? prev + '!' : '!');
            }, 500);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearInterval(t3);
            };
        }
    }, [isLoading]);

    useEffect(() => {
        setIsLoading(true);
        setLoaderMessage('Fetching Profile Data...');
        const checkProfile = async () => {
            try {
                const response = await fetch("http://localhost:8080/profile", {
                    method: "GET",
                    credentials: "include", // Include cookies in the request
                });

                setProfile(await response.json());
                if (!response.ok) {
                    throw new Error("Failed to fetch the user profile");
                }
            } catch (error) {
                console.error("Error checking for profile", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        checkProfile();
        // setResetPasswordConfig(profile?.resetPasswordConfig || false);

        // Add event listener to close sidebar when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // const handleResetPasswordConfig = () => {
    //     setResetPasswordConfig(!resetPasswordConfig);
    // }

    return (
        <div className='main-container' ref={profileRef}>
            <div className='header-container is-rounded'>
                <div className='close-button'>
                    <X onClick={onClose} />
                </div>
            </div>

            {profile?.role === 'student' ? (
                <div>
                    <hr className='nes-line' />
                    <div className="nes-container is-dark with-title">
                    <p className="title">Balance</p>
                    <div style={{
                        display: 'inline-flex',
                    }}>
                        <img src={coin} alt="coin" style={{width: '25px', height:'25px'}}/>
                        <p style={{marginTop:'2px', marginLeft:'5px'}} className='nes-text'>{profile?.currency}</p>
                    </div>
                </div>
                </div>
                
            ) : null}
            <hr className='nes-line' />
            {isLoading ? (
                <div className="loading-container" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <p>{loaderMessage}{stringOfExclamation}</p>
                </div>
            ) : (
            <div className="nes-container is-dark with-title">
                    <p className="title">Profile</p>

                    <div className="nes-container is-rounded is-dark">
                        <p>Username: {profile?.username}</p>
                    </div>
           
                    <div className="nes-container is-rounded is-dark">
                        <p>Name: {profile?.profile.firstName} {profile?.profile.lastName}</p>
                    </div>

                    <div className="nes-container is-rounded is-dark">
                        <p>Email: {profile?.profile.email}</p>
                    </div>
            </div>)}
            {/* <hr className='nes-line' />
            <div className="nes-container is-dark with-title">
                <label>
                    <input type="checkbox" className="nes-checkbox is-dark" checked={resetPasswordConfig} onChange={handleResetPasswordConfig}/>
                    <span>Create password when students logges in for first time?</span>
                </label>
            </div> */}
            <hr className='nes-line' />

            <div className="nes-container is-dark with-title">
                <p className="title">Role</p>
                <p className='nes-text'>{profile?.role === 'student' ? 'Student' : 'Instructor'}</p>
            </div>
            
            <hr className='nes-line' />
        </div>
    );
};

export default Profile;
