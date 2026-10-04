import { useState, useRef, useEffect } from "react";
import styles from "./city-monitor.module.scss";

export interface SurfaceAppearance {
    red: number; green: number; blue: number;
    transparency: number; blur: number;
}
export interface WindowAppearance {
    window: SurfaceAppearance;
    header: SurfaceAppearance;
    editorPosition: { x: number; y: number } | null;
}
export const defaultAppearance: WindowAppearance = {
    window: { red: 25, green: 43, blue: 57, transparency: 80, blur: 10 },
    header: { red: 12, green: 30, blue: 44, transparency: 70, blur: 10 },
    editorPosition: null,
};
const bounded = (value: unknown, fallback: number, max: number) =>
    typeof value === "number" && Number.isFinite(value)
        ? Math.max(0, Math.min(max, Math.round(value))) : fallback;
export function normalizeAppearance(raw: any): WindowAppearance {
    const surface = (value: any, defaults: SurfaceAppearance): SurfaceAppearance => ({
        red: bounded(value?.red, defaults.red, 255),
        green: bounded(value?.green, defaults.green, 255),
        blue: bounded(value?.blue, defaults.blue, 255),
        transparency: bounded(value?.transparency, defaults.transparency, 100),
        blur: bounded(value?.blur, defaults.blur, 30),
    });
    const p = raw?.editorPosition;
    return {
        window: surface(raw?.window, defaultAppearance.window),
        header: surface(raw?.header, defaultAppearance.header),
        editorPosition: p && Number.isFinite(p.x) && Number.isFinite(p.y)
            && p.x >= 0 && p.y >= 0 ? { x: p.x, y: p.y } : null,
    };
}
export const surfaceColor = (value: SurfaceAppearance) =>
    `rgb(${value.red},${value.green},${value.blue})`;

// Keep blur elements and their ancestors fully opaque. Background alpha controls
// transparency without creating a separate Cohtml backdrop root.
export const backdropBlurClass = (strength: number) =>
    styles[`blur${bounded(strength, 15, 30)}`];

export function AppearanceBackdrop({ value, panelClass, header = false }: {
    value: SurfaceAppearance; panelClass: string; header?: boolean;
}) {
    const alpha = 1 - bounded(value.transparency, 0, 100) / 100;
    return <div aria-hidden="true"
        className={`${panelClass} ${styles.appearanceBackdrop} ${header ? styles.headerBackdrop : styles.bodyBackdrop} ${backdropBlurClass(alpha > 0 ? value.blur : 0)}`}
        style={{ backgroundColor: `rgba(${value.red},${value.green},${value.blue},${0.93 * alpha})` }}>
        <div className={styles.surfaceTint}
            style={{ backgroundColor: `rgba(${value.red},${value.green},${value.blue},${0.25 * alpha})` }} />
    </div>;
}

