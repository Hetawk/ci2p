// Personal Information Types
export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  personalInfo: {
    sex: string;
    dateOfBirth: string;
    nationality: string;
    placeOfBirth: string;
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    wechat: string;
  };
  profileSummary: string;
  profileImage: string;
}

// Education Types
export interface Education {
  id: string;
  degree: string;
  degreeShort: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "In Progress" | "Completed";
  description: string;
  achievements: string[];
}

// Award Types
export interface Award {
  id: string;
  title: string;
  category: string;
  organization: string;
  date: string;
  description: string;
  type: "Academic" | "Sports" | "Technical" | "Leadership";
  certificateImage: string | null;
  featured: boolean;
}

// Certification Types
export interface Certification {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  skills: string[];
  certificateImage: string | null;
}

// Experience Types
export interface Experience {
  id: string;
  role: string;
  organization: string;
  institution: string | null;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  type: "Leadership" | "Entrepreneurship" | "Teaching" | "Volunteer" | "Work";
  description: string;
  highlights: string[];
}

// Skills Types
export interface Skills {
  technical: string[];
  soft: string[];
  categories: {
    [key: string]: {
      name: string;
      skills: string[];
    };
  };
}

// Language Types
export interface Language {
  language: string;
  proficiency: "Fluent" | "Advanced" | "Intermediate" | "Basic";
  level: 1 | 2 | 3 | 4 | 5;
}

// Interests Types
export type Interests = string[];
