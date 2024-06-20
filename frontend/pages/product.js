import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
const TargetPage = () => {
  const router = useRouter();
  const { product } = router.query;
    const [parsedData, setParsedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productDetails, setProductDetails] = useState(null);
  const [price, setPrice] = useState(0);
  const { data: session, status } = useSession();

    useEffect(() => {
        if (product) {
            const fetchProductDetails = async () => {
                try {
                  const res = await fetch(`http://localhost:8000/api/product/${product}/`);
                  if (!res.ok) {
                    throw new Error('Failed to fetch product details');
                  }
                  const data = await res.json();
                  setProductDetails(data);
                  setLoading(false);
                  
                } catch (error) {
                  setError(error.message);
                  setLoading(false);
                }
              };
        
              fetchProductDetails();

    }
    }, [product]);
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/products/${product}/update/`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${session.access}`,

        },
        body: JSON.stringify({ price }),

      })
      if (res.ok) {
        toast.success("product updated successfully");
        router.push("/");
      }
    } catch (e) {
      console.log(e);
    }
        
    };

  return (
      <div>
          {productDetails &&
          <Layout>
          <div className="box-element">
                        <div className="cart-row">
                            <div style={{ flex: 2 }}><strong>Item</strong></div>
                            <div style={{ flex: 2 }}><strong>Description</strong></div>
                          <div style={{ flex: 1 }}><strong>Price</strong></div>
                          <div style={{ flex: 1 }}><strong>Update Price</strong></div>
                          
                        </div>
                            <div className="cart-row" key={productDetails.id}>
                          <div style={{ flex: 2 }}><p>{productDetails.title}</p></div>
                          <div style={{ flex: 2 }}><p>{ productDetails.description }</p></div>
                                <div style={{ flex: 1 }}><p>{productDetails.price }</p></div>
                          <div style={{ flex: 1 }}>
                          <form id="searchbar" className="d-flex" onSubmit={handleSubmit}>
                <input name="price"
                  className="form-control me-2"
                  type="number"
                  placeholder="price"
                                      aria-label="Number"
                                      onChange={(e) => setPrice(e.target.value)}
                  />
                <button className="btn btn-warning" type="submit">
                  update
                </button>
                </form>
                                </div>
                            </div>

                    </div>
    </Layout>}

        
    </div>
  );
};

export default TargetPage;
