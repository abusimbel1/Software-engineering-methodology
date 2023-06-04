import { CountryCoordinates } from '@app/@types';
import City from '@app/utils/city';

export class Country {
    cities: City[];
    name: string;
    coordinates: CountryCoordinates;
    static MIN_COORDINATE = 1;
    static MAX_COORDINATE = 10;
    static NAME_MAX_LENGTH = 25;

    constructor(name: string, coordinates: CountryCoordinates) {
        if (!Country.isCoordinatesValid(coordinates)) {
            throw new Error('Invalid coordinates');
        }
        if (name.length > Country.NAME_MAX_LENGTH) {
            throw new Error(`Name must be less than ${Country.NAME_MAX_LENGTH} characters`);
        }
        this.cities = [];
        this.name = name;
        this.coordinates = coordinates;
    }

    addCity(city: City): void {
        this.cities.push(city);
    }

    isCompleted(): boolean {
        return this.cities.every((city) => city.isCompleted());
    }

    static parseCountryString(countryString: string): Country {
        const [name, ...coordinates] = countryString.split(' ');
        const [xl, yl, xh, yh] = coordinates.map((coordinate) => parseInt(coordinate));
        return new Country(name, { xl, yl, xh, yh } as CountryCoordinates);
    }

    static isCoordinatesValid({ xl, yl, xh, yh }: CountryCoordinates): boolean {
        const isCorrectLowHighRange = (low: number, high: number) => {
            return low <= high;
        };

        const isIntegerInBounds = (coordinate: number) => {
            if (!Number.isInteger(coordinate)) return false;
            return ((coordinate >= Country.MIN_COORDINATE) && (coordinate <= Country.MAX_COORDINATE));
        };

        return [isIntegerInBounds(xl),
            isIntegerInBounds(yl),
            isIntegerInBounds(xh),
            isIntegerInBounds(yh),
            isCorrectLowHighRange(xl, xh),
            isCorrectLowHighRange(yl, yh)]
            .every((result) => result === true);
    }
}

export default Country;
