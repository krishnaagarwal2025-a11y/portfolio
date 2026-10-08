// Source-of-truth data for Krishna Agarwal's portfolio (KrishnaOS)
// Strictly follows the factual information provided without fabricating details.

export const profile = {
  name: "Krishna Agarwal",
  dob: "2007-04-12", // 12 April 2007
  location: "India",
  university: "VIT Vellore",
  degree: "B.Tech",
  semester: "Third semester / Sem 3",
  semesterNumber: 3,
  cgpa: "9.4",
  cgpaDisplay: "9.40",
  status: "OPEN TO INTERNSHIPS",
  careerGoal: "Secure an internship before the end of 2026",
  tagline: "Computer Science student at VIT Vellore interested in cybersecurity, software development, networking, AI systems, embedded systems, and building things that actually work.",
  
  academicInterests: [
    "Computer Science",
    "Cybersecurity",
    "Software Development",
    "Networking",
    "Systems",
    "AI / RAG",
    "Embedded Systems",
    "IoT",
    "Problem Solving",
    "Data Structures and Algorithms",
  ],

  problemSolving: {
    leetcode: "200+ LeetCode problems solved",
    count: "200+",
    areas: ["Data Structures", "Algorithms", "Problem Solving"],
    profileText: "leetcode.krishna07.cv",
    profileUrl: "https://leetcode.krishna07.cv",
  },

  academicAreas: {
    computerScience: [
      "Data Structures (Stack, Queue, Linked List, Trees, Graphs, Skip List)",
      "Algorithms",
      "Operating Systems",
      "Computer Networks",
      "Database Systems",
      "Computer Organization and Architecture (COA)",
      "Object-Oriented Programming",
      "Programming in C/C++, Python, Java",
    ],
    operatingSystemsTopics: [
      "Unix commands",
      "Page Replacement (LFU, Optimal)",
      "Disk Scheduling (SCAN, C-SCAN, LOOK, C-LOOK)",
      "Dining Philosophers Problem",
      "N-Process Bakery Algorithm",
      "Readers-Writers Problem",
      "Banker's Algorithm",
      "CPU Scheduling (SRTF, Priority Preemptive)",
    ],
    networkingTopics: [
      "IPv4 & IP addressing",
      "HLEN & IP fragmentation",
      "IP classes & Subnetting",
      "ARP, Broadcast, Multicast",
      "Bellman-Ford & Distance Vector Routing",
      "Link State Routing & RIP",
      "Routing concepts",
      "Network simulation (Mininet)",
    ],
    mathematicsStatistics: [
      "Normal Distribution",
      "F Distribution",
      "t-test",
      "Chi-square test",
      "Yates correction",
      "Probability and statistics",
    ],
    germanCoursework: [
      "German language coursework",
      "Vocabulary (Family, Food, Time)",
      "Possessive pronouns & Articles",
      "Modal verbs",
      "Akkusativ prepositions",
    ],
  },

  hackathons: [
    { name: "KLA Hackathon", note: "Participant / Technical project work" },
    { name: "IQOO Chennai Hackathon", note: "Hackathon project development" },
    { name: "VIT Vellore Hackathon Work", note: "Campus hackathons & collaborative projects" },
    { name: "Ideathon", note: "Topic: 'Carbon vs Convenience'" },
  ],

  certifications: [
    {
      title: "Merit Certificate",
      issuer: "VIT Vellore",
      status: "CONFIRMED",
    },
    {
      title: "EC-Council Ethical Hacking Course",
      issuer: "EC-Council",
      status: "IN PROGRESS (Ongoing coursework - Not yet certified)",
    },
  ],

  contact: {
    email: "agarwalkrishna1204@gmail.com",
    github: "github.krishna07.cv",
    githubUrl: "https://github.krishna07.cv",
    linkedin: "linkedin.krishna07.cv",
    linkedinUrl: "https://linkedin.krishna07.cv",
    leetcode: "leetcode.krishna07.cv",
    leetcodeUrl: "https://leetcode.krishna07.cv",
    repo: "https://github.com/krishnaagarwal2025-a11y/Memora.git",
    resumeUrl: "/krishna_cyber.pdf",
    resumeFileName: "krishna_cyber.pdf",
  },
};

/**
 * Calculates Krishna's current age in real time.
 * DOB: 12 April 2007
 */
export function calculateRealtimeAge(dobString = "2007-04-12"): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  formatted: string;
} {
  const dob = new Date(dobString);
  const now = new Date();

  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = now.getTime() - dob.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalDays,
    formatted: `${years} years, ${months} months, ${days} days`,
  };
}
