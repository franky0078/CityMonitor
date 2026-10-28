import { Children, Fragment, isValidElement, cloneElement, createContext, useEffect, useRef, useState } from "react";
import { bindValue, trigger, useValue } from "cs2/api";
import { useLocalization } from "cs2/l10n";

const order$ = bindValue<string>("cityMonitor", "normalRowOrder");
export const NormalRowContext = createContext({
    enabled: false, custom: false, order: [] as string[], dragging: null as string | null,
    hint: "", start: (_id: string) => {}, move: (_id: string) => {},
});

export function NormalRowLayout({ ids, enabled, className, children }: {
    ids: readonly string[]; enabled: boolean; className: string; children: React.ReactNode;
}) {
    const raw = useValue(order$);
    const { translate } = useLocalization();
    const [order, setOrder] = useState<string[]>([...ids]);
    const current = useRef(order);
    const dragged = useRef<string | null>(null);
    const [dragging, setDragging] = useState<string | null>(null);
    const container = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let saved: unknown = [];
        try { saved = JSON.parse(raw || "[]"); } catch { /* Invalid saved data uses defaults. */ }
        const valid = Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string" && ids.includes(id)) : [];
        const next = [...new Set([...valid, ...ids])];
        current.current = next; setOrder(next);
    }, [raw, ids]);
    const move = (id: string) => {
        const source = dragged.current;
        if (!enabled || !source || source === id) return;
        const next = [...current.current];
        const from = next.indexOf(source), to = next.indexOf(id);
        if (from < 0 || to < 0) return;
        next.splice(from, 1); next.splice(to, 0, source);
        current.current = next; setOrder(next);
    };
    const moveRef = useRef(move); moveRef.current = move;
    useEffect(() => {
        const finish = () => {
            if (!dragged.current) return;
            dragged.current = null; setDragging(null);
            trigger("cityMonitor", "saveNormalRowOrder", JSON.stringify(current.current));
        };
        // Cohtml may capture the mouse on the original row. Hit-test global movement
        // instead of relying on mouseenter firing on another row while dragging.
        const onMove = (event: MouseEvent) => {
            if (!dragged.current || !container.current) return;
            event.preventDefault();
            const rows = container.current.querySelectorAll<HTMLElement>("[data-normal-stat]");
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i], rect = row.getBoundingClientRect();
                if (rect.height <= 0 || event.clientY < rect.top || event.clientY > rect.bottom) continue;
                const id = row.getAttribute("data-normal-stat");
                if (!id || id === dragged.current) return;
                const from = current.current.indexOf(dragged.current), to = current.current.indexOf(id);
                // Only cross a row's midpoint, avoiding oscillation after DOM reordering.
                if ((to > from && event.clientY > rect.top + rect.height / 2) ||
                    (to < from && event.clientY < rect.top + rect.height / 2)) moveRef.current(id);
                return;
            }
        };
        if (!enabled) finish();
        window.addEventListener("mousemove", onMove, true);
        window.addEventListener("mouseup", finish, true);
        window.addEventListener("blur", finish);
        return () => {
            window.removeEventListener("mousemove", onMove, true);
            window.removeEventListener("mouseup", finish, true);
            window.removeEventListener("blur", finish); finish();
        };
    }, [enabled]);
    const custom = order.some((id, index) => id !== ids[index]);
    const flatten = (nodes: React.ReactNode): React.ReactElement[] => {
        const result: React.ReactElement[] = [];
        Children.forEach(nodes, child => {
            if (!isValidElement(child)) return;
            if (child.type === Fragment) result.push(...flatten(child.props.children));
            else result.push(child.key === null ? cloneElement(child, { key: `row-separator-${result.length}` }) : child);
        });
        return result;
    };
    const elements = flatten(children);
    const byId = new Map(elements.filter(child => typeof child.props.id === "string").map(child => [child.props.id as string, child]));
    // Change the actual React/DOM order; do not depend on CSS flex-order support.
    const rendered = custom ? order.map(id => byId.get(id)) : elements;
    return <NormalRowContext.Provider value={{ enabled, custom, order, dragging,
        hint: translate("CityMonitor.ReorderRow", "Mit linker Maustaste ziehen, um die Zeile zu verschieben") ?? "",
        start: id => { if (enabled) { dragged.current = id; setDragging(id); } },
        move: () => {},
    }}>
        <div ref={container} className={className} style={{ display: "flex", flexDirection: "column" }}>{rendered}</div>
    </NormalRowContext.Provider>;
}
