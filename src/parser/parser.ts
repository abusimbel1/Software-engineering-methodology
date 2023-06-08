import fs from 'fs';

export const getParsedInputFile = (filename: string): string[][] => {
    if (!filename) {
        throw new Error('Filename is absent');
    }
    const countryInfo: string[][] = [];
    const lines = fs.readFileSync(filename).toString().split('\n').map((line) => line.replace('\r', ''));

    let lineIndex = 0;
    while (lineIndex < lines.length - 2) {
        const currentLine = lines[lineIndex];
        const countryNumber = parseInt(currentLine);
        if (countryNumber) {
            lineIndex += 1; // move to first country line
            const countries = [];
            for (let countryLineIndex = lineIndex; countryLineIndex < countryNumber + lineIndex; countryLineIndex++) {
                countries.push(lines[countryLineIndex]);
            }
            lineIndex += countryNumber; // move to next number of countries
            countryInfo.push(countries);
        } else {
            throw new Error(`Error in file at '${lines[lineIndex]}'. Expected a number of countries`);
        }
    }

    if (lines[lines.length - 1] !== '0') {
        throw new Error("Input must end with '0' line");
    }

    return countryInfo;
};
