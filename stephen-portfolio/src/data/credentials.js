/**
 * Honors and certifications rendered by the Credentials section, in display
 * order: honors first, then certifications.
 *
 * These mirror the `honorsAndAwards` and `certifications` blocks in
 * `api/linkedinProfile.js`, which feed the chat assistant's context. The two
 * lists are deliberately separate files — `api/` deploys to Vercel while `src/`
 * builds with Vite, and a cross-boundary import would couple the two builds.
 * When you add a credential, add it in both places so the page and the
 * assistant agree.
 *
 * `credentialUrl` powers the "Verify" button. Leave it null and the button is
 * omitted rather than rendered dead — paste the "Show credential" link from
 * your LinkedIn Licenses & certifications page to switch it on.
 */
export const credentials = [
    {
        id: "honor-scholar",
        type: "honor",
        name: "Honor Scholar",
        issuer: "DePauw University Honor Scholar Program",
        date: "January 2026",
        description:
            "Selected for DePauw's most prestigious academic track through a competitive writing and interview process, recognizing academic excellence and interdisciplinary thinking.",
    },
    {
        id: "bonner-scholar",
        type: "honor",
        name: "Bonner Scholar",
        issuer: "DePauw University Bonner Scholar Program",
        date: "August 2026",
        description:
            "Selected for DePauw's service-based scholarship program, which supports students committed to sustained community engagement through ongoing service placements and leadership development.",
    },
    {
        id: "distinguished-merit",
        type: "honor",
        name: "Distinguished Merit Scholarship",
        issuer: "DePauw University",
        date: "July 2024",
        note: "4-year award",
    },
    {
        id: "emerging-leader",
        type: "honor",
        name: "Emerging Leader Award",
        issuer: "DePauw University",
        date: "July 2024",
        note: "4-year award",
    },
    {
        id: "codepath-tip101",
        type: "cert",
        name: "CodePath TIP101",
        issuer: "CodePath",
        date: "May 2026",
        credentialId: "395732",
        credentialUrl: "https://drive.google.com/file/d/1AkIlNrWmgdC1MzvMXLmfevFLh4KlizD0/view?usp=sharing",
        skills: ["Python", "Problem Solving", "Data Structures", "Algorithms"],
    },
    {
        id: "aspire-leaders",
        type: "cert",
        name: "Aspire Leaders Program Fellow",
        issuer: "Aspire Institute",
        date: "October 2025",
        note: "Cohort 4, 2025",
        credentialUrl: "https://drive.google.com/file/d/1ig5xtb5zAR04F_oy0hah1NnzcEX2lyGD/view?usp=sharing",
        skills: ["Leadership", "Leadership Development"],
    },
];
