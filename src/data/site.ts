import { profile } from "./profile";

export const site = {
  name: profile.name,
  os: "KrishnaOS",
  dob: profile.dob,
  location: profile.location,
  education: `${profile.degree}, ${profile.semester}, ${profile.university}`,
  cgpa: profile.cgpa,
  summary: profile.tagline,
  status: profile.status,
  careerGoal: profile.careerGoal,
  areas: profile.academicInterests,
  contact: profile.contact,
  resumeUrl: profile.contact.resumeUrl,
};
