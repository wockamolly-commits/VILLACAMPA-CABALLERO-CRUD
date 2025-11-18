import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from './utils/axiosConfig';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';

import Login from './components/Login';
import Toast from './components/Toast';
import { CategoryProvider } from './contexts/CategoryContext';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [toast, setToast] = useState(null);

    // Check for existing token on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Token found in localStorage');
            // Set default header for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
        } else {
            console.log('No token found in localStorage');
            setLoading(false);
        }
    }, []);

    // Fetch products when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            console.log('User authenticated, fetching products');
            fetchProducts();
        }
    }, [isAuthenticated]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            console.log('Fetching products');
            const response = await axiosInstance.get('/api/products');
            setProducts(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const deletedProduct = products.find(p => p.id === id);
            await axiosInstance.delete(`/api/products/${id}`);
            // Immediately update local state before fetching
            setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
            // Then fetch to ensure sync with server
            fetchProducts();
            setToast({ type: 'success', message: `"${deletedProduct.name}" deleted successfully!` });
        } catch (err) {
            setError('Error deleting product');
            setToast({ type: 'error', message: 'Error deleting product' });
            console.error('Error:', err);
        }
    };

    const handleReset = async () => {
        if (window.confirm('Are you sure you want to delete ALL products? This cannot be undone!')) {
            try {
                await axiosInstance.delete('/api/products');
                fetchProducts();
            } catch (err) {
                setError('Error resetting products');
                console.error('Error:', err);
            }
        }
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        fetchProducts();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setProducts([]);
    };

    return (
        <CategoryProvider>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={4000}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {!isAuthenticated ? (
                <Login onLoginSuccess={handleLogin} />
            ) : (
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight px-2 py-1">
                            Dynasty Inventory System
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">
                                Welcome, {localStorage.getItem('username')}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8 max-w-5xl mx-auto">
                        <p className="text-gray-600 text-lg mx-auto text-center">
                            Manage your product inventory with ease
                        </p>



                        {editingProduct ? (
                            <ProductForm
                                initialData={editingProduct}
                                isEditing={true}
                                onProductAdded={() => {
                                    fetchProducts();
                                    setEditingProduct(null);
                                }}
                                onCancel={() => setEditingProduct(null)}
                            />
                        ) : (
                            <ProductForm onProductAdded={fetchProducts} />
                        )}

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading products...</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white rounded-lg shadow-md">
                                    <ProductTable
                                        products={products}
                                        onEdit={setEditingProduct}
                                        onDelete={handleDelete}
                                        editingProductId={editingProduct?.id}
                                    />
                                </div>

                                {products.length > 0 && (
                                    <div className="mt-8 text-center max-w-5xl mx-auto">
                                        <button
                                            onClick={handleReset}
                                            className="inline-flex items-center px-6 py-2.5 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200 font-semibold gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            Reset All Data
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Footer */}
                        <footer className="text-center text-gray-500 text-sm py-8">
                            Dynasty Inventory System © {new Date().getFullYear()}
                        </footer>
                    </div>
                </div>
            )}
            </div>
        </CategoryProvider>
    );
}

export default App;
