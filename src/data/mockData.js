// Mock user data
export const currentUser = {
  id: 1,
  name: "Jane Doe",
  title: "Senior Front-end Developer",
  company: "TechFlow Inc.",
  location: "San Francisco, CA",
  email: "jane.doe@example.com",
  avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  bio: "Passionate front-end developer with 5+ years of experience building responsive, user-friendly web applications.",
  skills: ["React", "JavaScript", "TypeScript", "CSS", "Tailwind", "UI/UX"],
  experience: [
    {
      id: 1,
      role: "Senior Front-end Developer",
      company: "TechFlow Inc.",
      period: "2022 - Present",
      description: "Leading the front-end team in developing modern web applications."
    },
    {
      id: 2,
      role: "Front-end Developer",
      company: "InnovateWeb",
      period: "2020 - 2022",
      description: "Developed responsive web interfaces for various clients."
    }
  ],
  education: [
    {
      id: 1,
      degree: "M.S. Computer Science",
      institution: "Stanford University",
      year: "2020"
    },
    {
      id: 2,
      degree: "B.S. Computer Science",
      institution: "UC Berkeley",
      year: "2018"
    }
  ],
  connections: 348,
  pitchVideo: "https://example.com/pitch-video.mp4",
  pitchTranscript: "Hi, I'm Jane Doe, a Senior Front-end Developer with experience in building modern web applications using React and TypeScript. I'm passionate about creating intuitive user interfaces and optimizing performance."
};

// Mock recommended connections
export const recommendedConnections = [
  {
    id: 2,
    name: "John Smith",
    title: "UX Designer",
    company: "DesignHub",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    mutualConnections: 12,
    skills: ["UI/UX", "Figma", "User Research"]
  },
  {
    id: 3,
    name: "Emily Johnson",
    title: "Product Manager",
    company: "ProductLabs",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    mutualConnections: 8,
    skills: ["Product Strategy", "Agile", "User Stories"]
  },
  {
    id: 4,
    name: "Michael Brown",
    title: "Backend Developer",
    company: "ServerTech",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    mutualConnections: 5,
    skills: ["Node.js", "Python", "MongoDB"]
  }
];

// Mock job listings
export const jobListings = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "InnovateTech",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $150k",
    description: "We're looking for a Senior React Developer to join our team and help build cutting-edge web applications.",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with state management libraries",
      "Understanding of web performance optimization"
    ],
    postedDate: "2 days ago",
    matchPercentage: 92
  },
  {
    id: 2,
    title: "Front-end Lead",
    company: "WebSolutions",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$130k - $160k",
    description: "Looking for a Front-end Lead to manage our team of developers and oversee front-end architecture.",
    requirements: [
      "7+ years of front-end development experience",
      "3+ years of team leadership",
      "Strong React and TypeScript skills",
      "Experience with performance optimization"
    ],
    postedDate: "1 week ago",
    matchPercentage: 85
  },
  {
    id: 3,
    title: "UX/UI Developer",
    company: "DesignForward",
    location: "New York, NY",
    type: "Contract",
    salary: "$90k - $110k",
    description: "Seeking a UX/UI Developer who can bridge the gap between design and implementation.",
    requirements: [
      "3+ years of front-end development",
      "Strong design skills with Figma or similar tools",
      "Understanding of UI/UX principles",
      "Experience with React preferred"
    ],
    postedDate: "3 days ago",
    matchPercentage: 78
  }
];

// Mock networking rooms
export const networkingRooms = [
  {
    id: 1,
    title: "Breaking into Tech: Tips for New Developers",
    host: {
      name: "Sarah Williams",
      title: "Senior Engineering Manager",
      company: "TechGiants",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg"
    },
    participants: 156,
    speakers: 4,
    scheduledTime: "Today, 3:00 PM",
    duration: "1 hour",
    topics: ["Career Advice", "Technology", "Junior Developers"]
  },
  {
    id: 2,
    title: "The Future of Front-end Development",
    host: {
      name: "Alex Rodriguez",
      title: "CTO",
      company: "FutureTech",
      avatar: "https://randomuser.me/api/portraits/men/15.jpg"
    },
    participants: 89,
    speakers: 3,
    scheduledTime: "Tomorrow, 4:30 PM",
    duration: "1.5 hours",
    topics: ["React", "Web Development", "Technology Trends"]
  },
  {
    id: 3,
    title: "Women in Tech: Challenges and Opportunities",
    host: {
      name: "Lisa Chen",
      title: "VP of Engineering",
      company: "InnovateCorp",
      avatar: "https://randomuser.me/api/portraits/women/20.jpg"
    },
    participants: 203,
    speakers: 5,
    scheduledTime: "Mar 31, 5:00 PM",
    duration: "2 hours",
    topics: ["Diversity", "Career Growth", "Leadership"]
  }
];

// Mock messages
export const messages = [
  {
    id: 1,
    conversation: [
      {
        id: 1,
        sender: {
          id: 2,
          name: "John Smith",
          avatar: "https://randomuser.me/api/portraits/men/2.jpg"
        },
        content: "Hi Jane, I saw your profile and was impressed by your experience. Would you be open to chatting about potential collaboration?",
        timestamp: "2023-03-28T10:30:00Z",
        type: "text"
      },
      {
        id: 2,
        sender: {
          id: 1,
          name: "Jane Doe",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg"
        },
        content: "Hi John, thanks for reaching out! I'd be happy to chat about collaboration opportunities. When would be a good time for you?",
        timestamp: "2023-03-28T11:15:00Z",
        type: "text"
      }
    ],
    unreadCount: 0
  },
  {
    id: 2,
    conversation: [
      {
        id: 1,
        sender: {
          id: 3,
          name: "Emily Johnson",
          avatar: "https://randomuser.me/api/portraits/women/3.jpg"
        },
        content: "Hey Jane, I'm organizing a virtual meetup for developers in our area next week. Would you be interested in joining or even speaking?",
        timestamp: "2023-03-27T14:20:00Z",
        type: "text"
      }
    ],
    unreadCount: 1
  }
];

// Mock notifications
export const notifications = [
  {
    id: 1,
    type: "connection",
    content: "John Smith accepted your connection request",
    timestamp: "2023-03-28T09:45:00Z",
    read: false
  },
  {
    id: 2,
    type: "job",
    content: "New job match: Senior React Developer at InnovateTech",
    timestamp: "2023-03-27T16:30:00Z",
    read: true
  },
  {
    id: 3,
    type: "room",
    content: "The Future of Front-end Development room starts in 30 minutes",
    timestamp: "2023-03-27T15:00:00Z",
    read: false
  }
]; 