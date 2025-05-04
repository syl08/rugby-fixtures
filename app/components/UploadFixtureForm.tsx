'use client';

import Papa from 'papaparse';
import { useState } from 'react';
import { createFixturesBulk } from '../actions';
import { CsvFixture } from '../types/fixture';

export default function UploadFixtureForm() {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            const maxSize = 10 * 1024 * 1024;

            if (selectedFile && selectedFile.size > maxSize) {
                setMessage('File is too large (max 10MB)');

                return;
            }

            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please select a file');
            return;
        }

        try {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async (result) => {
                    try {
                        setIsLoading(true);

                        const res = await createFixturesBulk(
                            result.data as unknown as CsvFixture[],
                        );
                        setMessage(res.message);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setIsLoading(false);
                    }
                },
                error: (error) => {
                    console.error('PapaParse error:', error);
                },
            });
        } catch (error) {
            console.error('Error reading file:', error);
        }
    };

    return (
        <div className="max-w-md w-full p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer transition"
                    >
                        {file ? file.name : 'Select CSV File'}
                        <input
                            id="file-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={!file || isLoading}
                        className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
                    >
                        {isLoading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </form>

            {message && (
                <p className="mt-4 text-center text-green-700 bg-green-100 px-4 py-2 rounded">
                    {message}
                </p>
            )}
        </div>
    );
}
