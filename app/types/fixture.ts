export interface CsvFixture {
    fixture_mid: string;
    season: string;
    competition_name: string;
    fixture_datetime: string;
    fixture_round: string;
    home_team: string;
    away_team: string;
}

export interface Fixture {
    fixture_mid: string;
    season: string;
    competition_name: string;
    fixture_datetime: Date;
    fixture_round: string;
    home_team: string;
    away_team: string;
}
