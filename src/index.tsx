import { ModRegistrar } from "cs2/modding";
import { CityMonitorComponent } from "mods/city-monitor";

const register: ModRegistrar = (moduleRegistry) => {
    moduleRegistry.append('GameTopRight', CityMonitorComponent);
}

export default register;