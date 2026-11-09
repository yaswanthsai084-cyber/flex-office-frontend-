"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const benefits = [
  { number: "01", title: "SEAMLESS BOOKING", text: "Find and reserve the right desk, room, or parking spot in seconds from one simple workspace." },
  { number: "02", title: "SMARTER WORKPLACES", text: "See how your office is being used and turn real-time data into better workplace decisions." },
  { number: "03", title: "WELCOME EVERYONE", text: "Give employees and guests a smooth, secure arrival with effortless visitor management." },
];

const solutions = [
  { title: "Desk & Room Booking", text: "Make every workday flexible. Let teams book the space they need, when they need it.", icon: "" },
  { title: "Visitor Management", text: "Create a warm first impression with digital invites, fast check-in, and secure access.", icon: "" },
  { title: "Workplace Insights", text: "Understand occupancy and preferences with clear dashboards built for modern teams.", icon: "" },
];

const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } };

export default function Home() {
  return (
    <main className="flex-home">
      <header className="site-header"><div className="container header-inner">
        <a href="#top" className="brand" aria-label="Flex Office home"><span className="brand-mark"><span /></span><span className="brand-name">flex<span>office</span></span></a>
        <nav className="main-nav" aria-label="Main navigation"><a href="#solutions">Solutions</a><a href="#why-flex">Why Flex Office</a><a href="#insights">Insights</a></nav>
        <div className="header-actions"><a href="/signin" className="login-link">Customer Login</a><a href="/signup" className="btn btn-dark btn-small">Get started <span>↗</span></a></div>
      </div></header>

      <section className="hero" id="top"><Image src="/hero/slide-3.jpeg" alt="Bright flexible office with collaborative seating" fill priority className="hero-image" sizes="100vw" /><div className="hero-shade" /><div className="container hero-content"><motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: .65 }}><p className="eyebrow eyebrow-light">THE INTELLIGENT WORKPLACE PLATFORM</p><h1>Make space<br /><em>for what matters.</em></h1><p className="hero-copy">Flex Office brings people, spaces, and workplace insights togetherso your team can do their best work wherever they are.</p><div className="hero-buttons"><a href="/signup" className="btn btn-accent">Explore Flex Office <span>↗</span></a><a href="#solutions" className="text-link light-link">Discover our solutions <span></span></a></div></motion.div></div><div className="hero-bottom container"><span></span><span className="scroll-cue">Scroll to explore </span></div></section>

      <section className="intro" id="why-flex"><div className="container intro-grid"><p className="eyebrow">FLEX OFFICE, SIMPLIFIED</p><div><h2>Your workplace should work <em>for you.</em></h2><p className="lead">From the first booking to the last goodbye, Flex Office gives your people a better way to move through the workday. One calm, connected experience for every space.</p><a href="#solutions" className="text-link">See how it works <span>↗</span></a></div></div></section>

      <section className="benefits" aria-label="Flex Office benefits"><div className="container benefits-grid">{benefits.map((benefit, index) => <motion.article key={benefit.number} className="benefit" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} transition={{ delay: index * .12, duration: .55 }}><span className="benefit-number">{benefit.number}</span><div><h3>{benefit.title}</h3><p>{benefit.text}</p></div></motion.article>)}</div></section>

      <section className="solutions" id="solutions"><div className="container"><div className="section-top"><div><p className="eyebrow">ONE PLATFORM. EVERY POSSIBILITY.</p><h2>Everything your<br /><em>workplace needs.</em></h2></div><p className="section-intro">A flexible toolkit designed to make offices more useful, welcoming, and human.</p></div><div className="solutions-grid">{solutions.map((solution, index) => <motion.article key={solution.title} className="solution-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * .1 }}><span className="solution-icon">{solution.icon}</span><span className="card-index">0{index + 1}</span><h3>{solution.title}</h3><p>{solution.text}</p><a href="#contact" className="card-link">Learn more <span>↗</span></a></motion.article>)}</div></div></section>

      <section className="quote-section" id="insights"><div className="container quote-layout"><div className="quote-mark"></div><div><p className="quote">Flex Office has made coming together feel effortless. Our teams have the freedom to work their way, while we have a clearer picture of the workplace were building.</p><div className="quote-author"><span className="author-avatar">RM</span><div><strong>Rhea Menon</strong><span>People &amp; Culture Lead, Studio North</span></div></div></div></div></section>

      <section className="contact-cta" id="contact"><div className="container cta-inner"><p className="eyebrow eyebrow-light">READY WHEN YOU ARE</p><h2>Lets make your workplace<br /><em>work better.</em></h2><a href="/signup" className="btn btn-accent">Start your journey <span>↗</span></a></div></section>

      <footer className="site-footer"><div className="container footer-top"><a href="#top" className="brand brand-footer"><span className="brand-mark"><span /></span><span className="brand-name">flex<span>office</span></span></a><div className="footer-links"><div><strong>Explore</strong><a href="#solutions">Solutions</a><a href="#why-flex">Why Flex Office</a><a href="#insights">Insights</a></div><div><strong>Connect</strong><a href="/signin">Customer Login</a><a href="mailto:hello@flexoffice.com">hello@flexoffice.com</a><a href="#contact">Talk to us ↗</a></div></div></div><div className="container footer-bottom"><span>Â© 2026 Flex Office. Built for better work.</span><span>Privacy &nbsp;  -  &nbsp; Terms</span></div></footer>
    </main>
  );
}


