import { useValue, type ValueBinding } from "cs2/api";
import { infoview, type IndicatorValue } from "cs2/bindings";
import { useLocalization, type Localization, type LocComponent, type LocalizedNumberProps, type LocalizedFractionProps } from "cs2/l10n";
import type { ModuleRegistry } from "cs2/modding";
import { Component, type ReactNode } from "react";
import styles from "./city-monitor.module.scss";

type Translate = (id: string, fallback: string) => string;
// Unit IDs are wire values. The game formatters can render them as plain text.
const units = {
    Integer: "integer", IntegerPerMonth: "integerPerMonth", Percentage: "percentage",
    Power: "power", Energy: "energy", VolumePerMonth: "volumePerMonth",
    Weight: "weight", WeightPerMonth: "weightPerMonth",
    Money: "money", MoneyPerMonth: "moneyPerMonth",
} as const;
type MetricUnit = typeof units[keyof typeof units];

type Metric = readonly [key: string, fallback: string, binding: ValueBinding<number>, unit?: MetricUnit];

const metrics: Readonly<Record<string, readonly Metric[]>> = {
    electricity: [
        ["Import", "Import", infoview.electricityImport$, units.Power],
        ["Export", "Export", infoview.electricityExport$, units.Power],
    ],
    water: [
        ["WaterCapacity", "Water production capacity", infoview.waterCapacity$, units.VolumePerMonth],
        ["WaterConsumption", "Water consumption", infoview.waterConsumption$, units.VolumePerMonth],
        ["Import", "Import", infoview.waterImport$, units.VolumePerMonth],
        ["WaterExport", "Water export", infoview.waterExport$, units.VolumePerMonth],
        ["SewageProduction", "Sewage production", infoview.sewageConsumption$, units.VolumePerMonth],
        ["SewageTreatment", "Sewage treatment capacity", infoview.sewageCapacity$, units.VolumePerMonth],
        ["SewageExport", "Sewage export", infoview.sewageExport$, units.VolumePerMonth],
    ],
    healthcare: [
        ["SickOrInjured", "Sick or injured", infoview.sickCount$],
        ["Patients", "Patients", infoview.patientCount$],
        ["Capacity", "Capacity", infoview.patientCapacity$],
        ["AverageHealth", "Average health", infoview.averageHealth$, units.Percentage],
    ],
    cemetery: [
        ["Occupied", "Occupied", infoview.cemeteryUse$],
        ["Capacity", "Capacity", infoview.cemeteryCapacity$],
    ],
    crematorium: [
        ["Deaths", "Deaths", infoview.deathRate$, units.IntegerPerMonth],
        ["ProcessingRate", "Processing", infoview.processingRate$, units.IntegerPerMonth],
    ],
    garbageProcessing: [
        ["GarbageProduction", "Garbage", infoview.garbageProductionRate$, units.WeightPerMonth],
        ["ProcessingRate", "Processing", infoview.garbageProcessingRate$, units.WeightPerMonth],
    ],
    landfill: [
        ["Stored", "Stored", infoview.storedGarbage$, units.Weight],
        ["Capacity", "Capacity", infoview.landfillCapacity$, units.Weight],
    ],
    police: [
        ["Arrested", "Arrested", infoview.arrestedCriminals$],
        ["InJail", "In jail", infoview.inJail$],
        ["JailCapacity", "Jail capacity", infoview.jailCapacity$],
        ["Sentenced", "Sentenced", infoview.prisoners$],
        ["InPrison", "In prison", infoview.inPrison$],
        ["PrisonCapacity", "Prison capacity", infoview.prisonCapacity$],
        ["Criminals", "Current criminals", infoview.criminals$],
        ["CrimePerMonth", "Crimes / month", infoview.crimePerMonth$],
        ["CrimeSuccess", "Crime success rate", infoview.escapedRate$, units.Percentage],
    ],
    parkingCar: [
        ["Parked", "Parked", infoview.parkedCars$],
        ["Capacity", "Capacity", infoview.parkingCapacity$],
        ["ParkingIncome", "Parking income", infoview.parkingIncome$, units.MoneyPerMonth],
    ],
    post: [
        ["MailProduction", "Mail rate", infoview.mailProductionRate$, units.IntegerPerMonth],
    ],
    tourism: [
        ["AverageHotelPrice", "Average hotel price", infoview.averageHotelPrice$, units.Money],
    ],
    elementary: [["EligibleStudents", "Eligible students", infoview.elementaryEligible$]],
    highschool: [["EligibleStudents", "Eligible students", infoview.highSchoolEligible$]],
    college: [["EligibleStudents", "Eligible students", infoview.collegeEligible$]],
    university: [["EligibleStudents", "Eligible students", infoview.universityEligible$]],
};

