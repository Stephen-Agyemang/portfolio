import { useEffect, useRef } from "react";
import "./BackgroundField.css";

/**
 * The page's background depth stack: a far grid, a floor plane tipped away
 * toward a horizon, and the three ambient light leaks. Each layer answers
 * scroll at its own rate, which is what reads as depth.
 *
 * One rAF-throttled scroll listener drives all of it, and it writes its
 * custom properties onto this component's own root rather than :root, so a
 * scroll only invalidates styles inside the background subtree.
 */

const TILE = 80;          // px — must match the grid background-size below
const FAR_RATE = 0.14;    // deepest layer, barely moves
const FLOOR_RATE = 0.32;  // the floor is underfoot, so it passes fastest

export default function BackgroundField() {
    const root = useRef(null);

    useEffect(() => {
        const el = root.current;
        if (!el) return;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

        let frame = 0;

        const paint = () => {
            frame = 0;
            const y = window.scrollY;
            // Both grids repeat every TILE px, so wrapping the offset to one
            // tile makes the parallax seamless no matter how far the page
            // scrolls — the layers never run out of texture to show.
            el.style.setProperty("--far-shift", ((y * FAR_RATE) % TILE).toFixed(2));
            el.style.setProperty("--floor-shift", ((y * FLOOR_RATE) % TILE).toFixed(2));
            el.style.setProperty("--scroll-y", y.toFixed(1));
        };

        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(paint);
        };

        paint();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div className="bg-field" ref={root} aria-hidden="true">
            <div className="bg-far-grid" />
            <div className="bg-floor">
                <div className="bg-floor-plane" />
            </div>
            <div className="ambient-glow-wrapper">
                <div className="ambient-glow-1" />
                <div className="ambient-glow-2" />
                <div className="ambient-glow-3" />
            </div>
        </div>
    );
}
