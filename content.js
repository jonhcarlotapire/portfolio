/* EDIT YOUR PORTFOLIO HERE.
 * All projects, activities, and profile details below are examples, not claims.
 * Use relative image paths and https:// links. Blank project URLs are hidden.
 */
window.PORTFOLIO = {
  name: "JC Tapire", // Replace with your full name.
  email: "hello@example.com", // Replace before sharing your portfolio.
  location: "Your city, country",
  education: "Your degree or course",
  school: "Your school or university",
  profileImage: "assets/profile.jpg",
  profileImageAlt: "Stock portrait placeholder; replace with your own photo",
  // Optional: a Formspree endpoint, e.g. https://formspree.io/f/YOUR_FORM_ID.
  // Leave blank to honestly open an email draft instead of pretending to send.
  formEndpoint: "",
  socials: [
    {
      label: "GitHub",
      icon: "github",
      url: "https://github.com/jonhcarlotapire",
    },
    // { label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/YOUR_PROFILE/" },
  ],
  skills: [
    {
      title: "Technical & Creative",
      icon: "code",
      label: "BUILD & CREATE",
      description: "Bringing ideas to screens, documents, and visual stories.",
      items: [
        { name: "HTML & CSS", note: "Responsive web foundations", mark: "</>" },
        { name: "JavaScript", note: "Interactive experiences", mark: "JS" },
        {
          name: "Microsoft Office",
          note: "Documents, data & presentations",
          mark: "M",
        },
        { name: "Canva", note: "Visual communication & design", mark: "C" },
      ],
    },
    {
      title: "Business & Analytical",
      icon: "chart",
      label: "THINK & SOLVE",
      description: "Understanding the bigger picture, one detail at a time.",
      items: [
        {
          name: "Business Management",
          note: "Planning & organization",
          mark: "BM",
        },
        { name: "Accounting", note: "Financial fundamentals", mark: "₱" },
        { name: "Research", note: "Insights backed by evidence", mark: "R" },
        {
          name: "Problem Solving",
          note: "Practical, thoughtful solutions",
          mark: "↗",
        },
      ],
    },
    {
      title: "People & Collaboration",
      icon: "users",
      label: "CONNECT & GROW",
      description: "Working with people to make good things happen.",
      items: [
        {
          name: "Communication",
          note: "Clear ideas, active listening",
          mark: "Co",
        },
        {
          name: "Leadership",
          note: "Taking initiative with purpose",
          mark: "L",
        },
        { name: "Teamwork", note: "Better outcomes, together", mark: "T" },
        { name: "Adaptability", note: "Learning through change", mark: "A" },
      ],
    },
  ],
  events: [
    {
      id: "leadership",
      title: "Student Leadership Summit",
      category: "LEADERSHIP",
      date: "October 2025",
      location: "Your school or venue",
      role: "Participant & team collaborator",
      image: "assets/event-summit.jpg",
      imageAlt: "Stock photo of people attending a professional event",
      description:
        "A sample entry for a day of fresh perspectives, thoughtful conversations, and learning to lead with intention.",
      details:
        "Replace this example with a leadership program, seminar, or school activity you attended. Describe the sessions, people, or challenges that made it meaningful.",
      takeaways: [
        "Practiced communicating ideas in a team setting.",
        "Explored ways to lead with empathy and accountability.",
        "Developed a fresh perspective on collaborative problem-solving.",
      ],
    },
    {
      id: "innovation",
      title: "Business Innovation Challenge",
      category: "COMPETITION",
      date: "August 2025",
      location: "Your school or venue",
      role: "Team member & presenter",
      image: "assets/event-workshop.jpg",
      imageAlt: "Stock photo of a collaborative workshop",
      description:
        "A sample entry for turning a business idea into a plan through research, teamwork, and a little creative thinking.",
      details:
        "Use this space to describe a competition or business activity you joined. Explain your contribution, the idea your team developed, and what you learned from the process.",
      takeaways: [
        "Connected customer research with a practical business idea.",
        "Collaborated on a presentation and project plan.",
        "Built confidence in presenting and responding to feedback.",
      ],
    },
    {
      id: "community",
      title: "Community Connect",
      category: "VOLUNTEERING",
      date: "June 2025",
      location: "Your local community",
      role: "Volunteer & activity organizer",
      image: "assets/event-community.jpg",
      imageAlt: "Stock photo representing a community gathering",
      description:
        "A sample entry for showing up, lending a hand, and discovering how small contributions can make a difference.",
      details:
        "Replace this example with an outreach program, organization, or community event. Share who the activity supported and what you personally contributed.",
      takeaways: [
        "Helped coordinate an activity with a team of volunteers.",
        "Strengthened interpersonal and organizational skills.",
        "Learned the value of consistent, small acts of service.",
      ],
    },
  ],
  projects: [
    {
      id: "folio",
      title: "Personal Portfolio",
      category: "Development",
      subtitle: "A little corner of the internet",
      image: "assets/project-portfolio.svg",
      imageAlt: "Illustrative mockup of a green and cream personal portfolio",
      description:
        "A responsive home for my story, skills, and work. Built with simplicity, accessibility, and a thoughtful visual identity in mind.",
      tools: ["HTML", "CSS", "JavaScript"],
      role: "Design & front-end development",
      features: [
        "Responsive layouts for every screen size",
        "Accessible navigation and smooth section reveals",
        "Editable project gallery and contact form",
      ],
      github: "https://github.com/jonhcarlotapire/portfolio",
      demo: "",
      note: "The source link points to this portfolio repository. The mockup is illustrative.",
    },
    {
      id: "budget",
      title: "Pennywise Dashboard",
      category: "Development",
      subtitle: "Make sense of the numbers",
      image: "assets/project-budget.svg",
      imageAlt:
        "Illustrative finance dashboard with a bar chart and expense categories",
      description:
        "A concept for a friendly budget tracker that makes everyday spending a little easier to understand.",
      tools: ["JavaScript", "CSS", "Chart UI"],
      role: "UI concept & front-end planning",
      features: [
        "At-a-glance income and expense overview",
        "Clear transaction categories",
        "Simple visual reports and savings goals",
      ],
      github: "",
      demo: "",
      note: "Concept only: this card illustrates a project you can replace with your own. There is no live app or source repository.",
    },
    {
      id: "bloom",
      title: "Bloom Brand Identity",
      category: "Design",
      subtitle: "A fresh start, by design",
      image: "assets/project-brand.svg",
      imageAlt:
        "Illustrative peach and purple brand identity for a fictional Bloom business",
      description:
        "A sample identity for a small creative business. Warm colors, a distinctive wordmark, and a consistent story across every touchpoint.",
      tools: ["Canva", "Brand Strategy", "Visual Design"],
      role: "Brand research & visual direction",
      features: [
        "Logo exploration and color palette",
        "Social media post templates",
        "A concise visual identity guide",
      ],
      github: "",
      demo: "",
      note: "Illustrative brand concept, not a real client project. Replace it with your design work.",
    },
    {
      id: "market",
      title: "Small Business, Big Ideas",
      category: "Business",
      subtitle: "An idea with a plan behind it",
      image: "assets/project-business.svg",
      imageAlt:
        "Illustrative business proposal document and market analysis charts",
      description:
        "A sample business proposal that connects market research, basic financial planning, and a clear strategy for a sustainable small business.",
      tools: ["Research", "Excel", "PowerPoint"],
      role: "Research, analysis & presentation",
      features: [
        "Customer and competitor research",
        "Basic cost projections and pricing strategy",
        "A structured proposal and pitch presentation",
      ],
      github: "",
      demo: "",
      note: "Example proposal only. Add your actual report, outcomes, and presentation link when available.",
    },
  ],
};
