import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.css' 
import { CartProvider } from '../contexts/CartContext'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <CartProvider>
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
      </Head>
      
      <Component {...pageProps} />
    </CartProvider>
    </>
  )
}
 
export default MyApp