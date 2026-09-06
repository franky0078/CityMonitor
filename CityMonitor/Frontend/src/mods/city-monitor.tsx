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
import crematoriumIcon from "./images/Crematorium.svg";
import landfillIcon from "./images/Landfill.svg";
import policeIcon from "./images/Police.svg";
import homelessIcon from "./images/Homeless.svg";

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
    "homeless",
    "jobs",
    "elementary",
    "highschool",
    "college",
    "university",
    "fire",
    "healthcare",
    "cemetery",
    "crematorium",
    "garbageProcessing",
    "landfill",
    "police",
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

const scalarPercent = (value: number | null | undefined) => {
    const current = Number(value);
    if (!Number.isFinite(current)) {
        return 0;
    }

    const percent = current >= 0 && current <= 1
        ? current * 100
        : current;

    return clamp(percent, 0, 100);
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

const riskStatusColor = (percent: number) => {
    if (percent <= 33) return STATUS_GREEN;
    if (percent <= 66) return STATUS_YELLOW;
    return STATUS_RED;
};

const homelessStatusColor = (percent: number) => {
    if (percent <= 1) return STATUS_GREEN;
    if (percent <= 3) return STATUS_YELLOW;
    return STATUS_RED;
};

// City Monitor App-Icon als direkt gezeichneter Ingame-SVG-Pfad
const P_CITY_MONITOR =
    "M 3.84,10.00 7.54,7.50 6.86,6.50 3.16,9.00 Z " +
    "M 6.92,7.53 10.32,9.33 10.88,8.27 7.48,6.47 Z " +
    "M 11.01,9.24 14.51,5.94 13.69,5.06 10.19,8.36 Z " +
    "M 13.78,6.01 16.78,7.91 17.42,6.89 14.42,4.99 Z " +
    "M 17.52,7.82 19.62,5.72 18.78,4.88 16.68,6.98 Z " +
    "M 2.72,9.50 a 0.78,0.78 0 1,0 1.56,0 a 0.78,0.78 0 1,0 -1.56,0 " +
    "M 6.42,7.00 a 0.78,0.78 0 1,0 1.56,0 a 0.78,0.78 0 1,0 -1.56,0 " +
    "M 9.82,8.80 a 0.78,0.78 0 1,0 1.56,0 a 0.78,0.78 0 1,0 -1.56,0 " +
    "M 13.32,5.50 a 0.78,0.78 0 1,0 1.56,0 a 0.78,0.78 0 1,0 -1.56,0 " +
    "M 16.32,7.40 a 0.78,0.78 0 1,0 1.56,0 a 0.78,0.78 0 1,0 -1.56,0 " +
    "M 18.1,3.8 L 21.5,3.2 L 20.9,6.6 L 19.9,5.6 L 18.8,6.7 " +
    "L 17.8,5.7 L 19.0,4.6 Z " +
    "M 2.8,21.5 L 2.8,16.4 L 6.0,16.4 L 6.0,21.5 L 7.2,21.5 " +
    "L 7.2,13.0 L 11.0,13.0 L 11.0,21.5 L 12.2,21.5 L 12.2,15.0 " +
    "L 16.0,15.0 L 16.0,21.5 L 17.2,21.5 L 17.2,17.1 L 21.0,17.1 " +
    "L 21.0,21.5 L 22.0,21.5 L 22.0,22.5 L 2.0,22.5 L 2.0,21.5 Z";

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


const HomelessRow = ({
    showText,
    compactValues,
    t,
}: {
    showText: boolean;
    compactValues: boolean;
    t: Translate;
}) => {
    const homeless = useValue(infoview.homeless$);
    const homelessness = useValue(infoview.homelessness$);
    const homelessCount = Math.max(0, Math.round(Number(homeless) || 0));
    const percent = scalarPercent(homelessness);

    return (
        <Row
            iconSrc={homelessIcon}
            label={t("CityMonitor.Homeless", "Obdachlosigkeit")}
            value={
                compactValues
                    ? percent.toFixed(1) + " %"
                    : percent.toFixed(1) + " % / " + String(homelessCount)
            }
            color={homelessStatusColor(percent)}
            showText={showText}
        />
    );
};

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
    | "homeless"
    | "fire"
    | "healthcare"
    | "cemetery"
    | "crematorium"
    | "garbageProcessing"
    | "landfill"
    | "police"
    | "traffic"
    | "electricity"
    | "water"
    | "parkingCar"
    | "parkingBike"
    | "post"
    | "tourism"
    | "attractiveness";

interface DragHandleProps {
    orientation: IconOrientationMode;
    title: string;
    onMouseDown: (e: React.MouseEvent) => void;
}

// Eigener Griff zum Verschieben der kompakten Icon-Leiste
const DragHandle = ({
    orientation,
    title,
    onMouseDown,
}: DragHandleProps) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            title={title}
            onMouseDown={onMouseDown}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: "18rem",
                height: "18rem",
                minWidth: "18rem",
                minHeight: "18rem",
                marginRight:
                    orientation === "horizontal"
                        ? "4rem"
                        : 0,
                marginBottom:
                    orientation === "vertical"
                        ? "4rem"
                        : 0,
                borderRadius: "4rem",
                border: hovered
                    ? "1rem solid rgba(210,240,255,0.72)"
                    : "1rem solid rgba(255,255,255,0.24)",
                background:
                    hovered
                        ? "linear-gradient(145deg, rgba(76,105,122,0.96), rgba(20,29,35,0.96))"
                        : "linear-gradient(145deg, rgba(47,61,70,0.94), rgba(14,21,26,0.94))",
                boxShadow: hovered
                    ? "0 0 8rem rgba(80,190,255,0.55), inset 0 0 4rem rgba(255,255,255,0.14)"
                    : "0 2rem 5rem rgba(0,0,0,0.34), inset 0 0 3rem rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem",
                cursor: "move",
                flexShrink: 0,
                transition:
                    "border 100ms ease, background 100ms ease, box-shadow 100ms ease",
            }}
        >
            {[0, 1, 2].map((index) => (
                <span
                    key={index}
                    style={{
                        width: "9rem",
                        height: "1.6rem",
                        borderRadius: "999rem",
                        backgroundColor: hovered
                            ? "rgba(235,248,255,0.95)"
                            : "rgba(220,235,245,0.72)",
                        boxShadow: hovered
                            ? "0 0 3rem rgba(120,210,255,0.65)"
                            : "none",
                        pointerEvents: "none",
                    }}
                />
            ))}
        </div>
    );
};

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
    onActivate?: () => void;
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
    onActivate,
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
                cursor: canReorder
                    ? "move"
                    : onActivate
                        ? "pointer"
                        : undefined,
            }}
            onClick={(e) => {
                if (!onActivate || reorderActive || isReordering) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                setHovered(false);
                onActivate();
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
                    background:
                        "radial-gradient(" +
                        "circle at 34% 24%, " +
                        "rgba(255,255,255,0.18) 0%, " +
                        "rgba(255,255,255,0.08) 24%, " +
                        "rgba(255,255,255,0) 52%" +
                        "), " +
                        "linear-gradient(" +
                        "145deg, " +
                        "rgb(54, 64, 72) 0%, " +
                        "rgb(28, 36, 42) 44%, " +
                        "rgb(10, 15, 19) 100%" +
                        ")",
                    opacity: iconOpacity,
                    boxShadow:
                        `0 0 3rem ${ringColor}, ` +
                        `0 0 6rem ${ringColor}55, ` +
                        "0 3rem 7rem rgba(0,0,0,0.30), " +
                        "inset 0 0 0 1rem rgba(255,255,255,0.12), " +
                        "inset 1rem 1rem 2rem rgba(255,255,255,0.12), " +
                        "inset -1rem -2rem 3rem rgba(0,0,0,0.38)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    transform: isReordering
                        ? "scale(1.10)"
                        : "scale(1)",
                    transition: "transform 100ms ease",
                }}
            >
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon src={iconSrc} size={glyphSize} />
                </div>
            </div>

            {isReordering && (
                <div
                    style={{
                        position: "absolute",
                        inset: "1rem",
                        borderRadius: "50%",
                        border:
                            "2rem solid rgba(235,248,255,0.96)",
                        backgroundColor:
                            "rgba(70, 175, 255, 0.14)",
                        boxShadow:
                            "0 0 5rem rgba(255,255,255,0.85), " +
                            "0 0 11rem rgba(70,175,255,0.95), " +
                            "inset 0 0 7rem rgba(180,225,255,0.22)",
                        pointerEvents: "none",
                        zIndex: 5,
                    }}
                />
            )}

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
const HomelessStatusIcon = (props: ServiceStatusIconProps) => {
    const homeless = useValue(infoview.homeless$);
    const homelessness = useValue(infoview.homelessness$);
    const homelessCount = Math.max(0, Math.round(Number(homeless) || 0));
    const percent = scalarPercent(homelessness);

    return (
        <StatusIcon
            {...props}
            details={
                props.compactValues
                    ? [
                        {
                            value: percent.toFixed(1) + " %",
                        },
                    ]
                    : [
                        {
                            label: props.t(
                                "CityMonitor.HomelessRate",
                                "Quote"
                            ),
                            value: percent.toFixed(1) + " %",
                        },
                        {
                            label: props.t(
                                "CityMonitor.HomelessPeople",
                                "Obdachlose"
                            ),
                            value: String(homelessCount),
                        },
                    ]
            }
            ringColor={homelessStatusColor(percent)}
        />
    );
};

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
                            "CityMonitor.FireHazard",
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
                            "CityMonitor.Availability",
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
                            "CityMonitor.Availability",
                            "Verfügbarkeit"
                        ),
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const CrematoriumStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const availability =
        useValue(infoview.deathcareAvailability$);
    const percent = indicatorPercent(availability);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    label: props.compactValues
                        ? undefined
                        : props.t(
                            "CityMonitor.Availability",
                            "Verfügbarkeit"
                        ),
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const GarbageProcessingStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const availability =
        useValue(infoview.processingAvailability$);
    const productionRate =
        useValue(infoview.garbageProductionRate$);
    const processingRate =
        useValue(infoview.garbageProcessingRate$);
    const percent = indicatorPercent(availability);

    return (
        <StatusIcon
            {...props}
            details={
                props.compactValues
                    ? [
                        {
                            value: percent.toFixed(0) + " %",
                        },
                    ]
                    : [
                        {
                            label: props.t(
                                "CityMonitor.Status",
                                "Status"
                            ),
                            value: percent.toFixed(0) + " %",
                        },
                        {
                            label: props.t(
                                "CityMonitor.GarbageProduction",
                                "Müll"
                            ),
                            value:
                                Math.max(0, Math.round(Number(productionRate) || 0)) +
                                " t/Mo.",
                        },
                        {
                            label: props.t(
                                "CityMonitor.ProcessingRate",
                                "Verarbeitung"
                            ),
                            value:
                                Math.max(0, Math.round(Number(processingRate) || 0)) +
                                " t/Mo.",
                        },
                    ]
            }
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const LandfillStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const availability =
        useValue(infoview.landfillAvailability$);
    const percent = indicatorPercent(availability);

    return (
        <StatusIcon
            {...props}
            details={[
                {
                    label: props.compactValues
                        ? undefined
                        : props.t(
                            "CityMonitor.Availability",
                            "Verfügbarkeit"
                        ),
                    value: percent.toFixed(0) + " %",
                },
            ]}
            ringColor={availabilityStatusColor(percent)}
        />
    );
};

