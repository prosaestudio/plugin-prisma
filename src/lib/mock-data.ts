export const mockCompanies = [
  { id: "c1", name: "Acme Corp", logo: "", userCount: 124, activeCourses: 8, primaryColor: "#4F6BED", createdAt: "2025-01-15" },
  { id: "c2", name: "TechFlow Inc", logo: "", userCount: 56, activeCourses: 5, primaryColor: "#10B981", createdAt: "2025-03-01" },
  { id: "c3", name: "DataBridge AI", logo: "", userCount: 89, activeCourses: 12, primaryColor: "#F59E0B", createdAt: "2025-02-10" },
  { id: "c4", name: "CloudNine Solutions", logo: "", userCount: 34, activeCourses: 3, primaryColor: "#8B5CF6", createdAt: "2025-04-20" },
];

export const mockCourses = [
  { id: "cr1", title: "Introduction to AI & Machine Learning", description: "Learn the fundamentals of artificial intelligence and machine learning concepts.", modules: 8, duration: "4h 30m", enrolled: 45, completion: 72, category: "AI", image: "" },
  { id: "cr2", title: "Data Privacy & Compliance", description: "Understanding GDPR, data protection regulations, and best practices.", modules: 5, duration: "2h 15m", enrolled: 89, completion: 85, category: "Compliance", image: "" },
  { id: "cr3", title: "Leadership in the Digital Age", description: "Develop modern leadership skills for managing distributed teams.", modules: 6, duration: "3h 00m", enrolled: 32, completion: 60, category: "Leadership", image: "" },
  { id: "cr4", title: "Cybersecurity Fundamentals", description: "Essential security practices every employee should know.", modules: 10, duration: "5h 45m", enrolled: 67, completion: 45, category: "Security", image: "" },
  { id: "cr5", title: "Effective Communication", description: "Master professional communication in remote and hybrid workplaces.", modules: 4, duration: "1h 50m", enrolled: 112, completion: 91, category: "Soft Skills", image: "" },
  { id: "cr6", title: "Project Management Essentials", description: "Learn Agile, Scrum, and modern project management methodologies.", modules: 7, duration: "3h 30m", enrolled: 54, completion: 68, category: "Management", image: "" },
];

export const mockUsers = [
  { id: "u1", name: "Sarah Chen", email: "sarah@acmecorp.com", role: "company_admin" as const, status: "active" as const, coursesCompleted: 5, lastActive: "2026-03-05" },
  { id: "u2", name: "John Doe", email: "john@acmecorp.com", role: "learner" as const, status: "active" as const, coursesCompleted: 3, lastActive: "2026-03-06" },
  { id: "u3", name: "Emma Wilson", email: "emma@acmecorp.com", role: "learner" as const, status: "active" as const, coursesCompleted: 7, lastActive: "2026-03-04" },
  { id: "u4", name: "Mike Johnson", email: "mike@acmecorp.com", role: "learner" as const, status: "inactive" as const, coursesCompleted: 1, lastActive: "2026-02-20" },
  { id: "u5", name: "Lisa Park", email: "lisa@acmecorp.com", role: "learner" as const, status: "active" as const, coursesCompleted: 4, lastActive: "2026-03-06" },
];

export const mockQuizzes = [
  { id: "q1", title: "AI Basics Assessment", courseTitle: "Introduction to AI & ML", questions: 15, avgScore: 78, attempts: 42, type: "multiple_choice" as const },
  { id: "q2", title: "GDPR Knowledge Check", courseTitle: "Data Privacy & Compliance", questions: 10, avgScore: 85, attempts: 67, type: "true_false" as const },
  { id: "q3", title: "Security Awareness Quiz", courseTitle: "Cybersecurity Fundamentals", questions: 20, avgScore: 72, attempts: 55, type: "multiple_choice" as const },
];

export const mockAnalytics = {
  totalUsers: 303,
  activeUsers: 245,
  totalCourses: 28,
  completionRate: 74,
  avgQuizScore: 79,
  monthlyActiveGrowth: 12,
  weeklyData: [
    { name: "Mon", users: 180, completions: 24 },
    { name: "Tue", users: 210, completions: 31 },
    { name: "Wed", users: 195, completions: 28 },
    { name: "Thu", users: 230, completions: 35 },
    { name: "Fri", users: 200, completions: 22 },
    { name: "Sat", users: 90, completions: 8 },
    { name: "Sun", users: 75, completions: 5 },
  ],
};
