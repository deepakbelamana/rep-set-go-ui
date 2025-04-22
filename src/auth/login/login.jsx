import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

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
    console.log(JSON.stringify({
      email: formData.email,
      pwd_hash: formData.pwd_hash,
    }));
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:9090/rep-set-go/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            pwd_hash: formData.pwd_hash,
          }),
        }
      );
      if (response.ok) {
        response.headers.forEach((v,k)=>{
          console.log(`value ${v} : key ${k} `)
        })

        const jwtToken = response.headers.get("token");
        localStorage.setItem("token",jwtToken);

        const userId = response.headers.get("userId");
        localStorage.setItem("userId",userId);

        alert("welcome back");
        // Redirect to home
        navigate("/home");
      } else {
        alert('login failed');
      }
    } catch (err) {
      console.log(err);
      alert("something went wrong..!");
    }
  };

  return (
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
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>
    </div>
  );
}
