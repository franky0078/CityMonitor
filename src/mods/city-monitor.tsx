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


const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const P_CHART = "M4 13h3v7H4v-7zm6.5-6h3v13h-3V7zM17 10h3v10h-3V10z";

const Icon = ({ path, src, size = 18, color = "#fff", white = false }:
    { path?: string; src?: string; size?: number; color?: string; white?: boolean }) => {
    const dim = size + "rem";
    if (src) {
        return (
            <img src={src} style={{ width: dim, height: dim, flexShrink: 0, filter: white ? "brightness(0) invert(1)" : undefined }} />
        );
    }
    return (
        <svg viewBox="0 0 24 24" width={dim} height={dim} fill={color} style={{ flexShrink: 0 }}>
            <path d={path} />
        </svg>
    );
};

const Row = ({ icon, iconSrc, label, value, color, showText }:
    { icon?: string; iconSrc?: string; label: string; value: string; color?: string; showText: boolean }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3rem 0" }}>
        <span style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <Tooltip tooltip={label}>
                <div style={{ display: "flex" }}>
                    <Icon path={icon} src={iconSrc} white={false} />
                </div>
            </Tooltip>
            {showText && <span style={{ whiteSpace: "nowrap", marginLeft: "8rem" }}>{label}</span>}
        </span>
        <span style={{ color: color ?? "#eee", fontWeight: "bold", whiteSpace: "nowrap" }}>{value}</span>
    </div>
);

const SchoolRow = ({ iconSrc, label, students, free, showText }:
    { iconSrc: string; label: string; students: number; free: number; showText: boolean }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3rem 0" }}>
        <span style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <Tooltip tooltip={label}>
                <div style={{ display: "flex" }}>
                    <Icon src={iconSrc} white={false} size={20} />
                </div>
            </Tooltip>
            {showText && <span style={{ whiteSpace: "nowrap", marginLeft: "8rem" }}>{label}</span>}
        </span>
        <span style={{ whiteSpace: "nowrap" }}>
            {students}{"\u00A0/\u00A0"}<span style={{ color: free <= 0 ? "#ff6b6b" : "#7CFC00" }}>{free}</span>
        </span>
    </div>
);

