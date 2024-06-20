import Link from 'next/link';
import Head from 'next/head';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import ProductImage from './productImage';
import { useState, useEffect, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import '../styles/main.css';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const ProductList = ({ products }) => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const { cartCount, updateCartCount } = useContext(CartContext);
  const [user, setUSer] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();


  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUSer(session.user.id);
    }

  }, [status,session])



  const addToCart = async (productId) => {
    try {
      const res = await fetch('http://localhost:8000/api/cart/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access}`,

        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error adding to cart:', errorData.detail || 'Unknown error');
        toast.error(`${ errorData.detail || 'Unknown error' }`);
        return;
      }
      const data = await res.json();
      setCart(data.cart.items);
      updateCartCount(data.cart.items.length);
      toast.success("product added to the cart");
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <div className="row">
      {products.map(product => (
        <div className="col-lg-4" key={product.id}>
          {/* <img className="thumbnail" src="R.jpg" alt="R.jpg" /> */}
          <div className="box-element product">
          <ProductImage product={product}></ProductImage>
            {/* <h6><strong>{product.title}</strong></h6> */}
            <hr />
            {product.status === "on-sale" ? <button className="btn btn-outline-secondary bt-add" onClick={() => addToCart(product.id)}>Add to cart</button> :
              <span>Sold out</span>}
            {user && user === product.seller && product.status === "on-sale" &&
              <Link className="btn btn-outline-success" href={{ pathname: '/product', query: { product: JSON.stringify(product.id) } }}>Edit</Link>}
            <h4 style={{ display: 'inline - block', float: 'right' }}><strong>{`${product.price} ${product.price_currency}`}</strong></h4>
          </div>
        </div>))}
    </div>
  )
}

export default ProductList;