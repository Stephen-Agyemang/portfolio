import useIsMobile from '../hooks/useIsMobile';
import PhotoCarousel from './PhotoCarousel.jsx';
import { moments } from '../data/moments';
import SketchFrame from './SketchFrame.jsx';

const About = () => {
  const isMobile = useIsMobile();
  const frameSize = isMobile ? "280px" : "340px";

  // Reticle brackets, corner ticks and the telemetry readout. Passed into the
  // carousel so they stay pinned to the frame while the photo behind them changes.
  const frameDecorations = (
    <>
      {/* Reticle Brackets */}
      <div style={{
        position: "absolute",
        inset: "-8px",
        border: "1.5px solid var(--card-border)",
        borderRadius: "100%",
        pointerEvents: "none",
        animation: "spinSlow 45s linear infinite",
        borderDasharray: "20 40 10 20",
      }} />
      <div style={{
        position: "absolute",
        inset: "-16px",
        border: "1px dashed rgba(56, 189, 248, 0.2)",
        borderRadius: "100%",
        pointerEvents: "none",
        animation: "spinReverseSlow 60s linear infinite",
      }} />
      {/* Viewfinder Target corner ticks */}
      <div style={{
        position: "absolute",
        top: "-5px",
        left: "-5px",
        width: "15px",
        height: "15px",
        borderTop: "3px solid var(--email-label)",
        borderLeft: "3px solid var(--email-label)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        top: "-5px",
        right: "-5px",
        width: "15px",
        height: "15px",
        borderTop: "3px solid var(--email-label)",
        borderRight: "3px solid var(--email-label)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-5px",
        left: "-5px",
        width: "15px",
        height: "15px",
        borderBottom: "3px solid var(--email-label)",
        borderLeft: "3px solid var(--email-label)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-5px",
        right: "-5px",
        width: "15px",
        height: "15px",
        borderBottom: "3px solid var(--email-label)",
        borderRight: "3px solid var(--email-label)",
        pointerEvents: "none",
      }} />
      {/* Telemetry coordinate label */}
      <div style={{
        position: "absolute",
        bottom: "12px",
        right: "12px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.6rem",
        background: "var(--chat-input-bg)",
        color: "var(--email-label)",
        padding: "2px 6px",
        borderRadius: "4px",
        border: "1px solid var(--card-border)",
        fontWeight: "bold",
        zIndex: 3,
        letterSpacing: "0.5px",
        pointerEvents: "none",
      }}>
        TRC_LOC // 41.52° N
      </div>
    </>
  );

  return (
    <section
      id="about"
      style={{
        padding: isMobile ? "44px 16px" : "60px 20px",
      }}
    >
      <SketchFrame>
      <div style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? "24px" : "50px",
        flexWrap: "wrap",
      }}>
      {/* Picture wrapped in a glowing cyber viewport frame */}
      <PhotoCarousel
        items={moments}
        size={frameSize}
        decorations={frameDecorations}
        isMobile={isMobile}
      />

      {/* About Text */}
      <div style={{ maxWidth: isMobile ? "100%" : "600px", textAlign: "left", zIndex: 2 }}>
        <div className="section-telemetry">[ SEC_01 // USER_INFO ]</div>
        <h2 className="section-title-neon" style={{
          fontSize: isMobile ? "2rem" : "3rem",
          marginBottom: "20px",
          fontFamily: "var(--font-mono)"
        }}>
          About Me
        </h2>
        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          lineHeight: "1.6",
          color: "var(--text-color)",
          fontFamily: "var(--font-mono)"
        }}>
          Hi, I'm Stephen! I'm a Computer Science and Honor Scholar at DePauw University,
          entering my second sophomore semester this fall. I just love asking "why." For me,
          software engineering is all about diving into the backend and figuring out how everything
          connects. Spending hours connecting dots is genuinely my thing.
        </p>

        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          lineHeight: "1.6",
          color: "var(--text-color)",
          fontFamily: "var(--font-mono)"
        }}>
          When I'm not in class, I'm deep in campus life. I serve as Tech and Design Lead for
          DePauw's Google Developer Group (GDG) and I'm an Aspire Leaders Program alumnus, a
          program that sharpened my leadership instincts and initiative, which I carry into
          every role I take on here.
        </p>

        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          lineHeight: "1.6",
          color: "var(--text-color)",
          fontFamily: "var(--font-mono)"
        }}>
          I'm still early in my engineering journey, but I have a massive drive to learn and
          tackle hard problems. Always down to connect with fellow students, builders, and engineers!
        </p>
      </div>
      </div>
      </SketchFrame>
    </section>
  );
};

export default About;