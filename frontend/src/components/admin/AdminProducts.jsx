import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { apiGet, apiPut, apiDelete, apiPost } from '../../api/client.js';

export default function AdminProducts() {
  const { user, token, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '', category: '', images: '', status: 'active' });
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME||'dln9bv0ct';
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET||'dgro_1221_sr';

  const createUploader = (onClose) => {
    if (!window.cloudinary) {
      setError('Cloudinary widget not loaded. Please refresh.');
      showToast('Cloudinary widget not loaded. Please refresh.', { type: 'error' });
      return null;
    }
    if (!cloudName || !uploadPreset) {
      setError('Missing Cloudinary config. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET.');
      showToast('Missing Cloudinary config. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET.', { type: 'error' });
      return null;
    }
    const collected = [];
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        multiple: true,
        sources: ['local', 'url', 'camera'],
        cropping: false,
        maxFiles: 10,
        folder: 'products'
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          collected.push(result.info.secure_url);
        }
        if (result && result.event === 'close') {
          onClose(collected);
        }
      }
    );
    return widget;
  };

  // Helpers: normalization and validation
  const normalizeToArray = (val) => Array.isArray(val)
    ? val
    : (typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : []);

  const validateProduct = (p) => {
    const title = (p.title || '').trim();
    const description = (p.description || '').trim();
    const technology = (p.technology || '').trim();
    const capacity = (p.capacity || '').trim();
    const rating = (p.rating || '').trim();
    const moreDetails = (p.moreDetails || '').trim();
    const priceNum = Number(p.price);
    const categoryVal = p.category?._id || p.category;
    const imagesArr = normalizeToArray(p.images);
    const techImgArr = normalizeToArray(p.techimage);

    if (!title) return { ok: false, msg: 'Title is required' };
    if (!(priceNum > 0)) return { ok: false, msg: 'Price must be a positive number' };
    if (!categoryVal) return { ok: false, msg: 'Category is required' };
    if (imagesArr.length === 0) return { ok: false, msg: 'At least one product image is required' };
    if (!description) return { ok: false, msg: 'Description is required' };
    if (!technology) return { ok: false, msg: 'Technology is required' };
    if (!capacity) return { ok: false, msg: 'Capacity is required' };
    if (techImgArr.length === 0) return { ok: false, msg: 'At least one technology image is required' };
    if (!rating) return { ok: false, msg: 'Rating is required' };
    if (!moreDetails) return { ok: false, msg: 'More Details is required' };
    return { ok: true };
  };

  const uploadForEdit = (field) => {
    const widget = createUploader((urls) => {
      if (!urls || urls.length === 0) return;
      const prev = Array.isArray(editing?.[field])
        ? editing[field]
        : (typeof editing?.[field] === 'string' && editing[field]
            ? editing[field].split(',').map(s => s.trim()).filter(Boolean)
            : []);
      const merged = [...prev, ...urls];
      setEditing({ ...editing, [field]: merged });
    });
    if (widget) widget.open();
  };

  const uploadForCreate = (field) => {
    const widget = createUploader((urls) => {
      if (!urls || urls.length === 0) return;
      const prev = Array.isArray(newProduct?.[field])
        ? newProduct[field]
        : (typeof newProduct?.[field] === 'string' && newProduct[field]
            ? newProduct[field].split(',').map(s => s.trim()).filter(Boolean)
            : []);
      const merged = [...prev, ...urls];
      setNewProduct({ ...newProduct, [field]: merged });
    });
    if (widget) widget.open();
  };

  useEffect(() => {
    // Temporarily bypass admin check for testing categories
    // if (!loading && (!user || !user.isAdmin)) return;
    if (user) fetchProducts();
    fetchCategories();
  }, [user, loading]);

  async function fetchCategories() {
    try {
      console.log('Fetching categories...');
      const cats = await apiGet('/api/categories');
      console.log('Categories loaded:', cats);
      setCategories(cats || []);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
      // non-fatal
    }
  }

  async function fetchProducts() {
    try {
      const prods = await apiGet('/api/admin/products', token);
      setProducts(prods);
    } catch (e) {
      setError(e.message || 'Failed to load');
      showToast(e.message || 'Failed to load products', { type: 'error' });
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  // Temporarily bypass admin check for testing
  // if (!user || !user.isAdmin) return <div className="p-6">Unauthorized: Admins only</div>;

  const startEdit = (p) => setEditing({ ...p });
  const cancelEdit = () => setEditing(null);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const validation = validateProduct(editing);
      if (!validation.ok) {
        showToast(validation.msg, { type: 'warning', duration: 3500 });
        setSaving(false);
        return;
      }
      const body = {
        title: editing.title,
        description: editing.description,
        capacity: editing.capacity,
        price: Number(editing.price) || 0,
        featured: !!editing.featured,
        status: editing.status || 'active',
        category: editing.category?._id || editing.category || '',
        images: normalizeToArray(editing.images),
        technology: editing.technology || '',
        techimage: normalizeToArray(editing.techimage),
        rating: editing.rating || '',
        moreDetails: editing.moreDetails || ''
      };
      const res = await apiPut(`/api/admin/products/${editing._id}`, body, token);
      setProducts((prev) => prev.map((p) => (p._id === res._id ? res : p)));
      setEditing(null);
      showToast('Product updated successfully', { type: 'success' });
    } catch (e) {
      setError(e.message || 'Save failed');
      showToast(e.message || 'Failed to update product', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await apiDelete(`/api/admin/products/${id}`, token);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast('Product deleted', { type: 'success' });
    } catch (e) {
      setError(e.message || 'Delete failed');
      showToast(e.message || 'Failed to delete product', { type: 'error' });
    }
  };

  const openCreate = () => {
    setNewProduct({ title: '', price: '', description: '',capacity: '', category: (categories[0]?._id) || '', images: '', status: 'active' });
    setCreating(true);
  };

  const createProduct = async () => {
    setSaving(true);
    try {
      const validation = validateProduct(newProduct);
      if (!validation.ok) {
        showToast(validation.msg, { type: 'warning', duration: 3500 });
        setSaving(false);
        return;
      }
      
      // Debug logging
      console.log('Creating product with data:', {
        images: newProduct.images,
        imagesType: typeof newProduct.images,
        isArray: Array.isArray(newProduct.images),
        techimage: newProduct.techimage,
        techimageType: typeof newProduct.techimage,
        techIsArray: Array.isArray(newProduct.techimage)
      });
      
      const body = {
        title: newProduct.title,
        description: newProduct.description || '',
        price: Number(newProduct.price) || 0,
        category: newProduct.category,
        images: normalizeToArray(newProduct.images),
        featured: !!newProduct.featured,
        status: newProduct.status || 'active',
        technology: newProduct.technology || '',
        capacity: newProduct.capacity || '',
        techimage: normalizeToArray(newProduct.techimage),
        rating:newProduct.rating || '',
        moreDetails: newProduct.moreDetails || ''
      };
      const res = await apiPost('/api/admin/products', body, token);
      setProducts((prev) => [res, ...prev]);
      setCreating(false);
      showToast('Product created successfully', { type: 'success' });
    } catch (e) {
      setError(e.message || 'Create failed');
      showToast(e.message || 'Failed to create product', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin - Products</h1>
        <div>
          <button onClick={openCreate} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-blue-600">Add Product</button>
        </div>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="grid grid-cols-1 gap-4">
        {products.map((p) => (
          <div key={p._id} className="p-4 border rounded-lg bg-white flex items-start justify-between">
            <div>
              <div className="font-bold">{p.title}</div>
              <div className="text-sm text-gray-600">{p.category?.name || 'Uncategorized'}</div>
              <div className="mt-1">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  p.status === 'active' ? 'bg-green-100 text-green-800' :
                  p.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  p.status === 'discontinued' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {p.status || 'active'}
                </span>
              </div>
              <div className="mt-2 text-lg font-semibold">₹ {Number(p.price).toLocaleString('en-IN')}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
              <button onClick={() => remove(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-40 flex items-start pt-24 justify-center overflow-auto">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <label className="block mb-2">Title
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Price
              <input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Category
              <select value={editing.category?._id || editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full border p-2 rounded mt-1">
                <option value="">Select category</option>
                {categories.length === 0 ? (
                  <option value="" disabled>No categories available</option>
                ) : (
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))
                )}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-red-600 mt-1">No categories loaded. Check console for errors.</p>
              )}
            </label>
            <label className="block mb-2">Images (comma separated URLs)
              <div className="flex gap-2">
                <input value={Array.isArray(editing.images) ? editing.images.join(', ') : (editing.images || '')} onChange={(e) => setEditing({ ...editing, images: e.target.value })} className="w-full border p-2 rounded mt-1" />
                <button type="button" onClick={() => uploadForEdit('images')} className="px-3 py-2 bg-indigo-600 text-white rounded mt-1">Upload</button>
              </div>
            </label>
            <label className="block mb-2">Description
              <input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Technology
              <input value={editing.technology || ''} onChange={(e) => setEditing({ ...editing, technology: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Capacity
              <input value={editing.capacity} onChange={(e) => setEditing({ ...editing, capacity: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Technology Images (comma separated URLs)
              <div className="flex gap-2">
                <input value={Array.isArray(editing.techimage) ? editing.techimage.join(', ') : (editing.techimage || '')} onChange={(e) => setEditing({ ...editing, techimage: e.target.value })} className="w-full border p-2 rounded mt-1" />
                <button type="button" onClick={() => uploadForEdit('techimage')} className="px-3 py-2 bg-indigo-600 text-white rounded mt-1">Upload</button>
              </div>
            </label>
            <label className="block mb-2">Rating
              <input value={editing.rating || ''} onChange={(e) => setEditing({ ...editing, rating: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">More Details
              <textarea value={editing.moreDetails || ''} onChange={(e) => setEditing({ ...editing, moreDetails: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Status
              <select value={editing.status || 'active'} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="w-full border p-2 rounded mt-1">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-2 mt-2">
              <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              <span>Featured</span>
            </label>

            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={cancelEdit} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
      {creating && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-40 flex items-start pt-24 justify-center overflow-auto">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Create Product</h2>
            <label className="block mb-2">Title
              <input value={newProduct.title} required onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Price
              <input value={newProduct.price} required onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Category
              <select value={newProduct.category} required onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full border p-2 rounded mt-1">
                <option value="">Select category</option>
                {categories.length === 0 ? (
                  <option value="" disabled>No categories available</option>
                ) : (
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))
                )}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-red-600 mt-1">No categories loaded. Check console for errors.</p>
              )}
            </label>
            <label className="block mb-2">Images (comma separated URLs)
              <div className="flex gap-2">
                <input value={Array.isArray(newProduct.images) ? newProduct.images.join(', ') : (newProduct.images || '')} required onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })} className="w-full border p-2 rounded mt-1" />
                <button type="button" onClick={() => uploadForCreate('images')} className="px-3 py-2 bg-indigo-600 text-white rounded mt-1">Upload</button>
              </div>
            </label>
            <label className="block mb-2">Description
              <textarea value={newProduct.description} required onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Technology
              <input value={newProduct.technology} required onChange={(e) => setNewProduct({ ...newProduct, technology: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Capacity
              <input value={newProduct.capacity} required onChange={(e) => setNewProduct({ ...newProduct, capacity: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Technology Images
              <div className="flex gap-2">
                <input value={Array.isArray(newProduct.techimage) ? newProduct.techimage.join(', ') : (newProduct.techimage || '')} required onChange={(e) => setNewProduct({ ...newProduct, techimage: e.target.value })} className="w-full border p-2 rounded mt-1" />
                <button type="button" onClick={() => uploadForCreate('techimage')} className="px-3 py-2 bg-indigo-600 text-white rounded mt-1">Upload</button>
              </div>
            </label>
            <label className="block mb-2">Rating
              <input value={newProduct.rating} required onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">More Details
              <textarea value={newProduct.moreDetails} required onChange={(e) => setNewProduct({ ...newProduct, moreDetails: e.target.value })} className="w-full border p-2 rounded mt-1" />
            </label>
            <label className="block mb-2">Status
              <select value={newProduct.status || 'active'} onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })} className="w-full border p-2 rounded mt-1">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-2 mt-2">
              <input type="checkbox" checked={!!newProduct.featured} onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })} />
              <span>Featured</span>
            </label>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setCreating(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={createProduct} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-600">{saving ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
