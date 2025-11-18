import { PencilSquareIcon, TrashIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';
import { useCategories } from '../contexts/CategoryContext';
import ConfirmModal from './ConfirmModal';
import CustomSelect from './CustomSelect';

const ProductTable = ({ products, onEdit, onDelete, editingProductId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });

    const { categories } = useCategories();
    // Combine 'all' with fetched categories
    const filterCategories = useMemo(() => {
        return ['all', ...categories];
    }, [categories]);

    // Calculate stats based on filtered products
    const stats = useMemo(() => {
        // Use filtered products for calculations to match what's shown
        const visibleProducts = products.filter(product => {
            const matchesSearch = searchTerm === '' ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        const totalItems = visibleProducts.reduce((sum, p) => sum + p.quantity, 0);
        const totalValue = visibleProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        return { totalItems, totalValue };
    }, [products, searchTerm, categoryFilter]);

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        return products
            .filter(product => {
                const matchesSearch = searchTerm === '' ||
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];
                if (typeof aValue === 'string') {
                    return sortDirection === 'asc' 
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            });
    }, [products, searchTerm, categoryFilter, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg max-w-5xl mx-auto w-full">
            {/* Search and Filter Bar */}
            <div className="p-4 border-b border-gray-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>

                    {/* Category Filter */}
                    <div className="relative" style={{ width: '200px' }}>
                        <CustomSelect
                            options={filterCategories}
                            value={categoryFilter}
                            onChange={(value) => setCategoryFilter(value)}
                            placeholder="Filter by category"
                            label=""
                            icon={FunnelIcon}
                            searchable={true}
                            clearable={false}
                        />
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-blue-600 text-sm font-medium">Total Products</p>
                        <p className="text-xl font-semibold text-blue-800">{filteredAndSortedProducts.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-green-600 text-sm font-medium">Total Items</p>
                        <p className="text-xl font-semibold text-green-800">{stats.totalItems}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-purple-600 text-sm font-medium">Total Value</p>
                        <p className="text-xl font-semibold text-purple-800">${stats.totalValue.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-sm">
                            <th 
                                className="py-4 px-6 text-left font-semibold cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('id')}
                            >
                                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-4 px-6 text-left font-semibold cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('name')}
                            >
                                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-4 px-6 text-left font-semibold cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('category')}
                            >
                                Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-4 px-6 text-right font-semibold cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('quantity')}
                            >
                                Quantity {sortField === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-4 px-6 text-right font-semibold cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('price')}
                            >
                                Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="py-4 px-6 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>
                <tbody className="text-gray-600 text-sm divide-y divide-gray-100">
                    {filteredAndSortedProducts.map((product) => (
                        <tr 
                            key={product.id} 
                            className={`transition-colors ${
                                editingProductId === product.id
                                    ? 'bg-blue-50 border-l-4 border-blue-500'
                                    : 'hover:bg-gray-50/50'
                            }`}
                        >
                            <td className="py-4 px-6 font-medium text-gray-500">{product.id}</td>
                            <td className="py-4 px-6 font-medium text-gray-900">{product.name}</td>
                            <td className="py-4 px-6">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {product.category}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-right font-medium">{product.quantity}</td>
                            <td className="py-4 px-6 text-right font-medium text-green-600">${Number(product.price).toFixed(2)}</td>
                            <td className="py-4 px-6">
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                        title="Edit Product"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                    {editingProductId !== product.id && (
                                        <button
                                            onClick={() => setDeleteModal({ isOpen: true, productId: product.id, productName: product.name })}
                                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            title="Delete Product"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredAndSortedProducts.length === 0 && (
                        <tr>
                            <td colSpan="6" className="py-8 px-6 text-center">
                                <p className="text-gray-500 text-base">No products found</p>
                                <p className="text-gray-400 text-sm mt-1">Add a new product using the form above</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                isDangerous={true}
                onConfirm={() => {
                    onDelete(deleteModal.productId);
                    setDeleteModal({ isOpen: false, productId: null, productName: '' });
                }}
                onCancel={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
            />
        </div>
    );
};

export default ProductTable;