import { useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

const ProductImage = ({ product }) => {
    const imageRef = useRef(null);

    useEffect(() => {
        if (imageRef.current) {
            htmlToImage.toPng(imageRef.current)
                .then((dataUrl) => {
                })
                .catch((error) => {
                    console.error('Error generating image:', error);
                });
        }
    }, [product]);

    return (
        <div ref={imageRef} className="product-image">
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>{product.date_added}</p>
            <p>Price:{product.price}  {product.price_currency}</p>
        </div>
    );
};

export default ProductImage;