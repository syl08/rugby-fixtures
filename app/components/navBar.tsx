'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { deleteFixtures } from '../actions';

export default function NavBar() {
    const pathname = usePathname();

    const handleDelete = async () => {
        await deleteFixtures();
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
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
                            onClick={handleDelete}
                            className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm leading-5 cursor-pointer"
                        >
                            Delete Fixtures
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
