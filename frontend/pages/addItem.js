import Layout from "../components/Layout";
import { useState } from 'react';
import { useRouter } from 'next/router';

function AddItem() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [error, setError] = useState(null);
    const router = useRouter();


    const handleSubmit = async (e) => {
    const authenticatedUser = JSON.parse(localStorage.getItem('user'));
    if (!authenticatedUser) {
        router.push('/login');
        return;
    }    
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/products/create/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${authenticatedUser.token}`,
        },
      body: JSON.stringify({ title, description, price }),
    });

    if (res.ok) {
      router.push('/myitems');
    } else {
      const data = await res.json();
      setError(data.detail || "Something went wrong");
    }
  };
    
    return (
        <Layout>
            <div className="signup-container">
            <h2>Add item</h2>
                <form onSubmit={handleSubmit} method="post">
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" required value={ title} onChange={(e)=>setTitle(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input type="text" id="description" name="description" required value={ description} onChange={(e)=>setDescription(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price:</label>
                        <input type="number" id="price" name="price" required value={ price} onChange={(e)=>setPrice(e.target.value)} />
                    </div>
                    <button type="submit">Create</button>
                </form>
            </div>
        </Layout>
    );
}

export default AddItem;