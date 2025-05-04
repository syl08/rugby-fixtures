'use client';

import { useEffect, useState } from 'react';
import { findFixturesByTeam } from '../actions';
import { Fixture } from '../types/fixture';

export default function SearchFixture() {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [fixtures, setFixtures] = useState<Fixture[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    useEffect(() => {
        async function findFixtures() {
            if (debouncedQuery) {
                try {
                    setIsLoading(true);

                    const fixturesData = await findFixturesByTeam(debouncedQuery);
                    setFixtures(fixturesData);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }
        }

        findFixtures();
    }, [debouncedQuery]);

    const closeDialog = () => {
        setSelectedFixture(null);
    };

    return (
        <div className="max-w-md w-full p-6">
            <div className="flex flex-col space-y-4">
                <div className="w-64">
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="Input team name"
                        className="w-full max-w-xs px-4 py-3 bg-gray-100 text-gray-800 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>
                <div style={{ minHeight: '1rem' }}>
                    {isLoading ? (
                        <p className="text-gray-700">Loading...</p>
                    ) : (
                        <p className="invisible">Loading...</p>
                    )}
                </div>
                <ul className="space-y-2 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {fixtures.map((fixture) => (
                        <li
                            key={fixture.fixture_mid}
                            onClick={() => setSelectedFixture(fixture)}
                            className="p-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer transition"
                        >
                            {fixture.home_team} vs {fixture.away_team} -{' '}
                            {fixture.fixture_datetime.toLocaleDateString('en-AU')}
                        </li>
                    ))}
                </ul>
                {selectedFixture && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-gray-50 p-6 rounded-md border border-gray-300 w-full max-w-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Fixture Details
                            </h2>
                            <p className="text-gray-700 mb-2">
                                Competition: {selectedFixture.competition_name || 'Unknown'}
                            </p>
                            <p className="text-gray-700 mb-2">Season: {selectedFixture.season}</p>
                            <p className="text-gray-700 mb-2">
                                Round: {selectedFixture.fixture_round}
                            </p>
                            <p className="text-gray-700 mb-2">
                                Date:{' '}
                                {selectedFixture.fixture_datetime.toLocaleString('en-AU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                })}
                            </p>
                            <p className="text-gray-700 mb-2">
                                Home Team: {selectedFixture.home_team}
                            </p>
                            <p className="text-gray-700 mb-2">
                                Away Team: {selectedFixture.away_team}
                            </p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={closeDialog}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
