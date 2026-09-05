import { useState, useRef, useCallback, useEffect } from "react";
import { bindValue, trigger, useValue } from "cs2/api";
import { Portal, Tooltip } from "cs2/ui";
import edu1 from "./images/Edu1.svg";
import edu2 from "./images/Edu2.svg";
import edu3 from "./images/Edu3.svg";
import edu4 from "./images/Edu4.svg";
import work from "./images/Workers.png";
import stat from "./images/CompanyProfit.png";
import alos from "./images/Population.png";

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
const iconBackgroundTransparency$ = bindValue<number>(
    "cityMonitor",
    "iconBackgroundTransparency"
);
const iconSize$ = bindValue<number>("cityMonitor", "iconSize");
const iconGap$ = bindValue<number>("cityMonitor", "iconGap");

const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

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


const STATUS_GREEN = "#7CFC00";
const STATUS_YELLOW = "#FFD84D";
const STATUS_RED = "#FF5A5A";

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

const StatusIcon = ({
    iconSrc,
    label,
    value,
    ringColor,
    hoverSide,
    iconOpacity,
    size,
    bottomGap,
}: {
    iconSrc: string;
    label: string;
    value: string;
    ringColor: string;
    hoverSide: "left" | "right";
    iconOpacity: number;
    size: number;
    bottomGap: number;
}) => {
    const [hovered, setHovered] = useState(false);

    const contentSize = Math.max(10, size - 4);
    const glyphSize = Math.max(12, Math.round(size * 0.60));
    const tooltipOffset = size + 6;

    return (
        <div
            style={{
                position: "relative",
                width: size + "rem",
                height: size + "rem",
                marginBottom: bottomGap + "rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                style={{
                    // Cohtml unterstützt box-sizing nicht zuverlässig.
                    // Inhaltsgröße + 2rem Rand je Seite = gewünschte Gesamtgröße.
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

            {hovered && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        ...(hoverSide === "right"
                            ? { left: tooltipOffset + "rem" }
                            : { right: tooltipOffset + "rem" }),
                        minWidth: "118rem",
                        padding: "6rem 9rem",
                        borderRadius: "6rem",
                        backgroundColor: "rgba(66, 72, 82, 0.97)",
                        border: "1rem solid rgba(255,255,255,0.16)",
                        color: "#fff",
                        pointerEvents: "none",
                        boxShadow: "0 4rem 12rem rgba(0,0,0,0.35)",
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
                    <div
                        style={{
                            color: "#fff",
                            fontSize: "14rem",
                            lineHeight: "17rem",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {value}
                    </div>
                </div>
            )}
        </div>
    );
};

export const CityMonitorComponent = () => {
    const data = useValue(data$);
    const savedRaw = useValue(uiState$);

    const showPanelSetting = useValue(showPanel$);
    const compactValues = useValue(compactValues$);
    const showText = useValue(showLabels$);
    const iconOnlyMode = useValue(iconOnlyMode$);
    const iconBackgroundTransparency = useValue(iconBackgroundTransparency$);
    const iconSizeSetting = useValue(iconSize$);
    const iconGapSetting = useValue(iconGap$);

    const iconSize = clamp(iconSizeSetting ?? 30, 22, 50);
    const iconGap = clamp(iconGapSetting ?? 5, 0, 20);

    // Der Slider steuert jetzt die Transparenz des kompletten Symbols:
    // Icon, Ring und dunkle Kreisfläche.
    // 0 % = vollständig sichtbar, 100 % = maximal transparent.
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

    // Automatische Breite passend zur aktuell gewählten Darstellung.
    // Ein manueller Resize bleibt möglich, wird aber beim Wechsel des
    // Darstellungsmodus wieder auf die passende Standardbreite gesetzt.
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

    // Im Symbolmodus ist das "Panel" nur noch ein transparenter Icon-Streifen.
    const widthRem = iconOnlyMode
        ? iconSize
        : minimized
            ? 52
            : clamp(userWidth ?? DEFAULT_W, MIN_W, 400);

    // Gespeicherten UI-Zustand einmalig anwenden.
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

            // Keine festen 1920x1080-Grenzen verwenden.
            // Auf 2560x1440 liegt eine korrekt am rechten Rand gespeicherte
            // Position deutlich über x=1900 und wurde früher deshalb verworfen.
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

            // Alte gespeicherte Breiten stammen noch vom breiteren Layout.
            // Erst Breiten ab Layout-Version 2 wiederverwenden.
            if (s.layoutVersion === 2 && typeof s.width === "number") {
                setUserWidth(s.width);
            }
        } catch {
            // Defaults beibehalten.
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
            // UI-State ist Komfortfunktion; Fehler hier dürfen das Panel nicht stoppen.
        }
    };

    // Wenn eine Anzeigeoption geändert wird, die Breite automatisch passend setzen.
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

    // Hover-Werte im Symbolmodus nach Möglichkeit auf der freien Bildschirmseite anzeigen.
    // Tooltip automatisch auf der Seite mit mehr Platz anzeigen.
    // panelRef liefert Pixelkoordinaten; dadurch funktioniert das unabhängig
    // von Auflösung und UI-Skalierung.
    const panelRect = panelRef.current?.getBoundingClientRect();
    const hoverSide: "left" | "right" =
        panelRect &&
            panelRect.left + panelRect.width / 2 > (window.innerWidth || 0) / 2
            ? "left"
            : "right";

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
                title="Stadt Monitor ein-/ausblenden"
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
                            // Ohne box-sizing: im normalen Modus 2rem für den
                            // linken + rechten 1rem-Rand vom Inhaltsmaß abziehen.
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
                                onMouseDown={onHeaderDown}
                                title="Zum Verschieben ziehen"
                                style={{
                                    width: iconSize + "rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    padding: 0,
                                    cursor: "move",
                                    overflow: "visible",
                                }}
                            >
                                <StatusIcon
                                    iconSrc={stat}
                                    label="Arbeitslosenquote"
                                    value={data.unemploymentRate.toFixed(1) + " %"}
                                    ringColor={unemploymentStatusColor(data.unemploymentRate)}
                                    hoverSide={hoverSide}
                                    iconOpacity={iconOpacity}
                                    size={iconSize}
                                    bottomGap={iconGap}
                                />

                                <StatusIcon
                                    iconSrc={work}
                                    label="Freie Arbeitsplätze"
                                    value={String(data.openJobs)}
                                    ringColor={openJobsStatusColor(data.openJobs, data.totalJobSlots)}
                                    hoverSide={hoverSide}
                                    iconOpacity={iconOpacity}
                                    size={iconSize}
                                    bottomGap={iconGap}
                                />

                                <StatusIcon
                                    iconSrc={edu1}
                                    label="Freie Grundschulplätze"
                                    value={String(data.elementaryFreeSlots)}
                                    ringColor={schoolStatusColor(data.elementaryFreeSlots, data.elementaryStudents)}
                                    hoverSide={hoverSide}
                                    iconOpacity={iconOpacity}
                                    size={iconSize}
                                    bottomGap={iconGap}
                                />

                                <StatusIcon
                                    iconSrc={edu2}
                                    label="Freie Oberschulplätze"
                                    value={String(data.highFreeSlots)}
                                    ringColor={schoolStatusColor(data.highFreeSlots, data.highStudents)}
                                    hoverSide={hoverSide}
                                    iconOpacity={iconOpacity}
                                    size={iconSize}
                                    bottomGap={iconGap}
                                />

                                <StatusIcon
                                    iconSrc={edu3}
                                    label="Freie Collegeplätze"
                                    value={String(data.collegeFreeSlots)}
                                    ringColor={schoolStatusColor(data.collegeFreeSlots, data.collegeStudents)}
                                    hoverSide={hoverSide}
                                    iconOpacity={iconOpacity}
                                    size={iconSize}
                                    bottomGap={iconGap}
                                />

                                <StatusIcon
                                    iconSrc={edu4}
                                    label="Freie Universitätsplätze"
                                    value={String(data.uniFreeSlots)}
                                    ringColor={schoolStatusColor(data.uniFreeSlots, data.uniStudents)}
                                    hoverSide={hoverSide}
                                    iconOpacity={iconOpacity}
                                    size={iconSize}
                                    bottomGap={0}
                                />
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
                                        title="Ein-/ausklappen"
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
                                                label="Arbeitslose"
                                                value={String(data.unemployedCount)}
                                                showText={showText}
                                            />
                                        )}

                                        <Row
                                            iconSrc={stat}
                                            label="Quote"
                                            value={data.unemploymentRate.toFixed(1) + " %"}
                                            color={rateColor}
                                            showText={showText}
                                        />

                                        <Row
                                            iconSrc={work}
                                            label="Offene Stellen"
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
                                            label="Grundschule"
                                            students={data.elementaryStudents}
                                            free={data.elementaryFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />

                                        <SchoolRow
                                            iconSrc={edu2}
                                            label="Oberschule"
                                            students={data.highStudents}
                                            free={data.highFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />

                                        <SchoolRow
                                            iconSrc={edu3}
                                            label="College"
                                            students={data.collegeStudents}
                                            free={data.collegeFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />

                                        <SchoolRow
                                            iconSrc={edu4}
                                            label="Universität"
                                            students={data.uniStudents}
                                            free={data.uniFreeSlots}
                                            showText={showText}
                                            compactValues={compactValues}
                                        />
                                    </div>
                                )}

                                {!minimized && (
                                    <>
                                        <div
                                            onMouseDown={startResize("l")}
                                            onMouseEnter={() => setResizeHover("l")}
                                            onMouseLeave={() => setResizeHover(null)}
                                            title="Breite ziehen"
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
                                            title="Breite ziehen"
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
