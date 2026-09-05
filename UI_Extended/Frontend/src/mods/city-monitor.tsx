import { useState, useRef, useCallback, useEffect } from "react";
import { bindValue, trigger, useValue } from "cs2/api";
import { Portal, Tooltip } from "cs2/ui";
import { useLocalization } from "cs2/l10n";
import { infoview, type IndicatorValue } from "cs2/bindings";
import edu1 from "./images/Edu1.svg";
import edu2 from "./images/Edu2.svg";
import edu3 from "./images/Edu3.svg";
import edu4 from "./images/Edu4.svg";
import work from "./images/Workers.png";
import stat from "./images/CompanyProfit.png";
import alos from "./images/Population.png";

// Vanilla-Service-Icons
const ICON_FIRE = "Media/Game/Icons/FireSafety.svg";
const ICON_HEALTHCARE = "Media/Game/Icons/Healthcare.svg";
const ICON_CEMETERY = "Media/Game/Icons/Deathcare.svg";
const ICON_GARBAGE = "Media/Game/Icons/Garbage.svg";
const ICON_TRAFFIC = "Media/Game/Icons/Traffic.svg";
const ICON_ELECTRICITY = "Media/Game/Icons/Electricity.svg";
const ICON_WATER = "Media/Game/Icons/Water.svg";
const ICON_PARKING = "Media/Game/Icons/Parking.svg";
const ICON_BICYCLE = "Media/Game/Icons/Bicycle.svg";
const ICON_POST = "Media/Game/Icons/PostService.svg";
const ICON_TOURISM = "Media/Game/Icons/Tourism.svg";
const ICON_ATTRACTIVENESS = "Media/Game/Icons/Attractions.svg";

const ALL_ICON_IDS = [
    "unemployment",
    "jobs",
    "elementary",
    "highschool",
    "college",
    "university",
    "fire",
    "healthcare",
    "cemetery",
    "garbage",
    "traffic",
    "electricity",
    "water",
    "parkingCar",
    "parkingBike",
    "post",
    "tourism",
    "attractiveness",
] as const;

interface CityMonitorData {
    unemployedCount: number;
    unemploymentRate: number;
    openJobs: number;
    totalJobSlots: number;
    elementaryStudents: number;
    elementaryFreeSlots: number;
    highStudents: number;
    highFreeSlots: number;
    collegeStudents: number;
    collegeFreeSlots: number;
    uniStudents: number;
    uniFreeSlots: number;
}

const data$ = bindValue<CityMonitorData>("cityMonitor", "data");
const uiState$ = bindValue<string>("cityMonitor", "uiState");
const showPanel$ = bindValue<boolean>("cityMonitor", "showPanel");
const compactValues$ = bindValue<boolean>("cityMonitor", "compactValues");
const showLabels$ = bindValue<boolean>("cityMonitor", "showLabels");
const iconOnlyMode$ = bindValue<boolean>("cityMonitor", "iconOnlyMode");
const iconOrientation$ = bindValue<number>("cityMonitor", "iconOrientation");
const iconPositionLocked$ = bindValue<boolean>(
    "cityMonitor",
    "iconPositionLocked"
);
const iconVisibilityEditMode$ = bindValue<boolean>(
    "cityMonitor",
    "iconVisibilityEditMode"
);
const iconBackgroundTransparency$ = bindValue<number>(
    "cityMonitor",
    "iconBackgroundTransparency"
);
const iconSize$ = bindValue<number>("cityMonitor", "iconSize");
const iconGap$ = bindValue<number>("cityMonitor", "iconGap");
const hiddenIcons$ = bindValue<string>("cityMonitor", "hiddenIcons");
const iconOrder$ = bindValue<string>("cityMonitor", "iconOrder");

const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

const STATUS_GREEN = "#7CFC00";
const STATUS_YELLOW = "#FFD84D";
const STATUS_RED = "#FF5A5A";
const STATUS_INACTIVE = "#8A929A";
const STATUS_INFO = "#4DA3FF";

const indicatorPercent = (value: IndicatorValue | null | undefined) => {
    if (!value) return 0;

    const min = Number(value.min);
    const max = Number(value.max);
    const current = Number(value.current);

    if (
        !Number.isFinite(min) ||
        !Number.isFinite(max) ||
        !Number.isFinite(current) ||
        max <= min
    ) {
        return 0;
    }

    return clamp(((current - min) / (max - min)) * 100, 0, 100);
};

const availabilityStatusColor = (percent: number) => {
    if (percent >= 60) return STATUS_GREEN;
    if (percent >= 40) return STATUS_YELLOW;
    return STATUS_RED;
};

const fireHazardStatusColor = (percent: number) => {
    if (percent <= 33) return STATUS_GREEN;
    if (percent <= 66) return STATUS_YELLOW;
    return STATUS_RED;
};

const trafficStatusColor = (percent: number) => {
    if (percent >= 70) return STATUS_GREEN;
    if (percent >= 50) return STATUS_YELLOW;
    return STATUS_RED;
};

const P_CHART = "M4 13h3v7H4v-7zm6.5-6h3v13h-3V7zM17 10h3v10h-3V10z";

const Icon = ({
    path,
    src,
    size = 18,
    color = "#fff",
    white = false,
}: {
    path?: string;
    src?: string;
    size?: number;
    color?: string;
    white?: boolean;
}) => {
    const dim = size + "rem";

    if (src) {
        return (
            <img
                src={src}
                style={{
                    width: dim,
                    height: dim,
                    flexShrink: 0,
                    filter: white ? "brightness(0) invert(1)" : undefined,
                }}
            />
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            width={dim}
            height={dim}
            fill={color}
            style={{ flexShrink: 0 }}
        >
            <path d={path} />
        </svg>
    );
};

const Row = ({
    icon,
    iconSrc,
    label,
    value,
    color,
    showText,
}: {
    icon?: string;
    iconSrc?: string;
    label: string;
    value: string;
    color?: string;
    showText: boolean;
}) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "3rem 0",
        }}
    >
        <span style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <Tooltip tooltip={label}>
                <div style={{ display: "flex" }}>
                    <Icon path={icon} src={iconSrc} white={false} />
                </div>
            </Tooltip>

            {showText && (
                <span style={{ whiteSpace: "nowrap", marginLeft: "8rem" }}>
                    {label}
                </span>
            )}
        </span>

        <span
            style={{
                color: color ?? "#eee",
                fontWeight: "bold",
                whiteSpace: "nowrap",
            }}
        >
            {value}
        </span>
    </div>
);

const SchoolRow = ({
    iconSrc,
    label,
    students,
    free,
    showText,
    compactValues,
}: {
    iconSrc: string;
    label: string;
    students: number;
    free: number;
    showText: boolean;
    compactValues: boolean;
}) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "3rem 0",
        }}
    >
        <span style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <Tooltip tooltip={label}>
                <div style={{ display: "flex" }}>
                    <Icon src={iconSrc} white={false} size={20} />
                </div>
            </Tooltip>

            {showText && (
                <span style={{ whiteSpace: "nowrap", marginLeft: "8rem" }}>
                    {label}
                </span>
            )}
        </span>

        <span style={{ whiteSpace: "nowrap" }}>
            {compactValues ? (
                <span style={{ color: free <= 0 ? "#ff6b6b" : "#7CFC00" }}>
                    {free}
                </span>
            ) : (
                <>
                    {students}{"\u00A0/\u00A0"}
                    <span style={{ color: free <= 0 ? "#ff6b6b" : "#7CFC00" }}>
                        {free}
                    </span>
                </>
            )}
        </span>
    </div>
);


const unemploymentStatusColor = (rate: number) => {
    if (rate <= 5) return STATUS_GREEN;
    if (rate <= 10) return STATUS_YELLOW;
    return STATUS_RED;
};

