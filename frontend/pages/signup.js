import Layout from "../components/Layout";
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Signup() {
    const [username, setUSername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();


    const handleSubmit = async (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
      body: JSON.stringify({ username, email, password: password1 }),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.detail || "Something went wrong");
    }
  };
    
    return (
        <Layout>
            <div className="signup-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit} method="post">
                    {error && <p className="text-danger">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="username">Name:</label>
                        <input type="text" id="username" name="username" required value={ username} onChange={(e)=> setUSername(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required value={ email} onChange={(e)=> setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password1">Password:</label>
                        <input type="password" id="password1" name="password1" required value={ password1} onChange={(e)=>setPassword1(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password2"> Retype your Password:</label>
                        <input type="password" id="password2" name="password2" required value={ password2} onChange={(e)=>setPassword2(e.target.value)} />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <Link href="/login">Login</Link></p>
            </div>
        </Layout>
    );
}

export default Signup;