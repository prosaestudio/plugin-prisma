import courseAi from "@/assets/course-ai.jpg";
import courseSecurity from "@/assets/course-security.jpg";
import courseLeadership from "@/assets/course-leadership.jpg";
import courseCommunication from "@/assets/course-communication.jpg";
import coursePrivacy from "@/assets/course-privacy.jpg";
import courseAgile from "@/assets/course-agile.jpg";

// Map course categories or keywords to fallback images
const categoryImageMap: Record<string, string> = {
  "inteligencia artificial": courseAi,
  "ai": courseAi,
  "ia": courseAi,
  "machine learning": courseAi,
  "seguridad": courseSecurity,
  "ciberseguridad": courseSecurity,
  "security": courseSecurity,
  "liderazgo": courseLeadership,
  "leadership": courseLeadership,
  "comunicación": courseCommunication,
  "communication": courseCommunication,
  "habilidades blandas": courseCommunication,
  "soft skills": courseCommunication,
  "privacidad": coursePrivacy,
  "compliance": coursePrivacy,
  "gdpr": coursePrivacy,
  "gestión de proyectos": courseAgile,
  "management": courseAgile,
  "agile": courseAgile,
  "scrum": courseAgile,
};

const fallbackImages = [courseAi, courseSecurity, courseLeadership, courseCommunication, coursePrivacy, courseAgile];

export function getCourseImage(course: { image_url?: string | null; category?: string | null; title?: string; id?: string }): string {
  if (course.image_url) return course.image_url;
  
  const searchText = `${course.category || ""} ${course.title || ""}`.toLowerCase();
  for (const [keyword, img] of Object.entries(categoryImageMap)) {
    if (searchText.includes(keyword)) return img;
  }
  
  // Deterministic fallback based on id
  const hash = (course.id || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return fallbackImages[hash % fallbackImages.length];
}
