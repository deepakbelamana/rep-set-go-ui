import { Link, useNavigate } from 'react-router-dom'
import './signUp.css'
import { useState } from 'react';


export default function SignUp() {

  const [formData, setFormData] = useState({
    email: '',
    pwd_hash: '',
    confirmPwd_hash:''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.pwd_hash !== formData.confirmPwd_hash) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:9090/rep-set-go/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          pwd_hash: formData.pwd_hash,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Signup successful! Please login to continue');
        localStorage.clear();
        navigate('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}> 
        <input type="email" placeholder="Email" name="email" onChange={handleChange}/><br />
        <input type="password" placeholder="Password" name="pwd_hash" onChange={handleChange}/><br />
        <input type="password" placeholder="Confirm Password" name="confirmPwd_hash" onChange={handleChange} /><br />
        <button type="submit">Create Account</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  )
}
