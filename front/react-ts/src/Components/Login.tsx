import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

interface Credentials {
  username: string;
  password: string;
}
interface ValidationResult {
  isValid: boolean;
  message: string;
}

// interface UserData {
//   role: string;
// }

const validateSignInInputs = (credentials:Credentials): ValidationResult => {
  // Regular expression for the userId validation
  const userIdPattern = /^[a-zA-Z0-9@#-]+$/;
  
  // Regular expression for the password validation
  const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  
  // Validate userId
  if (!userIdPattern.test(credentials.username)) {
    return { isValid: false, message: "Username should contain characters, numbers, and @, -, # characters." };
  }
  
  // Validate password
  if (!passwordPattern.test(credentials.password)) {
    return { isValid: false, message: "Password should be minimum 8 characters long including numbers, and special characters." };
  }
  
  // If both validations pass
  return { isValid: true, message: "Validation successful." };
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Make a request to the server to check the authentication status
        const response = await fetch("http://localhost:8080/check-auth", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        if (response.ok) {
          // User is authenticated, redirect to the landing page
          navigate("/courses");
        } else {
          // User is not authenticated, continue rendering the login page
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });
  const [validationMessage, setValidationMessage] = useState<string>('');


  const handleLogin = async () => {
    try {
      const validation = validateSignInInputs(credentials);
      console.log(validation);
      if (!validation.isValid) {
        setValidationMessage(validation.message);
        return; // Stop the form submission if validation fails
      } else {
        setValidationMessage("Validation successful. Proceeding with sign-in.");
        // Proceed with your sign-in logic here...
        console.log("Sign-In successful");
      }
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
        // On successful login, get the JWT from the response
        // const { jwt } = await response.json();

        // Decode JWT to get the role
        // const decodedJwt = decodeJwt(jwt);

        // Store JWT in httponly cookie (you need to implement this on the server side)
        // document.cookie = `jwt=${jwt}; Secure; HttpOnly`;

        // Redirect based on the role
        redirectToRole();
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const redirectToRole = () => {
    window.location.href = "/courses";
  };

  return (
        <div id="NewRootRoot" className="flex justify-center items-center min-h-[100vh] bg-white">
          <div className="flex flex-col items-center w-full max-w-[400px] rounded-lg shadow border-2 border-black bg-gray-100">
            <img 
              src="https://file.rendit.io/n/mWZVWPIwAmEIOBF3b0E9.png"
              alt="Arizona State University" 
              className="rounded-t-lg py-4 px-2 bg-asu-gold"
            ></img>
            <div className="form-container p-6">
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
                <button className="bg-asu-maroon/90 hover:bg-asu-maroon p-2 rounded-md text-white mt-4" type="submit">
                  Sign In
                </button>
              </form>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <button className="form-button" type="submit">
              Sign In
            </button>
            {validationMessage && <div className="validation-message">{validationMessage}</div>}
          </form>
        </div>
  );
};

export default Login;
