import { useState } from 'react';
import CustomSelect from './CustomSelect';
import { FunnelIcon, TagIcon } from '@heroicons/react/24/outline';

/**
 * CUSTOMSELECT USAGE EXAMPLES
 * 
 * This file demonstrates various implementations of the CustomSelect component
 * with different configurations and use cases.
 */

// Example 1: Basic Category Selection (for ProductForm)
export const BasicCategorySelect = ({ categories, selectedCategory, onCategoryChange, onAddNew }) => {
    return (
        <CustomSelect
            options={categories}
            value={selectedCategory}
            onChange={onCategoryChange}
            onAddNew={onAddNew}
            placeholder="Select a category"
            label="Category"
            icon={TagIcon}
            searchable={true}
        />
    );
};

// Example 2: Category Filter (for ProductTable)
export const CategoryFilter = ({ categories, selectedFilter, onFilterChange }) => {
    const filterOptions = ['all', ...categories];
    
    return (
        <CustomSelect
            options={filterOptions.map(cat => ({
                value: cat,
                label: cat === 'all' ? 'All Categories' : cat,
                disabled: false
            }))}
            value={selectedFilter}
            onChange={onFilterChange}
            placeholder="All Categories"
            label="Filter by Category"
            icon={FunnelIcon}
            searchable={true}
            clearable={false}
        />
    );
};

// Example 3: Disabled State with Clearable Option
export const ClearableCategorySelect = ({ categories, selectedCategory, onCategoryChange }) => {
    return (
        <CustomSelect
            options={categories}
            value={selectedCategory}
            onChange={onCategoryChange}
            placeholder="Select a category"
            label="Product Category"
            icon={TagIcon}
            searchable={true}
            clearable={true}
            disabled={false}
        />
    );
};

// Example 4: Advanced Usage with Custom Objects and Disabled Options
export const AdvancedCategorySelect = ({ categories, selectedCategory, onCategoryChange, onAddNew }) => {
    const categoryOptions = [
        ...categories.map(cat => ({ value: cat, label: cat, disabled: false })),
        { value: 'featured', label: 'Featured (Coming Soon)', disabled: true },
        { value: 'archived', label: 'Archived (Coming Soon)', disabled: true }
    ];

    return (
        <CustomSelect
            options={categoryOptions}
            value={selectedCategory}
            onChange={onCategoryChange}
            onAddNew={onAddNew}
            placeholder="Choose a category..."
            label="Product Category"
            icon={TagIcon}
            searchable={true}
            clearable={true}
        />
    );
};

// Example 5: Complete ProductForm Integration
export const ProductFormWithCustomSelect = ({
    formData,
    categories,
    onFormChange,
    onCategorySelect,
    onAddNewCategory
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Product Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onFormChange}
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Enter product name"
                />
            </div>

            {/* Custom Category Select */}
            <CustomSelect
                options={categories}
                value={formData.category}
                onChange={onCategorySelect}
                onAddNew={onAddNewCategory}
                placeholder="Select a category"
                label="Category"
                icon={TagIcon}
                searchable={true}
            />

            {/* Quantity */}
            <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Quantity
                </label>
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={onFormChange}
                    min="0"
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Enter quantity"
                />
            </div>

            {/* Price */}
            <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Price ($)
                </label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={onFormChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Enter price"
                />
            </div>
        </div>
    );
};

// Example 6: Complete ProductTable Integration
export const ProductTableFilterWithCustomSelect = ({
    products,
    categories,
    searchTerm,
    categoryFilter,
    onSearchChange,
    onCategoryFilterChange
}) => {
    const filterCategories = useMemo(() => {
        return ['all', ...categories];
    }, [categories]);

    return (
        <div className="p-4 border-b border-gray-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Custom Category Filter */}
                <CustomSelect
                    options={filterCategories.map(cat => ({
                        value: cat,
                        label: cat === 'all' ? 'All Categories' : cat
                    }))}
                    value={categoryFilter}
                    onChange={onCategoryFilterChange}
                    placeholder="All Categories"
                    label="Filter by Category"
                    icon={FunnelIcon}
                    searchable={true}
                />
            </div>
        </div>
    );
};

// Example 7: Standalone Demo Component (for testing)
export const CustomSelectDemo = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filterValue, setFilterValue] = useState('all');
    const [categories] = useState(['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports']);

    const handleAddNew = () => {
        alert('Add New Category modal would open here');
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">CustomSelect Component Demo</h1>

            {/* Example 1: Basic Select */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">1. Basic Category Selection</h2>
                <CustomSelect
                    options={categories}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    onAddNew={handleAddNew}
                    placeholder="Select a category"
                    label="Product Category"
                    icon={TagIcon}
                    searchable={true}
                />
                <p className="mt-4 text-sm text-gray-600">
                    Selected: <span className="font-semibold text-blue-600">{selectedCategory || 'None'}</span>
                </p>
            </div>

            {/* Example 2: Filter Select */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">2. Category Filter</h2>
                <CustomSelect
                    options={['all', ...categories].map(cat => ({
                        value: cat,
                        label: cat === 'all' ? 'All Categories' : cat
                    }))}
                    value={filterValue}
                    onChange={setFilterValue}
                    placeholder="All Categories"
                    label="Filter Options"
                    icon={FunnelIcon}
                    searchable={true}
                />
                <p className="mt-4 text-sm text-gray-600">
                    Filter: <span className="font-semibold text-blue-600">{filterValue}</span>
                </p>
            </div>

            {/* Example 3: With Clearable Option */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">3. Clearable Select</h2>
                <CustomSelect
                    options={categories}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Select a category"
                    label="Category (Clearable)"
                    icon={TagIcon}
                    searchable={true}
                    clearable={true}
                />
            </div>

            {/* Example 4: Disabled State */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">4. Disabled State</h2>
                <CustomSelect
                    options={categories}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Select a category"
                    label="Category (Disabled)"
                    icon={TagIcon}
                    disabled={true}
                />
            </div>
        </div>
    );
};

export default CustomSelectDemo;
