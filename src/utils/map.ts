import City from '@app/utils/city';
import Country from '@app/utils/country';
import GridUtil from '@app/utils/gridUtil';
import { deepEqual } from 'assert';
import { cloneDeep, isEqual } from 'lodash';
import { abort } from 'process';

export const INITIAL_COINS = 1000000;
export const PORTION = INITIAL_COINS / 1000;

export class MapGrid {
    countries: Country[];
    countriesGrid = new GridUtil();

    minX: number;
    minY: number;
    maxX: number;
    maxY: number;

    constructor(countries: Country[]) {
        this.countries = countries;
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;

        countries.forEach((country) => {
            this.minX = Math.min(this.minX, country.coordinates.xl);
            this.minY = Math.min(this.minY, country.coordinates.yl);
            this.maxX = Math.max(this.maxX, country.coordinates.xh);
            this.maxY = Math.max(this.maxY, country.coordinates.yh);
        });

        this.addCitiesToCountries();
        this.addNeighborsToCities();
    }

     addNeighborsToCities(): void {
        for (let x = this.minX; x <= this.maxX; x += 1) {
            for (let y = this.minY; y <= this.maxY; y += 1) {
                const city = this.countriesGrid.get({ x, y });
                if (!city) {
                    continue;
                }

                const neighbors: City[] = [];

                const addNeighbor = (x: number, y: number) => {
                    const neighborCity = this.countriesGrid.get({ x, y });
                    if (neighborCity) {
                        neighbors.push(neighborCity);
                    }
                };

                if (x < this.maxX) {
                    addNeighbor(x + 1, y); // right neighbor
                }
                if (x > this.minY) {
                    addNeighbor(x - 1, y); // left neighbor
                }
                if (y < this.maxY) {
                    addNeighbor(x, y + 1); // up neighbor
                }
                if (y > this.minY) {
                    addNeighbor(x, y - 1); // down neighbor
                }

                if (this.countries.length > 1 && !neighbors.length) {
                    throw new Error(`City in ${city.countryName} has no neighbors`);
                }

                city.neighbors = neighbors;
            }
        }
    }

    isCompleted(): boolean {
        return this.countries.every((country) => country.isCompleted());
    }

    addCitiesToCountries(): void {
        const coinTypes = this.countries.map(({name}) => name);
        this.countries.forEach(({coordinates, name}, countryIndex) => {
            for (let x = coordinates.xl; x <= coordinates.xh; x += 1) {
                for (let y = coordinates.yl; y <= coordinates.yh; y += 1) {
                    const city = new City(coinTypes, name);
                    this.countriesGrid.set({ x, y }, city);
                    this.countries[countryIndex].addCity(city);
                }
            }
        });
    }

    startDiffusionEmulation(): Map<string, number> {
        this.countriesGrid = new GridUtil();
        const result = new Map<string, number>();
        let currentDay = 0;

        let previousCountriesState = cloneDeep(this.countries)

        do {
            this.countries.forEach((country) => {
                country.cities.forEach((city) => {
                    city.transportCoinsToNeighbors();
                });

                if (country.isCompleted()) {
                    if (!result.has(country.name)) {
                        result.set(country.name, currentDay);
                    }
                }
            });

            this.countries.forEach((country) => {
                country.cities.forEach((city) => {
                    city.updateCoins();
                });
            });

            if (isEqual(previousCountriesState, this.countries)) {
                throw new Error('Can not find way to spread...')
                
            } else {
                previousCountriesState = cloneDeep(this.countries)
            }
            currentDay += 1;
        } while (!this.isCompleted());

        this.countries.forEach((country) => {
            if (!result.has(country.name)) {
                result.set(country.name, currentDay);
            }
        });

        return result;
    }

    static diffusionResultToString(diffusionResult: Map<string, number>): string {
        const results = [];
        for (const [countryName, days] of diffusionResult.entries()) {
            results.push(`${countryName} ${days}`);
        }
        return results.join('\n');
    }
}

export default MapGrid;
