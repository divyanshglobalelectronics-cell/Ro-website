import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { FaStar } from 'react-icons/fa';

export default function ProductCard({ product,index }) {
  const { items, addToCart, removeFromCart } = useCart();
  const defaultImg = '/images/placeholder.svg';
  const initialImg = product.images?.[0] || defaultImg;
  const [imgSrc, setImgSrc] = useState(initialImg);
  const inCart = items.some((it) => it.slug === product.slug);
  // console.log("product in card",product);
  return (
    <div className={`bg-gradient-to-b from-[#484b8b] to-[#1b083a] border border-gray-200 rounded-xl overflow-hidden ${index % 2 === 0 ? 'shadow-[2px_2px_0_white]' : 'shadow-[inset_3px_3px_0_yellow]'} transition-all duration-300 transform hover:-translate-y-1`}>
      <Link to={`/products/${product.slug}`} className="block overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={product.title}
          onError={() => setImgSrc(defaultImg)}
          className="w-full h-40 md:h-48 object-cover hover:scale-110 transition-transform duration-300"
        />
      </Link>
      <div className="p-5">
        <Link to={`/products/${product.slug}`} className="block text-white font-heading text-lg hover:text-blue-600 transition-colors line-clamp-2">
          {product.title}
        </Link>
        <div className="mt-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          ₹ {product.price.toLocaleString('en-IN')}
        </div>
        <div className="mt-3 white bg-clip-text text-white flex items-center gap-2 text-transparent">
          <FaStar color='gold'/>{product.rating}rating
        </div>
        <div className="mt-5 flex gap-3 items-baseline">
          <Link to={`/products/${product.slug}`} className="flex-1 px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-center">
            Details
          </Link>
          {inCart ? (
            <button onClick={() => removeFromCart(product.slug)} className="flex-1 px-3 py-2 text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md">
              ❌ Remove
            </button>
          ) : (
            <button onClick={() => addToCart(product, 1)} className="flex-1 px-3 py-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md">
              🛒 Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
