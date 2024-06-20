import { useContext, useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from 'next/link';
import { useRouter } from "next/router";
import { CartContext } from "../contexts/CartContext";
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

function Login() {
  const [username, setUSername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null);
  const { cartCount, updateCartCount } = useContext(CartContext);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchCartCount = async () => {
      if (session) {
        try {
          const cartRes = await fetch('http://localhost:8000/api/cart', {
            headers: {
              'Authorization': `Bearer ${session.access}`,
            }
          });

          if (cartRes.ok) {
            const cartData = await cartRes.json();
            const cartCount = cartData.items.length;
            updateCartCount(cartCount);
          } else {
            console.error("Failed to fetch cart items.");
          }
        } catch (error) {
          updateCartCount(0);
          console.error("Error fetching cart items:", error);
        }
      }
    };

    fetchCartCount();
  }, [session, updateCartCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      username: username,
      password: password,
      redirect: false,
    });
    if (res?.ok) {
      router.push('/'); // Manually redirect after successful sign-in
    } else {
      toast.error("Invalid credentials!");
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