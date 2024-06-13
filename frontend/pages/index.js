// pages/index.js
import Layout from '../components/Layout';
import ProductList from '../components/ProductList';
import React from 'react';


export default function Home({ products }) {
  return (
    <Layout>
      <div className="container">
        <h1>Products</h1>
        <ProductList products={products} />
      </div>
    </Layout>
  );
}


export async function getServerSideProps() {
  const res = await fetch('http://localhost:8000/api/products')
  const products = await res.json();
  return {
    props: {
      products,
    },
  };
}

