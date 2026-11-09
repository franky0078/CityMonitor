import { useValue, type ValueBinding } from "cs2/api";
import { infoview, type IndicatorValue } from "cs2/bindings";
import { Localized, LocElementType, Unit } from "cs2/l10n";
import type { ReactNode } from "react";
import styles from "./city-monitor.module.scss";

type Translate = (id: string, fallback: string) => string;
type Metric = readonly [key: string, fallback: string, binding: ValueBinding<number>, unit?: Unit];

const metrics: Readonly<Record<string, readonly Metric[]>> = {
    electricity: [
        ["Import", "Import", infoview.electricityImport$, Unit.Power],
        ["Export", "Export", infoview.electricityExport$, Unit.Power],
    ],
    water: [
        ["WaterCapacity", "Water production capacity", infoview.waterCapacity$, Unit.VolumePerMonth],
        ["WaterConsumption", "Water consumption", infoview.waterConsumption$, Unit.VolumePerMonth],
        ["Import", "Import", infoview.waterImport$, Unit.VolumePerMonth],
        ["WaterExport", "Water export", infoview.waterExport$, Unit.VolumePerMonth],
        ["SewageProduction", "Sewage production", infoview.sewageConsumption$, Unit.VolumePerMonth],
        ["SewageTreatment", "Sewage treatment capacity", infoview.sewageCapacity$, Unit.VolumePerMonth],
        ["SewageExport", "Sewage export", infoview.sewageExport$, Unit.VolumePerMonth],
    ],
    healthcare: [
        ["SickOrInjured", "Sick or injured", infoview.sickCount$],
        ["Patients", "Patients", infoview.patientCount$],
        ["Capacity", "Capacity", infoview.patientCapacity$],
        ["AverageHealth", "Average health", infoview.averageHealth$, Unit.Percentage],
    ],
    cemetery: [
        ["Occupied", "Occupied", infoview.cemeteryUse$],
        ["Capacity", "Capacity", infoview.cemeteryCapacity$],
    ],
    crematorium: [
        ["Deaths", "Deaths", infoview.deathRate$, Unit.BodiesPerMonth],
        ["ProcessingRate", "Processing", infoview.processingRate$, Unit.BodiesPerMonth],
    ],
    garbageProcessing: [
        ["GarbageProduction", "Garbage", infoview.garbageProductionRate$, Unit.WeightPerMonth],
        ["ProcessingRate", "Processing", infoview.garbageProcessingRate$, Unit.WeightPerMonth],
    ],
    landfill: [
        ["Stored", "Stored", infoview.storedGarbage$, Unit.Weight],
        ["Capacity", "Capacity", infoview.landfillCapacity$, Unit.Weight],
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
        ["CrimeSuccess", "Crime success rate", infoview.escapedRate$, Unit.Percentage],
    ],
    parkingCar: [
        ["Parked", "Parked", infoview.parkedCars$],
        ["Capacity", "Capacity", infoview.parkingCapacity$],
        ["ParkingIncome", "Parking income", infoview.parkingIncome$, Unit.MoneyPerMonth],
    ],
    post: [
        ["MailProduction", "Mail rate", infoview.mailProductionRate$, Unit.IntegerPerMonth],
    ],
    tourism: [
        ["AverageHotelPrice", "Average hotel price", infoview.averageHotelPrice$, Unit.Money],
    ],
    elementary: [["EligibleStudents", "Eligible students", infoview.elementaryEligible$]],
    highschool: [["EligibleStudents", "Eligible students", infoview.highSchoolEligible$]],
    college: [["EligibleStudents", "Eligible students", infoview.collegeEligible$]],
    university: [["EligibleStudents", "Eligible students", infoview.universityEligible$]],
};

export function TooltipValueRow({ label, children }: { label?: string; children: ReactNode }) {
    return <div className={styles.tooltipValueRow}>
        {label && <span>{label}</span>}
        <strong>{children}</strong>
    </div>;
}

function GameNumber({ value, unit, signed = false }: { value: number; unit: Unit; signed?: boolean }) {
    return <Localized value={{ __Type: LocElementType.Number, value, unit, signed }} />;
}

function MetricRow({ metric: [key, fallback, binding, unit], t }: { metric: Metric; t: Translate }) {
    const value = useValue(binding);
    if (!Number.isFinite(value)) return null;
    return <TooltipValueRow label={t("CityMonitor." + key, fallback)}>
        <GameNumber value={value} unit={unit ?? Unit.Integer} />
    </TooltipValueRow>;
}

function ElectricityDetails({ t }: { t: Translate }) {
    const production = useValue(infoview.electricityProduction$);
    const consumption = useValue(infoview.electricityConsumption$);
    const battery = useValue(infoview.batteryCharge$);
    return <>
        {Number.isFinite(production) && <TooltipValueRow label={t("CityMonitor.Production", "Production")}>
            <GameNumber value={production} unit={Unit.Power} />
        </TooltipValueRow>}
        {Number.isFinite(consumption) && <TooltipValueRow label={t("CityMonitor.Consumption", "Consumption")}>
            <GameNumber value={consumption} unit={Unit.Power} />
        </TooltipValueRow>}
        {Number.isFinite(production) && Number.isFinite(consumption) &&
            <TooltipValueRow label={t("CityMonitor.PowerBalance", "Local power balance")}>
                <GameNumber value={production - consumption} unit={Unit.Power} signed />
            </TooltipValueRow>}
        {battery && Number.isFinite(battery.current) && Number.isFinite(battery.max) &&
            <TooltipValueRow label={t("CityMonitor.BatteryCharge", "Battery charge")}>
                <Localized value={{ __Type: LocElementType.Fraction, value: battery.current, total: battery.max, unit: Unit.Energy }} />
            </TooltipValueRow>}
    </>;
}

function BikeParkingDetails({ t }: { t: Translate }) {
    const parking = useValue(infoview.bikeParking$);
    if (!parking || !Number.isFinite(parking.x) || !Number.isFinite(parking.y)) return null;
    return <>
        <TooltipValueRow label={t("CityMonitor.Parked", "Parked")}>
            <GameNumber value={parking.x} unit={Unit.Integer} />
        </TooltipValueRow>
        <TooltipValueRow label={t("CityMonitor.Capacity", "Capacity")}>
            <GameNumber value={parking.y} unit={Unit.Integer} />
        </TooltipValueRow>
    </>;
}

function PostProcessingDetails({ t }: { t: Translate }) {
    const collected = useValue(infoview.collectedMail$);
    const delivered = useValue(infoview.deliveredMail$);
    if (!Number.isFinite(collected) || !Number.isFinite(delivered)) return null;
    return <TooltipValueRow label={t("CityMonitor.ProcessingRate", "Processing")}>
        <GameNumber value={collected + delivered} unit={Unit.IntegerPerMonth} />
    </TooltipValueRow>;
}

export const hasDetailedValues = (id: string) =>
    Object.prototype.hasOwnProperty.call(metrics, id) || id === "parkingBike";

export function DetailedServiceValues({ id, t }: { id: string; t: Translate }) {
    return <>
        {id === "electricity" && <ElectricityDetails t={t} />}
        {metrics[id]?.map(metric => <MetricRow key={metric[0]} metric={metric} t={t} />)}
        {id === "post" && <PostProcessingDetails t={t} />}
        {id === "parkingBike" && <BikeParkingDetails t={t} />}
    </>;
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
