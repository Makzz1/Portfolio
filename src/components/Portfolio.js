import React, { useState, useEffect } from 'react';
import { Award, Calendar, Briefcase, Phone, Mail, Linkedin, Code, Box, Network } from 'lucide-react';
import { mockData } from '../data/mock';
import TextPressure from './TextPressure';
import Dither from './Dither';

const Portfolio = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [leetcodeLoading, setLeetcodeLoading] = useState(true);

  useEffect(() => {
    const fetchLeetCode = async () => {
      try {
        const res = await fetch('https://alfa-leetcode-api.onrender.com/userProfile/makzz');
        if (!res.ok) throw new Error('Alfa API failed');
        const data = await res.json();
        if (data && data.totalSolved !== undefined) {
          setLeetcodeStats(data);
          setLeetcodeLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Primary LeetCode API failed, trying fallback API...', err);
      }

      try {
        const res = await fetch('https://leetcode-stats-api.herokuapp.com/makzz');
        if (!res.ok) throw new Error('Heroku API failed');
        const data = await res.json();
        if (data.status === "success") {
          setLeetcodeStats({
            totalSolved: data.totalSolved,
            totalQuestions: data.totalQuestions,
            easySolved: data.easySolved,
            totalEasy: data.totalEasy,
            mediumSolved: data.mediumSolved,
            totalMedium: data.totalMedium,
            hardSolved: data.hardSolved,
            totalHard: data.totalHard,
            ranking: data.ranking
          });
          setLeetcodeLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Secondary API failed, using latest known static fallback.', err);
      }

      // Static Fallback Data in case both public APIs are rate limited
      setLeetcodeStats({
        totalSolved: 292,
        totalQuestions: 3879,
        easySolved: 122,
        totalEasy: 933,
        mediumSolved: 156,
        totalMedium: 2030,
        hardSolved: 14,
        totalHard: 916,
        ranking: 462428
      });
      setLeetcodeLoading(false);
    };

    fetchLeetCode();
    setIsVisible(true);
  }, []);

  // Smooth scroll function
  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Handle navigation click
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    smoothScrollTo(targetId);
  };

  return (
    <div className="portfolio-wrapper">
      {/* Dynamic Background - Covers entire page */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: '-2' }}>
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      
      {/* Grid Overlay - Covers entire page */}
      <div className="grid-background">
        <div className="grid-overlay"></div>
      </div>
      
      {/* Header */}
      <header className="header sticky top-0 z-50">
        <div className="container">
          <div className="flex justify-between items-center py-6">
            <div className="header-logo glow-text">
              PORTFOLIO
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="nav-link" onClick={(e) => handleNavClick(e, 'home')}>HOME</a>
              <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, 'about')}>ABOUT</a>
              <a href="#education" className="nav-link" onClick={(e) => handleNavClick(e, 'education')}>EDUCATION</a>
              <a href="#skills" className="nav-link" onClick={(e) => handleNavClick(e, 'skills')}>SKILLS</a>
              <a href="#projects" className="nav-link" onClick={(e) => handleNavClick(e, 'projects')}>PROJECTS</a>
              <a href="#certificates" className="nav-link" onClick={(e) => handleNavClick(e, 'certificates')}>CERTIFICATES</a>
              <a href="#contact" className="nav-link" onClick={(e) => handleNavClick(e, 'contact')}>CONTACT</a>
            </nav>
            <a href="#contact" className="btn-accent" onClick={(e) => handleNavClick(e, 'contact')}>
              GET IN TOUCH
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className={`py-32 relative z-10 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        <div className="container" style={{ position: 'relative', zIndex: '2' }}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="label mb-8 glow-text">CREATIVE DEVELOPER</div>
            <div style={{position: 'relative', height: '200px', marginBottom: '3rem'}}>
              <TextPressure
                text="DIGITAL CRAFTSMAN"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={36}
              />
            </div>
            <p className="text-big mb-16 max-w-2xl mx-auto text-secondary">
              Building exceptional digital experiences through innovative design and clean code
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <a href="#projects" className="btn-accent hover-scale" onClick={(e) => handleNavClick(e, 'projects')}>
                VIEW MY WORK
              </a>
              <a href="#about" className="btn-primary" onClick={(e) => handleNavClick(e, 'about')}>
                ABOUT ME
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <div className="label mb-4 glow-text">ABOUT</div>
            <h2 className="about-title mb-8">WHO I AM</h2>
          </div>
          <div className="about-section mb-20">
            <p>
              Hi, I'm Maghizhvanban E S — a passionate software developer and creative problem solver who loves building intuitive, impactful digital solutions. Whether it's crafting clean code, designing efficient architectures, or tackling complex technical challenges, I enjoy transforming ideas into working systems. I thrive at the intersection of logic and creativity, always learning, iterating, and pushing boundaries.
            </p>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-8 text-body mt-8">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-400" />
              <a href="mailto:maghizhvanban@gmail.com" className="hover:text-red-400 transition-colors">
                maghizhvanban@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-400" />
              <span>+91 9486307067</span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-red-400" />
              <a href="https://linkedin.com/in/maghizh1" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">
                linkedin.com/in/maghizh1
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 section-dark relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <div className="label mb-4 glow-text">EDUCATION</div>
            <h2 className="title-big mb-8">ACADEMIC BACKGROUND</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="card mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="card-title mb-2 text-red-400">SSN COLLEGE OF ENGINEERING</div>
                  <h3 className="text-regular mb-2">B.Tech in Information Technology</h3>
                  <div className="flex items-center text-body text-secondary mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    July 2023 – May 2027
                  </div>
                  <div className="text-body mb-4">
                    <span className="text-red-400 font-medium">CGPA:</span> 8.372/10.00
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-body font-medium mb-3 text-red-400">COURSEWORK</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Computer Architecture',
                    'Advanced Data Structure',
                    'Computational Theory',
                    'Database Management',
                    'Probability and Statistics',
                    'Machine Learning'
                  ].map((course, index) => (
                    <span key={index} className="label-small bg-gray-800 border border-gray-600 px-3 py-1">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-body font-medium mb-3 text-red-400">ADDITIONAL COURSES</h4>
                <div className="space-y-2 text-body text-secondary">
                  <div>• Nptel - Ethical Hacking and Java Programming</div>
                  <div>• Udemy - Python Bootcamp</div>
                  <div>• Google - Data Analytics Course</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <div className="label mb-4 glow-text">EXPERTISE</div>
            <h2 className="title-big mb-8">SKILLS & TECHNOLOGIES</h2>
          </div>
          
          <div className="max-w-6xl mx-auto space-y-16">
            {[
              {
                title: "PROGRAMMING",
                skills: [
                  { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
                  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
                  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
                  { name: "Ruby", icon: "https://cdn.simpleicons.org/ruby/CC342D" },
                  { name: "SQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" }
                ]
              },
              {
                title: "BACKEND & FRAMEWORKS",
                skills: [
                  { name: "Flask", icon: "https://cdn.simpleicons.org/flask/white" },
                  { name: "FastAPI", icon: "https://cdn.simpleicons.org/fastapi/009688" },
                  { name: "Flutter", icon: "https://cdn.simpleicons.org/flutter/02569B" }
                ]
              },
              {
                title: "DATABASES",
                skills: [
                  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
                  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
                  { name: "Elasticsearch", icon: "https://cdn.simpleicons.org/elasticsearch/005571" }
                ]
              },
              {
                title: "LIBRARIES & TOOLS",
                skills: [
                  { name: "Pandas", icon: "https://cdn.simpleicons.org/pandas/150458" },
                  { name: "NumPy", icon: "https://cdn.simpleicons.org/numpy/013243" },
                  { name: "SciKit-Learn", icon: "https://cdn.simpleicons.org/scikitlearn/F7931E" },
                  { name: "PyCharm", icon: "https://cdn.simpleicons.org/pycharm/white" },
                  { name: "VS Code", icon: "https://cdn.simpleicons.org/visualstudiocode/007ACC" }
                ]
              },
              {
                title: "CLOUD & DEVOPS",
                skills: [
                  { name: "Docker", icon: "https://cdn.simpleicons.org/docker/2496ED" },
                  { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
                  { name: "GitHub", icon: "https://cdn.simpleicons.org/github/white" },
                  { name: "Render", icon: "https://cdn.simpleicons.org/render/46E3B7" },
                  { name: "Postman", icon: "https://cdn.simpleicons.org/postman/FF6C37" },
                  { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/3ECF8E" }
                ]
              }
            ].map((category, idx) => (
              <div key={idx} className="w-full">
                <div className="card-title mb-8 text-xl text-red-400 border-b border-gray-700 pb-2 text-center">{category.title}</div>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 w-full">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="flex flex-col items-center justify-center hover:-translate-y-2 hover:scale-110 transition-all duration-300 cursor-pointer group">
                      <img src={skill.icon} alt={skill.name} className="w-16 h-16 mb-4 filter drop-shadow-md group-hover:drop-shadow-2xl transition-all" />
                      <span className="text-body font-bold text-gray-300 group-hover:text-white transition-colors tracking-wide">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Concepts */}
            <div className="w-full">
              <div className="card-title mb-8 text-xl text-red-400 border-b border-gray-700 pb-2 text-center">CONCEPTS</div>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 w-full opacity-90">
                <div className="flex flex-col items-center justify-center hover:-translate-y-2 hover:scale-110 transition-all duration-300 cursor-pointer group">
                  <Code className="w-16 h-16 mb-4 text-blue-400 filter drop-shadow-md group-hover:drop-shadow-2xl transition-all" />
                  <span className="text-body font-bold text-gray-300 group-hover:text-white transition-colors text-center tracking-wide">Data Structures &amp; Algorithms</span>
                </div>
                <div className="flex flex-col items-center justify-center hover:-translate-y-2 hover:scale-110 transition-all duration-300 cursor-pointer group">
                  <Box className="w-16 h-16 mb-4 text-purple-400 filter drop-shadow-md group-hover:drop-shadow-2xl transition-all" />
                  <span className="text-body font-bold text-gray-300 group-hover:text-white transition-colors text-center tracking-wide">Microservices Fundamentals</span>
                </div>
                <div className="flex flex-col items-center justify-center hover:-translate-y-2 hover:scale-110 transition-all duration-300 cursor-pointer group">
                  <Network className="w-16 h-16 mb-4 text-green-400 filter drop-shadow-md group-hover:drop-shadow-2xl transition-all" />
                  <span className="text-body font-bold text-gray-300 group-hover:text-white transition-colors text-center tracking-wide">Distributed Systems Basics</span>
                </div>
              </div>
            </div>
          </div>

          {/* LeetCode Stats - Separate Section */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="text-center mb-8">
              <div className="label mb-4 glow-text">CODING PRACTICE</div>
              <h3 className="text-big mb-4">LEETCODE STATISTICS</h3>
            </div>
            
            <div className="card">
              {leetcodeLoading ? (
                <div className="flex justify-center flex-col items-center py-8">
                  <div className="w-8 h-8 border-4 border-gray-600 border-t-accent-primary rounded-full animate-spin mb-4"></div>
                  <div className="text-secondary text-body">Loading real-time stats...</div>
                </div>
              ) : leetcodeStats ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-body text-secondary">Total Solved:</span>
                    <span className="text-regular text-accent-primary">{leetcodeStats.totalSolved}/{leetcodeStats.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body text-secondary">Easy:</span>
                    <span className="text-regular text-green-400">{leetcodeStats.easySolved}/{leetcodeStats.totalEasy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body text-secondary">Medium:</span>
                    <span className="text-regular text-yellow-400">{leetcodeStats.mediumSolved}/{leetcodeStats.totalMedium}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body text-secondary">Hard:</span>
                    <span className="text-regular text-red-500">{leetcodeStats.hardSolved}/{leetcodeStats.totalHard}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body text-secondary">Rank:</span>
                    <span className="text-regular text-accent-primary">{leetcodeStats.ranking?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-600 mt-4">
                    <a 
                      href="https://leetcode.com/u/makzz/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-body text-accent-primary hover:text-accent-hover transition-colors inline-block mt-2"
                    >
                      View Profile →
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-red-400 py-4">Failed to load statistics.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Internships Section */}
      <section id="internships" className="py-20 section-dark relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <div className="label mb-4 glow-text">PROFESSIONAL EXPERIENCE</div>
            <h2 className="title-big mb-8">INTERNSHIPS</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="card-title mb-2 text-red-400">ISRO – MAHENDRAGIRI, TAMIL NADU</div>
                  <h3 className="text-regular mb-2">Research Intern</h3>
                  <div className="flex items-center text-body text-secondary mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    June 2 - 16, 2025
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 text-body text-secondary mb-6">
                <div>
                  • Developed a log management tool using Python and Pandas to parse, filter, and analyze network logs at ISRO's Propulsion Complex.
                </div>
                <div>
                  • Visited multiple ISRO sites and learned about real-world operations across propulsion, telemetry, testing, and satellite systems.
                </div>
                <div>
                  • Created comprehensive documentation for subsystem integration.
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['Python', 'Pandas', 'Data Analysis', 'Network Logs', 'Documentation'].map((tech, index) => (
                  <span key={index} className="label-small bg-gray-800 border border-gray-600 px-3 py-1">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conferences Section */}
      <section id="conferences" className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <div className="label mb-4 glow-text">SPEAKING & EVENTS</div>
            <h2 className="title-big mb-8">CONFERENCES & PRESENTATIONS</h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {/* National Student Conference */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="card-title mb-2 text-red-400">IIST – THIRUVANANTHAPURAM, KERALA</div>
                  <h3 className="text-regular mb-2">National Student Conference</h3>
                  <div className="flex items-center text-body text-secondary mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    June 17-18, 2025
                  </div>
                </div>
              </div>
              
              <div className="text-body text-secondary">
                Attended expert sessions led by senior ISRO scientists and researchers from across India, gaining insights into cutting-edge space technology and research methodologies.
              </div>
            </div>
            
            {/* Industry-Academia Conference */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="card-title mb-2 text-red-400">NOKIA NETWORKS – CHENNAI, TAMIL NADU</div>
                  <h3 className="text-regular mb-2">Industry-Academia Tech Conference</h3>
                  <div className="flex items-center text-body text-secondary mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    July 11, 2025
                  </div>
                </div>
              </div>
              
              <div className="text-body text-secondary mb-4">
                Presented a paper on SDN-based ECMP traffic balancing in data center networks and engaged with industry engineers on real-world 5G and SDN deployment strategies.
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['SDN', 'ECMP', '5G Networks', 'Data Centers', 'Traffic Balancing'].map((tech, index) => (
                  <span key={index} className="label-small bg-gray-800 border border-gray-600 px-3 py-1">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <div className="label mb-4 glow-text">SELECTED WORK</div>
            <h2 className="title-big mb-8">PROJECTS</h2>
            <p className="text-body max-w-2xl mx-auto text-secondary">
              A collection of projects that showcase my skills and passion for creating meaningful digital solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockData.projects.map((project, index) => (
              <div
                key={project.id}
                className="card hover-lift cursor-pointer"
                onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
              >
                <div className="aspect-video bg-gray-900 mb-6 overflow-hidden border border-gray-700 relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className={`w-full h-full object-cover hover-scale opacity-80 ${project.status === 'ongoing' ? 'filter blur-sm' : ''}`}
                  />
                  {project.status === 'ongoing' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                      <div className="text-center w-full px-4">
                        <span className="text-accent-primary font-bold text-xl uppercase tracking-widest block text-center">
                          ONGOING PROJECT
                        </span>
                        <div className="w-16 h-0.5 bg-accent-primary mx-auto mt-2"></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="card-title text-accent-primary text-center">{project.category}</div>
                <h3 className="text-regular mb-4 text-center">{project.title}</h3>
                <p className="text-body mb-6 text-secondary text-center">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="label-small bg-gray-800 border border-gray-600 px-3 py-1">
                      {tech}
                    </span>
                  ))}
                </div>
                
                {activeProject === project.id && (
                  <div className="text-center border-t border-gray-600 pt-6 animate-in slide-in-from-top duration-300">
                    <div className="w-full">
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`btn-primary px-12 py-3 ${project.status === 'ongoing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={project.status === 'ongoing' ? (e) => e.preventDefault() : undefined}
                      >
                        {project.status === 'ongoing' ? 'CODE (SOON)' : 'CODE'}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <div className="label mb-4 glow-text">ACHIEVEMENTS</div>
            <h2 className="title-big mb-8">CERTIFICATES</h2>
            <p className="text-body max-w-2xl mx-auto text-secondary">
              Professional certifications and achievements that demonstrate my commitment to continuous learning
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockData.certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="card flex flex-col h-full"
                >
                  {/* Certificate Image */}
                  <div className="mb-4 flex-grow">
                    <div className="w-full h-80 bg-white border border-gray-600 rounded-lg overflow-hidden">
                      <img 
                        src={certificate.image} 
                        alt={`${certificate.title} Certificate`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="card-title mb-2 text-accent-primary">{certificate.issuer}</div>
                    <h3 className="text-regular mb-2">{certificate.title}</h3>
                    <div className="flex items-center justify-center text-body text-secondary mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      {certificate.date}
                    </div>
                    
                    <p className="text-body text-secondary mb-4">{certificate.description}</p>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      {certificate.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="label-small bg-gray-800 border border-gray-600 px-3 py-1">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative z-10">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <div className="label mb-4 glow-text">GET IN TOUCH</div>
            <h2 className="title-big mb-8">LET'S WORK TOGETHER</h2>
            <p className="text-body mb-12 text-secondary">
              Ready to bring your ideas to life? Let's discuss how we can create something amazing together.
            </p>
            <div className="mt-8">
              <a href="mailto:maghizhvanban@gmail.com" className="btn-accent hover-scale px-12">
                MAIL ME
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border-t border-gray-700 py-12 relative z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="header-logo mb-4 md:mb-0 glow-text">
              PORTFOLIO
            </div>
            <div className="flex space-x-8">
              <a href="https://linkedin.com/in/maghizh1" target="_blank" rel="noopener noreferrer" className="nav-link">LINKEDIN</a>
              <a href="https://github.com/Makzz1" target="_blank" rel="noopener noreferrer" className="nav-link">GITHUB</a>
              <a href="mailto:maghizhvanban@gmail.com" className="nav-link">EMAIL</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-body text-secondary">
              © 2024 PORTFOLIO. CRAFTED WITH PASSION AND PRECISION.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;