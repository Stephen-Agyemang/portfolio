import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ADVANCE_MS = 4500;
const FADE_MS = 900;

/**
 * Auto-playing photo slideshow that fills a circular viewport.
 *
 * `decorations` renders inside the frame, above the photos — the About section
 * passes its reticle brackets and telemetry readout so the HUD treatment stays
 * with the frame rather than being duplicated here.
 *
 * It is meant to read as a slideshow rather than something to click through:
 * the active photo slowly drifts in scale, the active dot fills like a timer,
 * and the arrows stay hidden until you actually reach for them. They remain
 * available for anyone who wants to steer, and become permanently visible when
 * the OS asks for reduced motion, since autoplay is disabled in that case.
 *
 * With a single photo this renders as a plain portrait: no timer, no controls.
 */
const PhotoCarousel = ({ items, size, decorations = null, isMobile = false }) => {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [hovered, setHovered] = useState(false);
    // Read once during init; the effect below only subscribes to later changes.
    const [reducedMotion, setReducedMotion] = useState(
        () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );

    const hasMultiple = items.length > 1;

    useEffect(() => {
        const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        if (!mq) return;
        const onChange = (e) => setReducedMotion(e.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    const go = useCallback(
        (delta) => setIndex((i) => (i + delta + items.length) % items.length),
        [items.length]
    );

    // Auto-advance. Skipped for a single photo, while the visitor is
    // interacting with the frame, or when the OS asks for reduced motion.
    useEffect(() => {
        if (!hasMultiple || paused || reducedMotion) return;
        const timer = setInterval(() => go(1), ADVANCE_MS);
        return () => clearInterval(timer);
    }, [hasMultiple, paused, reducedMotion, go]);

    const active = items[index];
    const showArrows = hasMultiple && (hovered || reducedMotion);

    const arrowStyle = {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--card-border)",
        background: "var(--chat-input-bg)",
        color: "var(--email-label)",
        cursor: "pointer",
        zIndex: 4,
        outline: "none",
        opacity: showArrows ? 1 : 0,
        pointerEvents: showArrows ? "auto" : "none",
        transition: "opacity 250ms ease",
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <div
                style={{
                    position: "relative",
                    width: size,
                    height: size,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    margin: "10px 0",
                }}
                onMouseEnter={() => { setHovered(true); setPaused(true); }}
                onMouseLeave={() => { setHovered(false); setPaused(false); }}
                onFocus={() => { setHovered(true); setPaused(true); }}
                onBlur={() => { setHovered(false); setPaused(false); }}
            >
                {/* Photos are clipped to the circle here rather than on each image,
                    so the slow scale drift never pokes outside the frame. */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "100%",
                    overflow: "hidden",
                    border: "2px solid var(--card-border)",
                    boxShadow: "0 0 25px var(--card-border)",
                    boxSizing: "border-box",
                }}>
                    {items.map((item, i) => (
                        <img
                            key={item.src}
                            src={item.src}
                            alt={item.alt}
                            loading="lazy"
                            aria-hidden={i === index ? undefined : true}
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                opacity: i === index ? 1 : 0,
                                // The drift runs over the full slide so the photo is
                                // never completely still — what makes it read as a
                                // slideshow instead of a static image with buttons.
                                transform: i === index && !reducedMotion ? "scale(1.07)" : "scale(1)",
                                transition: reducedMotion
                                    ? `opacity ${FADE_MS}ms ease`
                                    : `opacity ${FADE_MS}ms ease, transform ${ADVANCE_MS + FADE_MS}ms linear`,
                            }}
                        />
                    ))}
                </div>

                {decorations}

                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Previous photo"
                            className="interactive-scale-sm"
                            style={{ ...arrowStyle, left: isMobile ? "-6px" : "-14px" }}
                        >
                            <FaChevronLeft size={11} />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Next photo"
                            className="interactive-scale-sm"
                            style={{ ...arrowStyle, right: isMobile ? "-6px" : "-14px" }}
                        >
                            <FaChevronRight size={11} />
                        </button>
                    </>
                )}
            </div>

            {/* Announced politely so a screen reader hears the caption change
                without the slideshow stealing focus. */}
            {active.caption && (
                <p
                    aria-live="polite"
                    style={{
                        margin: 0,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        color: "var(--telemetry-color)",
                        letterSpacing: "0.5px",
                        textAlign: "center",
                        maxWidth: size,
                    }}
                >
                    {active.caption}
                </p>
            )}

            {hasMultiple && (
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {items.map((item, i) => (
                        <button
                            key={item.src}
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={`Show photo ${i + 1} of ${items.length}`}
                            aria-current={i === index}
                            className="pc-dot"
                            style={{
                                width: i === index ? "22px" : "7px",
                                background: i === index
                                    ? "color-mix(in srgb, var(--email-label) 28%, transparent)"
                                    : "color-mix(in srgb, var(--text-color) 30%, transparent)",
                            }}
                        >
                            {/* Fills across the slide's duration, so the dots double as
                                a countdown to the next photo. Remounted per slide via
                                `key` so the animation restarts. */}
                            {i === index && !reducedMotion && (
                                <span
                                    key={index}
                                    className="pc-dot-fill"
                                    style={{ animationPlayState: paused ? "paused" : "running" }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}

            <style>{`
                .pc-dot {
                    position: relative;
                    height: 7px;
                    padding: 0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    outline: none;
                    overflow: hidden;
                    transition: width 300ms ease, background 300ms ease;
                }

                .pc-dot-fill {
                    position: absolute;
                    inset: 0;
                    border-radius: 4px;
                    background: var(--email-label);
                    transform-origin: left center;
                    animation: pcDotFill ${ADVANCE_MS}ms linear forwards;
                }

                @keyframes pcDotFill {
                    from { transform: scaleX(0); }
                    to   { transform: scaleX(1); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .pc-dot-fill { animation: none; transform: scaleX(1); }
                    .pc-dot { transition: none; }
                }
            `}</style>
        </div>
    );
};

export default PhotoCarousel;
