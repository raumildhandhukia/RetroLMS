import React, { useState } from 'react'; 
import './CreatePassword.css';
import { useNavigate } from "react-router-dom";

const CreatePassword: React.FC = () => {

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showErrorString, setShowErrorString] = useState<boolean>(false);
    const navigate = useNavigate();

    const updatePassword = async ()=>{
        if (password && password === confirmPassword) {
                try{
                    const response = await fetch('http://localhost:8080/updateStudent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            password
                        }),
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        throw new Error('Failed to update password');
                    } else {
                        navigate('/dashboard');
                    } 
                } catch (error) {
                    console.error("Error updating password:", error);
                }
            } else {
                setShowErrorString(true);
            }
    };


    return (
    <div className="nes-container is-dark with-title flex-container">
        <div className="center-container">
        
            <h1>Please create a new password for your account</h1>
                <div className="nes-container is-dark with-title" style={{marginTop:"50px"}}>
                    <p className="title">Password</p>
                    <input 
                        type="password"
                        style={{color: 'black'}} 
                        id="password" 
                        onChange={(e) => setPassword(e.target.value)}
                        className="nes-input" 
                        value={password} 
                    />
                </div>
                <div className="nes-container is-dark with-title" style={{marginTop:"15px"}}>
                    <p className="title">Confirm Password</p>
                    <input 
                        type="password"
                        style={{color: 'black'}} 
                        id="confirm-password" 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="nes-input" 
                        value={confirmPassword} 
                    />
                </div>
            

                <div style={{marginTop:"15px"}}>
                    <p className="error-message" style={{ display: showErrorString ? 'block' : 'none', color: "red" }}>Passwords do not match</p>
                </div>
                <button type="button" className="nes-btn is-success" onClick={updatePassword}>Create Password</button>
        </div>
    </div>
)

}

export default CreatePassword;