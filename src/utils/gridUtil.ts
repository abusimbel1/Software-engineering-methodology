import { Coordinates } from "@app/@types";
import City from "@app/utils/city";

class GridUtil {
    private map = new Map<string, City>();

    private setupKey(coordinates: Coordinates) {
        return `${coordinates.x}-${coordinates.y}`;
    }

    set(coords: Coordinates, value: City) {
        const key = this.setupKey(coords);
        this.map.set(key, value);
    }

    get(coords: Coordinates) {
        const key = this.setupKey(coords);
        return this.map.get(key);
    }
}

export default GridUtil