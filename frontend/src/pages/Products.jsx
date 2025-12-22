import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiGet } from '../api/client';
import ProductCard from '../components/product&payment/ProductCard';
import Loader from '../common/Loader';

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const selectedCategory = params.get('category') || '';
  const selectedTech = params.get('tech') || '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const query = new URLSearchParams();
        if (selectedCategory) query.set('category', selectedCategory);
        if (selectedTech) query.set('tech', selectedTech);
        const [cats, prods] = await Promise.all([
          apiGet('/api/categories'),
          apiGet(`/api/products${query.toString() ? `?${query.toString()}` : ''}`),
        ]);
        setCategories(cats);
        setProducts(prods);
        // console.log(products);
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedCategory, selectedTech]);

  const displayed = useMemo(() => {
    const list = Array.isArray(products) ? products.slice() : [];
    if (sortBy === 'priceLow') list.sort((a,b)=> Number(a.price||0) - Number(b.price||0));
    else if (sortBy === 'priceHigh') list.sort((a,b)=> Number(b.price||0) - Number(a.price||0));
    else list.sort((a,b)=> new Date(b.createdAt||0) - new Date(a.createdAt||0));
    return list;
  }, [products, sortBy]);

  const setCategory = (slug) => {
    const next = new URLSearchParams(location.search);
    if (slug) next.set('category', slug);
    else next.delete('category');
    navigate({ pathname: '/products', search: next.toString() });
  };

  const setTech = (tech) => {
    const next = new URLSearchParams(location.search);
    if (tech) next.set('tech', tech);
    else next.delete('tech');
    navigate({ pathname: '/products', search: next.toString() });
  };
// console.log("products",products[0]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#484b8b] to-[#1b083a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-serif text-white">Water Purifiers</h1>
            <p className="mt-2 text-white font-body">Find the perfect solution for your home</p>
          </div>
          <Link to="/cart" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-medium">🛒 Cart</Link>
        </div>

        <div className="md:hidden mb-4">
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className="w-full inline-flex items-center justify-between px-4 py-2 rounded-lg bg-white/90 text-gray-900 border border-white/20"
            aria-expanded={filtersOpen}
          >
            <span className="font-medium">Filters</span>
            <span className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 block gap-6">
          <aside className={`md:col-span-1 space-y-4 ${filtersOpen ? '' : 'hidden'} md:block`}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:sticky md:top-4">
              <h2 className="font-serif text-gray-900 text-lg">📂 Categories</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <button onClick={() => setCategory('')} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === '' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}>All</button>
                </li>
                {categories.map((c) => (
                  <li key={c._id}>
                    <button onClick={() => setCategory(c.slug)} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === c.slug ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                      }`}>{c.name}</button>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <h3 className="font-serif text-gray-900 text-sm">⚙️ Technology</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['RO','UV','UF','Alkaline','Copper'].map(t => (
                    <button key={t} onClick={() => setTech(selectedTech===t? '' : t)} className={`px-3 py-1 rounded-full border text-xs ${selectedTech===t? 'bg-indigo-600 text-white border-indigo-600':'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{t}</button>
                  ))}
                  {selectedTech && (
                    <button onClick={() => setTech('')} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-xs">Clear</button>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <section className="md:col-span-3">
            {loading && <Loader />}
            {error && <p className="text-red-600 text-center font-medium">{error}</p>}
            {(selectedCategory || selectedTech) && (
              <div className="mb-6 flex flex-wrap gap-2 text-sm">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    📌 {selectedCategory}
                    <button className="ml-1 font-bold hover:opacity-70" onClick={() => setCategory('')}>×</button>
                  </span>
                )}
                {selectedTech && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    ⚙️ {selectedTech}
                    <button className="ml-1 font-bold hover:opacity-70" onClick={() => setTech('')}>×</button>
                  </span>
                )}
                {(selectedCategory || selectedTech) && (
                  <button className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 text-sm font-medium" onClick={() => { setCategory(''); setTech(''); }}>Clear all</button>
                )}
              </div>
            )}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-white/90 text-sm">
                Showing <span className="font-semibold">{displayed.length}</span> {selectedCategory? `in ${selectedCategory}`:''}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-white/80 text-sm">Sort</label>
                <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="border rounded px-2 py-1 bg-white/90 text-sm">
                  <option value="newest">Newest</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({length:6}).map((_,i)=> (
                  <div key={i} className="animate-pulse bg-white/10 border border-white/20 rounded-xl h-60" />
                ))}
              </div>
            ) : (
              <>
                {displayed.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10 text-white/80">No products found.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayed.map((p,index) => (
                      <ProductCard key={p._id} product={p} index={index} />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
