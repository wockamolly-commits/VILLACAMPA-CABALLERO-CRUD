import { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            // Get unique categories from existing products
            const response = await fetch('http://localhost:5000/api/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const products = await response.json();
            const uniqueCategories = [...new Set(products.map(p => p.category))];
            setCategories(uniqueCategories);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const addCategory = async (newCategory) => {
        try {
            // Call backend to add category to database
            const response = await fetch('http://localhost:5000/api/products/category/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newCategory })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add category');
            }

            const result = await response.json();
            
            // Add to local state if not already present
            if (!categories.includes(newCategory)) {
                setCategories([...categories, newCategory]);
            }
            
            return result;
        } catch (err) {
            console.error('Error adding category:', err);
            throw err;
        }
    };

    return (
        <CategoryContext.Provider value={{ categories, fetchCategories, addCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategories() {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
}