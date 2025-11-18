import { useState, useEffect, useRef } from 'react';

/**
 * AddCategoryModal Component
 * 
 * A modern, accessible modal dialog for adding new product categories.
 * Features:
 * - Dark overlay backdrop
 * - Centered modal with smooth appearance
 * - Focus trapping for keyboard accessibility
 * - ARIA attributes for screen readers
 * - ESC key support for closing
 * - Tailwind CSS styling
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal should close (Cancel or backdrop click)
 * @param {Function} props.onSubmit - Callback with category name when Create is clicked
 * @param {string} [props.title='Add New Category'] - Modal title
 * @param {string} [props.placeholder='Enter category name'] - Input placeholder text
 */
const AddCategoryModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    title = 'Add New Category',
    placeholder = 'Enter category name'
}) => {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);

    // Handle focus trapping and manage focus on open/close
    useEffect(() => {
        if (isOpen) {
            // Store the previously focused element
            previousActiveElement.current = document.activeElement;
            
            // Focus the input field
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);

            // Add escape key listener
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    handleClose();
                }
            };

            document.addEventListener('keydown', handleEscape);

            // Trap focus inside modal
            const handleTabKey = (e) => {
                if (e.key !== 'Tab') return;

                const focusableElements = modalRef.current?.querySelectorAll(
                    'button, input, [tabindex]:not([tabindex="-1"])'
                );
                
                if (!focusableElements || focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            document.addEventListener('keydown', handleTabKey);

            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.removeEventListener('keydown', handleTabKey);
                document.body.style.overflow = 'auto';
            };
        } else if (previousActiveElement.current) {
            // Restore focus to the previously focused element
            previousActiveElement.current.focus();
        }
    }, [isOpen]);

    const handleClose = () => {
        setCategoryName('');
        setError('');
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate input
        if (!categoryName.trim()) {
            setError('Please enter a category name');
            return;
        }

        // Call the onSubmit callback with the trimmed category name
        onSubmit(categoryName.trim());
        
        // Reset form
        setCategoryName('');
        setError('');
    };

    const handleInputChange = (e) => {
        setCategoryName(e.target.value);
        // Clear error when user starts typing
        if (error) {
            setError('');
        }
    };

    // Close modal when backdrop is clicked
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-0 m-0"
            onClick={handleBackdropClick}
            role="presentation"
            style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0,
            }}
        >
            {/* Backdrop overlay */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                aria-hidden="true"
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                }}
            />

            {/* Modal dialog */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                className="relative z-50 bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
                style={{
                    position: 'relative',
                    zIndex: 9999,
                }}
            >
                {/* Header */}
                <div className="mb-6">
                    <h2
                        id="modal-title"
                        className="text-2xl font-bold text-gray-900"
                    >
                        {title}
                    </h2>
                    <p
                        id="modal-description"
                        className="text-sm text-gray-600 mt-1"
                    >
                        Enter a new category name to organize your products
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input field */}
                    <div>
                        <label
                            htmlFor="category-input"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Category Name
                        </label>
                        <input
                            id="category-input"
                            ref={inputRef}
                            type="text"
                            value={categoryName}
                            onChange={handleInputChange}
                            placeholder={placeholder}
                            maxLength="100"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                error
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 bg-white'
                            }`}
                            aria-invalid={error ? 'true' : 'false'}
                            aria-describedby={error ? 'error-message' : undefined}
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            id="error-message"
                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                            role="alert"
                        >
                            <svg
                                className="w-5 h-5 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-medium text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            aria-label="Cancel adding a new category"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            aria-label="Create new category"
                        >
                            Create
                        </button>
                    </div>
                </form>

                {/* Close button (optional visual affordance) */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
                    aria-label="Close modal"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AddCategoryModal;
