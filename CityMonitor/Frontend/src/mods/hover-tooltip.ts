import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";

const HOVER_DELAY_MS = 220;
const ROW_TOOLTIP_OFFSET_REM = 14;

export function useHoverTooltip(enabled: boolean, placement: "side" | "above") {
    const pending = useRef<number | undefined>();
    const [position, setPosition] = useState<CSSProperties | null>(null);

    const cancelPending = () => {
        window.clearTimeout(pending.current);
        pending.current = undefined;
    };

    useEffect(() => () => window.clearTimeout(pending.current), []);
    useEffect(() => {
        if (enabled) return;
        window.clearTimeout(pending.current);
        pending.current = undefined;
        setPosition(null);
    }, [enabled]);

    const hide = () => {
        cancelPending();
        setPosition(null);
    };

    const onMouseEnter = (event: MouseEvent<HTMLElement>) => {
        if (!enabled) return;
        cancelPending();
        const anchor = event.currentTarget;
        pending.current = window.setTimeout(() => {
            pending.current = undefined;
            const rect = anchor.getBoundingClientRect();
            const viewport = document.documentElement;
            if (placement === "side") {
                const opensLeft = rect.left > viewport.clientWidth - rect.right;
                const side = opensLeft
                    ? { right: "100%" }
                    : { left: "100%", marginLeft: `${ROW_TOOLTIP_OFFSET_REM}rem` };
                const centerY = rect.top + rect.height / 2;
                const nearTop = centerY < viewport.clientHeight * 0.25;
                const nearBottom = centerY > viewport.clientHeight * 0.75;
                const vertical = nearTop ? { top: 0 } : nearBottom ? { bottom: 0 } : { top: "50%" };
                const centered = !nearTop && !nearBottom;
                // Offset the left tooltip from the row edge using the same rem scale as the right.
                const transform = opensLeft
                    ? `translate(-${ROW_TOOLTIP_OFFSET_REM}rem, ${centered ? "-50%" : "0"})`
                    : centered ? "translateY(-50%)" : undefined;
                setPosition({ ...side, ...vertical, transform });
            } else {
                const above = rect.top > viewport.clientHeight - rect.bottom;
                setPosition(above
                    ? { left: 0, bottom: "100%", marginBottom: "5rem" }
                    : { left: 0, top: "100%", marginTop: "5rem" });
            }
        }, HOVER_DELAY_MS);
    };

    return { position: enabled ? position : null, onMouseEnter, onMouseLeave: hide, onMouseDownCapture: hide };
}
