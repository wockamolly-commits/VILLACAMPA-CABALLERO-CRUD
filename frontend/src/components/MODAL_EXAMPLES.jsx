/**
 * AddCategoryModal - Usage Examples
 * 
 * This file demonstrates various use cases for the AddCategoryModal component
 */

// ============================================================================
// Example 1: Basic Usage in a Simple Component
// ============================================================================

import { useState } from 'react';
import AddCategoryModal from './AddCategoryModal';

function SimpleExample() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState(['Electronics', 'Clothing', 'Food']);

    const handleAddCategory = (categoryName) => {
        // Add to your list or send to API
        setCategories([...categories, categoryName]);
        console.log(`Added category: ${categoryName}`);
    };

    return (
        <div className="p-6">
            <h1>Categories</h1>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Category
            </button>

            <ul className="mt-4">
                {categories.map(cat => <li key={cat}>{cat}</li>)}
            </ul>

            <AddCategoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleAddCategory}
            />
        </div>
    );
}

// ============================================================================
// Example 2: With Loading State (Async API Call)
// ============================================================================

function AdvancedExample() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddCategory = async (categoryName) => {
        setIsLoading(true);
        setError('');

        try {
            // Simulate API call
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName })
            });

            if (!response.ok) {
                throw new Error('Failed to add category');
            }

            console.log(`Category "${categoryName}" added successfully!`);
            setIsOpen(false);
        } catch (err) {
            setError(err.message);
            console.error('Error adding category:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>
                Add Category
            </button>

            <AddCategoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleAddCategory}
                title="Add New Category"
                placeholder="Enter category name"
            />

            {error && <div className="text-red-600">{error}</div>}
        </div>
    );
}

// ============================================================================
// Example 3: In ProductForm (Current Implementation)
// ============================================================================

import { useCategories } from '../contexts/CategoryContext';
import Toast from './Toast';

function ProductFormExample() {
    const { categories, addCategory } = useCategories();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ category: '' });
    const [toast, setToast] = useState(null);

    const handleCategorySelect = (value) => {
        if (value === '_new') {
            setIsModalOpen(true);
        } else {
            setFormData(prev => ({ ...prev, category: value }));
        }
    };

    const handleCategorySubmit = async (categoryName) => {
        try {
            await addCategory(categoryName);
            setFormData(prev => ({ ...prev, category: categoryName }));
            setToast({ 
                type: 'success', 
                message: `Category "${categoryName}" added successfully!` 
            });
            setIsModalOpen(false);
        } catch (err) {
            setToast({ 
                type: 'error', 
                message: 'Failed to add category. Please try again.' 
            });
        }
    };

    return (
        <form>
            <label>Category:</label>
            <select 
                value={formData.category}
                onChange={(e) => handleCategorySelect(e.target.value)}
            >
                <option value="">Select a category</option>
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="_new">+ Add New Category</option>
            </select>

            <AddCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCategorySubmit}
                title="Add New Category"
                placeholder="Enter category name"
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3000}
                    onClose={() => setToast(null)}
                />
            )}
        </form>
    );
}

// ============================================================================
// Example 4: With Duplicate Validation
// ============================================================================

function ValidationExample() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState(['Electronics', 'Clothing']);

    const handleAddCategory = (categoryName) => {
        // Check for duplicates
        if (categories.includes(categoryName)) {
            alert(`"${categoryName}" already exists!`);
            return;
        }

        setCategories([...categories, categoryName]);
        console.log(`Added: ${categoryName}`);
    };

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>
                Add Category
            </button>

            <AddCategoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleAddCategory}
            />
        </div>
    );
}

// ============================================================================
// Example 5: With Custom Styling (Color Theme)
// ============================================================================

/**
 * To customize colors, you would modify AddCategoryModal.jsx:
 * 
 * Change from:
 *   bg-blue-600 hover:bg-blue-700 focus:ring-blue-500
 * 
 * To your preferred color (e.g., green):
 *   bg-green-600 hover:bg-green-700 focus:ring-green-500
 * 
 * Or purple:
 *   bg-purple-600 hover:bg-purple-700 focus:ring-purple-500
 * 
 * Or red:
 *   bg-red-600 hover:bg-red-700 focus:ring-red-500
 */

// ============================================================================
// Example 6: Controlled Component Pattern
// ============================================================================

function ControlledExample() {
    const [isOpen, setIsOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const handleOpenModal = () => {
        setNewCategory('');
        setIsOpen(true);
    };

    const handleCategorySubmit = (categoryName) => {
        setNewCategory(categoryName);
        console.log(`New category: ${categoryName}`);
        // Process the category
        setIsOpen(false);
    };

    return (
        <div>
            <button onClick={handleOpenModal}>
                Add Category
            </button>

            {newCategory && <p>Added: {newCategory}</p>}

            <AddCategoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleCategorySubmit}
            />
        </div>
    );
}

// ============================================================================
// Example 7: With Context API
// ============================================================================

import { createContext, useContext } from 'react';

const CategoryModalContext = createContext();

export function CategoryModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <CategoryModalContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </CategoryModalContext.Provider>
    );
}

export function useCategoryModal() {
    const context = useContext(CategoryModalContext);
    if (!context) {
        throw new Error('useCategoryModal must be used within CategoryModalProvider');
    }
    return context;
}

function ContextExample() {
    const { isOpen, setIsOpen } = useCategoryModal();

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>
                Add Category
            </button>

            <AddCategoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={(name) => console.log(name)}
            />
        </div>
    );
}

// ============================================================================
// Example 8: Full Integration with Error Handling
// ============================================================================

function FullIntegrationExample() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const addNewCategory = async (categoryName) => {
        setIsLoading(true);
        setError('');

        try {
            // Validate
            if (categories.includes(categoryName)) {
                throw new Error(`Category "${categoryName}" already exists`);
            }

            // API call
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName })
            });

            if (!response.ok) {
                throw new Error('Failed to add category');
            }

            const data = await response.json();
            setCategories([...categories, data.name]);
            setToast({
                type: 'success',
                message: `Category "${categoryName}" added successfully!`
            });
            setIsOpen(false);
        } catch (err) {
            const errorMsg = err.message || 'Failed to add category';
            setError(errorMsg);
            setToast({
                type: 'error',
                message: errorMsg
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2>Category Management</h2>

            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isLoading}
            >
                {isLoading ? 'Adding...' : 'Add Category'}
            </button>

            <AddCategoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={addNewCategory}
            />

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
                    {error}
                </div>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3000}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="mt-6">
                <h3>Categories ({categories.length})</h3>
                <ul>
                    {categories.map(cat => (
                        <li key={cat} className="py-2 border-b">
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export {
    SimpleExample,
    AdvancedExample,
    ProductFormExample,
    ValidationExample,
    ControlledExample,
    ContextExample,
    FullIntegrationExample
};
