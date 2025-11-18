import { useState } from 'react';
import axios from 'axios';
import { useCategories } from '../contexts/CategoryContext';
import Toast from './Toast';
import AddCategoryModal from './AddCategoryModal';
import CustomSelect from './CustomSelect';
import { TagIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const ProductForm = ({ onProductAdded, initialData, isEditing, onCancel }) => {
    const { categories, addCategory } = useCategories();
    const [formData, setFormData] = useState(initialData || {
        name: '',
        category: '',
        quantity: '',
        price: ''
    });
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Validate inputs
            if (!formData.name || !formData.category || !formData.quantity || !formData.price) {
                setError('All fields are required');
                return;
            }

            if (isNaN(formData.quantity) || isNaN(formData.price)) {
                setError('Quantity and price must be numbers');
                return;
            }

            const payload = {
                ...formData,
                quantity: parseInt(formData.quantity),
                price: parseFloat(formData.price)
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/products/${initialData.id}`, payload);
                setToast({ type: 'success', message: `"${formData.name}" updated successfully!` });
            } else {
                await axios.post('http://localhost:5000/api/products', payload);
                setToast({ type: 'success', message: `"${formData.name}" added successfully!` });
            }

            onProductAdded();
            if (!isEditing) {
                setFormData({ name: '', category: '', quantity: '', price: '' });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error saving product. Please try again.';
            setError(errorMessage);
            setToast({ type: 'error', message: errorMessage });
            console.error('Error:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategorySelect = (value) => {
        if (value === '_new') {
            setIsModalOpen(true);
        } else {
            handleChange({ target: { name: 'category', value } });
        }
    };

    const handleCategorySubmit = async (categoryName) => {
        try {
            await addCategory(categoryName);
            setFormData(prev => ({ ...prev, category: categoryName }));
            setToast({ type: 'success', message: `Category "${categoryName}" added successfully!` });
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to add category:', err);
            setToast({ type: 'error', message: 'Failed to add category. Please try again.' });
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={4000}
                    onClose={() => setToast(null)}
                />
            )}
            <AddCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCategorySubmit}
                title="Add New Category"
                placeholder="Enter category name"
            />
            <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md bg-white border border-gray-200 mb-8 max-w-5xl mx-auto w-full" style={{
                borderLeft: isEditing ? '4px solid #f59e0b' : 'none',
                backgroundColor: isEditing ? '#fffbf0' : '#ffffff'
            }}>
                {isEditing && (
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '12px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        color: '#d97706',
                        fontSize: '12px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                    }}>
                        <PencilSquareIcon style={{ width: '16px', height: '16px' }} />
                        EDITING
                    </div>
                )}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        placeholder="Enter product name"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Category
                    </label>
                    <CustomSelect
                        options={categories}
                        value={formData.category}
                        onChange={(value) => handleCategorySelect(value)}
                        onAddNew={() => setIsModalOpen(true)}
                        placeholder="Select a category"
                        label=""
                        icon={TagIcon}
                        searchable={true}
                        clearable={false}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Quantity
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        placeholder="Enter quantity"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Price ($)
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        placeholder="Enter price"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded-r-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
                {isEditing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className={`px-6 py-2 text-white font-semibold rounded-lg focus:outline-none transition-colors ${
                        isEditing
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isEditing ? 'Save Changes' : 'Add Product'}
                </button>
            </div>
        </form>
        </>
    );
};

export default ProductForm;