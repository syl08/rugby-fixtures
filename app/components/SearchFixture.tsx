'use client';

import { useEffect, useState } from 'react';
import { findFixturesByTeam } from '../actions';
import { Fixture } from '../types/fixture';

export default function SearchFixture() {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [fixtures, setFixtures] = useState<Fixture[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    useEffect(() => {
        async function findFixtures() {
            if (debouncedQuery) {
                const fixturesData = await findFixturesByTeam(debouncedQuery);
                setFixtures(fixturesData);
            }
        }

        findFixtures();
    }, [debouncedQuery]);

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col space-y-4">
                <div className="w-64">
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="Input team name"
                    />
                </div>
                <ul>
                    {fixtures.map((fixture) => (
                        <li key={fixture.fixture_mid} style={{ cursor: 'pointer' }}>
                            {fixture.home_team} vs {fixture.away_team} -{' '}
                            {fixture.fixture_datetime.toDateString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
