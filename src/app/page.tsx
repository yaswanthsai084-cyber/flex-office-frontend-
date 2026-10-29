"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Easing } from 'framer-motion';
import HeroSlider from '../components/HeroSlider';

// ===================== Motion variants =====================
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as Easing },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

// ===================== Data =====================
const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Our Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '#contact' },
];

const services = [
  {
    title: 'Office Space Design & Build',
    body: 'Our team of expert office design consultants will work with you to understand your brand, culture, and business needs. We’ll collaborate with you to create a comprehensive design brief that will guide our entire design process. From space planning and layout design to furniture selection and material finishes, we provide in-depth consultancy services that ensure your workspace reflects your unique company identity.',
    icon: '🏢',
  },
  {
    title: 'Office Design',
    body: 'Drawing upon our extensive experience, we’ll use data-driven insights to create a bespoke office design that aligns with your brand, values, and culture. Our expert team will work closely with you throughout the design process, from initial concepts and 3D visualisations to detailed drawings and office space specifications. We’ll ensure every aspect of your workspace is curated and planned to perfection.',
    icon: '🎨',
  },
  {
    title: 'Office Fit-Out',
    body: 'Our team of skilled professionals will bring your office design to life, managing every aspect of the fit-out process from start to finish. We’ll handle all construction work, furniture installation and IT infrastructure requirements, ensuring your project is completed on time and within budget. Our focus on quality design, craftsmanship, and attention to detail sets us apart as one of the leading office fit-out companies in the UK.',
    icon: '🛠️',
  },
  {
    title: 'Office Refurbishment',
    body: 'As businesses grow and evolve, so do their workspace needs. Our office refurbishment services allow you to adapt your existing space to better meet the changing demands of your organisation. Whether it’s a complete overhaul or minor updates, our team will work with you to create an efficient and aesthetically pleasing workspace that supports productivity and well-being.',
    icon: '🔨',
  },
];

const projects = [
  { client: 'Infor', time: '6 weeks', size: '13,000 sq ft', logo: '💼' },
  { client: 'px Group', time: '16 weeks', size: '30,000 sq ft', logo: '📊' },
  { client: 'Northbank House', time: '6 weeks', size: '2,000 sq ft', logo: '🏢' },
  { client: 'Confidential Client – Automotive Sector', time: '9 weeks', size: '6,300 sq ft', logo: '🚗' },
  { client: 'UCAS', time: '6 weeks', size: '2,000 sq ft', logo: '🎓' },
  { client: 'Northern Trust', time: '17 weeks', size: '12500 sq ft', logo: '🏛️' },
  { client: 'DB Cargo UK Ltd', time: '20 weeks', size: '14,000 sq ft', logo: '🚂' },
  { client: 'Mileway', time: '5 weeks', size: '2,152 sq ft', logo: '📦' },
  { client: 'Kinesso', time: '6 weeks', size: '10,350 sq ft', logo: '📈' },
  { client: 'Apadmi', time: '8 weeks', size: '5,300 sq ft', logo: '📱' },
];

const steps = [
  {
    num: '1', title: 'Define',
    body: 'Agree on project brief. Establish design outputs. Determine procurement strategy. Our design and construction philosophies are wholly centred on your requirements and vision. Our mission is to shape an environment that reflects your unique corporate identity. This begins by deeply comprehending your objectives for the design and construction project. We employ a data-driven approach tailored to extract valuable insights from your team, enabling us to craft a workspace that fosters their productivity and satisfaction.',
  },
  {
    num: '2', title: 'Design',
    body: 'Develop detailed design, specifications and cost plan. Our goal is to transform your ideas into tangible realities. Our skilled office design team specialises in conceiving work environments that not only mirror but also support your business goals. We are committed to designing workspaces that are both pleasant and practical for your workforce. Tailoring our design approach to address your specific needs and challenges, we aim to realise your concept of the ideal workplace.',
  },
  {
    num: '3', title: 'Deliver',
    body: 'Seamlessly project manage the delivery of your new workspace. We work in partnership with you to bring to life an office design that meets your specific needs. With our network of trusted suppliers and contractors, we ensure that your project is delivered on time and within budget. Our dedicated project management team assumes overall responsibility for planning, coordinating, and executing the construction process from start to finish.',
  },
];

