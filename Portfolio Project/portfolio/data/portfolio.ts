import { 
  Code2, 
  Link2, 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  LayoutDashboard, 
  Zap, 
  Sparkles,
  BarChart2,
  Database,
  Layers,
  Brain,
  History
} from "lucide-react";

export const portfolioData = {
  personal: {
    name: "Md Danish Alam",
    role: "Data Analyst (AI & Automation Focus)",
    location: "Hyderabad, India",
    email: "danishalam7700@gmail.com",
    github: "https://github.com/MdDanishAlam7700",
    linkedin: "https://www.linkedin.com/in/md-danish-alam-76b565213/",
    resume: "/resume.pdf"
  },
  
  hero: {
    title: "Md Danish Alam",
    subtitle: "Data Analyst (AI & Automation Focus)",
    tagline: "I turn data, automation, and AI into clear business decisions.",
    subtext: "I specialize in analytics, dashboards, automation with formulas, and AI-assisted workflows."
  },

  services: [
    {
      title: "Financial Analytics & Projections",
      description: "Building robust financial models and predictive growth forecasts to help businesses plan with analytical precision.",
      icon: TrendingUp,
      color: "#00f0ff"
    },
    {
      title: "Dashboard Development",
      description: "Creating interactive, high-impact dashboards in Power BI and Tableau that turn complex datasets into actionable insights.",
      icon: LayoutDashboard,
      color: "#9d00ff"
    },
    {
      title: "Automation & AI Workflows",
      description: "Streamlining operations by building automated systems in Excel, Google Sheets, and AI-driven tools to eliminate manual work.",
      icon: Zap,
      color: "#00f0ff"
    },
    {
      title: "Data Processing & Insights",
      description: "Transforming raw, messy datasets into clean, reliable sources of truth through advanced processing and validation.",
      icon: BarChart2,
      color: "#9d00ff"
    }
  ],

  skills: [
    {
      category: "Data Analytics",
      icon: BarChart2,
      skills: ["Data Cleaning & Preparation", "Data Visualization", "Dashboard Development", "Report Generation", "Statistical Analysis", "Predictive Analytics", "ETL", "Requirements Gathering", "SLA / documentation support"]
    },
    {
      category: "Financial Analytics",
      icon: TrendingUp,
      skills: ["Financial Analysis", "Financial Reporting", "Projections", "Business Analysis", "Cross-functional analysis"]
    },
    {
      category: "Dashboarding & Reporting",
      icon: LayoutDashboard,
      skills: ["Power BI", "Tableau", "Excel dashboards", "PowerPoint reporting"]
    },
    {
      category: "Programming",
      icon: Code2,
      skills: ["Python (Pandas, NumPy)", "SQL", "MySQL"]
    },
    {
      category: "Tools",
      icon: Layers,
      skills: ["Excel (Advanced VBA Macros, Pivot Tables)", "Google Sheets", "JIRA", "PowerPoint", "Claude", "Gemini", "Generative AI platforms", "LLMs"]
    },
    {
      category: "AI & Automation",
      icon: Brain,
      isAI: true,
      skills: ["Generative AI", "Prompt Engineering", "AI Workflows", "AI-assisted automation", "Formula automation", "Reusable templates"]
    },
    {
      category: "Soft Skills",
      icon: Award,
      skills: ["Communication", "Collaboration", "Problem-solving", "Analytical thinking", "Critical thinking", "Leadership", "Time management", "Adaptability"]
    }
  ],

  impact: [
    { label: "Reduced Manual Work", value: "40%", description: "via AI & Formula Automation" },
    { label: "Time Saved Weekly", value: "15+", description: "Hours recovered for strategic tasks" },
    { label: "Interdepartmental Efficiency", value: "25%", description: "Improved through centralized reporting" },
    { label: "Data Error Reduction", value: "30%", description: "Achieved via automated validation" }
  ],

  experience: [
    {
      role: "Business Associate",
      company: "5 Data INC",
      period: "Jul 2025 – Present",
      description: [
        "Report directly to the CEO",
        "Manage confidential business and client financial documents",
        "Automated legacy Google Sheets with complex formulas, AI-powered scripts, and reusable templates",
        "Reduced manual work by 40%",
        "Designed AI-driven models and workflows",
        "Conducted financial and operational analysis",
        "Improved cross-functional efficiency"
      ],
      icon: Briefcase,
      color: "#00f0ff"
    },
    {
      role: "Data Analyst Intern (Healthcare)",
      company: "AI Variant, Bengaluru",
      period: "Aug 2024 – Nov 2024",
      description: [
        "Built Power BI and Tableau dashboards for hospital finance and patient data",
        "Identified cost-saving opportunities",
        "Used Excel and MySQL for analysis",
        "Improved report retrieval time with SQL",
        "Reduced errors through cleaning and validation"
      ],
      icon: Database,
      color: "#9d00ff"
    },
    {
      role: "Data Analyst Intern (HR Analytics)",
      company: "AI Variant, Bengaluru",
      period: "Oct 2023 – Jan 2024",
      description: [
        "Built HR dashboards in Power BI and Tableau",
        "Used Excel and MySQL for employee retention analysis",
        "Applied predictive analytics and AI tools",
        "Reduced discrepancies through cleaner data processes"
      ],
      icon: Brain,
      color: "#00f0ff"
    },
    {
      role: "Intern (Logistics)",
      company: "Flipkart",
      period: "Sep 2022 – Oct 2022",
      description: [
        "Exposure to picking, packing, sorting, and warehouse operations",
        "Understanding of end-to-end logistics and supply chain flow"
      ],
      icon: Zap,
      color: "#9d00ff"
    }
  ],

  certifications: [
    { title: "Generative AI for Professionals", issuer: "IIT Patna", status: "In Progress", color: "#f2c811" },
    { title: "Database Management with MySQL", issuer: "Meta", date: "2025", color: "#00f0ff" },
    { title: "Google Prompting Essentials", issuer: "Google", date: "2025", color: "#00f0ff" },
    { title: "Business Analyst", issuer: "ExcelR Solutions", date: "2023", color: "#9d00ff" },
    { title: "Google Project Management", issuer: "Coursera", status: "In Progress", color: "#f2c811" },
    { title: "Generative AI Career Enrichment", issuer: "IBM", date: "2024", color: "#00f0ff" },
    { title: "Career Essentials in GenAI", issuer: "Microsoft & LinkedIn", date: "2024", color: "#9d00ff" },
    { title: "Prompt Engineering for ChatGPT", issuer: "Vanderbilt/Various", date: "2024", color: "#00f0ff" },
    { title: "Data Visualization", issuer: "IBM / ExcelR", date: "2023", color: "#9d00ff" },
    { title: "Agile Methodologies", issuer: "IBM / ExcelR", date: "2023", color: "#00f0ff" }
  ],

  contact: {
    socials: [
      { icon: Code2, href: "https://github.com/MdDanishAlam7700", label: "GitHub", color: "#00f0ff" },
      { icon: Link2, href: "https://www.linkedin.com/in/md-danish-alam-76b565213/", label: "LinkedIn", color: "#9d00ff" },
      { icon: Mail, href: "mailto:danishalam7700@gmail.com", label: "Email", color: "#00f0ff" },
      { icon: MapPin, label: "Hyderabad, India", color: "#9d00ff", isInfo: true }
    ]
  }
};
