'use server';

import prisma from '@/lib/prisma';
import { CsvFixture } from './types/fixture';

export async function createFixturesBulk(fixtures: CsvFixture[]) {
    try {
        const BATCH_SIZE = 100;
        const errors: string[] = [];
        const fixtureMids = new Set<string>();

        fixtures.forEach((f, index) => {
            if (
                !f.fixture_mid ||
                !f.season ||
                !f.competition_name ||
                !f.fixture_datetime ||
                !f.fixture_round ||
                !f.home_team ||
                !f.away_team
            ) {
                errors.push(`Row ${index + 1}: Missing required fields`);
            }

            if (fixtureMids.has(f.fixture_mid)) {
                errors.push(`Row ${index + 1}: Duplicate fixture_mid ${f.fixture_mid} in CSV`);
            }

            fixtureMids.add(f.fixture_mid);
        });

        if (errors.length > 0) {
            throw new Error(`Validation errors:\n${errors.join('\n')}`);
        }

        // Check for existing fixture_mid in database
        const existingFixtures = await prisma.fixture.findMany({
            where: { fixture_mid: { in: Array.from(fixtureMids) } },
            select: { fixture_mid: true },
        });
        const existingMids = new Set(existingFixtures.map((f) => f.fixture_mid));

        // Separate new and existing fixtures
        const newFixtures = fixtures.filter((f) => !existingMids.has(f.fixture_mid));
        const existingFixturesToUpdate = fixtures.filter((f) => existingMids.has(f.fixture_mid));

        let importedCount = 0;
        let updatedCount = 0;

        // Batch insert new fixtures
        for (let i = 0; i < newFixtures.length; i += BATCH_SIZE) {
            const batch = newFixtures.slice(i, i + BATCH_SIZE);
            const result = await prisma.fixture.createMany({
                data: batch.map((f) => ({
                    fixture_mid: f.fixture_mid,
                    season: f.season,
                    competition_name: f.competition_name,
                    fixture_datetime: new Date(f.fixture_datetime),
                    fixture_round: f.fixture_round,
                    home_team: f.home_team,
                    away_team: f.away_team,
                })),
            });
            importedCount += result.count;
        }

        // Batch update existing fixtures
        for (let i = 0; i < existingFixturesToUpdate.length; i += BATCH_SIZE) {
            const batch = existingFixturesToUpdate.slice(i, i + BATCH_SIZE);
            await Promise.all(
                batch.map((f) =>
                    prisma.fixture.upsert({
                        where: { fixture_mid: f.fixture_mid },
                        update: {
                            season: f.season,
                            competition_name: f.competition_name,
                            fixture_datetime: new Date(f.fixture_datetime),
                            fixture_round: f.fixture_round,
                            home_team: f.home_team,
                            away_team: f.away_team,
                        },
                        create: {
                            fixture_mid: f.fixture_mid,
                            season: f.season,
                            competition_name: f.competition_name,
                            fixture_datetime: new Date(f.fixture_datetime),
                            fixture_round: f.fixture_round,
                            home_team: f.home_team,
                            away_team: f.away_team,
                        },
                    }),
                ),
            );
            updatedCount += batch.length;
        }

        console.log(
            `Imported ${importedCount} new fixtures, updated ${updatedCount} existing fixtures`,
        );
        return {
            imported: importedCount,
            updated: updatedCount,
            message: `Imported ${importedCount} new fixtures, updated ${updatedCount} existing fixtures.`,
        };
    } catch (error) {
        console.error('Error importing/updating fixtures:', error);
        throw error;
    }
}

export async function deleteFixtures() {
    try {
        const result = await prisma.fixture.deleteMany({});
        return result;
    } catch (error) {
        console.error('Error delete fixtures:', error);
        throw error;
    }
}

export async function findFixturesByTeam(team: string) {
    if (!team) {
        throw new Error('Team name is required');
    }

    try {
        const fixtures = await prisma.fixture.findMany({
            where: {
                OR: [
                    {
                        home_team: {
                            contains: team,
                            mode: 'insensitive',
                        },
                    },
                    {
                        away_team: {
                            contains: team,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            orderBy: { fixture_datetime: 'asc' },
        });

        return fixtures;
    } catch (error) {
        console.error('Error find fixtures:', error);
        throw error;
    }
}
