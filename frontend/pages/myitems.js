import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';
import { useSession } from 'next-auth/react';

const MyItems = () => {
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [onSaleProducts, setOnSaleProducts] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);
    const router = useRouter();
    const { data: session, status } = useSession();



    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/myItems/", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access}`,
                    },
                
                });
                const data = await res.json();
                setPurchasedProducts(data.item_purchased);
                setSoldProducts(data.item_sold);
                setOnSaleProducts(data.item_on_sale);
            } catch (e) {
                setError(e);

            }
        };
        if (session) {
            fetchItems();
        }
        
    }, [session]);

    if (error) {
        return <div>Error: {error.message}</div>;

    }

    return (
        <Layout>
            <div className="container">
                {onSaleProducts && onSaleProducts.length>0 && <><h1>Item on sale</h1>
                <div className="row">
                    <ProductList products={onSaleProducts} />
                </div></>}
                {purchasedProducts && purchasedProducts.length>0 && <> <hr className="hr" />
                <h1>Item Purchased</h1>
                <div className="row">
                    <ProductList products={purchasedProducts} />
                </div></>}
                {soldProducts && soldProducts.length>0 && <><hr className="hr" />
                <h1>Item Sold</h1>
                <div className="row">
                    <ProductList products={soldProducts} />
                </div></>}
            </div>
        </Layout>
    );
};

export default MyItems;
