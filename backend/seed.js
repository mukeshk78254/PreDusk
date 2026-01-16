const mongoose = require('mongoose');
require('dotenv').config();
const Profile = require('./models/Profile');


const sampleProfile = {
  name: "Mukesh Kumar",
  email: "mukeshk78254@gmail.com",
  education: [
    {
      institution: "National Institute of Technology Meghalaya",
      degree: "B.Tech",
      field: "Electronics and Communication Engineering (ECE)",
      startYear: 2023,
      endYear: 2027
    }
  ],
  skills: [
    "React.js",
    "Next.js 14",
    "Tailwind CSS",
    "Node.js",
    "Express.js",
    "Solana Blockchain",
    "Ethereum",
    "Web3.js",
    "Solidity",
    "Rust",
    "Anchor Framework",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Redis",
    "JavaScript",
    "TypeScript",
    "Python",
    "C++",
    "Golang",
    "AWS",
    "Docker",
    "Kubernetes",
    "Socket.IO",
    "TensorFlow.js",
    "OpenAI API",
    "NLP",
    "JWT",
    "RBAC",
    "Judge0 API",
    "Razorpay",
    "Twilio API"
  ],
  projects: [
    {
      title: "Coder World - Competitive Programming Platform",
      description: "Built a high-performance platform handling 1,000+ concurrent users with 99.5% uptime, optimizing load times by 60% through strategic Redis Caching and optimistic UI updates. Engineered a code execution pipeline using Judge0 API and integrated OpenAI API to provide AI-driven code optimization suggestions. Developed real-time Contest Leaderboards and analytics using Socket.IO, reducing server requests by 45% while ensuring secure payments via Razorpay.",
      links: {
        github: "https://github.com/mukeshk78254/CoderWorld3855",
        demo: "https://coder-world3855.vercel.app/"
      },
      technologies: ["React", "Node.js", "Express.js", "MongoDB", "Redis", "Socket.IO", "Judge0 API", "OpenAI API", "Razorpay", "JavaScript"]
    },
    {
      title: "Solana-Based Immutable Content Storage Solution (Solana Note App)",
      description: "Developed a decentralized application on the Solana Blockchain (Devnet) using Rust and the Anchor Framework, implementing Program Derived Addresses (PDAs) for tamper-proof, on-chain data storage. Integrated Solana Wallet Adapter for secure, non-custodial authentication (Phantom/Solflare), eliminating the security risks associated with centralized password storage. Orchestrated a type-safe, mobile-responsive frontend using Next.js 14, React 18, and Tailwind CSS, utilizing custom hooks to manage blockchain state efficiently.",
      links: {
        github: "https://github.com/mukeshk78254/noteapp",
        demo: "https://noteapp-xqd5.vercel.app/"
      },
      technologies: ["Blockchain", "Solana", "Rust", "Anchor Framework", "Next.js 14", "React 18", "Tailwind CSS", "Web3.js", "Phantom Wallet", "Solflare"]
    },
    {
      title: "Smart AI-Powered Helpdesk Ticketing System",
      description: "Engineered an intelligent NLP system with 92% classification accuracy for Smart India Hackathon 2025, successfully automating ticket routing for over 10,000 employees and reducing manual operational workloads by 70%. Achieved 65% faster resolution times and an 85% first-contact resolution rate by implementing autonomous handling for common IT issues. Architected a unified MERN Full-Stack system that consolidated three separate platforms into one, securing all data transactions with JWT, Redis caching, and strict RBAC protocols. Implemented SLA Management and Real-Time Escalation workflows using Socket.IO and Twilio API, complete with a custom Analytics Dashboard for live monitoring.",
      links: {
        github: "https://github.com/mukeshk78254/SIH_2025_themetroid_DEMO",
        demo: "https://sih-2025-themetroid-demo.vercel.app/auth"
      },
      technologies: ["Python", "MongoDB", "Express.js", "React", "Node.js", "NLP", "TensorFlow.js", "Socket.IO", "Twilio API", "Redis", "JWT", "RBAC"]
    }
  ],
  work: [
    {
      company: "Smart India Hackathon 2025",
      position: "Backend Developer",
      startDate: new Date("2025-10-01"),
      endDate: new Date("2025-10-31"),
      description: "Developed an AI-powered helpdesk ticketing system with 92% NLP classification accuracy, automating ticket routing for 10,000+ employees and reducing manual workload by 70%"
    }
  ],
  links: {
    github: "https://github.com/mukeshk78254",
    linkedin: "https://www.linkedin.com/in/mukesh-kumar90",
    portfolio: "https://pp-93jkg2m4z-coderworlds-projects.vercel.app/",
    resume: "https://drive.google.com/file/d/1NfKN-pdDQNcv2AqbAAqzmOvgTFcGshsS/view?usp=drivesdk"
  }
};

async function seedDatabase() {
  try {
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    
    await Profile.deleteMany({});
    console.log('Clear profiles');
    const profile = await Profile.create(sampleProfile);
    console.log('Seed data inserted successfully');
    console.log('Profile ID:', profile._id);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