const posts = [
  { title: 'Should You Refurbish Your Existing Office or Relocate?', excerpt: 'The negative effects of a cramped office extend beyond the inconvenience of not being able to sit somewhere. While people struggle to find desk space when they... Read More' },
  { title: 'How can you downsize an office without compromising how people work?', excerpt: 'When done right, reducing the size of an office is a smart and increasingly popular way to reduce a high fixed cost. Done wrong, though, and it... Read More' },
  { title: 'Top Office Design Trends for 2026', excerpt: 'with Samantha Norris, Head of Design. At OfficeInsight, everything we deliver starts with our people and Samantha is a brilliant example of that. She brings deep experience across workplace consultancy, interior design and... Read More' },
];

// ===================== Components =====================
function SectionHeading({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className="section-heading"
    >
      <motion.span variants={fadeUp} className="section-tag">{tag}</motion.span>
      <motion.h2 variants={fadeUp} className="section-title">{title}</motion.h2>
      {subtitle ? <motion.p variants={fadeUp} className="section-subtitle">{subtitle}</motion.p> : null}
    </motion.div>
  );
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as Easing }}
      className="service-card"
    >
      <div className="service-icon">{service.icon}</div>
      <h3>{service.title}</h3>
      <p>{service.body}</p>
      <a href="#" className="service-link">Find Out More &rarr;</a>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] as Easing }}
      className="project-card"
    >
      <div className="project-thumb">{project.logo}</div>
      <div className="project-info">
        <h3 className="project-client">{project.client}</h3>
        <div className="project-meta">
          <span className="project-stat"><strong>Time:</strong> {project.time}</span>
          <span className="project-stat"><strong>Office Size:</strong> {project.size}</span>
        </div>
        <a href="#">View Project &rarr;</a>
      </div>
    </motion.div>
  );
}

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] as Easing }}
      className="step"
    >
      <div className="step-number">{step.num}</div>
      <div className="step-content">
        <h3>{step.title}</h3>
        <p>{step.body}</p>
      </div>
    </motion.div>
  );
}

