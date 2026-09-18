import { ModRegistrar } from "cs2/modding";
import { bindValue, useValue } from "cs2/api";
import {
    CityMonitorComponent,
    CityMonitorLauncher,
} from "mods/city-monitor";

const buttonLocation$ = bindValue<number>("cityMonitor", "buttonLocation");

const StandardCityMonitor = () =>
    useValue(buttonLocation$) === 0
        ? <CityMonitorLauncher />
        : null;

const UniversalMenuCityMonitor = () =>
    useValue(buttonLocation$) === 1
        ? <CityMonitorLauncher inUniversalModMenu />
        : null;

const CityMonitorPanel = () => <CityMonitorComponent />;

const register: ModRegistrar = (moduleRegistry) => {
    moduleRegistry.append("GameTopRight", StandardCityMonitor);
    moduleRegistry.append("UniversalModMenu", UniversalMenuCityMonitor);
    moduleRegistry.append("Game", CityMonitorPanel);
}

export default register;
