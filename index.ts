import { getParsedInputFile } from '@app/parser/parser';
import { calculateCountry } from '@app/utils/calculateCountry';

const start = () => {
    const countryInput = getParsedInputFile('input');

    countryInput.forEach((countries: string[], index) => {
        console.log(`Case Number ${index + 1}`);

        calculateCountry(countries);
    });
};

start();
