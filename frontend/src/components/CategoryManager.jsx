import { useState } from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCategories } from '../contexts/CategoryContext';
import AddCategoryModal from './AddCategoryModal';
import Toast from './Toast';

const CategoryManager = () => {
    const { categories, addCategory, deleteCategory } = useCategories();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const handleAddCategory = async (categoryName) => {
        try {
            await addCategory(categoryName);
            setToast({ type: 'success', message: `Category "${categoryName}" added successfully!` });
            setIsModalOpen(false);
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to add category' });
        }
    };

    const handleDeleteCategory = async (categoryName) => {
        if (!window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
            return;
        }

        setDeleting(categoryName);
        try {
            await deleteCategory(categoryName);
            setToast({ type: 'success', message: `Category "${categoryName}" deleted successfully!` });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete category';
            setToast({ type: 'error', message: errorMessage });
        } finally {
            setDeleting(null);
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

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Category
                    </button>
                </div>

                {categories.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No categories yet</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {categories.map((category) => (
                            <div
                                key={category}
                                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-gray-700 font-medium truncate">{category}</span>
                                <button
                                    onClick={() => handleDeleteCategory(category)}
                                    disabled={deleting === category}
                                    className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete category"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AddCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddCategory}
                title="Add New Category"
            />
        </>
    );
};

export default CategoryManager;
