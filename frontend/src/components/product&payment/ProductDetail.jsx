import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet } from '../../api/client.js';
import Loader from '../../common/Loader.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { FaStar } from 'react-icons/fa';
import ProductCard from './ProductCard.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const p = await apiGet(`/api/products/${slug}`);
        setProduct(p);
      } catch (e) {
        setError(e.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  useEffect(() => {
    (async () => {
      try {
        if (!product) return;
        // Try by category slug if available, fallback to technology, else featured
        let url = '';
        const catSlug = product.category?.slug || product.category?.name || '';
        if (catSlug) {
          const qs = new URLSearchParams({ category: String(catSlug) });
          url = `/api/products?${qs.toString()}`;
        } else if (product.technology) {
          const qs = new URLSearchParams({ tech: String(product.technology) });
          url = `/api/products?${qs.toString()}`;
        } else {
          url = '/api/products?featured=true';
        }
        const list = await apiGet(url);
        const filtered = Array.isArray(list)
          ? list.filter(x => x.slug !== product.slug).slice(0, 8)
          : [];
        setRelated(filtered);
      } catch {
        setRelated([]);
      }
    })();
  }, [product]);

  if (loading) return <Loader />;
  if (error) return <div className="max-w-5xl mx-auto px-4 py-8 text-red-600 text-center text-lg font-medium">{error}</div>;
  if (!product) return <div className="max-w-5xl mx-auto px-4 py-8 text-gray-600 text-center text-lg font-medium">Product not found</div>;

  const img = product.images?.[0] || 'https://via.placeholder.com/600x400?text=Product';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#484b8b] to-[#1b083a] mb-0.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-4 text-white/80 text-sm">
          <Link to="/products" className="hover:underline">Products</Link>
          <span className="mx-2">/</span>
          <span className="opacity-90">{product.title}</span>
        </nav>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden p-4">
            <img src={img} alt={product.title} className="w-full h-auto rounded-lg" />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{product.category?.name}</div>
            <h1 className="mt-3 text-4xl font-bold text-gray-900">{product.title}</h1>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">₹ {product.price.toLocaleString('en-IN')}</span>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 font-medium">Capacity</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">{product.capacity}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 font-medium">Rating</p>
                  <p className="mt-1 text-lg font-bold flex items-center gap-2 text-gray-900"><FaStar color="gold" />{product.rating}</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border mt-2 flex flex-col items-center border-gray-200">
              <p className="text-xs text-gray-600 font-medium">Technology</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{product.technology}</p>
            </div>


            <div className="mt-8 flex gap-3">
              <button onClick={() => addToCart(product, 1)} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md transition-all">
                🛒 Add to Cart
              </button>
              <a href={`https://wa.me/919999999999?text=I want to buy ${encodeURIComponent(product.title)}`} target="_blank" rel="noreferrer" className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-all text-center">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div>
          <h2 className="mt-12 text-3xl font-bold text-white">Details</h2>
          <p className="mt-4 text-white whitespace-pre-line">{product.moreDetails}</p>
          <img src={product.techimage} alt="Technology" className="w-full h-auto mt-8 rounded-lg shadow-lg border border-gray-200" />
        </div>
        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-end justify-between mb-4 text-white">
              <div>
                <h3 className="text-2xl font-serif">Related Products</h3>
                <p className="text-white/80 text-sm">You might also like</p>
              </div>
              <Link to="/products" className="hidden md:inline-flex px-3 py-1.5 rounded bg-white/10 border border-white/30 text-sm hover:bg-white/20">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p._id || p.slug || i} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