type Translate = (key: string, fallback: string) => string;
function AppearanceSlider({ label, value, max, onChange }: {
    label: string; value: number; max: number; onChange: (value: number) => void;
}) {
    const track = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(String(value));
    const editing = useRef(false);
    const cancelled = useRef(false);
    const active = useRef(false);
    const updateRef = useRef(onChange);
    updateRef.current = onChange;
    useEffect(() => { if (!editing.current) setText(String(value)); }, [value]);
    useEffect(() => {
        const update = (event: MouseEvent) => {
            if (!active.current || !track.current) return;
            event.preventDefault();
            const rect = track.current.getBoundingClientRect();
            if (rect.width > 0) updateRef.current(Math.round(Math.max(0, Math.min(1,
                (event.clientX - rect.left) / rect.width)) * max));
        };
        const stop = () => { active.current = false; };
        window.addEventListener("mousemove", update);
        window.addEventListener("mouseup", stop);
        return () => { window.removeEventListener("mousemove", update); window.removeEventListener("mouseup", stop); };
    }, [max]);
    const commit = () => {
        editing.current = false;
        if (cancelled.current) { cancelled.current = false; setText(String(value)); return; }
        const n = Number(text.trim().replace(",", "."));
        if (text.trim() && Number.isFinite(n)) onChange(Math.round(Math.max(0, Math.min(max, n))));
        else setText(String(value));
    };
    return <div className={styles.appearanceRow}>
        <span>{label}</span>
        <div className={styles.appearanceSlider} role="slider" aria-label={label}
            aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} tabIndex={0}
            onMouseDown={event => {
                if (event.button !== 0 || !track.current) return;
                event.preventDefault(); event.stopPropagation(); active.current = true;
                const rect = track.current.getBoundingClientRect();
                if (rect.width > 0) onChange(Math.round(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * max));
            }}
            onKeyDown={event => {
                const step = event.shiftKey ? 10 : 1;
                let next = value;
                if (event.key === "ArrowRight" || event.key === "ArrowUp") next += step;
                else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next -= step;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = max;
                else return;
                event.preventDefault(); event.stopPropagation(); onChange(Math.max(0, Math.min(max, next)));
            }}>
            <div ref={track} className={styles.appearanceTrack}>
                <div className={styles.appearanceFill} style={{ width: `${value / max * 100}%` }} />
                <div className={styles.appearanceThumb} style={{ left: `${value / max * 100}%` }} />
            </div>
        </div>
        <input aria-label={label} value={text} onFocus={() => { editing.current = true; cancelled.current = false; }}
            onChange={event => setText(event.target.value)} onBlur={commit}
            onKeyDown={event => {
                event.stopPropagation();
                if (event.key === "Enter") event.currentTarget.blur();
                if (event.key === "Escape") { cancelled.current = true; event.currentTarget.blur(); }
            }} />
    </div>;
}

