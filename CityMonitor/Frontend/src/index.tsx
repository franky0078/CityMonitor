import { ModRegistrar } from "cs2/modding";
import { bindValue, useValue } from "cs2/api";
import { registerSelectedInfoFontFix } from "mods/selected-info-font-fix";
import {
    CityMonitorComponent,
    CityMonitorLauncher,
    CityMonitorPanelTheme,
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

const register: ModRegistrar = (moduleRegistry) => {
    registerSelectedInfoFontFix(moduleRegistry);
    let panelClass = "";
    try {
        panelClass = (moduleRegistry as any).registry.get(
            "game-ui/game/components/tool-options/tool-options-panel.module.scss"
        )?.classes?.toolOptionsPanel ?? "";
    } catch (error) {
        console.warn("[CityMonitor] Game panel theme unavailable", error);
    }
    const CityMonitorPanel = () => (
        <CityMonitorPanelTheme.Provider value={panelClass}>
            <CityMonitorComponent />
        </CityMonitorPanelTheme.Provider>
    );
    moduleRegistry.append("GameTopRight", StandardCityMonitor);
    moduleRegistry.append("UniversalModMenu", UniversalMenuCityMonitor);
    moduleRegistry.append("Game", CityMonitorPanel);
}

export default register;