const openJobsStatusColor = (open: number, total: number) => {
    if (total <= 0) return STATUS_RED;

    const ratio = open / total;

    if (ratio >= 0.05) return STATUS_GREEN;
    if (ratio >= 0.01) return STATUS_YELLOW;
    return STATUS_RED;
};

const schoolStatusColor = (free: number, students: number) => {
    if (free <= 0) return STATUS_RED;

    const capacity = free + students;
    if (capacity <= 0) return STATUS_RED;

    const ratio = free / capacity;

    if (ratio >= 0.10) return STATUS_GREEN;
    if (ratio >= 0.03) return STATUS_YELLOW;
    return STATUS_RED;
};

interface TooltipDetail {
    label?: string;
    value: string;
}

type IconOrientationMode = "vertical" | "horizontal";
type TooltipPlacement = "left" | "right" | "top" | "bottom";
type HorizontalTooltipAnchor = "left" | "center" | "right";
type Translate = (id: string, fallback: string) => string;
type ServiceKind =
    | "fire"
    | "healthcare"
    | "cemetery"
    | "garbage"
    | "traffic"
    | "electricity"
    | "water"
    | "parkingCar"
    | "parkingBike"
    | "post"
    | "tourism"
    | "attractiveness";

interface StatusIconProps {
    iconSrc: string;
    label: string;
    details: TooltipDetail[];
    ringColor: string;
    iconOpacity: number;
    size: number;
    gapAfter: number;
    orientation: IconOrientationMode;
    canToggleVisibility?: boolean;
    onToggleVisibility?: () => void;
    visibilityHint?: string;
    canReorder?: boolean;
    reorderActive?: boolean;
    isReordering?: boolean;
    onReorderStart?: () => void;
    onReorderEnter?: () => void;
}

