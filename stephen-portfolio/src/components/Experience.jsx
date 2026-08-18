import { FaBriefcase, FaUsers } from "react-icons/fa";
import { experience } from "../data/experience";
import useIsMobile from "../hooks/useIsMobile";

// Paid roles and elected/volunteer leadership read differently to a recruiter,
// so each gets its own accent — the same badge language the Credentials grid uses.
const TYPE_META = {
    work: { label: "WORK", color: "var(--color-fintracker)", Icon: FaBriefcase },
    lead: { label: "LEAD", color: "var(--color-portfolio)", Icon: FaUsers },
};

const Experience = () => {
    const isMobile = useIsMobile();

    return (
        <section
            id="experience"
            style={{
                padding: isMobile ? "44px 16px" : "60px 20px",
                textAlign: "left",
                zIndex: 2,
                position: "relative",
            }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
                <div className="section-telemetry">[ SEC_06 // SERVICE_LOG ]</div>
                <h2
                    className="section-title-neon"
                    style={{
                        fontSize: isMobile ? "2rem" : "3rem",
                        marginBottom: "10px",
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    Experience
                </h2>
                <p
                    style={{
                        margin: "0 0 44px",
                        fontSize: isMobile ? "0.9rem" : "1.05rem",
                        color: "var(--text-color)",
                        maxWidth: "620px",
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    Roles held on campus and beyond — where the engineering work meets
                    teaching, leading, and showing up for people.
                </p>

                <div className="xp-timeline">
                    {experience.map((role) => {
                        const meta = TYPE_META[role.type] || TYPE_META.work;
                        const { Icon } = meta;

                        return (
                            <article
                                key={role.id}
                                className="xp-entry"
                                style={{ "--xp-theme": meta.color }}
                            >
                                {/* Rail node */}
                                <span className="xp-node" aria-hidden="true">
                                    <Icon size={9} />
                                </span>

                                <div className="xp-card" style={{ padding: isMobile ? "20px" : "24px" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            flexWrap: "wrap",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: "0.56rem",
                                                fontWeight: "700",
                                                letterSpacing: "1.5px",
                                                color: meta.color,
                                            }}
                                        >
                                            {meta.label}
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: "0.7rem",
                                                color: "var(--telemetry-color)",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            {role.current
                                                ? `${role.start} —`
                                                : [role.start, role.end].filter(Boolean).join(" — ")}
                                        </span>
                                        {role.current && (
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    fontFamily: "var(--font-mono)",
                                                    fontSize: "0.56rem",
                                                    fontWeight: "700",
                                                    letterSpacing: "1px",
                                                    color: meta.color,
                                                }}
                                            >
                                                <span
                                                    className="blink-led"
                                                    style={{
                                                        width: "5px",
                                                        height: "5px",
                                                        borderRadius: "50%",
                                                        background: meta.color,
                                                        boxShadow: `0 0 8px ${meta.color}`,
                                                    }}
                                                />
                                                PRESENT
                                            </span>
                                        )}
                                    </div>

                                    <h3
                                        style={{
                                            fontSize: isMobile ? "1.1rem" : "1.25rem",
                                            margin: "0 0 5px",
                                            color: "var(--text-title)",
                                            fontWeight: "800",
                                            fontFamily: "var(--font-mono)",
                                            lineHeight: "1.35",
                                        }}
                                    >
                                        {role.title}
                                    </h3>

                                    <p
                                        style={{
                                            fontSize: "0.85rem",
                                            color: meta.color,
                                            fontWeight: "600",
                                            margin: "0 0 4px",
                                            fontFamily: "var(--font-mono)",
                                        }}
                                    >
                                        {role.org}
                                    </p>

                                    <p
                                        style={{
                                            fontSize: "0.7rem",
                                            color: "var(--telemetry-color)",
                                            margin: "0 0 12px",
                                            fontFamily: "var(--font-mono)",
                                        }}
                                    >
                                        {role.location}
                                    </p>

                                    <p
                                        style={{
                                            fontSize: isMobile ? "0.86rem" : "0.88rem",
                                            color: "var(--text-color)",
                                            lineHeight: "1.6",
                                            margin: role.skills?.length ? "0 0 14px" : 0,
                                            fontFamily: "var(--font-mono)",
                                        }}
                                    >
                                        {role.description}
                                    </p>

                                    {role.skills?.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                            {role.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    style={{
                                                        fontSize: "0.68rem",
                                                        padding: "3px 8px",
                                                        background: `color-mix(in srgb, ${meta.color} 10%, transparent)`,
                                                        color: meta.color,
                                                        borderRadius: "12px",
                                                        fontWeight: "600",
                                                        border: `1px solid color-mix(in srgb, ${meta.color} 13%, transparent)`,
                                                        fontFamily: "var(--font-mono)",
                                                    }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .xp-timeline {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 22px;
                }

                /* The rail itself. Fades at both ends so it reads as a continuing
                   log rather than a bar with hard stops. */
                .xp-timeline::before {
                    content: "";
                    position: absolute;
                    left: 11px;
                    top: 6px;
                    bottom: 6px;
                    width: 1px;
                    background: linear-gradient(
                        180deg,
                        transparent,
                        color-mix(in srgb, var(--text-color) 22%, transparent) 8%,
                        color-mix(in srgb, var(--text-color) 22%, transparent) 92%,
                        transparent
                    );
                }

                .xp-entry {
                    position: relative;
                    padding-left: 44px;
                }

                .xp-node {
                    position: absolute;
                    left: 0;
                    top: 18px;
                    width: 23px;
                    height: 23px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--xp-theme);
                    background: var(--bg-color);
                    border: 1px solid color-mix(in srgb, var(--xp-theme) 45%, transparent);
                    box-shadow: 0 0 0 4px var(--bg-color);
                    z-index: 1;
                }

                .xp-card {
                    background: var(--card-bg-init);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid var(--card-border);
                    border-radius: 16px;
                    box-sizing: border-box;
                    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
                                box-shadow 0.3s ease,
                                border-color 0.3s ease,
                                background 0.3s ease;
                }

                .xp-entry:hover .xp-card {
                    transform: translateX(4px);
                    border-color: color-mix(in srgb, var(--xp-theme) 30%, transparent);
                    box-shadow: 0 12px 30px 0 color-mix(in srgb, var(--xp-theme) 12%, transparent);
                    background: var(--card-bg-hover);
                }

                @media (max-width: 767px) {
                    .xp-entry { padding-left: 34px; }
                    .xp-timeline::before { left: 8px; }
                    .xp-node { width: 18px; height: 18px; top: 16px; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .xp-card,
                    .xp-entry:hover .xp-card {
                        transition: none;
                        transform: none;
                    }
                }
            `}</style>
        </section>
    );
};

export default Experience;
