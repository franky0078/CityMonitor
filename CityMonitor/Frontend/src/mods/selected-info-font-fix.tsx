import { LocComponent, LocalizedFractionProps, Localization, useLocalization } from "cs2/l10n";
import { ModRegistrar } from "cs2/modding";
import { bindValue, useValue } from "cs2/api";

const luminaNumberFix$ = bindValue<boolean>("cityMonitor", "luminaNumberFix", false);

// Correct only spacing in value/total displays; keep localized numbers and units.
export const normalizeFractionSpacing = (value: string): string => value
    .replace(/[\u00a0\u2000-\u200b\u202f\u205f\u2060\ufeff]/g, " ")
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "");

export const registerSelectedInfoFontFix: ModRegistrar = (moduleRegistry) => {
    const path = "game-ui/common/localization/localized-fraction.tsx";
    const original = moduleRegistry.registry.get(path)?.LocalizedFraction as LocComponent<LocalizedFractionProps> | undefined;
    if (!original || typeof original.renderString !== "function") {
        console.warn("[CityMonitor] Fraction spacing correction unavailable: localized fraction formatter not found");
        return;
    }

    const renderString = (localization: Localization, props: LocalizedFractionProps) => {
        const value = original.renderString(localization, props);
        return luminaNumberFix$.value ? normalizeFractionSpacing(value) : value;
    };

    moduleRegistry.extend(path, "LocalizedFraction", () => {
        const CorrectedFraction = (props: LocalizedFractionProps) => {
            const localization = useLocalization();
            const enabled = useValue(luminaNumberFix$);
            const value = original.renderString(localization, props);
            return <>{enabled ? normalizeFractionSpacing(value) : value}</>;
        };
        // Preserve the localization component's public string-rendering interface.
        return Object.assign(CorrectedFraction, {
            renderString,
            propsAreEqual: original.propsAreEqual,
        });
    });
};