export function AppearanceEditor({ value, panelClass, initialPosition, t, onChange, onClose }: {
    value: WindowAppearance; panelClass: string; initialPosition: { x: number; y: number };
    t: Translate; onChange: (value: WindowAppearance) => void; onClose: () => void;
}) {
    const [target, setTarget] = useState<"window" | "header">("window");
    const [position, setPosition] = useState(value.editorPosition ?? initialPosition);
    const panel = useRef<HTMLDivElement>(null);
    const positionRef = useRef(position);
    const valueRef = useRef(value); valueRef.current = value;
    const changeRef = useRef(onChange); changeRef.current = onChange;
    const drag = useRef<{ mx: number; my: number; x: number; y: number; scale: number } | null>(null);
    useEffect(() => {
        const move = (event: MouseEvent) => {
            const d = drag.current;
            if (!d) return;
            event.preventDefault();
            const scale = d.scale;
            const width = panel.current?.getBoundingClientRect().width ?? 320 * scale;
            const height = panel.current?.getBoundingClientRect().height ?? 340 * scale;
            const next = { x: Math.max(0, Math.min((window.innerWidth - width) / scale, d.x + (event.clientX - d.mx) / scale)),
                y: Math.max(0, Math.min((window.innerHeight - height) / scale, d.y + (event.clientY - d.my) / scale)) };
            positionRef.current = next; setPosition(next);
        };
        const up = () => {
            if (!drag.current) return;
            drag.current = null;
            changeRef.current({ ...valueRef.current, editorPosition: positionRef.current });
        };
        window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
        return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    }, []);
    useEffect(() => {
        const rect = panel.current?.getBoundingClientRect();
        if (!rect) return;
        const scale = rect.width / 320 || 1;
        const next = { x: Math.max(0, Math.min(positionRef.current.x, (window.innerWidth - rect.width) / scale)),
            y: Math.max(0, Math.min(positionRef.current.y, (window.innerHeight - rect.height) / scale)) };
        positionRef.current = next; setPosition(next);
    }, []);
    const selected = value[target];
    const setSurface = (surface: SurfaceAppearance) => onChange({ ...value, [target]: surface });
    const hex = (n: number) => n.toString(16).padStart(2, "0");
    const [hexText, setHexText] = useState("");
    const hexEditing = useRef(false);
    useEffect(() => { if (!hexEditing.current) setHexText(`#${hex(selected.red)}${hex(selected.green)}${hex(selected.blue)}`.toUpperCase()); }, [target, selected]);
    const presets = [0x192b39, 0x0c1e2c, 0x444b50, 0x737b80, 0x466779, 0xa69b83, 0xffffff, 0x000000];
    const setHexColor = (color: number) => setSurface({ ...selected, red: color >> 16 & 255, green: color >> 8 & 255, blue: color & 255 });
    const commitHex = () => {
        hexEditing.current = false;
        const text = hexText.trim().replace(/^#/, "");
        if (/^[0-9a-f]{6}$/i.test(text)) setHexColor(parseInt(text, 16));
        else setHexText(`#${hex(selected.red)}${hex(selected.green)}${hex(selected.blue)}`.toUpperCase());
    };
    return <div ref={panel} className={`${panelClass} ${styles.appearanceEditor}`}
        style={{ left: `${position.x}rem`, top: `${position.y}rem` }}>
        <div className={styles.appearanceHeader} onMouseDown={event => {
            if (event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
            event.preventDefault();
            const rect = panel.current?.getBoundingClientRect();
            drag.current = { mx: event.clientX, my: event.clientY, x: position.x, y: position.y, scale: rect ? rect.width / 320 : 1 };
        }}>
            <strong>{t("CityMonitor.AppearanceTitle", "Fenster anpassen")}</strong>
            <button onClick={onClose} title={t("CityMonitor.Close", "Schließen")}>×</button>
        </div>
        <div className={styles.appearanceContent}>
            <div className={styles.appearanceTabs}>
                {(["window", "header"] as const).map(key => <button key={key} aria-pressed={target === key}
                    onClick={() => { hexEditing.current = false; setTarget(key); }}>
                    {t(key === "window" ? "CityMonitor.AppearanceWindow" : "CityMonitor.AppearanceHeader", key === "window" ? "Fenster" : "Obere Leiste")}</button>)}
            </div>
            <div className={styles.appearancePreview}>
                <span style={{ backgroundColor: surfaceColor(selected), opacity: 1 - selected.transparency / 100 }} />
                <input aria-label={t("CityMonitor.AppearanceHex", "Hex-Farbe")} value={hexText}
                    onFocus={() => { hexEditing.current = true; }} onChange={event => setHexText(event.target.value)}
                    onBlur={commitHex} onKeyDown={event => { event.stopPropagation(); if (event.key === "Enter") event.currentTarget.blur(); }} />
            </div>
            {([
                ["red", "CityMonitor.AppearanceRed", "Rot", 255],
                ["green", "CityMonitor.AppearanceGreen", "Grün", 255],
                ["blue", "CityMonitor.AppearanceBlue", "Blau", 255],
                ["transparency", "CityMonitor.AppearanceTransparency", "Transparenz", 100],
                ["blur", "CityMonitor.AppearanceBlur", "Blur", 30],
            ] as const).map(([key, label, fallback, max]) => <AppearanceSlider key={key} label={t(label, fallback)}
                value={selected[key]} max={max} onChange={next => setSurface({ ...selected, [key]: next })} />)}
            <div className={styles.appearancePresets}>{presets.map(color => <button key={color}
                aria-label={`#${color.toString(16).padStart(6, "0")}`} style={{ backgroundColor: `#${color.toString(16).padStart(6, "0")}` }} onClick={() => setHexColor(color)} />)}</div>
            <button className={styles.appearanceReset} onClick={() => setSurface({ ...defaultAppearance[target] })}>
                {t("CityMonitor.AppearanceReset", "Bereich zurücksetzen")}</button>
        </div>
    </div>;
}
