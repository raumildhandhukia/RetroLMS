import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

interface Credentials {
  username: string;
  password: string;
}

// interface UserData {
//   role: string;
// }

const Login: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Make a request to the server to check the authentication status
        const response = await fetch('http://localhost:8080/check-auth', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });

        if (response.ok) {
          // User is authenticated, redirect to the landing page
          navigate('/courses');
        } else {
          // User is not authenticated, continue rendering the login page
          console.log('User not authenticated');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });

  const handleLogin = async () => {
    try {
      // Send credentials to the server
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        // On successful login, get the JWT from the response
        // const { jwt } = await response.json();

        // Decode JWT to get the role
        // const decodedJwt = decodeJwt(jwt);

        // Store JWT in httponly cookie (you need to implement this on the server side)
        // document.cookie = `jwt=${jwt}; Secure; HttpOnly`;

        // Redirect based on the role
        redirectToRole();
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };


  const redirectToRole = () => {
    window.location.href = '/courses';
  };

  return (
        <div id="NewRootRoot" className="center-container">
          <div className="login-container">
            <img src="https://file.rendit.io/n/mWZVWPIwAmEIOBF3b0E9.png" alt="Arizona State University"
                 className="logo"></img>
            <div className="form-container">
              <h1 className="form-title">Sign In</h1>
              <div className="form-group">
                <label htmlFor="username" className="form-label">ASURITE User ID</label>
                <input id="username" type="text" placeholder="" className="form-input"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}>        
                </input>
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input id="password" type="password" placeholder="" className="form-input"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}>
                </input>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}>
                <button className="form-button" type="submit">Sign In</button>
              </form>
            </div>
          </div>
        </div>
  );
};

export default Login;