const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// POST new product
router.post('/', async (req, res) => {
    try {
        const { name, category, quantity, price } = req.body;
        
        // Validation
        if (!name || !category || !quantity || !price) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const [result] = await db.query(
            'INSERT INTO products (name, category, quantity, price) VALUES (?, ?, ?, ?)',
            [name, category, quantity, price]
        );
        
        res.status(201).json({ 
            message: 'Product added successfully',
            productId: result.insertId 
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product' });
    }
});

// PUT update product
router.put('/:id', async (req, res) => {
    try {
        const { name, category, quantity, price } = req.body;
        const { id } = req.params;
        
        // Validation
        if (!name || !category || !quantity || !price) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const [result] = await db.query(
            'UPDATE products SET name = ?, category = ?, quantity = ?, price = ? WHERE id = ?',
            [name, category, quantity, price, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// DELETE all products (reset)
router.delete('/', async (req, res) => {
    try {
        await db.query('TRUNCATE TABLE products');
        res.json({ message: 'All products deleted successfully' });
    } catch (error) {
        console.error('Error resetting products:', error);
        res.status(500).json({ message: 'Error resetting products' });
    }
});

// POST new category
router.post('/category/add', async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        
        const [result] = await db.query(
            'INSERT INTO categories (name) VALUES (?)',
            [name.trim()]
        );
        
        res.status(201).json({ 
            message: 'Category added successfully',
            categoryId: result.insertId,
            categoryName: name.trim()
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Category already exists' });
        }
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Error adding category' });
    }
});

// GET all categories
router.get('/categories/list', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT name FROM categories ORDER BY name');
        res.json(rows.map(row => row.name));
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

module.exports = router;
