import { ModRegistrar } from "cs2/modding";
import { bindValue, useValue } from "cs2/api";
import { CityMonitorComponent } from "mods/city-monitor";

const buttonLocation$ = bindValue<number>("cityMonitor", "buttonLocation");

const StandardCityMonitor = () =>
    useValue(buttonLocation$) === 0
        ? <CityMonitorComponent />
        : null;

const UniversalMenuCityMonitor = () =>
    useValue(buttonLocation$) === 1
        ? <CityMonitorComponent inUniversalModMenu />
        : null;

const register: ModRegistrar = (moduleRegistry) => {
    moduleRegistry.append("GameTopRight", StandardCityMonitor);
    moduleRegistry.append("UniversalModMenu", UniversalMenuCityMonitor);
}

export default register;
