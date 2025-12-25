import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center text-center p-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-9xl font-bold text-blue-500 dark:text-blue-400">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mt-4">Page Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
                    Oops! The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="px-8 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-200"
                >
                    Go Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
