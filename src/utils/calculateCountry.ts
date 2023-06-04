import Country from "@app/utils/country";
import MapGrid from "@app/utils//map";

export const calculateCountry = (countriesStrings: string[]) => {
    try {
        const countries: Country[] = countriesStrings.map((countryString) => Country.parseCountryString(countryString));

        const res = new MapGrid(countries).startDiffusionEmulation();
        console.log(MapGrid.diffusionResultToString(res));
    } catch (e: any) {
        console.error(e?.message || JSON.stringify(e));
    }
};