/**
 * Stephen Agyemang's LinkedIn Profile Data
 *
 * Curated from public LinkedIn profile: linkedin.com/in/stephagyemang
 * Last updated: September 2026
 */

export function getLinkedInProfile() {
    return {
        profileUrl: "https://www.linkedin.com/in/stephagyemang",
        headline: "Computer Science @ DePauw University | Honor Scholar & Bonner Scholar | Aspiring Software Engineer | AI/ML Researcher",
        location: "Greater Indianapolis",
        stats: "1K+ followers · 500+ connections",
        summary: `Computer Science student at DePauw University with two serious technical focuses: backend software engineering and AI/ML/DL research. On the backend side, I'm actively exploring distributed systems, cloud infrastructure, REST APIs, Spring Boot, FastAPI, Docker, and Kubernetes. On the research side, I spent summer 2026 as an undergraduate ML researcher on Transformer-based monocular 3D human pose estimation. Tech and Design Lead for the Google Developer Group on campus, Aspire Leaders Program alumnus (Harvard, Cohort 4 '25), and a ColorStack student member. Beyond code, I'm a multi-disciplinary thinker — theatre, photography, soccer, piano, and guitar all have a place in my life too, and Mathematics and Theatre are my intended minors.`,

        workExperience: [
            {
                title: "Undergraduate Machine Learning Researcher",
                company: "DePauw University — Computer Science Department",
                type: "Full-time · Hybrid",
                location: "Greencastle, Indiana",
                dates: "May 2026 – August 2026",
                description: "Collaborated with a faculty researcher and two student researchers to train and evaluate Transformer-based PyTorch models for monocular 3D human pose estimation. Benchmarked models, conducted ablation studies, and debugged pipelines to validate architectural decisions and enhance experiment reliability. Reviewed ML research, analyzed large-scale motion-capture datasets, and evaluated models for browser deployment with ONNX Runtime."
            },
            {
                title: "IT Intern",
                company: "DePauw University — Helpdesk & Technical Support",
                type: "Part-time · On-site",
                location: "Greencastle, Indiana",
                dates: "March 2026 – May 2026",
                description: "Collaborated with users and IT staff to resolve hardware, software, account, and network issues through a ticketing system, guiding non-technical users through solutions."
            },
            {
                title: "STEM Guide / TA",
                company: "DePauw University — Department of Computer Science",
                type: "Part-time · On-site",
                location: "Greencastle, Indiana",
                dates: "January 2026 – May 2026",
                description: "Worked with Computer Science faculty to lead office hours, review sessions, and individualized mentoring for 20+ students in Java, object-oriented programming, and software engineering fundamentals. Guided students through debugging compiler errors, runtime exceptions, and program logic, creating instructional examples and adapting technical concepts to different learning styles."
            },
            {
                title: "Admissions Overnight Host",
                company: "DePauw University",
                type: "Part-time · On-site",
                location: "Greencastle, Indiana",
                dates: "January 2026 – May 2026",
                description: "Served as a personal student ambassador for prospective students during overnight campus visits. Introduced guests to both the academic and social life at DePauw, ensuring their safety and comfort while addressing their questions about the student experience."
            },
        ],

        education: [
            {
                school: "DePauw University",
                degree: "Bachelor of Arts (BA) in Computer Science — intended minors in Mathematics and Theatre (not yet declared)",
                dates: "January 2025 – December 2028 (Expected)",
                gpa: "3.97 / 4.0",
                honors: ["Honor Scholar — DePauw's most prestigious academic track, selected through a competitive writing and interview process based on academic excellence and interdisciplinary thinking."],
                activities: [
                    "Google Developers Group on Campus (Design Lead)",
                    "DePauw Futbol Club",
                    "DePauw WiCS"
                ],
                relevantCoursework: [
                    "Computer Science I (CSC-121B)",
                    "Data Structures (CSC-235A)",
                    "Principles of Software Development (CSC-125A)",
                    "Computational Discrete Math (MATH-123A)",
                    "Calculus I (MATH-151B)",
                    "Acting I & II",
                    "Voice and Movement",
                    "Photography & Social Justice",
                    "Beginning Class Folk Guitar I",
                    "Beginning Class Piano",
                    "Computer Systems (Fall 2026)",
                    "Algorithmic Foundations of Computation (Fall 2026)",
                    "Honor Scholar Seminar (Fall 2026)",
                    "Calculus II (Fall 2026)",
                ],
            },
            {
                school: "Aspire Institute (Harvard Aspire Leaders Program)",
                degree: "Urban Education and Leadership — Alumni",
                dates: "August 2025 – October 2025",
                gpa: "Alumni (Cohort 4, 2025)",
                honors: [],
                relevantCoursework: [],
                description: "Global leadership development initiative for limited-income and first-generation university students. Multi-module curriculum covering personal growth, leadership, and community impact through live sessions and mentorship."
            },
        ],

        skills: [
            "Python", "Java", "C++", "JavaScript", "React", "FastAPI",
            "Gemini AI", "Generative AI", "Node.js", "HTML/CSS",
            "Git", "GitHub", "Docker", "REST APIs",
            "Software Development", "Data Structures", "Machine Learning",
            "Web Development", "Database Management", "Problem-Solving",
            "Public Speaking", "Team Leadership", "Mentoring", "Adaptability",
            "Community Building", "Usability Testing",
        ],

        certifications: [
            {
                name: "CodePath TIP101",
                issuer: "CodePath",
                date: "May 2026",
                credentialId: "395732",
                skills: ["Python", "Problem Solving", "Data Structures", "Algorithms"]
            },
            {
                name: "Aspire Leaders Program Fellow (Cohort 4, 2025)",
                issuer: "Aspire Institute",
                date: "October 2025",
            },
        ],

        honorsAndAwards: [
            {
                title: "Bonner Scholar",
                issuer: "DePauw University Bonner Scholar Program",
                date: "August 2026",
                description: "Selected for DePauw's service-based scholarship program, which supports students committed to sustained community engagement through ongoing service placements and leadership development."
            },
            {
                title: "Honor Scholar",
                issuer: "DePauw University Honor Scholar Program",
                date: "January 2026",
                description: "Selected for DePauw's most prestigious academic track based on academic excellence, intellectual curiosity, and interdisciplinary thinking — awarded through a selective writing and interview process."
            },
            {
                title: "Distinguished Merit Scholarship",
                issuer: "DePauw University",
                date: "July 2024 (4-year award)",
            },
            {
                title: "Emerging Leader Award",
                issuer: "DePauw University",
                date: "July 2024 (4-year award)",
            },

        ],

        organizations: [
            {
                name: "Google Developer Student Clubs (GDG on Campus – DePauw)",
                role: "Tech and Design Lead",
                dates: "August 2025 – Present",
                location: "Greencastle, Indiana",
                description: "Coordinate with club leaders to design technical and marketing materials for 5+ workshops and a panel, growing attendance from near zero to roughly 50 participants per event. Represented DePauw at Google I/O and the GDG/GDE Summit. Organized the inaugural GDG Coding Jam, where FridgeJam was the first project ever featured."
            },
            {
                name: "ColorStack",
                role: "Student Member",
                dates: "July 2025 – Present",
                location: "United States (Remote)",
                description: "Participate in a 16,000+ member technical community for Black and Latinx computer science students through career development, peer support, and professional networking."
            },
        ],

        volunteerAndLeadership: [
            {
                role: "Welcome Week Student Volunteer",
                organization: "DePauw University",
                dates: "August 2025",
                description: "Assisted incoming students during Welcome Week with campus navigation, move-in logistics, and orientation onboarding."
            },
            {
                role: "Software Testing Volunteer",
                organization: "DePauw University",
                dates: "November 2025",
                description: "Contributed usability feedback on a DePauw software testing project, helping enhance the overall student digital experience."
            },
        ],

        languages: [
            { language: "English", proficiency: "Native or bilingual proficiency" },
            { language: "French", proficiency: "Elementary proficiency" },
        ],

        recentActivity: [
            "FridgeJam was featured by GDG Developer Relations Engineering Manager Christina Lin as the first project at the inaugural GDG Coding Jam — praised for its gamified UX and mini-games while waiting for LLM output.",
            "Reposted a recap of Google I/O 2026, highlighting AI sandbox experiences with Gemini, Workspace, and developer community building.",
        ],
    };
}