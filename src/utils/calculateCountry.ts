import Country from "@app/utils/country";
import MapGrid from "@app/utils//map";

export const calculateCountry = (countriesStrings: string[]) => {
    try {
        const countries: Country[] = countriesStrings.map((countryString) => Country.parseCountryString(countryString));

        const diffusionEmulationResult = new MapGrid(countries).startDiffusionEmulation();
        console.log(MapGrid.diffusionResultToString(diffusionEmulationResult));
    } catch (e: any) {
        console.error(e?.message || JSON.stringify(e));
    }
};