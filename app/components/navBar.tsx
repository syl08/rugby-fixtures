'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { deleteFixtures } from '../actions';

export default function NavBar() {
    const [showMessage, setShowMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const pathname = usePathname();

    const handleDelete = async () => {
        try {
            setIsLoading(true);

            await deleteFixtures();

            setShowMessage(true);

            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <nav className="bg-gray-800 text-white p-4 relative">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-lg font-bold">
                    <Link href="/">Rugby Fixtures</Link>
                </div>
                <ul className="flex space-x-4">
                    <li className="flex items-center">
                        <Link
                            href="/upload"
                            className={`px-3 py-2 rounded-md ${
                                pathname === '/upload' ? 'bg-gray-600' : 'hover:bg-gray-700'
                            }`}
                        >
                            Upload
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <Link
                            href="/search"
                            className={`px-3 py-2 rounded-md ${
                                pathname === '/search' ? 'bg-gray-600' : 'hover:bg-gray-700'
                            }`}
                        >
                            Search
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <button
                            disabled={isLoading}
                            onClick={handleDelete}
                            className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm leading-5 cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed disabled:hover:bg-red-400"
                        >
                            Delete Fixtures
                        </button>
                    </li>
                </ul>
            </div>

            {showMessage && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-green-100 text-green-800 text-sm px-4 py-2 rounded shadow-md animate-fade-in-out">
                    Fixtures deleted successfully.
                </div>
            )}
        </nav>
    );
}
