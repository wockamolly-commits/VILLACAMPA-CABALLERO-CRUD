import { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = ({ message, type = 'success', duration = 4000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
    const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const Icon = type === 'success' ? CheckCircleIcon : ExclamationCircleIcon;

    return (
        <div className={`fixed top-4 right-4 ${bgColor} border ${borderColor} rounded-lg shadow-lg p-4 flex items-start gap-3 z-40 max-w-sm`}>
            <Icon className={`h-6 w-6 ${textColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
                <p className={`text-sm font-medium ${textColor}`}>{message}</p>
            </div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    onClose?.();
                }}
                className={`${textColor} hover:opacity-70 transition-opacity`}
            >
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

export default Toast;
