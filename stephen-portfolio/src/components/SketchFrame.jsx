import "./sketch.css";

/**
 * The sheet the content rides on, raised above the desk scattered behind it
 * by SketchDesk. Opaque enough that an object passing under its edge tucks
 * beneath rather than showing through.
 */
export default function SketchFrame({ children }) {
    return (
        <div className="sketch-scene">
            <div className="sketch-sheet">{children}</div>
        </div>
    );
}
