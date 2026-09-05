/**
 * The desk objects, each drawn in its own 100x100 box so that placement and
 * scale stay independent of the path data. Stroked in `currentColor` — one
 * theme token re-inks every object, in both themes, with no second asset set.
 */

const ART = {
    headphones: (
        <>
            <path d="M17 63C14 31 32 13 50 13s36 18 33 50" />
            <path d="M15 57c6-1 11 3 11 9v16c0 6-5 10-11 9-4-1-7-4-7-9V66c0-5 3-8 7-9z" />
            <path d="M85 57c-6-1-11 3-11 9v16c0 6 5 10 11 9 4-1 7-4 7-9V66c0-5-3-8-7-9z" />
            <path d="M20 68v14M80 68v14" />
        </>
    ),
    mug: (
        <>
            <circle cx="50" cy="50" r="31" />
            <circle cx="50" cy="50" r="24" />
            <path d="M50 34c9 0 16 7 16 16s-7 16-16 16-15-6-15-13 5-11 11-11 9 4 9 8" />
        </>
    ),
    laptop: (
        <>
            <path d="M27 16h46a3 3 0 013 3v40H24V19a3 3 0 013-3z" />
            <path d="M31 23h38v31H31z" />
            <path d="M16 62h68l7 13a3 3 0 01-3 4H12a3 3 0 01-3-4l7-13z" />
            <path d="M40 71h20" />
        </>
    ),
    notebook: (
        <>
            <path d="M28 12h52a3 3 0 013 3v70a3 3 0 01-3 3H28z" />
            <path d="M22 17c4-3 8-3 10 0M22 32c4-3 8-3 10 0M22 47c4-3 8-3 10 0M22 62c4-3 8-3 10 0M22 77c4-3 8-3 10 0" />
            <path d="M38 30h34M38 42h34M38 54h24" />
        </>
    ),
    usb: (
        <>
            <path d="M33 26h34a4 4 0 014 4v54a4 4 0 01-4 4H33a4 4 0 01-4-4V30a4 4 0 014-4z" />
            <path d="M40 10h20v16H40z" />
            <path d="M38 46h24M38 58h24" />
        </>
    ),
    mouse: (
        <>
            <path d="M50 11c17 0 28 16 28 39S67 89 50 89 22 73 22 50 33 11 50 11z" />
            <path d="M50 11v29M23 40h54" />
        </>
    ),
    phone: (
        <>
            <path d="M32 8h36a5 5 0 015 5v74a5 5 0 01-5 5H32a5 5 0 01-5-5V13a5 5 0 015-5z" />
            <path d="M34 21h32v50H34z" />
            <circle cx="50" cy="80" r="4" />
        </>
    ),
    pencil: (
        <>
            <path d="M18 86l5-15L69 15l12 10-46 56-17 5z" />
            <path d="M69 15l12 10M23 71l12 10M63 22l12 10" />
        </>
    ),
    clip: <path d="M63 27v45c0 12-18 12-18 0V22c0-11 25-11 25 0v52c0 15-32 15-32 0V31" />,
    note: (
        <>
            <path d="M16 16h68v50L64 86H16z" />
            <path d="M64 86V66h20" />
            <path d="M28 32h44M28 44h44M28 56h28" />
        </>
    ),
    // Three more, added for the page-wide scatter so the ten originals don't
    // visibly cycle. These lean into what actually sits on *this* desk.
    terminal: (
        <>
            <path d="M12 20h76a4 4 0 014 4v52a4 4 0 01-4 4H12a4 4 0 01-4-4V24a4 4 0 014-4z" />
            <path d="M8 34h84" />
            <path d="M22 48l10 8-10 8M42 64h22" />
        </>
    ),
    keyboard: (
        <>
            <path d="M8 30h84a4 4 0 014 4v32a4 4 0 01-4 4H8a4 4 0 01-4-4V34a4 4 0 014-4z" />
            <path d="M16 40h8M30 40h8M44 40h8M58 40h8M72 40h8M16 51h8M30 51h8M44 51h8M58 51h8M72 51h8" />
            <path d="M30 61h40" />
        </>
    ),
    glasses: (
        <>
            <circle cx="26" cy="54" r="17" />
            <circle cx="74" cy="54" r="17" />
            <path d="M43 52c4-4 10-4 14 0M9 48L2 40M91 48l7-8" />
        </>
    ),
};

const SHAPES = Object.keys(ART);

export const SKETCH_COUNT = SHAPES.length;

/**
 * Picks one object out of the catalogue by index, wrapping around. Callers
 * pass a strided index so successive draws walk the whole set before any
 * shape repeats; the catalogue itself stays private to this module.
 */
export default function SketchArt({ index }) {
    return ART[SHAPES[((index % SHAPES.length) + SHAPES.length) % SHAPES.length]];
}