export function TooltipValueRow({ label, children, summary = false }: {
    label?: string; children: ReactNode; summary?: boolean;
}) {
    const className = summary ? `${styles.tooltipValueRow} ${styles.tooltipSummaryRow}` : styles.tooltipValueRow;
    return <div className={className}>
        {label && <span style={{
            color: "#b8b8b8", fontSize: "11rem", fontWeight: 400, lineHeight: "15rem", marginRight: "10rem",
        }}>{label}</span>}
        <span style={{
            color: "#fff", fontSize: "11rem", fontWeight: summary ? 700 : 400, lineHeight: "15rem", whiteSpace: "nowrap",
        }}>{children}</span>
    </div>;
}

let renderNumber: LocComponent<LocalizedNumberProps>["renderString"] | undefined;
let renderFraction: LocComponent<LocalizedFractionProps>["renderString"] | undefined;

export function registerTooltipFormatters(registry: ModuleRegistry) {
    renderNumber = registry.registry.get("game-ui/common/localization/localized-number.tsx")?.LocalizedNumber?.renderString;
    renderFraction = registry.registry.get("game-ui/common/localization/localized-fraction.tsx")?.LocalizedFraction?.renderString;
}

const fallbackUnits: Partial<Record<MetricUnit, string>> = {
    integerPerMonth: "/mo.", percentage: "%", power: "kW", energy: "kWh",
    volumePerMonth: "m³/mo.", weight: "t", weightPerMonth: "t/mo.",
    money: "₡", moneyPerMonth: "₡/mo.",
};

function formatMetric(localization: Localization, value: number, unit: MetricUnit, signed = false, total?: number) {
    try {
        const text = total === undefined
            ? renderNumber?.(localization, { value, unit: unit as LocalizedNumberProps["unit"], signed })
            : renderFraction?.(localization, { value, total, unit: unit as LocalizedFractionProps["unit"] });
        if (typeof text === "string" && text.length && !/<[a-z][a-z0-9]*>/i.test(text)) {
            return text.replace(/[\u00a0\u2000-\u200b\u202f\u205f\u2060\ufeff]/g, " ");
        }
    } catch (error) {
        console.debug("[CityMonitor] Tooltip formatter unavailable", error);
    }
    const prefix = signed && value > 0 ? "+" : "";
    const current = Number(value.toFixed(2)).toString();
    const quantity = total === undefined ? prefix + current : current + " / " + Number(total.toFixed(2));
    if (unit === units.WeightPerMonth) {
        const german = document.documentElement.classList.contains("locale-de-DE");
        const quantity = Math.abs(value) >= 1000 ? String(Number((value / 1000).toFixed(1))) : current;
        const massUnit = Math.abs(value) >= 1000 ? "t" : "kg";
        return prefix + (german ? quantity.replace(".", ",") : quantity) + " " + massUnit + (german ? "/Mo." : "/mo.");
    }
    const suffix = fallbackUnits[unit];
    return suffix ? quantity + " " + suffix : quantity;
}

function GameNumber({ value, unit, signed, total }: {
    value: number; unit: MetricUnit; signed?: boolean; total?: number;
}) {
    return <>{formatMetric(useLocalization(), value, unit, signed, total)}</>;
}

export function TooltipDivider() {
    return <div aria-hidden="true" className={styles.tooltipDivider} />;
}

const detailGroupStarts = new Set(["Import", "SewageProduction", "Sentenced", "Criminals"]);

function MetricRow({ metric: [key, fallback, binding, unit], t }: { metric: Metric; t: Translate }) {
    const value = useValue(binding);
    if (!Number.isFinite(value)) return null;
    return <>
        {detailGroupStarts.has(key) && <TooltipDivider />}
        <TooltipValueRow label={t("CityMonitor." + key, fallback)}>
            <GameNumber value={value} unit={unit ?? units.Integer} />
        </TooltipValueRow>
    </>;
}