// Statussymbol mit Tooltip und Bearbeitungsfunktionen
const StatusIcon = ({
    iconSrc,
    label,
    details,
    ringColor,
    iconOpacity,
    size,
    gapAfter,
    orientation,
    canToggleVisibility = false,
    onToggleVisibility,
    visibilityHint,
    canReorder = false,
    reorderActive = false,
    isReordering = false,
    onReorderStart,
    onReorderEnter,
}: StatusIconProps) => {
    const [hovered, setHovered] = useState(false);
    const [tooltipSide, setTooltipSide] =
        useState<TooltipPlacement>(
            orientation === "horizontal" ? "bottom" : "right"
        );
    const [horizontalTooltipAnchor, setHorizontalTooltipAnchor] =
        useState<HorizontalTooltipAnchor>("center");

    const contentSize = Math.max(10, size - 4);
    const glyphSize = Math.max(12, Math.round(size * 0.60));
    const tooltipOffset = size + 6;

    const tooltipMinWidth = details.length > 1 ? 160 : 118;

    const horizontalAnchorStyle: React.CSSProperties =
        horizontalTooltipAnchor === "left"
            ? { left: 0 }
            : horizontalTooltipAnchor === "right"
                ? { right: 0 }
                : {
                    left: "50%",
                    transform: "translateX(-50%)",
                };

    const tooltipPositionStyle: React.CSSProperties =
        tooltipSide === "right"
            ? {
                top: "50%",
                left: tooltipOffset + "rem",
                transform: "translateY(-50%)",
            }
            : tooltipSide === "left"
                ? {
                    top: "50%",
                    right: tooltipOffset + "rem",
                    transform: "translateY(-50%)",
                }
                : tooltipSide === "bottom"
                    ? {
                        top: tooltipOffset + "rem",
                        ...horizontalAnchorStyle,
                    }
                    : {
                        bottom: tooltipOffset + "rem",
                        ...horizontalAnchorStyle,
                    };

    return (
        <div
            style={{
                position: "relative",
                width: size + "rem",
                height: size + "rem",
                marginBottom:
                    orientation === "vertical"
                        ? gapAfter + "rem"
                        : 0,
                marginRight:
                    orientation === "horizontal"
                        ? gapAfter + "rem"
                        : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: canReorder ? "move" : undefined,
            }}
            onMouseEnter={(e) => {
                if (reorderActive) {
                    setHovered(false);
                    if (!isReordering && onReorderEnter) {
                        onReorderEnter();
                    }
                    return;
                }
                const rect = e.currentTarget.getBoundingClientRect();
                const viewportWidth =
                    document.documentElement?.clientWidth ||
                    window.innerWidth ||
                    0;
                const viewportHeight =
                    document.documentElement?.clientHeight ||
                    window.innerHeight ||
                    0;

                if (orientation === "horizontal") {
                    if (viewportHeight > 0) {
                        const spaceTop = rect.top;
                        const spaceBottom =
                            viewportHeight - rect.bottom;

                        setTooltipSide(
                            spaceTop > spaceBottom
                                ? "top"
                                : "bottom"
                        );
                    }

                    if (viewportWidth > 0) {
                        const centerX =
                            rect.left + rect.width / 2;

                        if (centerX < viewportWidth * 0.25) {
                            setHorizontalTooltipAnchor("left");
                        } else if (
                            centerX > viewportWidth * 0.75
                        ) {
                            setHorizontalTooltipAnchor("right");
                        } else {
                            setHorizontalTooltipAnchor("center");
                        }
                    }
                } else if (viewportWidth > 0) {
                    const spaceLeft = rect.left;
                    const spaceRight =
                        viewportWidth - rect.right;

                    setTooltipSide(
                        spaceLeft > spaceRight
                            ? "left"
                            : "right"
                    );
                }

                setHovered(true);
            }}
            onMouseLeave={() => setHovered(false)}
            onMouseDown={(e) => {
                if (e.button === 0 && canReorder && onReorderStart) {
                    e.preventDefault();
                    e.stopPropagation();
                    setHovered(false);
                    onReorderStart();
                    return;
                }

                if (e.button === 2) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (
                        canToggleVisibility &&
                        onToggleVisibility
                    ) {
                        onToggleVisibility();
                    }
                }
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div
                style={{
                    width: contentSize + "rem",
                    height: contentSize + "rem",
                    borderRadius: "50%",
                    border: `2rem solid ${ringColor}`,
                    backgroundColor: "rgba(15, 20, 25, 0.58)",
                    opacity: iconOpacity,
                    boxShadow: `0 0 7rem ${ringColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Icon src={iconSrc} size={glyphSize} />
            </div>

            {hovered && !reorderActive && (
                <div
                    style={{
                        position: "absolute",
                        ...tooltipPositionStyle,
                        minWidth: tooltipMinWidth + "rem",
                        padding: "6rem 9rem",
                        borderRadius: "6rem",
                        backgroundColor: "rgba(15, 20, 25, 0.86)",
                        border: "1rem solid rgba(255,255,255,0.12)",
                        color: "#fff",
                        pointerEvents: "none",
                        boxShadow: "0 4rem 12rem rgba(0,0,0,0.40)",
                        zIndex: 20,
                    }}
                >
                    <div
                        style={{
                            color: "rgba(255,255,255,0.72)",
                            fontSize: "11rem",
                            lineHeight: "14rem",
                            whiteSpace: "nowrap",
                            marginBottom: "2rem",
                        }}
                    >
                        {label}
                    </div>

                    {details.map((detail, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: detail.label
                                    ? "space-between"
                                    : "flex-start",
                                width: "100%",
                                marginTop:
                                    index === 0
                                        ? 0
                                        : "2rem",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {detail.label && (
                                <span
                                    style={{
                                        color: "rgba(255,255,255,0.68)",
                                        fontSize: "11rem",
                                        lineHeight: "16rem",
                                        marginRight: "10rem",
                                    }}
                                >
                                    {detail.label}
                                </span>
                            )}

                            <span
                                style={{
                                    color: "#fff",
                                    fontSize: "14rem",
                                    lineHeight: "17rem",
                                    fontWeight: "bold",
                                }}
                            >
                                {detail.value}
                            </span>
                        </div>
                    ))}

                    {canToggleVisibility && visibilityHint && (
                        <div
                            style={{
                                marginTop: "5rem",
                                paddingTop: "4rem",
                                borderTop:
                                    "1rem solid rgba(255,255,255,0.10)",
                                color: "rgba(255,255,255,0.50)",
                                fontSize: "10rem",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {visibilityHint}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

interface ServiceStatusIconProps
    extends Omit<
        StatusIconProps,
        "details" | "ringColor"
    > {
    compactValues: boolean;
    t: Translate;
}

// Servicewerte werden nur für aktive Symbole abonniert
const FireStatusIcon = (props: ServiceStatusIconProps) => {
    const fireHazard =
        useValue(infoview.averageFireHazard$);
    const percent = indicatorPercent(fireHazard);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    label: props.compactValues
                        ? undefined
                        : props.t(
                            "UI_Extended.CityMonitor.FireHazard",
                            "Brandgefahr"
                        ),
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={fireHazardStatusColor(percent)}
        />
    );
};

const HealthcareStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const availability =
        useValue(infoview.healthcareAvailability$);
    const percent = indicatorPercent(availability);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    label: props.compactValues
                        ? undefined
                        : props.t(
                            "UI_Extended.CityMonitor.Availability",
                            "Verfügbarkeit"
                        ),
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const CemeteryStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const availability =
        useValue(infoview.cemeteryAvailability$);
    const percent = indicatorPercent(availability);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    label: props.compactValues
                        ? undefined
                        : props.t(
                            "UI_Extended.CityMonitor.Availability",
                            "Verfügbarkeit"
                        ),
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const GarbageStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const landfillAvailability =
        useValue(infoview.landfillAvailability$);
    const garbageProductionRate =
        useValue(infoview.garbageProductionRate$);
    const garbageProcessingRate =
        useValue(infoview.garbageProcessingRate$);

    const landfillPercent =
        indicatorPercent(landfillAvailability);

    const processingPercent =
        garbageProductionRate > 0
            ? clamp(
                (
                    garbageProcessingRate /
                    garbageProductionRate
                ) * 100,
                0,
                100
            )
            : 100;

    const overallPercent = Math.min(
        processingPercent,
        landfillPercent
    );

    return (
        <StatusIcon
            {...props}
            details={
                props.compactValues
                    ? [
                        {
                            value:
                                overallPercent.toFixed(0) +
                                " %",
                        },
                    ]
                    : [
                        {
                            label: props.t(
                                "UI_Extended.CityMonitor.Processing",
                                "Verarbeitung"
                            ),
                            value:
                                processingPercent.toFixed(0) +
                                " %",
                        },
                        {
                            label: props.t(
                                "UI_Extended.CityMonitor.Landfill",
                                "Deponie frei"
                            ),
                            value:
                                landfillPercent.toFixed(0) +
                                " %",
                        },
                    ]
            }
            ringColor={
                availabilityStatusColor(overallPercent)
            }
        />
    );
};

const TrafficStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const trafficFlow = useValue(infoview.trafficFlow$);

    const values = Array.isArray(trafficFlow)
        ? trafficFlow
            .slice(0, 4)
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value))
        : [];

    let percent =
        values.length > 0
            ? values.reduce(
                (sum, value) => sum + value,
                0
            ) / values.length
            : 0;

    if (
        values.length > 0 &&
        values.every(
            (value) => value >= 0 && value <= 1
        )
    ) {
        percent *= 100;
    }

    percent = clamp(percent, 0, 100);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={trafficStatusColor(percent)}
        />
    );
};

const ElectricityStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const availability =
        useValue(infoview.electricityAvailability$);
    const percent = indicatorPercent(availability);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    label: props.compactValues
                        ? undefined
                        : props.t(
                            "UI_Extended.CityMonitor.Availability",
                            "Verfügbarkeit"
                        ),
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const WaterStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const waterAvailability =
        useValue(infoview.waterAvailability$);
    const sewageAvailability =
        useValue(infoview.sewageAvailability$);

    const waterPercent =
        indicatorPercent(waterAvailability);
    const sewagePercent =
        indicatorPercent(sewageAvailability);
    const overallPercent =
        Math.min(waterPercent, sewagePercent);

    return (
        <StatusIcon
            {...props}
            details={
                props.compactValues
                    ? [
                        {
                            value:
                                overallPercent.toFixed(0) +
                                " %",
                        },
                    ]
                    : [
                        {
                            label: props.t(
                                "UI_Extended.CityMonitor.Water",
                                "Wasser"
                            ),
                            value:
                                waterPercent.toFixed(0) +
                                " %",
                        },
                        {
                            label: props.t(
                                "UI_Extended.CityMonitor.Sewage",
                                "Abwasser"
                            ),
                            value:
                                sewagePercent.toFixed(0) +
                                " %",
                        },
                    ]
            }
            ringColor={
                availabilityStatusColor(overallPercent)
            }
        />
    );
};


const ParkingCarStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const availability =
        useValue(infoview.parkingAvailability$);
    const percent = indicatorPercent(availability);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    label: props.compactValues
                        ? undefined
                        : props.t(
                            "UI_Extended.CityMonitor.Availability",
                            "Verfügbarkeit"
                        ),
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const ParkingBikeStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const availability =
        useValue(infoview.bikeParkingAvailability$);
    const percent = indicatorPercent(availability);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    label: props.compactValues
                        ? undefined
                        : props.t(
                            "UI_Extended.CityMonitor.Availability",
                            "Verfügbarkeit"
                        ),
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const PostStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const availability =
        useValue(infoview.postServiceAvailability$);
    const percent = indicatorPercent(availability);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    label: props.compactValues
                        ? undefined
                        : props.t(
                            "UI_Extended.CityMonitor.Availability",
                            "Verfügbarkeit"
                        ),
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const TourismStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const tourists = useValue(infoview.tourismRate$);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    label: props.compactValues
                        ? undefined
                        : props.t(
                            "UI_Extended.CityMonitor.Tourists",
                            "Touristen"
                        ),
                    value: String(Math.max(0, Math.round(Number(tourists) || 0))),
                },
            ]}
            ringColor={STATUS_INFO}
        />
    );
};

const AttractivenessStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const attractiveness =
        useValue(infoview.attractiveness$);
    const percent = indicatorPercent(attractiveness);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const ServiceStatusIcon = ({
    service,
    ...props
}: ServiceStatusIconProps & {
    service: ServiceKind;
}) => {
    switch (service) {
        case "fire":
            return <FireStatusIcon {...props} />;

        case "healthcare":
            return <HealthcareStatusIcon {...props} />;

        case "cemetery":
            return <CemeteryStatusIcon {...props} />;

        case "garbage":
            return <GarbageStatusIcon {...props} />;

        case "traffic":
            return <TrafficStatusIcon {...props} />;

        case "electricity":
            return <ElectricityStatusIcon {...props} />;

        case "water":
            return <WaterStatusIcon {...props} />;

        case "parkingCar":
            return <ParkingCarStatusIcon {...props} />;

        case "parkingBike":
            return <ParkingBikeStatusIcon {...props} />;

        case "post":
            return <PostStatusIcon {...props} />;

        case "tourism":
            return <TourismStatusIcon {...props} />;

        case "attractiveness":
            return <AttractivenessStatusIcon {...props} />;
    }
};


interface NormalServiceRowsProps {
    compactValues: boolean;
    showText: boolean;
    t: Translate;
}

// Servicewerte für den normalen Panelmodus
const NormalServiceRows = ({
    compactValues,
    showText,
    t,
}: NormalServiceRowsProps) => {
    const fireHazard = useValue(infoview.averageFireHazard$);
    const healthcare = useValue(infoview.healthcareAvailability$);
    const cemetery = useValue(infoview.cemeteryAvailability$);
    const landfill = useValue(infoview.landfillAvailability$);
    const garbageProduction = useValue(infoview.garbageProductionRate$);
    const garbageProcessing = useValue(infoview.garbageProcessingRate$);
    const trafficFlow = useValue(infoview.trafficFlow$);
    const electricity = useValue(infoview.electricityAvailability$);
    const water = useValue(infoview.waterAvailability$);
    const sewage = useValue(infoview.sewageAvailability$);
    const parkingCar = useValue(infoview.parkingAvailability$);
    const parkingBike = useValue(infoview.bikeParkingAvailability$);
    const post = useValue(infoview.postServiceAvailability$);
    const tourists = useValue(infoview.tourismRate$);
    const attractiveness = useValue(infoview.attractiveness$);

    const firePercent = indicatorPercent(fireHazard);
    const healthcarePercent = indicatorPercent(healthcare);
    const cemeteryPercent = indicatorPercent(cemetery);
    const landfillPercent = indicatorPercent(landfill);
    const electricityPercent = indicatorPercent(electricity);
    const waterPercent = indicatorPercent(water);
    const sewagePercent = indicatorPercent(sewage);
    const parkingCarPercent = indicatorPercent(parkingCar);
    const parkingBikePercent = indicatorPercent(parkingBike);
    const postPercent = indicatorPercent(post);
    const attractivenessPercent = indicatorPercent(attractiveness);

    const garbageProcessingPercent =
        garbageProduction > 0
            ? clamp((garbageProcessing / garbageProduction) * 100, 0, 100)
            : 100;
    const garbagePercent = Math.min(
        garbageProcessingPercent,
        landfillPercent
    );

    const trafficValues = Array.isArray(trafficFlow)
        ? trafficFlow
            .slice(0, 4)
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value))
        : [];
    let trafficPercent =
        trafficValues.length > 0
            ? trafficValues.reduce((sum, value) => sum + value, 0) /
              trafficValues.length
            : 0;
    if (
        trafficValues.length > 0 &&
        trafficValues.every((value) => value >= 0 && value <= 1)
    ) {
        trafficPercent *= 100;
    }
    trafficPercent = clamp(trafficPercent, 0, 100);

    const waterSewagePercent = Math.min(waterPercent, sewagePercent);

    return (
        <>
            <div
                style={{
                    height: "1rem",
                    background: "rgba(255,255,255,0.1)",
                    margin: "6rem 0",
                }}
            />

            <Row
                iconSrc={ICON_FIRE}
                label={t("UI_Extended.CityMonitor.Fire", "Feuerwehr")}
                value={firePercent.toFixed(0) + " %"}
                color={fireHazardStatusColor(firePercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_HEALTHCARE}
                label={t("UI_Extended.CityMonitor.Healthcare", "Krankenhaus")}
                value={healthcarePercent.toFixed(0) + " %"}
                color={availabilityStatusColor(healthcarePercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_CEMETERY}
                label={t("UI_Extended.CityMonitor.Cemetery", "Friedhof")}
                value={cemeteryPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(cemeteryPercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_GARBAGE}
                label={t("UI_Extended.CityMonitor.Garbage", "Müll")}
                value={
                    compactValues
                        ? garbagePercent.toFixed(0) + " %"
                        : garbageProcessingPercent.toFixed(0) + " / " +
                          landfillPercent.toFixed(0) + " %"
                }
                color={availabilityStatusColor(garbagePercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_TRAFFIC}
                label={t("UI_Extended.CityMonitor.TrafficFlow", "Verkehrsfluss")}
                value={trafficPercent.toFixed(0) + " %"}
                color={trafficStatusColor(trafficPercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_ELECTRICITY}
                label={t("UI_Extended.CityMonitor.Electricity", "Strom")}
                value={electricityPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(electricityPercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_WATER}
                label={t("UI_Extended.CityMonitor.WaterSewage", "Wasser / Abwasser")}
                value={
                    compactValues
                        ? waterSewagePercent.toFixed(0) + " %"
                        : waterPercent.toFixed(0) + " / " +
                          sewagePercent.toFixed(0) + " %"
                }
                color={availabilityStatusColor(waterSewagePercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_PARKING}
                label={t("UI_Extended.CityMonitor.CarParking", "Parkplätze Auto")}
                value={parkingCarPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(parkingCarPercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_BICYCLE}
                label={t("UI_Extended.CityMonitor.BikeParking", "Parkplätze Fahrrad")}
                value={parkingBikePercent.toFixed(0) + " %"}
                color={availabilityStatusColor(parkingBikePercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_POST}
                label={t("UI_Extended.CityMonitor.Post", "Post")}
                value={postPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(postPercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_TOURISM}
                label={t("UI_Extended.CityMonitor.Tourism", "Tourismus")}
                value={String(Math.max(0, Math.round(Number(tourists) || 0)))}
                color={STATUS_INFO}
                showText={showText}
            />
            <Row
                iconSrc={ICON_ATTRACTIVENESS}
                label={t("UI_Extended.CityMonitor.Attractiveness", "Stadtattraktivität")}
                value={attractivenessPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(attractivenessPercent)}
                showText={showText}
            />
        </>
    );
};

// Hauptkomponente und persistenter UI-Zustand
export const CityMonitorComponent = () => {
    const localization = useLocalization();
    const t = (id: string, fallback: string) =>
        localization.translate(id, fallback) ?? fallback;

    const data = useValue(data$);
    const savedRaw = useValue(uiState$);

    const showPanelSetting = useValue(showPanel$);
    const compactValues = useValue(compactValues$);
    const showText = useValue(showLabels$);
    const iconOnlyMode = useValue(iconOnlyMode$);
    const iconOrientationSetting = useValue(iconOrientation$);
    const iconPositionLocked = useValue(iconPositionLocked$);
    const iconVisibilityEditMode = useValue(iconVisibilityEditMode$);
    const iconBackgroundTransparency = useValue(iconBackgroundTransparency$);
    const iconSizeSetting = useValue(iconSize$);
    const iconGapSetting = useValue(iconGap$);
    const hiddenIconsRaw = useValue(hiddenIcons$);
    const iconOrderRaw = useValue(iconOrder$);

    const [hiddenIconIds, setHiddenIconIds] =
        useState<Set<string>>(new Set());

    useEffect(() => {
        try {
            const parsed = JSON.parse(hiddenIconsRaw || "[]");

            if (Array.isArray(parsed)) {
                setHiddenIconIds(
                    new Set(
                        parsed.filter(
                            (item): item is string =>
                                typeof item === "string"
                        )
                    )
                );
            } else {
                setHiddenIconIds(new Set());
            }
        } catch {
            setHiddenIconIds(new Set());
        }
    }, [hiddenIconsRaw]);

    const normalizeIconOrder = (ids: string[]) => {
        const validIds = new Set<string>(ALL_ICON_IDS);
        const seen = new Set<string>();
        const result: string[] = [];

        for (const id of ids) {
            if (validIds.has(id) && !seen.has(id)) {
                seen.add(id);
                result.push(id);
            }
        }

        for (const id of ALL_ICON_IDS) {
            if (!seen.has(id)) {
                result.push(id);
            }
        }

        return result;
    };

    const [iconOrderIds, setIconOrderIds] =
        useState<string[]>([...ALL_ICON_IDS]);
    const iconOrderRef = useRef<string[]>([...ALL_ICON_IDS]);

    useEffect(() => {
        try {
            const parsed = JSON.parse(iconOrderRaw || "[]");
            const next = normalizeIconOrder(
                Array.isArray(parsed)
                    ? parsed.filter(
                          (item): item is string =>
                              typeof item === "string"
                      )
                    : []
            );
            iconOrderRef.current = next;
            setIconOrderIds(next);
        } catch {
            const next = [...ALL_ICON_IDS];
            iconOrderRef.current = next;
            setIconOrderIds(next);
        }
    }, [iconOrderRaw]);

    const [reorderingIconId, setReorderingIconId] =
        useState<string | null>(null);

    const iconSize = clamp(iconSizeSetting ?? 30, 22, 50);
    const iconGap = clamp(iconGapSetting ?? 5, 0, 20);
    const iconOrientation: IconOrientationMode =
        iconOrientationSetting === 1
            ? "horizontal"
            : "vertical";

    const displayedIconIdCount = iconVisibilityEditMode
        ? ALL_ICON_IDS.length
        : ALL_ICON_IDS.filter(
            (id) => !hiddenIconIds.has(id)
        ).length;

    const iconBarLengthRem =
        displayedIconIdCount > 0
            ? displayedIconIdCount * iconSize +
              Math.max(0, displayedIconIdCount - 1) *
                  iconGap
            : 0;

    const iconOpacity =
        1 - clamp(iconBackgroundTransparency ?? 40, 0, 100) / 100;

    const [pos, setPos] = useState({ x: 50, y: 100 });
    const posRef = useRef(pos);

    useEffect(() => {
        posRef.current = pos;
    }, [pos]);

    const [minimized, setMinimized] = useState(false);
    const [visible, setVisible] = useState(true);
    const [dragging, setDragging] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({
        startMx: 0,
        startMy: 0,
        startX: 0,
        startY: 0,
        pxPerRem: 1,
    });

    const [userWidth, setUserWidth] = useState<number | null>(null);
    const [resizing, setResizing] = useState(false);
    const [resizeHover, setResizeHover] = useState<"l" | "r" | null>(null);

    const resizeRef = useRef<{
        startMx: number;
        startWidth: number;
        startX: number;
        pxPerRem: number;
        side: "l" | "r";
    }>({
        startMx: 0,
        startWidth: 0,
        startX: 0,
        pxPerRem: 1,
        side: "r",
    });

    const DEFAULT_W = showText
        ? compactValues
            ? 170
            : 215
        : compactValues
          ? 76
          : 102;

    const MIN_W = showText
        ? compactValues
            ? 155
            : 190
        : compactValues
          ? 72
          : 96;

    const widthRem = iconOnlyMode
        ? iconOrientation === "horizontal"
            ? Math.max(iconSize, iconBarLengthRem)
            : iconSize
        : minimized
          ? 52
          : clamp(userWidth ?? DEFAULT_W, MIN_W, 400);

    // Gespeicherten UI-Zustand laden
    const applied = useRef(false);

    useEffect(() => {
        if (applied.current || !savedRaw) return;

        applied.current = true;

        try {
            const s = JSON.parse(savedRaw);

            let p =
                s.pos &&
                typeof s.pos.x === "number" &&
                typeof s.pos.y === "number"
                    ? s.pos
                    : { x: 50, y: 100 };

            if (
                !Number.isFinite(p.x) ||
                !Number.isFinite(p.y) ||
                p.x < 0 ||
                p.y < 0
            ) {
                p = { x: 50, y: 100 };
            }

            posRef.current = p;
            setPos(p);

            if (typeof s.minimized === "boolean") {
                setMinimized(s.minimized);
            }

            if (typeof s.visible === "boolean") {
                setVisible(s.visible);
            }

            if (s.layoutVersion === 2 && typeof s.width === "number") {
                setUserWidth(s.width);
            }
        } catch {
        }
    }, [savedRaw]);

    const save = (
        override: Partial<{
            pos: { x: number; y: number };
            minimized: boolean;
            visible: boolean;
            width: number | null;
        }> = {}
    ) => {
        const s = {
            layoutVersion: 2,
            pos,
            minimized,
            visible,
            width: userWidth,
            ...override,
        };

        try {
            trigger("cityMonitor", "saveUiState", JSON.stringify(s));
        } catch {
        }
    };

    useEffect(() => {
        if (
            !iconOnlyMode ||
            !visible ||
            !panelRef.current
        ) {
            return;
        }

        const rect =
            panelRef.current.getBoundingClientRect();
        const viewportWidth =
            document.documentElement?.clientWidth ||
            window.innerWidth ||
            0;
        const viewportHeight =
            document.documentElement?.clientHeight ||
            window.innerHeight ||
            0;

        if (
            viewportWidth <= 0 ||
            viewportHeight <= 0 ||
            rect.width <= 0 ||
            rect.height <= 0
        ) {
            return;
        }

        const pxPerRem =
            widthRem > 0
                ? rect.width / widthRem
                : 1;

        if (pxPerRem <= 0) {
            return;
        }

        let nx = posRef.current.x;
        let ny = posRef.current.y;

        if (rect.right > viewportWidth) {
            nx -=
                (rect.right - viewportWidth) /
                pxPerRem;
        }

        if (rect.bottom > viewportHeight) {
            ny -=
                (rect.bottom - viewportHeight) /
                pxPerRem;
        }

        if (rect.left < 0) {
            nx += -rect.left / pxPerRem;
        }

        if (rect.top < 0) {
            ny += -rect.top / pxPerRem;
        }

        nx = Math.max(0, nx);
        ny = Math.max(0, ny);

        if (
            Math.abs(nx - posRef.current.x) > 0.01 ||
            Math.abs(ny - posRef.current.y) > 0.01
        ) {
            const nextPos = { x: nx, y: ny };
            posRef.current = nextPos;
            setPos(nextPos);
            save({ pos: nextPos });
        }
    }, [
        iconOnlyMode,
        iconOrientation,
        displayedIconIdCount,
        iconSize,
        iconGap,
        visible,
        widthRem,
        data,
    ]);

    const previousLayout = useRef({ compactValues, showText, iconOnlyMode });

    useEffect(() => {
        const previous = previousLayout.current;

        if (
            previous.compactValues !== compactValues ||
            previous.showText !== showText ||
            previous.iconOnlyMode !== iconOnlyMode
        ) {
            previousLayout.current = { compactValues, showText, iconOnlyMode };
            setUserWidth(null);
            save({ width: null });
        }
    }, [compactValues, showText, iconOnlyMode]);

    const onHeaderDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.button !== 0) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            let pxPerRem = 1;

            if (panelRef.current) {
                const w = panelRef.current.getBoundingClientRect().width;
                if (w > 0) {
                    pxPerRem = w / widthRem;
                }
            }

            dragRef.current = {
                startMx: e.clientX,
                startMy: e.clientY,
                startX: pos.x,
                startY: pos.y,
                pxPerRem,
            };

            setDragging(true);
        },
        [pos.x, pos.y, widthRem]
    );

    const onOverlayMove = (e: React.MouseEvent) => {
        const f = dragRef.current.pxPerRem || 1;

        const dx = (e.clientX - dragRef.current.startMx) / f;
        const dy = (e.clientY - dragRef.current.startMy) / f;

        let nx = dragRef.current.startX + dx;
        let ny = dragRef.current.startY + dy;

        const viewportWidthPx =
            document.documentElement?.clientWidth || window.innerWidth || 0;
        const viewportHeightPx =
            document.documentElement?.clientHeight || window.innerHeight || 0;

        let panelWidthPx = widthRem * f;
        let panelHeightPx = 30 * f;

        if (panelRef.current) {
            const rect = panelRef.current.getBoundingClientRect();

            if (rect.width > 0) {
                panelWidthPx = rect.width;
            }

            if (rect.height > 0) {
                panelHeightPx = rect.height;
            }
        }

        if (viewportWidthPx > 0) {
            const maxX =
                Math.max(0, viewportWidthPx - panelWidthPx) / f;

            nx = clamp(nx, 0, maxX);
        }

        if (viewportHeightPx > 0) {
            const maxY =
                Math.max(0, viewportHeightPx - panelHeightPx) / f;

            ny = clamp(ny, 0, maxY);
        }

        const nextPos = { x: nx, y: ny };
        posRef.current = nextPos;
        setPos(nextPos);
    };

    const startResize =
        (side: "l" | "r") => (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            let pxPerRem = 1;

            if (panelRef.current) {
                const w = panelRef.current.getBoundingClientRect().width;
                if (w > 0) {
                    pxPerRem = w / widthRem;
                }
            }

            resizeRef.current = {
                startMx: e.clientX,
                startWidth: widthRem,
                startX: pos.x,
                pxPerRem,
                side,
            };

            setResizing(true);
        };

    const onResizeMove = (e: React.MouseEvent) => {
        const r = resizeRef.current;
        const f = r.pxPerRem || 1;
        const dx = (e.clientX - r.startMx) / f;

        if (r.side === "r") {
            setUserWidth(clamp(r.startWidth + dx, MIN_W, 400));
        } else {
            const nw = clamp(r.startWidth - dx, MIN_W, 400);
            const nx = Math.max(0, r.startX + r.startWidth - nw);

            setUserWidth(nw);
            setPos((p) => ({ ...p, x: nx }));
        }
    };

    const onResizeUp = () => {
        setResizing(false);
        save({ width: userWidth, pos });
    };

    const onOverlayUp = () => {
        setDragging(false);
        save({ pos: posRef.current });
    };

    const toggleMin = () =>
        setMinimized((p) => {
            const n = !p;
            save({ minimized: n });
            return n;
        });

    const toggleVisible = () =>
        setVisible((p) => {
            const n = !p;
            save({ visible: n });
            return n;
        });


    // Sichtbarkeit und Reihenfolge der Symbole bearbeiten
    const toggleIconVisibility = (id: string) => {
        if (!iconVisibilityEditMode) {
            return;
        }

        const next = new Set(hiddenIconIds);

        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }

        setHiddenIconIds(next);

        try {
            trigger(
                "cityMonitor",
                "saveHiddenIcons",
                JSON.stringify(Array.from(next))
            );
        } catch {
        }
    };


    const startIconReorder = (id: string) => {
        if (!iconVisibilityEditMode) {
            return;
        }
        setReorderingIconId(id);
    };

    const moveReorderingIcon = (targetId: string) => {
        const sourceId = reorderingIconId;
        if (!sourceId || sourceId === targetId) {
            return;
        }

        const current = [...iconOrderRef.current];
        const sourceIndex = current.indexOf(sourceId);
        const targetIndex = current.indexOf(targetId);

        if (sourceIndex < 0 || targetIndex < 0) {
            return;
        }

        current.splice(sourceIndex, 1);
        current.splice(targetIndex, 0, sourceId);
        iconOrderRef.current = current;
        setIconOrderIds(current);
    };

    const finishIconReorder = useCallback(() => {
        if (!reorderingIconId) {
            return;
        }

        setReorderingIconId(null);

        try {
            trigger(
                "cityMonitor",
                "saveIconOrder",
                JSON.stringify(iconOrderRef.current)
            );
        } catch {
        }
    }, [reorderingIconId]);

    useEffect(() => {
        if (!reorderingIconId) {
            return;
        }

        const onMouseUp = () => finishIconReorder();
        window.addEventListener("mouseup", onMouseUp);
        return () => window.removeEventListener("mouseup", onMouseUp);
    }, [reorderingIconId, finishIconReorder]);

    type IconItem = {
        id: string;
        iconSrc: string;
        label: string;
        details?: TooltipDetail[];
        ringColor?: string;
        service?: ServiceKind;
    };

    const iconItems: IconItem[] = data
        ? [
              {
                  id: "unemployment",
                  iconSrc: stat,
                  label: t(
                      "UI_Extended.CityMonitor.Unemployment",
                      "Arbeitslosigkeit"
                  ),
                  details: compactValues
                      ? [
                            {
                                value:
                                    data.unemploymentRate.toFixed(1) + " %",
                            },
                        ]
                      : [
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.UnemploymentRate",
                                    "Quote"
                                ),
                                value:
                                    data.unemploymentRate.toFixed(1) + " %",
                            },
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Unemployed",
                                    "Arbeitslose"
                                ),
                                value: String(data.unemployedCount),
                            },
                        ],
                  ringColor: unemploymentStatusColor(
                      data.unemploymentRate
                  ),
              },
              {
                  id: "jobs",
                  iconSrc: work,
                  label: t(
                      "UI_Extended.CityMonitor.Jobs",
                      "Arbeitsplätze"
                  ),
                  details: compactValues
                      ? [{ value: String(data.openJobs) }]
                      : [
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Open",
                                    "Offen"
                                ),
                                value: String(data.openJobs),
                            },
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Total",
                                    "Gesamt"
                                ),
                                value: String(data.totalJobSlots),
                            },
                        ],
                  ringColor: openJobsStatusColor(
                      data.openJobs,
                      data.totalJobSlots
                  ),
              },
              {
                  id: "elementary",
                  iconSrc: edu1,
                  label: t(
                      "UI_Extended.CityMonitor.ElementarySchool",
                      "Grundschule"
                  ),
                  details: compactValues
                      ? [{ value: String(data.elementaryFreeSlots) }]
                      : [
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Free",
                                    "Frei"
                                ),
                                value: String(data.elementaryFreeSlots),
                            },
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Total",
                                    "Gesamt"
                                ),
                                value: String(
                                    data.elementaryStudents +
                                        data.elementaryFreeSlots
                                ),
                            },
                        ],
                  ringColor: schoolStatusColor(
                      data.elementaryFreeSlots,
                      data.elementaryStudents
                  ),
              },
              {
                  id: "highschool",
                  iconSrc: edu2,
                  label: t(
                      "UI_Extended.CityMonitor.HighSchool",
                      "Oberschule"
                  ),
                  details: compactValues
                      ? [{ value: String(data.highFreeSlots) }]
                      : [
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Free",
                                    "Frei"
                                ),
                                value: String(data.highFreeSlots),
                            },
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Total",
                                    "Gesamt"
                                ),
                                value: String(
                                    data.highStudents +
                                        data.highFreeSlots
                                ),
                            },
                        ],
                  ringColor: schoolStatusColor(
                      data.highFreeSlots,
                      data.highStudents
                  ),
              },
              {
                  id: "college",
                  iconSrc: edu3,
                  label: t(
                      "UI_Extended.CityMonitor.College",
                      "College"
                  ),
                  details: compactValues
                      ? [{ value: String(data.collegeFreeSlots) }]
                      : [
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Free",
                                    "Frei"
                                ),
                                value: String(data.collegeFreeSlots),
                            },
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Total",
                                    "Gesamt"
                                ),
                                value: String(
                                    data.collegeStudents +
                                        data.collegeFreeSlots
                                ),
                            },
                        ],
                  ringColor: schoolStatusColor(
                      data.collegeFreeSlots,
                      data.collegeStudents
                  ),
              },
              {
                  id: "university",
                  iconSrc: edu4,
                  label: t(
                      "UI_Extended.CityMonitor.University",
                      "Universität"
                  ),
                  details: compactValues
                      ? [{ value: String(data.uniFreeSlots) }]
                      : [
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Free",
                                    "Frei"
                                ),
                                value: String(data.uniFreeSlots),
                            },
                            {
                                label: t(
                                    "UI_Extended.CityMonitor.Total",
                                    "Gesamt"
                                ),
                                value: String(
                                    data.uniStudents +
                                        data.uniFreeSlots
                                ),
                            },
                        ],
                  ringColor: schoolStatusColor(
                      data.uniFreeSlots,
                      data.uniStudents
                  ),
              },

              {
                  id: "fire",
                  service: "fire",
                  iconSrc: ICON_FIRE,
                  label: t(
                      "UI_Extended.CityMonitor.Fire",
                      "Feuerwehr"
                  ),
              },
              {
                  id: "healthcare",
                  service: "healthcare",
                  iconSrc: ICON_HEALTHCARE,
                  label: t(
                      "UI_Extended.CityMonitor.Healthcare",
                      "Krankenhaus"
                  ),
              },
              {
                  id: "cemetery",
                  service: "cemetery",
                  iconSrc: ICON_CEMETERY,
                  label: t(
                      "UI_Extended.CityMonitor.Cemetery",
                      "Friedhof"
                  ),
              },
              {
                  id: "garbage",
                  service: "garbage",
                  iconSrc: ICON_GARBAGE,
                  label: t(
                      "UI_Extended.CityMonitor.Garbage",
                      "Müll"
                  ),
              },
              {
                  id: "traffic",
                  service: "traffic",
                  iconSrc: ICON_TRAFFIC,
                  label: t(
                      "UI_Extended.CityMonitor.TrafficFlow",
                      "Verkehrsfluss"
                  ),
              },
              {
                  id: "electricity",
                  service: "electricity",
                  iconSrc: ICON_ELECTRICITY,
                  label: t(
                      "UI_Extended.CityMonitor.Electricity",
                      "Strom"
                  ),
              },
              {
                  id: "water",
                  service: "water",
                  iconSrc: ICON_WATER,
                  label: t(
                      "UI_Extended.CityMonitor.WaterSewage",
                      "Wasser / Abwasser"
                  ),
              },
              {
                  id: "parkingCar",
                  service: "parkingCar",
                  iconSrc: ICON_PARKING,
                  label: t(
                      "UI_Extended.CityMonitor.CarParking",
                      "Parkplätze Auto"
                  ),
              },
              {
                  id: "parkingBike",
                  service: "parkingBike",
                  iconSrc: ICON_BICYCLE,
                  label: t(
                      "UI_Extended.CityMonitor.BikeParking",
                      "Parkplätze Fahrrad"
                  ),
              },
              {
                  id: "post",
                  service: "post",
                  iconSrc: ICON_POST,
                  label: t(
                      "UI_Extended.CityMonitor.Post",
                      "Post"
                  ),
              },
              {
                  id: "tourism",
                  service: "tourism",
                  iconSrc: ICON_TOURISM,
                  label: t(
                      "UI_Extended.CityMonitor.Tourism",
                      "Tourismus"
                  ),
              },
              {
                  id: "attractiveness",
                  service: "attractiveness",
                  iconSrc: ICON_ATTRACTIVENESS,
                  label: t(
                      "UI_Extended.CityMonitor.Attractiveness",
                      "Stadtattraktivität"
                  ),
              },
          ]
        : [];

    const orderedIconItems = iconOrderIds
        .map((id) => iconItems.find((item) => item.id === id))
        .filter((item): item is IconItem => item !== undefined);

    // Ausgeblendete Symbole bleiben nur im Bearbeitungsmodus sichtbar
    const displayedIconItems = iconVisibilityEditMode
        ? orderedIconItems
        : orderedIconItems.filter((item) => !hiddenIconIds.has(item.id));

    const rateColor =
        data && data.unemploymentRate > 10 ? "#ff6b6b" : "#7CFC00";

    const headerBtnStyle: React.CSSProperties = {
        background: "rgba(255,255,255,0.1)",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        borderRadius: "3rem",
        padding: "0 6rem",
        lineHeight: "20rem",
    };

    if (!showPanelSetting) {
        return null;
    }

    return (
        <>
            <button
                onClick={toggleVisible}
                title={t("UI_Extended.CityMonitor.Toggle", "Stadt Monitor ein-/ausblenden")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36rem",
                    height: "36rem",
                    margin: "0 4rem",
                    borderRadius: "4rem",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    backgroundColor: visible
                        ? "rgba(80,160,220,0.9)"
                        : "rgba(60,70,80,0.9)",
                }}
            >
                <Icon path={P_CHART} size={22} />
            </button>

            {visible && data && (
                <Portal>
                    {(dragging || resizing) && (
                        <div
                            onMouseMove={
                                dragging ? onOverlayMove : onResizeMove
                            }
                            onMouseUp={
                                dragging ? onOverlayUp : onResizeUp
                            }
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: "100%",
                                height: "100%",
                                zIndex: 9999,
                                cursor: resizing ? "ew-resize" : "move",
                                pointerEvents: "auto",
                            }}
                        />
                    )}

                    <div
                        ref={panelRef}
                        style={{
                            position: "absolute",
                            top: pos.y + "rem",
                            left: pos.x + "rem",
                            width:
                                (iconOnlyMode
                                    ? widthRem
                                    : Math.max(0, widthRem - 2)) + "rem",
                            backgroundColor: iconOnlyMode
                                ? "transparent"
                                : "rgba(20, 28, 35, 0.95)",
                            color: "#fff",
                            borderRadius: "4rem",
                            fontSize: "13rem",
                            fontFamily: "Noto Sans, sans-serif",
                            border: iconOnlyMode
                                ? "none"
                                : "1rem solid rgba(255,255,255,0.1)",
                            boxShadow: iconOnlyMode
                                ? "none"
                                : "0 4rem 15rem rgba(0,0,0,0.5)",
                            userSelect: "none",
                            zIndex: 100,
                            pointerEvents: "auto",
                        }}
                    >
                        {iconOnlyMode ? (
                            <div
                                onMouseDown={
                                    iconPositionLocked
                                        ? undefined
                                        : onHeaderDown
                                }
                                title={
                                    iconPositionLocked
                                        ? t(
                                              "UI_Extended.CityMonitor.PositionLocked",
                                              "Position fixiert"
                                          )
                                        : t(
                                              "UI_Extended.CityMonitor.Drag",
                                              "Zum Verschieben ziehen"
                                          )
                                }
                                style={{
                                    width:
                                        (iconOrientation === "horizontal"
                                            ? Math.max(
                                                iconSize,
                                                iconBarLengthRem
                                            )
                                            : iconSize) + "rem",
                                    height:
                                        iconOrientation === "horizontal"
                                            ? iconSize + "rem"
                                            : undefined,
                                    display: "flex",
                                    flexDirection:
                                        iconOrientation === "horizontal"
                                            ? "row"
                                            : "column",
                                    alignItems: "center",
                                    padding: 0,
                                    cursor: iconPositionLocked
                                        ? "default"
                                        : "move",
                                    overflow: "visible",
                                }}
                            >
                                {displayedIconItems.map(
                                    (item, index) => {
                                        const isHidden =
                                            hiddenIconIds.has(item.id);

                                        const currentIconOpacity =
                                            iconVisibilityEditMode
                                                ? isHidden
                                                    ? 0.4
                                                    : 1
                                                : iconOpacity;

                                        const gapAfter =
                                            index <
                                            displayedIconItems.length - 1
                                                ? iconGap
                                                : 0;

                                        const visibilityAction =
                                            isHidden
                                                ? t(
                                                    "UI_Extended.CityMonitor.ShowIcon",
                                                    "Rechtsklick: Symbol einblenden"
                                                )
                                                : t(
                                                    "UI_Extended.CityMonitor.HideIcon",
                                                    "Rechtsklick: Symbol ausblenden"
                                                );
                                        const visibilityHint =
                                            t(
                                                "UI_Extended.CityMonitor.ReorderIcon",
                                                "Ziehen: Reihenfolge ändern"
                                            ) + " · " + visibilityAction;

                                        if (
                                            isHidden &&
                                            iconVisibilityEditMode
                                        ) {
                                            return (
                                                <StatusIcon
                                                    key={item.id}
                                                    iconSrc={item.iconSrc}
                                                    label={item.label}
                                                    details={[
                                                        {
                                                            value: t(
                                                                "UI_Extended.CityMonitor.Hidden",
                                                                "Ausgeblendet"
                                                            ),
                                                        },
                                                    ]}
                                                    ringColor={STATUS_INACTIVE}
                                                    iconOpacity={
                                                        currentIconOpacity
                                                    }
                                                    size={iconSize}
                                                    gapAfter={gapAfter}
                                                    orientation={
                                                        iconOrientation
                                                    }
                                                    canToggleVisibility
                                                    onToggleVisibility={() =>
                                                        toggleIconVisibility(
                                                            item.id
                                                        )
                                                    }
                                                    visibilityHint={
                                                        visibilityHint
                                                    }
                                                    canReorder={
                                                        iconVisibilityEditMode
                                                    }
                                                    reorderActive={
                                                        reorderingIconId !== null
                                                    }
                                                    isReordering={
                                                        reorderingIconId === item.id
                                                    }
                                                    onReorderStart={() =>
                                                        startIconReorder(item.id)
                                                    }
                                                    onReorderEnter={() =>
                                                        moveReorderingIcon(item.id)
                                                    }
                                                />
                                            );
                                        }

                                        if (item.service) {
                                            return (
                                                <ServiceStatusIcon
                                                    key={item.id}
                                                    service={item.service}
                                                    iconSrc={item.iconSrc}
                                                    label={item.label}
                                                    compactValues={
                                                        compactValues
                                                    }
                                                    t={t}
                                                    iconOpacity={
                                                        currentIconOpacity
                                                    }
                                                    size={iconSize}
                                                    gapAfter={gapAfter}
                                                    orientation={
                                                        iconOrientation
                                                    }
                                                    canToggleVisibility={
                                                        iconVisibilityEditMode
                                                    }
                                                    onToggleVisibility={() =>
                                                        toggleIconVisibility(
                                                            item.id
                                                        )
                                                    }
                                                    visibilityHint={
                                                        visibilityHint
                                                    }
                                                    canReorder={
                                                        iconVisibilityEditMode
                                                    }
                                                    reorderActive={
                                                        reorderingIconId !== null
                                                    }
                                                    isReordering={
                                                        reorderingIconId === item.id
                                                    }
                                                    onReorderStart={() =>
                                                        startIconReorder(item.id)
                                                    }
                                                    onReorderEnter={() =>
                                                        moveReorderingIcon(item.id)
                                                    }
                                                />
                                            );
                                        }

                                        return (
                                            <StatusIcon
                                                key={item.id}
                                                iconSrc={item.iconSrc}
                                                label={item.label}
                                                details={
                                                    item.details ?? []
                                                }
                                                ringColor={
                                                    item.ringColor ??
                                                    STATUS_INACTIVE
                                                }
                                                iconOpacity={
                                                    currentIconOpacity
                                                }
                                                size={iconSize}
                                                gapAfter={gapAfter}
                                                orientation={
                                                    iconOrientation
                                                }
                                                canToggleVisibility={
                                                    iconVisibilityEditMode
                                                }
                                                onToggleVisibility={() =>
                                                    toggleIconVisibility(
                                                        item.id
                                                    )
                                                }
                                                visibilityHint={
                                                    visibilityHint
                                                }
                                                canReorder={
                                                    iconVisibilityEditMode
                                                }
                                                reorderActive={
                                                    reorderingIconId !== null
                                                }
                                                isReordering={
                                                    reorderingIconId === item.id
                                                }
                                                onReorderStart={() =>
                                                    startIconReorder(item.id)
                                                }
                                                onReorderEnter={() =>
                                                    moveReorderingIcon(item.id)
                                                }
                                            />
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <>
                                <div
                                    onMouseDown={onHeaderDown}
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        padding: "5rem 6rem",
                                        cursor: "move",
                                        backgroundColor: "rgba(255,255,255,0.08)",
                                        borderTopLeftRadius: "4rem",
                                        borderTopRightRadius: "4rem",
                                    }}
                                >
                                    <button
                                        onClick={toggleMin}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        title={t("UI_Extended.CityMonitor.CollapseExpand", "Ein-/ausklappen")}
                                        style={headerBtnStyle}
                                    >
                                        {minimized ? "▼" : "▲"}
                                    </button>
                                </div>

                                {!minimized && (
                                    <div style={{ padding: "7rem" }}>
                                        {!compactValues && (
                                            <Row
                                                iconSrc={alos}
                                                label={t("UI_Extended.CityMonitor.Unemployed", "Arbeitslose")}
                                                value={String(data.unemployedCount)}
                                                showText={showText}
                                            />
                                        )}

                                        <Row
                                            iconSrc={stat}
                                            label={t("UI_Extended.CityMonitor.UnemploymentRate", "Quote")}
                                            value={data.unemploymentRate.toFixed(1) + " %"}
                                            color={rateColor}
                                            showText={showText}
                                        />

                                        <Row
                                            iconSrc={work}
                                            label={t("UI_Extended.CityMonitor.OpenJobs", "Offene Stellen")}
                                            value={
                                                compactValues
                                                    ? String(data.openJobs)
                                                    : `${data.openJobs} / ${data.totalJobSlots}`
                                            }
                                            showText={showText}
                                        />

                                        <div
                                            style={{
                                                height: "1rem",
                                                background: "rgba(255,255,255,0.1)",
                                                margin: "6rem 0",
                                            }}
                                        />

                                        <SchoolRow
                                            iconSrc={edu1}
                                            label={t("UI_Extended.CityMonitor.ElementarySchool", "Grundschule")}
                                            students={data.elementaryStudents}
                                            free={data.elementaryFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />

                                        <SchoolRow
                                            iconSrc={edu2}
                                            label={t("UI_Extended.CityMonitor.HighSchool", "Oberschule")}
                                            students={data.highStudents}
                                            free={data.highFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />

                                        <SchoolRow
                                            iconSrc={edu3}
                                            label={t("UI_Extended.CityMonitor.College", "College")}
                                            students={data.collegeStudents}
                                            free={data.collegeFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />

                                        <SchoolRow
                                            iconSrc={edu4}
                                            label={t("UI_Extended.CityMonitor.University", "Universität")}
                                            students={data.uniStudents}
                                            free={data.uniFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />

                                        <NormalServiceRows
                                            compactValues={compactValues}
                                            showText={showText}
                                            t={t}
                                        />
                                    </div>
                                )}

                                {!minimized && (
                                    <>
                                        <div
                                            onMouseDown={startResize("l")}
                                            onMouseEnter={() => setResizeHover("l")}
                                            onMouseLeave={() => setResizeHover(null)}
                                            title={t("UI_Extended.CityMonitor.Resize", "Breite ziehen")}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                height: "100%",
                                                width: "5rem",
                                                cursor: "ew-resize",
                                                backgroundColor:
                                                    resizeHover === "l"
                                                        ? "rgba(255,255,255,0.12)"
                                                        : "transparent",
                                                borderTopLeftRadius: "4rem",
                                                borderBottomLeftRadius: "4rem",
                                            }}
                                        />

                                        <div
                                            onMouseDown={startResize("r")}
                                            onMouseEnter={() => setResizeHover("r")}
                                            onMouseLeave={() => setResizeHover(null)}
                                            title={t("UI_Extended.CityMonitor.Resize", "Breite ziehen")}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                height: "100%",
                                                width: "5rem",
                                                cursor: "ew-resize",
                                                backgroundColor:
                                                    resizeHover === "r"
                                                        ? "rgba(255,255,255,0.12)"
                                                        : "transparent",
                                                borderTopRightRadius: "4rem",
                                                borderBottomRightRadius: "4rem",
                                            }}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </Portal>
            )}
        </>
    );
};
