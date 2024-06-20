import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.css' 
import { CartProvider } from '../contexts/CartContext'
import { SessionProvider } from "next-auth/react"
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps}) {

  return (
    <>
      <SessionProvider session={pageProps.session}>
      <CartProvider>
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
          </Head>
      
          <Component {...pageProps} />
          <ToastContainer/>
        </CartProvider>
        </SessionProvider>
    </>
  )
}
 
export default MyApp