import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';

const Search = () => {
  const router = useRouter();
  const { query } = router.query;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (query) {
      // Fetch search results from your API
      axios
        .get(`http://localhost:8000/api/products?search=${query}`)
        .then((response) => {
          setProducts(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
        });
    }
  }, [query]);

  return (
    <Layout>
      <div className="container">
        <h1>Search Results</h1>
        <div className="row">
        <ProductList products={products} />
        </div>
      </div>
    </Layout>
  );
};

export default Search;
