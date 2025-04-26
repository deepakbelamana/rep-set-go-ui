import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    email: "",
    pwd_hash: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.type === "email" ? "email" : "pwd_hash"]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(baseUrl+"/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            pwd_hash: formData.pwd_hash,
          }),
      });

      if (response.ok) {
        const jwtToken = response.headers.get("token");
        const userId = response.headers.get("userId");
        
        if (jwtToken) {
          localStorage.setItem("token", jwtToken);
          localStorage.setItem("userId", userId);
          toast.success('Welcome back!', {
            onClose: () => {
        navigate("/home");
            }
          });
        } else {
          toast.error('Login successful but token not received');
        }
      } else {
        const errorText = await response.text();
        toast.error(errorText || 'Login failed');
      }
    } catch (err) {
      console.error("Error during login:", err);
      toast.error('Something went wrong..!');
    }
  };

  return (
    <Container className="py-4">
      <ToastContainer 
        position="top-right"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="dark"
      />
    <div>
      <h1>Rep Set Go</h1>
    </div>
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          name="pwd_hash"
          onChange={handleChange}
        />
        <br />
        <button type="submit" style={{borderRadius:4}}>Login</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
    </Container>
  );
}
