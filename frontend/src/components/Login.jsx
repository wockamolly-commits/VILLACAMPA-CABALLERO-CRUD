import { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validate inputs
            if (!credentials.username || !credentials.password) {
                setError('Please fill in all fields');
                return;
            }

            const endpoint = isRegistering ? 'register' : 'login';
            const response = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, credentials);
            
            if (isRegistering) {
                setError('');
                setIsRegistering(false);
                setCredentials({ username: '', password: '' });
                return;
            }

            const { token, username } = response.data;
            
            // Store token and user info
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            
            // Configure axios defaults for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            onLoginSuccess();
        } catch (err) {
            setError(err.response?.data?.message || `Error ${isRegistering ? 'registering' : 'logging in'}`);
            console.error(`${isRegistering ? 'Registration' : 'Login'} error:`, err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-center leading-tight px-2 py-1">
                        Dynasty Inventory System
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please sign in to continue
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={credentials.username}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (isRegistering ? 'Register' : 'Sign In')}
                        </button>
                        
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegistering(!isRegistering);
                                    setError('');
                                    setCredentials({ username: '', password: '' });
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                            >
                                {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;