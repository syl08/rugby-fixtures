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

                setTimeout(() => {
                    setMessage('');
                }, 5000);

                return;
            }

            setFile(selectedFile);
            setMessage('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please select a file');

            setTimeout(() => {
                setMessage('');
            }, 5000);

            return;
        }

        const chunkSize = 500;
        let chunk: unknown[] = [];

        setIsLoading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            step: async (row, parser) => {
                chunk.push(row.data);

                if (chunk.length > chunkSize) {
                    parser.pause();

                    try {
                        await createFixturesBulk(chunk as unknown[] as CsvFixture[]);
                        chunk = [];
                    } catch (error) {
                        console.error('Error uploading chunk:', error);
                        setMessage('Error uploading chunk');
                        setTimeout(() => {
                            setMessage('');
                        }, 5000);
                        setIsLoading(false);
                        parser.abort();
                        return;
                    }
                }

                parser.resume();
            },
            complete: async () => {
                if (chunk.length > 0) {
                    try {
                        await createFixturesBulk(chunk as unknown[] as CsvFixture[]);
                        setMessage('Upload complete!');
                        setTimeout(() => {
                            setMessage('');
                        }, 5000);
                    } catch (error) {
                        console.error('Error uploading final chunk:', error);
                        setMessage('Error uploading final chunk');
                        setTimeout(() => {
                            setMessage('');
                        }, 5000);
                    }
                }

                setIsLoading(false);
            },
            error: (error) => {
                console.error('PapaParse error:', error);
                setMessage('Error parsing file');
                setTimeout(() => {
                    setMessage('');
                }, 5000);
                setIsLoading(false);
            },
        });
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
                        className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer transition disabled:bg-blue-300 disabled:cursor-not-allowed transition"
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
