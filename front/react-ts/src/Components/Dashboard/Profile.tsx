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
    locked : number | null;
    makeStudentEditable: boolean;
}

const Profile: React.FC<CoursesSidebarProps> = ({ onClose }) => {
    const [profile, setProfile] = useState<Prof | null>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
        };
        checkProfile();
        // setResetPasswordConfig(profile?.resetPasswordConfig || false);

        // Add event listener to close sidebar when clicking outside
        // const handleClickOutside = (event: MouseEvent) => {
        //     if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        //         onClose();
        //     }
        // };

        // document.addEventListener('mousedown', handleClickOutside);
        // return () => {
        //     document.removeEventListener('mousedown', handleClickOutside);
        // };
    }, [onClose]);

    const handleMakeStudentEditFullName = async () => {
        if (profile) {
            setProfile({
                ...profile,
                makeStudentEditable: !profile.makeStudentEditable,
            });
            debugger;
            const res = await fetch("http://localhost:8080/updateInstrutor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    makeStudentEditable: !profile.makeStudentEditable,
                }),
                credentials: "include",
            });

            if (!res.ok) {
                console.error("Failed to update student editable status");
            }
        }
    }

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
                    {/* <div className="nes-container is-dark with-title">
                        <p className="title">Locked</p>
                        <div style={{
                            display: 'inline-flex',
                        }}>
                            <img src={coin} alt="coin" style={{width: '25px', height:'25px'}}/>
                            <p style={{marginTop:'2px', marginLeft:'5px'}} className='nes-text'>{profile?.locked}</p>
                        </div>
                    </div> */}
                </div>
                
            ) : null}
            <hr className='nes-line' />
            <div className="nes-container is-dark with-title" style={{
                fontSize: '0.8rem',
            }}>
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
            </div>
            {profile?.role === 'instructor' && <>
            <hr className='nes-line' />
            <div className="nes-container is-dark with-title" style={{
                fontSize: '0.8rem',
            }}>
                <label>
                    <input type="checkbox" className="nes-checkbox is-dark" 
                    checked={profile?.makeStudentEditable} onChange={handleMakeStudentEditFullName}/>
                    <span>Make Student Name Editable</span>
                </label>
            </div>
            </>
            }
            <hr className='nes-line' />

            <div className="nes-container is-dark with-title" style={{
                fontSize: '0.8rem',
            }}>
                <p className="title">Role</p>
                <p className='nes-text'>{profile?.role === 'student' ? 'Student' : 'Instructor'}</p>
            </div>
            
            <hr className='nes-line' />
        </div>
    );
};

export default Profile;
