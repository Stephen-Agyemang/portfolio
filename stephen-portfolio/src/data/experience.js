/**
 * Roles rendered by the Experience timeline, newest first.
 *
 * Mirrors `workExperience` in `api/linkedinProfile.js`, which feeds the chat
 * assistant. (`api/handshakeProfile.js` is parked and no longer read.) Same split as
 * `credentials.js`: `api/` deploys to Vercel while `src/` builds with Vite, so
 * the lists are kept separate rather than coupling the two builds. Add new
 * roles in both places.
 *
 * Dates and descriptions follow Stephen's resume. As of Fall 2026 the ML
 * research, IT Intern, STEM Guide, and Overnight Host roles have all ended.
 *
 * `current: true` renders the pulsing "PRESENT" indicator, which supplies the
 * end of the date range. Past roles set `current: false` and should carry an
 * `end`; without one, only the start date is shown.
 */
export const experience = [
    {
        id: "ml-researcher",
        type: "work",
        title: "Undergraduate Machine Learning Researcher",
        org: "DePauw University — Computer Science Department",
        start: "May 2026",
        end: "August 2026",
        current: false,
        location: "Greencastle, IN · Full-time, Hybrid",
        description:
            "Collaborated with a faculty researcher and two student researchers to train and evaluate Transformer-based PyTorch models for monocular 3D human pose estimation. Benchmarked models, ran ablation studies, and debugged pipelines to validate architectural decisions, and evaluated models for browser deployment with ONNX Runtime.",
        skills: ["PyTorch", "Transformers", "3D Pose Estimation", "ONNX Runtime", "Research"],
    },
    {
        id: "it-intern",
        type: "work",
        title: "IT Intern",
        org: "DePauw University — Helpdesk & Technical Support",
        start: "March 2026",
        end: "May 2026",
        current: false,
        location: "Greencastle, IN · Part-time, On-site",
        description:
            "Collaborated with users and IT staff to resolve hardware, software, account, and network issues through a ticketing system, guiding non-technical users through solutions.",
        skills: ["Troubleshooting", "Networking", "Technical Support"],
    },
    {
        id: "stem-guide",
        type: "work",
        title: "STEM Guide / TA",
        org: "DePauw University — Department of Computer Science",
        start: "January 2026",
        end: "May 2026",
        current: false,
        location: "Greencastle, IN · Part-time, On-site",
        description:
            "Worked with Computer Science faculty to lead office hours, review sessions, and individualized mentoring for 20+ students in Java, object-oriented programming, and software engineering fundamentals. Guided students through debugging compiler errors, runtime exceptions, and program logic, creating instructional examples and adapting technical concepts to different learning styles.",
        skills: ["Java", "Mentoring", "Debugging", "Teaching"],
    },
    {
        id: "overnight-host",
        type: "work",
        title: "Admissions Overnight Host",
        org: "DePauw University",
        start: "January 2026",
        end: "May 2026",
        current: false,
        location: "Greencastle, IN · Part-time, On-site",
        description:
            "Served as a personal student ambassador for prospective students during overnight campus visits, introducing them to academic and social life at DePauw and ensuring their safety and comfort throughout the stay.",
        skills: ["Communication", "Community Building"],
    },
    {
        id: "gdg-lead",
        type: "lead",
        title: "Tech & Design Lead",
        org: "Google Developer Group on Campus (GDGoC) — DePauw",
        start: "August 2025",
        current: true,
        location: "Greencastle, IN · On-site",
        description:
            "Coordinate with club leaders to design technical and marketing materials for 5+ workshops and a panel, growing attendance from near zero to roughly 50 participants per event. Represented DePauw at Google I/O and the GDG/GDE Summit, bringing emerging technologies and workshop insights back to campus. Organized the inaugural GDG Coding Jam, where FridgeJam was the first project ever featured.",
        skills: ["Technical Leadership", "Event Organizing", "Design", "Public Speaking"],
    },
    {
        id: "colorstack",
        type: "lead",
        title: "Student Member",
        org: "ColorStack",
        start: "July 2025",
        current: true,
        location: "Remote",
        description:
            "Participate in a 16,000+ member technical community for Black and Latinx computer science students through career development, peer support, and professional networking.",
        skills: ["Career Development", "Networking", "Community"],
    },
];