export const CityMonitorComponent = () => {
    const data = useValue(data$);
    const savedRaw = useValue(uiState$);

    const [pos, setPos] = useState({ x: 50, y: 100 });
    const [minimized, setMinimized] = useState(false);
    const [visible, setVisible] = useState(true);
    const [showText, setShowText] = useState(true);
    const [dragging, setDragging] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({ startMx: 0, startMy: 0, startX: 0, startY: 0, pxPerRem: 1 });
    const [userWidth, setUserWidth] = useState<number | null>(null);
    const [resizing, setResizing] = useState(false);
    //const resizeRef = useRef({ startMx: 0, startWidth: 0, pxPerRem: 1 });

    const [resizeHover, setResizeHover] = useState<"l" | "r" | null>(null);
    const resizeRef = useRef<{ startMx: number; startWidth: number; startX: number; pxPerRem: number; side: "l" | "r" }>(
        { startMx: 0, startWidth: 0, startX: 0, pxPerRem: 1, side: "r" }
    );

    const MIN_W = showText ? 200 : 80;   // Mindestbreite: mit Text breiter, kompakt schmaler
    const widthRem = minimized
        ? (showText ? 160 : 80)
        : clamp(userWidth ?? (showText ? 220 : 110), MIN_W, 400);

    // Gespeicherten Zustand einmalig anwenden (inkl. Off-Screen-Schutz)
    const applied = useRef(false);
    useEffect(() => {
        if (applied.current || !savedRaw) return;
        applied.current = true;
        try {
            const s = JSON.parse(savedRaw);
            let p = (s.pos && typeof s.pos.x === "number" && typeof s.pos.y === "number") ? s.pos : { x: 50, y: 100 };
            // rem-Raum entspricht ~1920x1080 – liegt das Fenster draußen, zurück auf Standard
            if (p.x < 0 || p.y < 0 || p.x > 1900 || p.y > 1050) p = { x: 50, y: 100 };
            setPos(p);
            if (typeof s.minimized === "boolean") setMinimized(s.minimized);
            if (typeof s.visible === "boolean") setVisible(s.visible);
            if (typeof s.showText === "boolean") setShowText(s.showText);
            if (typeof s.width === "number") setUserWidth(s.width);
        } catch { /* Defaults behalten */ }
    }, [savedRaw]);

    // Aktuellen Zustand an C# schicken (dort wird er gespeichert)
    const save = (override: Partial<{ pos: { x: number; y: number }; minimized: boolean; visible: boolean; showText: boolean; width: number | null }> = {}) => {
        const s = { pos, minimized, visible, showText, width: userWidth, ...override };
        try { trigger("cityMonitor", "saveUiState", JSON.stringify(s)); } catch { /* egal */ }
    };

    const onHeaderDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        let pxPerRem = 1;
        if (panelRef.current) {
            const w = panelRef.current.getBoundingClientRect().width;
            if (w > 0) pxPerRem = w / widthRem;
        }
        dragRef.current = { startMx: e.clientX, startMy: e.clientY, startX: pos.x, startY: pos.y, pxPerRem };
        setDragging(true);
    }, [pos.x, pos.y, widthRem]);

    const onOverlayMove = (e: React.MouseEvent) => {
        const f = dragRef.current.pxPerRem || 1;
        const dx = (e.clientX - dragRef.current.startMx) / f;
        const dy = (e.clientY - dragRef.current.startMy) / f;
        let nx = dragRef.current.startX + dx;
        let ny = dragRef.current.startY + dy;
        const wRem = (window.innerWidth || 0) / f;
        const hRem = (window.innerHeight || 0) / f;
        if (wRem > 0) nx = clamp(nx, 0, wRem - 60);
        if (hRem > 0) ny = clamp(ny, 0, hRem - 30);
        setPos({ x: nx, y: ny });
    };

    const startResize = (side: "l" | "r") => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        let pxPerRem = 1;
        if (panelRef.current) {
            const w = panelRef.current.getBoundingClientRect().width;
            if (w > 0) pxPerRem = w / widthRem;
        }
        resizeRef.current = { startMx: e.clientX, startWidth: widthRem, startX: pos.x, pxPerRem, side };
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
            setPos(p => ({ ...p, x: nx }));
        }
    };


    const onResizeUp = () => {
        setResizing(false);
        save({ width: userWidth, pos });
    };

    const onOverlayUp = () => {
        setDragging(false);
        save({ pos });
    };

    const toggleMin = () => setMinimized(p => { const n = !p; save({ minimized: n }); return n; });
    const toggleVisible = () => setVisible(p => { const n = !p; save({ visible: n }); return n; });
    const toggleText = () => setShowText(p => {
        const n = !p;
        setUserWidth(null);                 // zurück auf Standardbreite des Modus
        save({ showText: n, width: null });
        return n;
    });

    const rateColor = data && data.unemploymentRate > 10 ? "#ff6b6b" : "#7CFC00";

    const headerBtnStyle: React.CSSProperties = {
        background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
        cursor: "pointer", borderRadius: "3rem", padding: "0 6rem", lineHeight: "20rem",
    };

    return (
        <>
            <button
                onClick={toggleVisible}
                title="Stadt Monitor ein-/ausblenden"
                style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "36rem", height: "36rem", margin: "0 4rem",
                    borderRadius: "4rem", border: "none", cursor: "pointer", color: "#fff",
                    backgroundColor: visible ? "rgba(80,160,220,0.9)" : "rgba(60,70,80,0.9)",
                }}
            >
                <Icon path={P_CHART} size={22} />
            </button>

            {visible && data && (
                <Portal>
                    {(dragging || resizing) && (
                        <div
                            onMouseMove={dragging ? onOverlayMove : onResizeMove}
                            onMouseUp={dragging ? onOverlayUp : onResizeUp}
                            style={{
                                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                width: "100%", height: "100%", zIndex: 9999,
                                cursor: resizing ? "ew-resize" : "move",
                                pointerEvents: "auto",
                            }}
                        />
                    )}

                    <div ref={panelRef} style={{
                        position: "absolute",
                        top: pos.y + "rem",
                        left: pos.x + "rem",
                        width: widthRem + "rem",
                        boxSizing: "border-box",
                        backgroundColor: "rgba(20, 28, 35, 0.95)",
                        color: "#fff",
                        borderRadius: "4rem",
                        fontSize: "13rem",
                        fontFamily: "Noto Sans, sans-serif",
                        border: "1rem solid rgba(255,255,255,0.1)",
                        boxShadow: "0 4rem 15rem rgba(0,0,0,0.5)",
                        userSelect: "none",
                        zIndex: 100,
                        pointerEvents: "auto",
                    }}>
                        <div
                            onMouseDown={onHeaderDown}
                            style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "6rem 8rem", cursor: "move",
                                backgroundColor: "rgba(255,255,255,0.08)",
                                borderTopLeftRadius: "4rem", borderTopRightRadius: "4rem",
                                gap: "6rem",
                            }}
                        >
                            <span style={{ display: "flex", marginLeft: "auto" }}>
                                <button onClick={toggleText} onMouseDown={(e) => e.stopPropagation()}
                                    title="Text ein-/ausblenden" style={headerBtnStyle}>
                                    {showText ? "T−" : "T+"}
                                </button>
                                <button onClick={toggleMin} onMouseDown={(e) => e.stopPropagation()}
                                    title="Ein-/ausklappen" style={{ ...headerBtnStyle, marginLeft: "4rem" }}>
                                    {minimized ? "▼" : "▲"}
                                </button>
                            </span>
                        </div>

                        {!minimized && (
                            <div style={{ padding: "10rem" }}>
                                <Row iconSrc={alos} label="Arbeitslose" value={String(data.unemployedCount)} showText={showText} />
                                <Row iconSrc={stat} label="Quote" value={data.unemploymentRate.toFixed(1) + " %"} color={rateColor} showText={showText} />
                                <Row iconSrc={work} label="Offene Stellen" value={`${data.openJobs} / ${data.totalJobSlots}`} showText={showText} />

                                <div style={{ height: "1rem", background: "rgba(255,255,255,0.1)", margin: "8rem 0" }} />

                                <SchoolRow iconSrc={edu1} label="Grundschule" students={data.elementaryStudents} free={data.elementaryFreeSlots} showText={showText} />
                                <SchoolRow iconSrc={edu2} label="Oberschule" students={data.highStudents} free={data.highFreeSlots} showText={showText} />
                                <SchoolRow iconSrc={edu3} label="College" students={data.collegeStudents} free={data.collegeFreeSlots} showText={showText} />
                                <SchoolRow iconSrc={edu4} label="Universität" students={data.uniStudents} free={data.uniFreeSlots} showText={showText} />
                            </div>
                        )}

                        {!minimized && (
                            <>
                                {/* linker Rand */}
                                <div
                                    onMouseDown={startResize("l")}
                                    onMouseEnter={() => setResizeHover("l")}
                                    onMouseLeave={() => setResizeHover(null)}
                                    title="Breite ziehen"
                                    style={{
                                        position: "absolute", top: 0, left: 0, height: "100%", width: "6rem",
                                        cursor: "ew-resize",
                                        backgroundColor: resizeHover === "l" ? "rgba(255,255,255,0.12)" : "transparent",
                                        borderTopLeftRadius: "4rem", borderBottomLeftRadius: "4rem",
                                    }}
                                />
                                {/* rechter Rand */}
                                <div
                                    onMouseDown={startResize("r")}
                                    onMouseEnter={() => setResizeHover("r")}
                                    onMouseLeave={() => setResizeHover(null)}
                                    title="Breite ziehen"
                                    style={{
                                        position: "absolute", top: 0, right: 0, height: "100%", width: "6rem",
                                        cursor: "ew-resize",
                                        backgroundColor: resizeHover === "r" ? "rgba(255,255,255,0.12)" : "transparent",
                                        borderTopRightRadius: "4rem", borderBottomRightRadius: "4rem",
                                    }}
                                />
                            </>
                        )}
                    </div>
                </Portal>
            )}
        </>
    );
};