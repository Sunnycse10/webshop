import Layout from "../components/Layout";
import { useState, useContext, useEffect } from 'react';
import { Router, useRouter } from 'next/router';
import { CartContext } from '../contexts/CartContext';
import Link from "next/link";
import ProductImage from "../components/productImage";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { cartCount, updateCartCount } = useContext(CartContext);
    const [cartTotal, setCartTotal] = useState(0);
    const [priceChanges, setPriceChanges] = useState([]);
    const [soldItems, setSoldItems] = useState([]);
    const [checkoutError, setCheckoutError] = useState(null);
    const router = useRouter();



    useEffect(() => {
        const authenticatedUser = JSON.parse(localStorage.getItem('user'));
        const fetchCartItems = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/cart/', {
                    headers: {
                        'Authorization': `token ${authenticatedUser.token}`,
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch');
                }

                const data = await res.json();
                setCartItems(data.items || []);
                console.log(data.items);
                updateCartCount(data.items.length || 0);
                setCartTotal(data.items.reduce((sum, item) => sum + Number(item.product.price), 0))  // Update cart count
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [updateCartCount]);


    const removeCart = async (product_id) => {
        const authenticatedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const res = await fetch("http://localhost:8000/api/cart/remove/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `token ${authenticatedUser.token}`,
                },
                body: JSON.stringify({ product_id }),

            });

            if (!res.ok) {
                throw new Error("Failed to fetch");
            }
            debugger;

            const updatedCartItems = cartItems.filter(item => item.product.id !== product_id);
            setCartItems(updatedCartItems);
            updateCartCount(updatedCartItems.length);
            setCartTotal(updatedCartItems.reduce((sum, item) => sum + Number(item.product.price), 0) || 0);
            setLoading(false);


        } catch (error) {
            setError(error.message);

        }


    }

    const handlePay = async () => {
        const authenticatedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const res = await fetch("http://localhost:8000/api/pay/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `token ${authenticatedUser.token}`,
                },

            });

            if (!res.ok) {
                debugger;
                if (res.status === 400) {
                    const data = await res.json();
                    setPriceChanges(data.price_changes || []);
                    setSoldItems(data.unavailable_items || []);
                    setCheckoutError("Status of some items are changes, please review your cart");
                    debugger;

                }
                else {
                    throw new Error("Failed to complete checkout");
                }
            }
            else {
                const data = await res.json();
                console.log("successful checkout: ", data);
                alert("items purchased successfully!");
                setCartItems([]);
                updateCartCount(0);
                setCartTotal(0);
                setLoading(false);

                //router.push("/myitems");

            }

        } catch (error) {
            setError(error.message);
        }

    }

    const hasPriceChanged = (productId) => {
        debugger;
        return priceChanges.some(item => item.id === productId);
    }

    const isSold = (productId) => {
        return soldItems.some(item => item.id === productId);
    }



    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <Layout>
            <div className="row">
                <div className="col-lg-12">
                    <div className="box-element">

                        <Link className="btn btn-outline-dark" href="/">&#x2190; Continue Shopping</Link>

                        <br />
                        <br />
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        <h5>
                                            Items: <strong>{cartCount}</strong>
                                        </h5>
                                    </th>
                                    <th>
                                        <h5>
                                            Total:<strong> ${cartTotal}</strong>
                                        </h5>
                                    </th>
                                    <th>
                                        <div>
                                            <button className="btn btn-success" style={{ float: 'right', margin: '5px' }} onClick={() => handlePay()}>
                                                Checkout
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Here, you can add more <tr> elements for each cart item */}
                            </tbody>
                        </table>

                    </div>

                    <br />
                    <div className="box-element">
                        <div className="cart-row">
                            <div style={{ flex: 1 }}><strong>Title</strong></div>
                            <div style={{ flex: 2 }}><strong>Description</strong></div>
                            <div style={{ flex: 2 }}><strong>Price</strong></div>
                            <div style={{ flex: 1 }}><strong>Remove Item</strong></div>
                        </div>
                        {cartItems && cartItems.length > 0 && cartItems.map((item) => (
                            <div className="cart-row" key={item.product.id}>
                                <div style={{ flex: 1 }}><p>{item.product.title}</p></div>
                                <div style={{ flex: 2 }}><p>{item.product.title}</p></div>
                                <div style={{ flex: 2 }}><p>{item.product.price}</p>
                                    {hasPriceChanged(item.product.id) && (<p className="text-warning">Price has changed!</p>)}
                                    {isSold(item.product.id) && (<p className="text-warning">Product not available!</p>)}

                                </div>
                                <div style={{ flex: 1 }} > <button className="btn btn-danger" onClick={() => removeCart(item.product.id)}>
                                    Remove
                                </button></div>
                            </div>))}

                    </div>
                </div>
            </div>
        </Layout>
    );
}



export default Cart;