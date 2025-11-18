import { useRef, useState, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

const CustomSelect = ({
    options = [],
    value = '',
    onChange,
    onAddNew,
    placeholder = 'Select an option',
    searchable = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);
    const searchInputRef = useRef(null);

    // Normalize options
    const normalizedOptions = options.map(opt => 
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    // Filter options
    const filteredOptions = searchable
        ? normalizedOptions.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : normalizedOptions;

    // Get display text
    const getDisplayText = () => {
        const selected = normalizedOptions.find(opt => opt.value === value);
        return selected ? selected.label : placeholder;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
        }
    }, [isOpen, searchable]);

    const handleSelectOption = (option) => {
        onChange(option.value);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleAddNew = (e) => {
        e.stopPropagation();
        if (onAddNew) {
            onAddNew();
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    return (
        <div className="w-full">
            <div ref={wrapperRef} className="relative w-full">
                {/* Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: isOpen ? '2px solid #3b82f6' : '1px solid #d1d5db',
                        background: isOpen ? '#eff6ff' : '#ffffff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => !isOpen && (e.target.style.borderColor = '#9ca3af')}
                    onMouseLeave={(e) => !isOpen && (e.target.style.borderColor = '#d1d5db')}
                >
                    <span className="truncate">{getDisplayText()}</span>
                    <ChevronDownIcon 
                        className="h-4 w-4 flex-shrink-0 transition-transform"
                        style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                            color: '#6b7280'
                        }}
                    />
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '8px',
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        zIndex: 50,
                    }}>
                        {/* Search */}
                        {searchable && (
                            <div style={{ padding: '8px', borderBottom: '1px solid #f3f4f6' }}>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>
                        )}

                        {/* Options */}
                        <ul style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            padding: '4px',
                            margin: 0,
                            listStyle: 'none'
                        }}>
                            {filteredOptions.length === 0 ? (
                                <li style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    color: '#9ca3af',
                                    fontSize: '13px'
                                }}>
                                    No options
                                </li>
                            ) : (
                                filteredOptions.map((option) => (
                                    <li
                                        key={option.value}
                                        onClick={() => handleSelectOption(option)}
                                        style={{
                                            padding: '10px 12px',
                                            cursor: 'pointer',
                                            background: value === option.value ? '#dbeafe' : 'transparent',
                                            color: value === option.value ? '#1e40af' : '#374151',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            transition: 'all 0.15s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            margin: '2px 4px'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (value !== option.value) {
                                                e.target.style.background = '#f3f4f6';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (value !== option.value) {
                                                e.target.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <span className="flex-1">{option.label}</span>
                                        {value === option.value && (
                                            <CheckIcon className="h-4 w-4" style={{ color: '#3b82f6' }} />
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>

                        {/* Add New */}
                        {onAddNew && (
                            <>
                                <div style={{ height: '1px', background: '#e5e7eb' }} />
                                <button
                                    onClick={handleAddNew}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        textAlign: 'left',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#3b82f6',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#f0f9ff'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    + Add New
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomSelect;
