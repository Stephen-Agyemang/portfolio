import Stephen from "../assets/Stephen.webp";
import GoogleIO from "../assets/google-io.webp";
import GdgSummit from "../assets/gdg-summit.webp";
import Googleplex from "../assets/googleplex.webp";
import SanFrancisco from "../assets/san-francisco.webp";
import DepauwCampus from "../assets/depauw-campus.webp";

/**
 * Photos shown in the About section's circular viewport, in order.
 *
 * The carousel only auto-advances and shows arrows/dots when there is more
 * than one entry, so a single photo renders exactly like a static portrait.
 *
 * To add an event photo:
 *   1. Crop it square first — the frame is a circle, so anything in the
 *      corners is cut and a subject off to one side gets clipped. Export
 *      around 800x800 as .webp; the frame renders at 340px.
 *   2. Drop the file in `src/assets/` and import it above.
 *   3. Add an entry below with `alt` (required, read by screen readers) and
 *      an optional `caption`; omit the caption and that line is not rendered.
 *
 * Phone photos usually carry EXIF rotation that browsers honour inconsistently,
 * so bake the rotation into the file rather than relying on the tag.
 */
export const moments = [
    {
        src: Stephen,
        alt: "Stephen Agyemang on the DePauw University campus",
    },
    {
        src: GoogleIO,
        alt: "Stephen at Google I/O, Shoreline Amphitheatre",
        caption: "Google I/O · Shoreline Amphitheatre",
    },
    {
        src: GdgSummit,
        alt: "Stephen on stage at the Google Developer Groups North America Summit 2026",
        caption: "GDG North America Summit · 2026",
    },
    {
        src: Googleplex,
        alt: "Stephen beside the Google sign at 1098 Alta Avenue, Mountain View",
        caption: "Googleplex · Mountain View",
    },
    {
        src: SanFrancisco,
        alt: "Stephen in front of the Golden Gate Bridge",
        caption: "Golden Gate · San Francisco",
    },
    {
        src: DepauwCampus,
        alt: "Stephen on the DePauw University campus in autumn",
        caption: "DePauw University · Greencastle",
    },
];