function PostCard({ post, index }: { post: typeof posts[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as Easing }}
      className="post-card"
    >
      <div className="post-thumb">📰</div>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-excerpt">{post.excerpt}</p>
    </motion.div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      {/* ===================== Header ===================== */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="#" className="brand">
            <span className="brand-logo">🏢</span>
            <span className="brand-name">Office Insight</span>
          </a>
          <nav className={`nav${menuOpen ? ' open' : ''}`} id="mainNav">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
            ))}
            <div className="header-actions">
              <button className="btn btn-outline btn-sm auth-btn" onClick={() => (window.location.href = "/signin")}>
                Sign In
              </button>
              <button className="btn btn-primary btn-sm auth-btn" onClick={() => (window.location.href = "/signup")}>
                Sign Up
              </button>
            </div>
          </nav>
          <button
            className="hamburger" id="hamburger" aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* ===================== Hero ===================== */}
      <section className="hero">
        <HeroSlider />
        <div className="container hero-inner">
          <div className="hero-content">
          <span className="hero-text-placeholder"></span>
        </div>
        </div>
      </section>

      {/* ===================== About ===================== */}
      <section id="about">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="about-grid"
          >
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="about-tag">About Us</motion.h2>
            <motion.h3 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="about-title">
              Discover defining designs that deliver
            </motion.h3>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="about-text">
              Office Insight offers a collaborative, data-driven model to office design delivering brand defining designs. Our office design and build consultants have worked with a wide range of industries throughout the UK to craft unique workplaces with character.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="about-text">
              We can help you with office fit outs, refurbishments, office interior design, remodelling, and office design consultancy.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ===================== Projects ===================== */}
      <section className="projects" id="projects">
        <div className="container">
          <SectionHeading
            tag="Our Projects"
            title="Recent Projects"
            subtitle="A selection of our latest office design, fit out, and refurbishment projects across the UK."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="projects-grid"
          >
            {projects.map((project, i) => (
              <ProjectCard key={project.client} project={project} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== Services ===================== */}
      <section className="services" id="services">
        <div className="container">
          <SectionHeading
            tag="What We Do"
            title="Office Design, Fit Out &amp; Build Specialists"
          />
          <div className="services-intro">
            <motion.h3 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>Our Services</motion.h3>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="services-grid"
          >
            {services.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== Testimonial ===================== */}
      <section className="testimonial-section">
        <div className="container">
          <motion.div
            className="testimonial-quote"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as Easing }}
          >
            <div className="quote-mark">&#8220;</div>
            <motion.p className="testimonial-text" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              From the initial meeting through to completion, Office Insight have been great. The team was really easy to communicate with,
            </motion.p>
            <motion.p className="testimonial-text" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              and they went to great lengths to get the most out of the budget and the space.
            </motion.p>
            <motion.div
              className="testimonial-author"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.3 }}
            >
              <span className="ta-initials">AP</span>
              <div>
                <strong>Gary Partington</strong>
                <span className="ta-role">Chief Executive Officer and Co-Founder, Apadmi</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===================== Process ===================== */}
      <section className="process" id="process">
        <div className="container">
          <SectionHeading
            tag="The Office Insight Process"
            title="Our innovative yet simple three step process"
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="steps"
          >
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} />
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="process-cta"
          >
            <motion.button
              className="btn btn-outline"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View The Process
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ===================== Insights ===================== */}
      <section className="insights" id="insights">
        <div className="container">
          <SectionHeading
            tag="News &amp; Blog"
            title="Latest Insights"
            subtitle="Read the latest office design, fit out and refurbishment advice from our experts."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="posts-grid"
          >
            {posts.map((post, i) => (
              <PostCard key={post.title} post={post} index={i} />
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <a href="#" className="view-all-link">View All Insights &rarr;</a>
          </motion.div>
        </div>
      </section>

      {/* ===================== Contact CTA ===================== */}
      <section className="contact-cta" id="contact">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as Easing }}
            className="contact-content"
          >
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Ready to reimagine your office?
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              Request a free consultation today.
            </motion.p>
            <motion.button
              className="btn btn-primary btn-lg"
              onClick={() => alert('Request a call back')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Request Call Back
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ===================== Footer ===================== */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#" className="brand">
              <span className="brand-logo">🏢</span>
              <span className="brand-name">Office Insight</span>
            </a>
            <p className="footer-tag">Office Design, Fit Out, &amp; Build Specialists</p>
            <p className="footer-desc">
              We reinvigorate offices with inspiring, creative design that drives performance.
            </p>
          </div>

          <div className="footer-links">
            <h4>Services</h4>
            <ul className="footer-list">
              <li><a href="#">Consultancy</a></li>
              <li><a href="#">Office Design</a></li>
              <li><a href="#">Office Fit Out</a></li>
              <li><a href="#">Office Refurbishment</a></li>
              <li><a href="#">Office Interior Design</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>About</h4>
            <ul className="footer-list">
              <li><a href="#">Process</a></li>
              <li><a href="#">Team &amp; Values</a></li>
              <li><a href="#">Our Space</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Our Projects</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Insights</h4>
            <ul className="footer-list">
              <li><a href="#">Articles</a></li>
              <li><a href="#">Videos</a></li>
              <li><a href="#">Guides</a></li>
              <li><a href="#">Budget Planner</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Contact</h4>
            <ul className="footer-list">
              <li><a href="#">Manchester : 0161 233 0030</a></li>
              <li><a href="#">London : 020 8092 2030</a></li>
              <li><a href="mailto:projects@officeinsight.co.uk">projects@officeinsight.co.uk</a></li>
            </ul>
            <div className="footer-offices">
              <div className="office-address">
                <strong>Manchester</strong>
                Insight House, Pacific Road<br />Altrincham, Manchester WA14 5BJ
              </div>
              <div className="office-address">
                <strong>London</strong>
                20 Red Lion Street<br />Holborn, London WC1R 4PS
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Office Insight.</p>
          <ul className="footer-legal">
            <li><a href="#">Terms &amp; Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