const PoliceStatusIcon = (
    props: ServiceStatusIconProps
) => {
    const crimeProbability =
        useValue(infoview.averageCrimeProbability$);
    const jailAvailability =
        useValue(infoview.jailAvailability$);
    const crimePerMonth =
        useValue(infoview.crimePerMonth$);

    const crimePercent = indicatorPercent(crimeProbability);
    const jailPercent = indicatorPercent(jailAvailability);

    return (
        <StatusIcon
            {...props}
            details={
                props.compactValues
                    ? [
                        {
                            value: crimePercent.toFixed(0) + " %",
                        },
                    ]
                    : [
                        {
                            label: props.t(
                                "CityMonitor.CrimeProbability",
                                "Kriminalitätsrisiko"
                            ),
                            value: crimePercent.toFixed(0) + " %",
                        },
                        {
                            label: props.t(
                                "CityMonitor.JailAvailability",
                                "Gefängnis frei"
                            ),
                            value: jailPercent.toFixed(0) + " %",
                        },
                        {
                            label: props.t(
                                "CityMonitor.CrimePerMonth",
                                "Straftaten / Monat"
                            ),
                            value: String(
                                Math.max(0, Math.round(Number(crimePerMonth) || 0))
                            ),
                        },
                    ]
            }
            ringColor={riskStatusColor(crimePercent)}
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
                            "CityMonitor.Availability",
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
                                "CityMonitor.Water",
                                "Wasser"
                            ),
                            value:
                                waterPercent.toFixed(0) +
                                " %",
                        },
                        {
                            label: props.t(
                                "CityMonitor.Sewage",
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
                            "CityMonitor.Availability",
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
                            "CityMonitor.Availability",
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
                            "CityMonitor.Availability",
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
                            "CityMonitor.Tourists",
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
        case "homeless":
            return <HomelessStatusIcon {...props} />;

        case "fire":
            return <FireStatusIcon {...props} />;

        case "healthcare":
            return <HealthcareStatusIcon {...props} />;
        case "cemetery":
            return <CemeteryStatusIcon {...props} />;

        case "crematorium":
            return <CrematoriumStatusIcon {...props} />;

        case "garbageProcessing":
            return <GarbageProcessingStatusIcon {...props} />;

        case "landfill":
            return <LandfillStatusIcon {...props} />;

        case "police":
            return <PoliceStatusIcon {...props} />;

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
    const crematorium = useValue(infoview.deathcareAvailability$);
    const garbageProcessing = useValue(infoview.processingAvailability$);
    const landfill = useValue(infoview.landfillAvailability$);
    const crimeProbability = useValue(infoview.averageCrimeProbability$);
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
    const crematoriumPercent = indicatorPercent(crematorium);
    const garbageProcessingPercent = indicatorPercent(garbageProcessing);
    const landfillPercent = indicatorPercent(landfill);
    const crimePercent = indicatorPercent(crimeProbability);
    const electricityPercent = indicatorPercent(electricity);
    const waterPercent = indicatorPercent(water);
    const sewagePercent = indicatorPercent(sewage);
    const parkingCarPercent = indicatorPercent(parkingCar);
    const parkingBikePercent = indicatorPercent(parkingBike);
    const postPercent = indicatorPercent(post);
    const attractivenessPercent = indicatorPercent(attractiveness);

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
                label={t("CityMonitor.Fire", "Feuerwehr")}
                value={firePercent.toFixed(0) + " %"}
                color={fireHazardStatusColor(firePercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_HEALTHCARE}
                label={t("CityMonitor.Healthcare", "Krankenhaus")}
                value={healthcarePercent.toFixed(0) + " %"}
                color={availabilityStatusColor(healthcarePercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_CEMETERY}
                label={t("CityMonitor.Cemetery", "Friedhof")}
                value={cemeteryPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(cemeteryPercent)}
                showText={showText}
            />
            <Row
                iconSrc={crematoriumIcon}
                label={t("CityMonitor.Crematorium", "Krematorium")}
                value={crematoriumPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(crematoriumPercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_GARBAGE}
                label={t("CityMonitor.GarbageProcessing", "Müllverarbeitung")}
                value={garbageProcessingPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(garbageProcessingPercent)}
                showText={showText}
            />
            <Row
                iconSrc={landfillIcon}
                label={t("CityMonitor.Landfill", "Deponie")}
                value={landfillPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(landfillPercent)}
                showText={showText}
            />
            <Row
                iconSrc={policeIcon}
                label={t("CityMonitor.Police", "Polizei")}
                value={crimePercent.toFixed(0) + " %"}
                color={riskStatusColor(crimePercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_TRAFFIC}
                label={t("CityMonitor.TrafficFlow", "Verkehrsfluss")}
                value={trafficPercent.toFixed(0) + " %"}
                color={trafficStatusColor(trafficPercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_ELECTRICITY}
                label={t("CityMonitor.Electricity", "Strom")}
                value={electricityPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(electricityPercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_WATER}
                label={t("CityMonitor.WaterSewage", "Wasser / Abwasser")}
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
                label={t("CityMonitor.CarParking", "Parkplätze Auto")}
                value={parkingCarPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(parkingCarPercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_BICYCLE}
                label={t("CityMonitor.BikeParking", "Parkplätze Fahrrad")}
                value={parkingBikePercent.toFixed(0) + " %"}
                color={availabilityStatusColor(parkingBikePercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_POST}
                label={t("CityMonitor.Post", "Post")}
                value={postPercent.toFixed(0) + " %"}
                color={availabilityStatusColor(postPercent)}
                showText={showText}
            />
            <Row
                iconSrc={ICON_TOURISM}
                label={t("CityMonitor.Tourism", "Tourismus")}
                value={String(Math.max(0, Math.round(Number(tourists) || 0)))}
                color={STATUS_INFO}
                showText={showText}
            />
            <Row
                iconSrc={ICON_ATTRACTIVENESS}
                label={t("CityMonitor.Attractiveness", "Stadtattraktivität")}
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
    const availableInfoviews = useValue(infoview.infoviews$);
    const activeInfoview = useValue(infoview.activeInfoview$);

    const [hiddenIconIds, setHiddenIconIds] =
        useState<Set<string>>(new Set());

    useEffect(() => {
        try {
            const parsed = JSON.parse(hiddenIconsRaw || "[]");

            if (Array.isArray(parsed)) {
                const ids = parsed.filter(
                    (item): item is string =>
                        typeof item === "string"
                );
                const migrated = ids.filter((id) => id !== "garbage");
                if (ids.includes("garbage")) {
                    migrated.push("garbageProcessing", "landfill");
                }
                setHiddenIconIds(new Set(migrated));
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

        const add = (id: string) => {
            if (validIds.has(id) && !seen.has(id)) {
                seen.add(id);
                result.push(id);
            }
        };

        for (const id of ids) {
            if (id === "garbage") {
                add("garbageProcessing");
                add("landfill");
            } else {
                add(id);
            }
        }

        const insertAfter = (anchorId: string, id: string) => {
            if (seen.has(id)) {
                return;
            }
            const anchorIndex = result.indexOf(anchorId);
            if (anchorIndex >= 0) {
                result.splice(anchorIndex + 1, 0, id);
                seen.add(id);
            }
        };

        insertAfter("unemployment", "homeless");
        insertAfter("cemetery", "crematorium");
        insertAfter("landfill", "police");

        for (const id of ALL_ICON_IDS) {
            add(id);
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
        iconOrientationSetting === 0
            ? "vertical"
            : "horizontal";

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

    const dragHandleSize = 18;
    const dragHandleGap = 4;
    const showDragHandle =
        iconOnlyMode && !iconPositionLocked;

    const iconBarLengthWithHandleRem =
        iconBarLengthRem +
        (showDragHandle
            ? dragHandleSize +
            (displayedIconIdCount > 0
                ? dragHandleGap
                : 0)
            : 0);

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
            ? Math.max(
                iconSize,
                iconBarLengthWithHandleRem
            )
            : Math.max(
                iconSize,
                showDragHandle
                    ? dragHandleSize
                    : 0
            )
        : minimized
            ? 52
            : clamp(userWidth ?? DEFAULT_W, MIN_W, 400);

    // Gespeicherten UI-Zustand laden
    const applied = useRef(false);
    const hasValidSavedPosition = useRef(false);
    const defaultPositionApplied = useRef(false);

    useEffect(() => {
        if (applied.current || !savedRaw) return;

        applied.current = true;

        try {
            const s = JSON.parse(savedRaw);

            const hasValidPosition =
                s.pos &&
                typeof s.pos.x === "number" &&
                typeof s.pos.y === "number" &&
                Number.isFinite(s.pos.x) &&
                Number.isFinite(s.pos.y) &&
                s.pos.x >= 0 &&
                s.pos.y >= 0;

            if (hasValidPosition) {
                hasValidSavedPosition.current = true;
                posRef.current = s.pos;
                setPos(s.pos);
            }

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

    // Ohne gespeicherte UI-Position startet die kompakte Leiste
    // horizontal zentriert und etwas unterhalb der Bildschirmmitte.
    useEffect(() => {
        if (
            defaultPositionApplied.current ||
            hasValidSavedPosition.current ||
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

        const targetCenterY =
            viewportHeight * 0.58;

        const maxX =
            Math.max(0, viewportWidth - rect.width);
        const maxY =
            Math.max(0, viewportHeight - rect.height);

        const targetXPx = clamp(
            (viewportWidth - rect.width) / 2,
            0,
            maxX
        );
        const targetYPx = clamp(
            targetCenterY - rect.height / 2,
            0,
            maxY
        );

        const nextPos = {
            x: targetXPx / pxPerRem,
            y: targetYPx / pxPerRem,
        };

        defaultPositionApplied.current = true;
        posRef.current = nextPos;
        setPos(nextPos);
    }, [
        savedRaw,
        iconOnlyMode,
        visible,
        widthRem,
        iconOrientation,
        displayedIconIdCount,
        iconSize,
        iconGap,
    ]);

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
                    "CityMonitor.Unemployment",
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
                                "CityMonitor.UnemploymentRate",
                                "Quote"
                            ),
                            value:
                                data.unemploymentRate.toFixed(1) + " %",
                        },
                        {
                            label: t(
                                "CityMonitor.Unemployed",
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
                id: "homeless",
                service: "homeless",
                iconSrc: homelessIcon,
                label: t(
                    "CityMonitor.Homeless",
                    "Obdachlosigkeit"
                ),
            },
            {
                id: "jobs",
                iconSrc: work,
                label: t(
                    "CityMonitor.Jobs",
                    "Arbeitsplätze"
                ),
                details: compactValues
                    ? [{ value: String(data.openJobs) }]
                    : [
                        {
                            label: t(
                                "CityMonitor.Open",
                                "Offen"
                            ),
                            value: String(data.openJobs),
                        },
                        {
                            label: t(
                                "CityMonitor.Total",
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
                    "CityMonitor.ElementarySchool",
                    "Grundschule"
                ),
                details: compactValues
                    ? [{ value: String(data.elementaryFreeSlots) }]
                    : [
                        {
                            label: t(
                                "CityMonitor.Free",
                                "Frei"
                            ),
                            value: String(data.elementaryFreeSlots),
                        },
                        {
                            label: t(
                                "CityMonitor.Total",
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
                    "CityMonitor.HighSchool",
                    "Oberschule"
                ),
                details: compactValues
                    ? [{ value: String(data.highFreeSlots) }]
                    : [
                        {
                            label: t(
                                "CityMonitor.Free",
                                "Frei"
                            ),
                            value: String(data.highFreeSlots),
                        },
                        {
                            label: t(
                                "CityMonitor.Total",
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
                    "CityMonitor.College",
                    "College"
                ),
                details: compactValues
                    ? [{ value: String(data.collegeFreeSlots) }]
                    : [
                        {
                            label: t(
                                "CityMonitor.Free",
                                "Frei"
                            ),
                            value: String(data.collegeFreeSlots),
                        },
                        {
                            label: t(
                                "CityMonitor.Total",
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
                    "CityMonitor.University",
                    "Universität"
                ),
                details: compactValues
                    ? [{ value: String(data.uniFreeSlots) }]
                    : [
                        {
                            label: t(
                                "CityMonitor.Free",
                                "Frei"
                            ),
                            value: String(data.uniFreeSlots),
                        },
                        {
                            label: t(
                                "CityMonitor.Total",
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
                    "CityMonitor.Fire",
                    "Feuerwehr"
                ),
            },
            {
                id: "healthcare",
                service: "healthcare",
                iconSrc: ICON_HEALTHCARE,
                label: t(
                    "CityMonitor.Healthcare",
                    "Krankenhaus"
                ),
            },
            {
                id: "cemetery",
                service: "cemetery",
                iconSrc: ICON_CEMETERY,
                label: t(
                    "CityMonitor.Cemetery",
                    "Friedhof"
                ),
            },
            {
                id: "crematorium",
                service: "crematorium",
                iconSrc: crematoriumIcon,
                label: t(
                    "CityMonitor.Crematorium",
                    "Krematorium"
                ),
            },
            {
                id: "garbageProcessing",
                service: "garbageProcessing",
                iconSrc: ICON_GARBAGE,
                label: t(
                    "CityMonitor.GarbageProcessing",
                    "Müllverarbeitung"
                ),
            },
            {
                id: "landfill",
                service: "landfill",
                iconSrc: landfillIcon,
                label: t(
                    "CityMonitor.Landfill",
                    "Deponie"
                ),
            },
            {
                id: "police",
                service: "police",
                iconSrc: policeIcon,
                label: t(
                    "CityMonitor.Police",
                    "Polizei"
                ),
            },
            {
                id: "traffic",
                service: "traffic",
                iconSrc: ICON_TRAFFIC,
                label: t(
                    "CityMonitor.TrafficFlow",
                    "Verkehrsfluss"
                ),
            },
            {
                id: "electricity",
                service: "electricity",
                iconSrc: ICON_ELECTRICITY,
                label: t(
                    "CityMonitor.Electricity",
                    "Strom"
                ),
            },
            {
                id: "water",
                service: "water",
                iconSrc: ICON_WATER,
                label: t(
                    "CityMonitor.WaterSewage",
                    "Wasser / Abwasser"
                ),
            },
            {
                id: "parkingCar",
                service: "parkingCar",
                iconSrc: ICON_PARKING,
                label: t(
                    "CityMonitor.CarParking",
                    "Parkplätze Auto"
                ),
            },
            {
                id: "parkingBike",
                service: "parkingBike",
                iconSrc: ICON_BICYCLE,
                label: t(
                    "CityMonitor.BikeParking",
                    "Parkplätze Fahrrad"
                ),
            },
            {
                id: "post",
                service: "post",
                iconSrc: ICON_POST,
                label: t(
                    "CityMonitor.Post",
                    "Post"
                ),
            },
            {
                id: "tourism",
                service: "tourism",
                iconSrc: ICON_TOURISM,
                label: t(
                    "CityMonitor.Tourism",
                    "Tourismus"
                ),
            },
            {
                id: "attractiveness",
                service: "attractiveness",
                iconSrc: ICON_ATTRACTIVENESS,
                label: t(
                    "CityMonitor.Attractiveness",
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

    const infoviewSearchTerms: Record<string, string[]> = {
        unemployment: ["population"],
        homeless: ["population"],
        jobs: ["population"],
        elementary: ["education"],
        highschool: ["education"],
        college: ["education"],
        university: ["education"],
        fire: ["fire"],
        healthcare: ["healthcare", "health", "deathcare"],
        cemetery: ["healthcare", "deathcare", "health"],
        crematorium: ["healthcare", "deathcare", "health"],
        garbageProcessing: ["garbage", "waste"],
        landfill: ["garbage", "waste"],
        police: ["police", "crime"],
        traffic: ["traffic"],
        electricity: ["electricity"],
        water: ["water", "sewage"],
        // Parkplätze liegen im Spiel in zwei getrennten Infoviews
        parkingCar: ["roads", "road", "streets", "street"],
        parkingBike: ["bicycles", "bicycle", "bike", "cycling"],
        post: ["post", "mail"],
        tourism: ["tourism"],
        attractiveness: ["tourism", "attraction"],
    };

    const normalizeInfoviewText = (
        value: string | null | undefined
    ) =>
        (value ?? "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

    const findInfoviewForIcon = (iconId: string) => {
        const terms =
            infoviewSearchTerms[iconId]?.map(
                normalizeInfoviewText
            ) ?? [];

        if (terms.length === 0) {
            return undefined;
        }

        let bestMatch:
            | (typeof availableInfoviews)[number]
            | undefined;
        let bestScore = 0;

        for (const view of availableInfoviews) {
            if (view.locked) {
                continue;
            }

            const id = normalizeInfoviewText(view.id);
            const uiTag = normalizeInfoviewText(view.uiTag);
            const icon = normalizeInfoviewText(view.icon);

            let score = 0;

            for (const term of terms) {
                if (!term) {
                    continue;
                }

                if (id === term) {
                    score = Math.max(score, 100);
                } else if (id.includes(term)) {
                    score = Math.max(score, 70);
                }

                if (uiTag.includes(term)) {
                    score = Math.max(score, 45);
                }

                if (icon.includes(term)) {
                    score = Math.max(score, 30);
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestMatch = view;
            }
        }

        return bestMatch;
    };

    const toggleInfoviewForIcon = (iconId: string) => {
        const target = findInfoviewForIcon(iconId);

        if (!target) {
            return;
        }

        if (activeInfoview?.id === target.id) {
            infoview.clearActiveInfoview();
            return;
        }

        infoview.setActiveInfoview(target.entity);
    };

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
                title={t("CityMonitor.Toggle", "Stadt Monitor ein-/ausblenden")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36rem",
                    height: "36rem",
                    margin: "0 4rem",
                    padding: 0,
                    borderRadius: "4rem",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    backgroundColor: visible
                        ? "rgba(76,188,226,0.95)"
                        : "rgba(60,76,86,0.92)",
                    opacity: visible ? 1 : 0.68,
                    transition:
                        "background-color 120ms ease, opacity 120ms ease",
                }}
            >
                <Icon
                    path={P_CITY_MONITOR}
                    size={40}
                    color="#fff"
                />
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
                                style={{
                                    width:
                                        (iconOrientation === "horizontal"
                                            ? Math.max(
                                                iconSize,
                                                iconBarLengthWithHandleRem
                                            )
                                            : Math.max(
                                                iconSize,
                                                showDragHandle
                                                    ? dragHandleSize
                                                    : 0
                                            )) + "rem",
                                    height:
                                        iconOrientation === "horizontal"
                                            ? Math.max(
                                                iconSize,
                                                showDragHandle
                                                    ? dragHandleSize
                                                    : 0
                                            ) + "rem"
                                            : undefined,
                                    display: "flex",
                                    flexDirection:
                                        iconOrientation === "horizontal"
                                            ? "row"
                                            : "column",
                                    alignItems: "center",
                                    padding: 0,
                                    cursor: "default",
                                    overflow: "visible",
                                }}
                            >
                                {showDragHandle && (
                                    <DragHandle
                                        orientation={iconOrientation}
                                        title={t(
                                            "CityMonitor.Drag",
                                            "Griff ziehen, um Leiste zu verschieben"
                                        )}
                                        onMouseDown={onHeaderDown}
                                    />
                                )}

                                {displayedIconItems.map(
                                    (item, index) => {
                                        const isHidden =
                                            hiddenIconIds.has(item.id);

                                        const currentIconOpacity =
                                            iconVisibilityEditMode
                                                ? isHidden
                                                    ? 0.45
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
                                                    "CityMonitor.ShowIcon",
                                                    "Rechtsklick: Symbol einblenden"
                                                )
                                                : t(
                                                    "CityMonitor.HideIcon",
                                                    "Rechtsklick: Symbol ausblenden"
                                                );
                                        const visibilityHint =
                                            t(
                                                "CityMonitor.ReorderIcon",
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
                                                                "CityMonitor.Hidden",
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
                                                    onActivate={
                                                        iconVisibilityEditMode
                                                            ? undefined
                                                            : () =>
                                                                toggleInfoviewForIcon(
                                                                    item.id
                                                                )
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
                                                onActivate={
                                                    iconVisibilityEditMode
                                                        ? undefined
                                                        : () =>
                                                            toggleInfoviewForIcon(
                                                                item.id
                                                            )
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
                                        title={t("CityMonitor.CollapseExpand", "Ein-/ausklappen")}
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
                                                label={t("CityMonitor.Unemployed", "Arbeitslose")}
                                                value={String(data.unemployedCount)}
                                                showText={showText}
                                            />
                                        )}

                                        <Row
                                            iconSrc={stat}
                                            label={t("CityMonitor.UnemploymentRate", "Quote")}
                                            value={data.unemploymentRate.toFixed(1) + " %"}
                                            color={rateColor}
                                            showText={showText}
                                        />

                                        <HomelessRow
                                            showText={showText}
                                            compactValues={compactValues}
                                            t={t}
                                        />

                                        <Row
                                            iconSrc={work}
                                            label={t("CityMonitor.OpenJobs", "Offene Stellen")}
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
                                            label={t("CityMonitor.ElementarySchool", "Grundschule")}
                                            students={data.elementaryStudents}
                                            free={data.elementaryFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />

                                        <SchoolRow
                                            iconSrc={edu2}
                                            label={t("CityMonitor.HighSchool", "Oberschule")}
                                            students={data.highStudents}
                                            free={data.highFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />

                                        <SchoolRow
                                            iconSrc={edu3}
                                            label={t("CityMonitor.College", "College")}
                                            students={data.collegeStudents}
                                            free={data.collegeFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />

                                        <SchoolRow
                                            iconSrc={edu4}
                                            label={t("CityMonitor.University", "Universität")}
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
                                            title={t("CityMonitor.Resize", "Breite ziehen")}
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
                                            title={t("CityMonitor.Resize", "Breite ziehen")}
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
