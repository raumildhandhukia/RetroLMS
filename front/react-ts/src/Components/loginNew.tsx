import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

interface Credentials {
  username: string;
  password: string;
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
    resetPassword: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>('');
  const [showPasswordCreatePage, setShowPasswordCreatePage] = useState<boolean>(false);

  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8080/check-auth", {
  //         method: "GET",
  //         credentials: "include", // Include cookies in the request
  //       });

  //       if (response.ok) {
  //         redirectToRole();
  //       } else {
  //         console.log("User not authenticated");
  //       }
  //     } catch (error) {
  //       console.error("Error checking authentication:", error);
  //     }
  //   };
  //   checkAuthentication();
  // }, []);

  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      // Send credentials to the server
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        redirectToRole();
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const getProfile = async () => {
        try {
          const response = await fetch("http://localhost:8080/profile", {
            method: "GET",
            credentials: "include",
          });
          if (response.ok) {
            const data:Prof = await response.json();
            setRole(data.role);
            setShowPasswordCreatePage(data.resetPassword);
          } else {
            console.log("User not found");
          }
        } catch (error) {
          console.error("Error checking for profile", error);
        }
      };

  const redirectToRole = () => {
    
    getProfile();
    console.log(role)
    if (role === "student") {
      if (showPasswordCreatePage) {
          navigate("/createPassword");
      } else {
        navigate("/dashboard");
      }
      
    } else if (role === "instructor") {
      debugger;
      navigate("/dashboard");
    }

    // window.location.href = "/dashboard";
  };

return (
    <div className="nes-container is-rounded is-centered login-container">
      <div className="form-container">
        <img
          src="https://file.rendit.io/n/mWZVWPIwAmEIOBF3b0E9.png" 
          alt="ASU"
          className="form-image"
        />
        <h1 className="form-title">Sign In</h1>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            ASURITE User ID
          </label>
          <input
            id="username"
            type="text"
            placeholder=""
            className="form-input"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder=""
            className="form-input"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <button className="nes-btn is-success mt-4" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );

};

export default Login;
