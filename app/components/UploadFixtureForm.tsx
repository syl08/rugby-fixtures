'use client';

import Papa from 'papaparse';
import { useState } from 'react';
import { createFixturesBulk } from '../actions';
import { CsvFixture } from '../types/fixture';

export default function UploadFixtureForm() {
    const [file, setFile] = useState<File | null>(null);
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
                    await createFixturesBulk(result.data as CsvFixture[]);
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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upload Fixtures</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-4">
                    <div className="w-64">
                        <label
                            htmlFor="file-upload"
                            className="inline-block px-4 py-2 w-fit bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer transition text-center"
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
                    <button
                        type="submit"
                        disabled={!file}
                        className="px-4 py-2 w-fit bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
                    >
                        Upload
                    </button>
                </div>
            </form>
        </div>
    );
}
