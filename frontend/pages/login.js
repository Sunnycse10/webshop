import { useContext, useState } from "react";
import Layout from "../components/Layout";
import Link from 'next/link';
import { useRouter } from "next/router";
import { CartContext } from "../contexts/CartContext";

function Login() {
  const [username, setUSername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null);
  const { cartCount, updateCartCount } = useContext(CartContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data));
      const cartRes = await fetch('http://localhost:8000/api/cart', {
        headers: {
          'Authorization': `token ${data.token}`,
        }
      });
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const cartCount = cartData.items.length;
        updateCartCount(cartCount);
      }
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.detail || "Invalid credentials");
    }
  };






  return (
    <Layout>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} method="post">
          <div className="form-group">
            <label htmlFor="username">Name:</label>
            <input type="text" id="username" name="username" required value={username} onChange={(e) => setUSername(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link href="/signup">Sign up</Link></p>
      </div>
    </Layout>
  );
}

export default Login;