function ElectricityDetails({ t }: { t: Translate }) {
    const production = useValue(infoview.electricityProduction$);
    const consumption = useValue(infoview.electricityConsumption$);
    const battery = useValue(infoview.batteryCharge$);
    return <>
        {Number.isFinite(production) && <TooltipValueRow label={t("CityMonitor.Production", "Production")}>
            <GameNumber value={production} unit={units.Power} />
        </TooltipValueRow>}
        {Number.isFinite(consumption) && <TooltipValueRow label={t("CityMonitor.Consumption", "Consumption")}>
            <GameNumber value={consumption} unit={units.Power} />
        </TooltipValueRow>}
        {Number.isFinite(production) && Number.isFinite(consumption) &&
            <TooltipValueRow label={t("CityMonitor.PowerBalance", "Local power balance")}>
                <GameNumber value={production - consumption} unit={units.Power} signed />
            </TooltipValueRow>}
        {battery && Number.isFinite(battery.current) && Number.isFinite(battery.max) &&
            <TooltipValueRow label={t("CityMonitor.BatteryCharge", "Battery charge")}>
                <GameNumber value={battery.current} total={battery.max} unit={units.Energy} />
            </TooltipValueRow>}
    </>;
}

function BikeParkingDetails({ t }: { t: Translate }) {
    const parking = useValue(infoview.bikeParking$);
    if (!parking || !Number.isFinite(parking.x) || !Number.isFinite(parking.y)) return null;
    return <>
        <TooltipValueRow label={t("CityMonitor.Parked", "Parked")}>
            <GameNumber value={parking.x} unit={units.Integer} />
        </TooltipValueRow>
        <TooltipValueRow label={t("CityMonitor.Capacity", "Capacity")}>
            <GameNumber value={parking.y} unit={units.Integer} />
        </TooltipValueRow>
    </>;
}

function PostProcessingDetails({ t }: { t: Translate }) {
    const collected = useValue(infoview.collectedMail$);
    const delivered = useValue(infoview.deliveredMail$);
    if (!Number.isFinite(collected) || !Number.isFinite(delivered)) return null;
    return <TooltipValueRow label={t("CityMonitor.ProcessingRate", "Processing")}>
        <GameNumber value={collected + delivered} unit={units.IntegerPerMonth} />
    </TooltipValueRow>;
}

export const hasDetailedValues = (id: string) =>
    Object.prototype.hasOwnProperty.call(metrics, id) || id === "parkingBike";

// Keep a failing optional game binding inside the hovered tooltip.
class DetailValuesBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error: Error) {
        console.warn("[CityMonitor] Detailed tooltip data unavailable", error);
    }

    render() {
        return this.state.failed ? <TooltipValueRow>–</TooltipValueRow> : this.props.children;
    }
}

export function DetailedServiceValues({ id, t, detailed = true }: { id: string; t: Translate; detailed?: boolean }) {
    return <DetailValuesBoundary>
        {id === "electricity" && <ElectricityDetails t={t} />}
        {metrics[id]?.filter(metric => !!metric[2] && (detailed || metric[0] !== "ProcessingRate")).map(metric => <MetricRow key={metric[0]} metric={metric} t={t} />)}
        {id === "post" && <PostProcessingDetails t={t} />}
        {id === "parkingBike" && <BikeParkingDetails t={t} />}
    </DetailValuesBoundary>;
}

const profitabilitySectors = [
    ["CommercialProfitability", "Commercial"],
    ["IndustrialProfitability", "Industrial"],
    ["OfficeProfitability", "Offices"],
] as const;

const profitabilityPercent = (value: IndicatorValue | null | undefined) =>
    value && Number.isFinite(value.current) && Number.isFinite(value.min) && Number.isFinite(value.max) && value.max > value.min
        ? Math.max(0, Math.min(100, (value.current - value.min) / (value.max - value.min) * 100))
        : undefined;

export function useCompanyProfitability(t: Translate) {
    const commercial = profitabilityPercent(useValue(infoview.commercialProfitability$));
    const industrial = profitabilityPercent(useValue(infoview.industrialProfitability$));
    const office = profitabilityPercent(useValue(infoview.officeProfitability$));
    const values = [commercial, industrial, office];
    const available = values.filter((value): value is number => value !== undefined);

    return {
        lowest: available.length ? Math.min(...available) : undefined,
        details: profitabilitySectors.map(([key, fallback], index) => {
            const value = values[index];
            return {
                label: t("CityMonitor." + key, fallback),
                value: value === undefined ? "–" : value.toFixed(0) + " %",
            };
        }),
    };
}
