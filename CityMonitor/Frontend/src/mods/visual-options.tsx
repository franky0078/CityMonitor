import { useEffect, useRef, useState } from "react";
import { bindValue, useValue, trigger } from "cs2/api";
import { AppearanceBackdrop, AppearanceSlider, type WindowAppearance } from "./appearance-editor";
import styles from "./city-monitor.module.scss";

type Translate = (key: string, fallback: string) => string;
export const setVisualOption = (key: string, value: number) => trigger("cityMonitor", "setVisualOption", key, Math.round(value));
const definitions = [
    ["IconOnlyMode", "toggle"], ["ShowLabels", "toggle"], ["NormalRowReorder", "toggle"],
    ["CompactValues", "toggle"], ["IconOrientation", "orientation"], ["IconPositionLocked", "toggle"],
    ["IconVisibilityEditMode", "toggle"], ["IconSize", "slider", 22, 50], ["IconGap", "slider", 0, 20],
    ["ShowStatusRing", "toggle"], ["SegmentedStatusRing", "toggle"], ["ShowIconValues", "toggle"],
    ["IconValuePosition", "position"], ["IconBackgroundTransparency", "slider", 0, 100],
    ["IconBackgroundDarkening", "slider", 0, 100], ["IconOpaqueOnHover", "toggle"], ["AllIconsOpaqueOnHover", "toggle"],
    ["WarningOpaque", "toggle"], ["CriticalEnlargement", "toggle"], ["IconBarBackground", "toggle"],
    ["IconBarBlur", "toggle"], ["IconBarBlurStrength", "slider", 0, 30], ["IconBarTransparency", "slider", 0, 100],
] as const;
const bindings = Object.fromEntries(definitions.map(([key]) => [key, bindValue<any>("cityMonitor", key[0].toLowerCase() + key.slice(1))]));
function Control({ definition, t }: { definition: typeof definitions[number]; t: Translate }) {
    const [key, kind] = definition;
    const value = useValue(bindings[key]);
    const label = t(`CityMonitor.Visual.${key}`, key);
    const change = (next: number) => setVisualOption(key, next);
    if (kind === "slider") {
        const min = definition[2], max = definition[3];
        return <div title={t(`CityMonitor.Visual.${key}.Description`, "")}>
            <AppearanceSlider label={label} value={Number(value)} max={max} min={min} onChange={change} />
        </div>;
    }
    const choices = kind === "orientation" ? [[0,"Vertical"],[1,"Horizontal"]] : [[0,"Below"],[1,"Left"],[2,"Right"]];
    return <div className={styles.visualOptionRow} title={t(`CityMonitor.Visual.${key}.Description`, "")}>
        <span>{label}</span>
        {kind === "toggle" ? <button role="checkbox" aria-checked={!!value} onClick={() => change(value ? 0 : 1)} aria-label={label}>
                <svg aria-hidden="true" viewBox="0 0 20 20" style={{ width: "16rem", height: "16rem", display: "block", pointerEvents: "none" }}>
                    {value ? <path d="M4 10 L8 14 L16 5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        : <path d="M5 10 H15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
                </svg>
            </button>
            : <div className={styles.visualChoices}>{choices.map(([id, text]) => <button key={id} aria-pressed={Number(value) === id}
                onClick={() => change(Number(id))}>{t(`CityMonitor.Visual.${text}`, String(text))}</button>)}</div>}
    </div>;
}
export function VisualOptions({ open, t, panelClass, appearance, onClose, onColors }: {
    open: boolean; t: Translate; panelClass: string; appearance: WindowAppearance;
    onClose: () => void; onColors: () => void;
}) {
    const iconMode = !!useValue(bindings.IconOnlyMode);
    const normalKeys = new Set(["CompactValues", "ShowLabels", "IconVisibilityEditMode", "NormalRowReorder"]);
    const visibleDefinitions = definitions.filter(([key]) => key === "IconOnlyMode" ||
        (iconMode ? key !== "ShowLabels" && key !== "NormalRowReorder" : normalKeys.has(key)));
    const [pos, setPos] = useState({x: 80, y: 80});
    const posRef = useRef(pos); posRef.current = pos;
    const panel = useRef<HTMLDivElement>(null);
    const drag = useRef<{mx:number;my:number;x:number;y:number;scale:number}|null>(null);
    useEffect(() => {
        const move = (event: MouseEvent) => {
            const d = drag.current, rect = panel.current?.getBoundingClientRect();
            if (!d || !rect) return;
            event.preventDefault();
            setPos({x: Math.max(0, Math.min((window.innerWidth-rect.width)/d.scale, d.x+(event.clientX-d.mx)/d.scale)),
                y: Math.max(0, Math.min((window.innerHeight-rect.height)/d.scale, d.y+(event.clientY-d.my)/d.scale))});
        };
        const stop = () => { drag.current = null; };
        window.addEventListener("mousemove", move); window.addEventListener("mouseup", stop); window.addEventListener("blur", stop);
        return () => {window.removeEventListener("mousemove", move);window.removeEventListener("mouseup", stop);window.removeEventListener("blur", stop);};
    }, []);
    useEffect(() => { if (!open) drag.current = null; }, [open]);
    useEffect(() => {
        const resize = () => {
            const rect = panel.current?.getBoundingClientRect();
            if (rect && rect.width > 0) {
                const scale = rect.width / 420;
                setPos(current => ({x: Math.max(0, Math.min(current.x, (window.innerWidth - rect.width) / scale)),
                    y: Math.max(0, Math.min(current.y, (window.innerHeight - rect.height) / scale))}));
            }
        };
        // Wait for Cohtml to lay out the selected mode before clamping position.
        let frame = 0;
        if (open) frame = window.requestAnimationFrame(() => {
            frame = window.requestAnimationFrame(resize);
        });
        window.addEventListener("resize", resize);
        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
        };
    }, [open, iconMode]);
    if (!open) return null;
    const controls = <div className={styles.visualOptionsContent}>
        {visibleDefinitions.map(definition => <Control key={definition[0]} definition={definition} t={t} />)}
        {(iconMode ? ["ShowAllIcons", "ResetIconOrder"] : ["ShowAllNormalStats", "ResetNormalRowOrder"]).map(key => <button className={styles.appearanceReset} key={key}
            onClick={() => setVisualOption(key, 1)}>{t(`CityMonitor.Visual.${key}`, key)}</button>)}
    </div>;
    return <div ref={panel} className={styles.visualOptions} style={{left: `${pos.x}rem`, top: `${pos.y}rem`}}>
        <AppearanceBackdrop value={appearance.window} panelClass={panelClass} />
        <div className={styles.appearanceHeader} style={{position:"relative"}} onMouseDown={event => {
            if (event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
            event.preventDefault();event.stopPropagation();
            drag.current={mx:event.clientX,my:event.clientY,x:posRef.current.x,y:posRef.current.y,scale:(panel.current?.getBoundingClientRect().width ?? 420)/420};
        }}>
            <AppearanceBackdrop value={appearance.header} panelClass={panelClass} header />
            <strong style={{position:"relative"}}>{iconMode ? t("CityMonitor.Visual.Title", "Symbolleiste anpassen") : t("CityMonitor.Visual.NormalTitle", "Normalen Modus anpassen")}</strong>
            <button onClick={onColors} title={t("CityMonitor.AppearanceTitle", "Farben anpassen")} style={{position:"relative"}}>
                <svg viewBox="0 0 24 24" style={{width:"20rem",height:"20rem"}}><path d="M12 3a9 9 0 1 0 0 18h1a3 3 0 0 0 0-6h-1a2 2 0 0 1 0-4h4a5 5 0 0 0-4-8Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="9" r="1.5" fill="#ff6555"/><circle cx="10" cy="6" r="1.5" fill="#ffd84d"/><circle cx="15" cy="7" r="1.5" fill="#7cfc00"/><circle cx="6" cy="14" r="1.5" fill="#4da3ff"/></svg>
            </button>
            <button onClick={onClose} title={t("CityMonitor.Close", "Schließen")} style={{position:"relative"}} aria-label={t("CityMonitor.Close", "Schließen")}>
                <svg aria-hidden="true" viewBox="0 0 20 20" style={{width:"16rem",height:"16rem",display:"block",pointerEvents:"none"}}>
                    <path d="M5 5 L15 15 M15 5 L5 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
        </div>
        {controls}
    </div>;
}
