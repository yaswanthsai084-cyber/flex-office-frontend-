"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type BookingKind = "desks" | "meeting-rooms" | "parking" | "floors";

type Resource = {
  id: string;
  name: string;
  detail: string;
  meta: string;
  status: "Available" | "Popular" | "Limited";
  icon: string;
};

const pageInfo: Record<BookingKind, { label: string; title: string; description: string; icon: string }> = {
  desks: { label: "Desk booking", title: "Find your perfect desk.", description: "Choose a neighborhood, settle in, and make the day yours.", icon: "" },
  "meeting-rooms": { label: "Meeting halls", title: "Bring people together.", description: "Book a room that fits the conversation, from quick huddles to big ideas.", icon: "" },
  parking: { label: "Vehicle parking", title: "A spot waiting for you.", description: "Reserve secure parking before you arrive at the office.", icon: "" },
  floors: { label: "Office floors", title: "Choose where you work.", description: "Plan your day around the floor, facilities, and energy you need.", icon: "" },
};

const formatDate = (value: string) => {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : "";
};

const resources: Record<BookingKind, Resource[]> = {
  desks: [
    { id: "D-204", name: "Quiet corner desk", detail: "Floor 2  -  North wing", meta: "Near focus pods", status: "Available", icon: "" },
    { id: "D-118", name: "Window desk", detail: "Floor 1  -  East wing", meta: "Natural light", status: "Popular", icon: "" },
    { id: "D-307", name: "Team neighborhood", detail: "Floor 3  -  South wing", meta: "6 desks together", status: "Available", icon: "" },
    { id: "D-221", name: "Lounge desk", detail: "Floor 2  -  Central", meta: "Near coffee bar", status: "Limited", icon: "" },
  ],
  "meeting-rooms": [
    { id: "M-01", name: "The Studio", detail: "Floor 1  -  8 people", meta: "Video conferencing", status: "Available", icon: "" },
    { id: "M-04", name: "The Commons", detail: "Floor 2  -  14 people", meta: "Whiteboard wall", status: "Popular", icon: "" },
    { id: "M-09", name: "The Boardroom", detail: "Floor 3  -  20 people", meta: "Presentation display", status: "Available", icon: "" },
    { id: "M-12", name: "Focus room", detail: "Floor 2  -  2 people", meta: "Soundproofed", status: "Limited", icon: "" },
  ],
  parking: [
    { id: "P-18", name: "Covered parking", detail: "Basement 1  -  Zone A", meta: "EV charging nearby", status: "Available", icon: "" },
    { id: "P-42", name: "Visitor parking", detail: "Basement 1  -  Zone C", meta: "Easy lobby access", status: "Popular", icon: "" },
    { id: "P-67", name: "Two-wheeler bay", detail: "Ground level  -  Zone B", meta: "Secure access", status: "Available", icon: "" },
    { id: "P-73", name: "EV charging bay", detail: "Basement 2  -  Zone D", meta: "Fast charger", status: "Limited", icon: "ÏŸ" },
  ],
  floors: [
    { id: "F-01", name: "The Welcome Floor", detail: "Floor 1  -  Open plan", meta: "Caf and visitor lounge", status: "Available", icon: "" },
    { id: "F-02", name: "The Focus Floor", detail: "Floor 2  -  Quiet zone", meta: "Library and focus pods", status: "Popular", icon: "" },
    { id: "F-03", name: "The Collaboration Floor", detail: "Floor 3  -  Social zone", meta: "Project rooms and terrace", status: "Available", icon: "" },
    { id: "F-04", name: "The Terrace Floor", detail: "Floor 4  -  Flexible zone", meta: "Outdoor workspaces", status: "Limited", icon: "" },
  ],
};

const navItems: { href: string; label: string; kind?: BookingKind; icon: string }[] = [
  { href: "/bookings", label: "Overview", icon: "" },
  { href: "/bookings/desks", label: "Desks", kind: "desks", icon: "" },
  { href: "/bookings/meeting-rooms", label: "Meeting halls", kind: "meeting-rooms", icon: "" },
  { href: "/bookings/parking", label: "Parking", kind: "parking", icon: "" },
  { href: "/bookings/floors", label: "Office floors", kind: "floors", icon: "" },
];

export default function BookingWorkspace({ kind = "desks" }: { kind?: BookingKind }) {
  const info = pageInfo[kind];
  const [currentUser, setCurrentUser] = useState({ name: "User", building: "Your workspace" });
  const [selectedDate, setSelectedDate] = useState("2026-11-06");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [booked, setBooked] = useState<string[]>([]);
  const items = useMemo(() => resources[kind].filter((item) => {
    const matchesSearch = `${item.name} ${item.detail} ${item.meta}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === "All" || item.status === filter);
  }), [kind, search, filter]);

  useEffect(() => {
    const storedUser = localStorage.getItem("flexoffice_user");
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser) as { name?: string; building?: string; role?: string };
      if (user.role === "occupant") {
        window.location.replace("/workspace");
        return;
      }
      setCurrentUser({
        name: user.name?.trim() || "User",
        building: user.building?.trim() || "Your workspace",
      });
    } catch {
      localStorage.removeItem("flexoffice_user");
    }
  }, []);

  const userInitials = currentUser.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  function book(item: Resource) {
    setBooked((current) => current.includes(item.id) ? current : [...current, item.id]);
  }

  return (
    <main className="booking-app">
      <aside className="booking-sidebar">
        <Link href="/" className="booking-brand"><span className="brand-mark"><span /></span><span>flex<span>office</span></span></Link>
        <div className="workspace-label">YOUR WORKSPACE</div>
        <nav className="booking-nav" aria-label="Booking navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} className={`booking-nav-link ${item.kind === kind || (!item.kind && kind === "desks") ? "active" : ""}`}><span>{item.icon}</span>{item.label}</Link>)}
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><span>Need a hand?</span><strong>Visit the help centre <b>↗</b></strong></div><Link href="/" className="back-home"> Back to website</Link></div>
      </aside>
      <section className="booking-content">
        <header className="booking-topbar"><div className="mobile-brand">flex<span>office</span></div><div className="topbar-actions"><span className="topbar-divider" /><div className="user-avatar">{userInitials}</div><div className="user-detail"><strong>{currentUser.name}</strong><span>{currentUser.building}</span></div><span className="chevron"></span></div></header>
        <div className="booking-main">
          <div className="booking-heading"><div><p className="booking-eyebrow">{info.label.toUpperCase()}</p><h1>{info.title}</h1><p className="booking-description">{info.description}</p></div><div className="date-picker"><label htmlFor="booking-date">BOOKING DATE</label><span className="date-format">{formatDate(selectedDate)}</span><input id="booking-date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></div></div>
          <div className="booking-summary"><div><span className="summary-icon">{info.icon}</span><div><strong>{resources[kind].length * 12} spaces</strong><span>available across your workplace</span></div></div><span className="summary-note"><i /> Live availability</span></div>
          <div className="booking-toolbar"><div className="search-wrap"><span></span><input aria-label="Search spaces" placeholder={`Search ${kind === "parking" ? "parking slots" : kind === "floors" ? "floors" : kind === "meeting-rooms" ? "meeting halls" : "desks"}`} value={search} onChange={(event) => setSearch(event.target.value)} /></div><div className="filter-buttons">{["All", "Available", "Popular"].map((option) => <button key={option} className={filter === option ? "selected" : ""} onClick={() => setFilter(option)}>{option}</button>)}</div></div>
          <div className="resource-grid">{items.map((item) => <article className="resource-card" key={item.id}><div className="resource-card-top"><span className="resource-icon">{item.icon}</span><span className={`availability availability-${item.status.toLowerCase()}`}><i />{item.status}</span></div><p className="resource-id">{item.id}</p><h2>{item.name}</h2><p className="resource-detail">{item.detail}</p><div className="resource-meta"><span> {item.meta}</span><button onClick={() => book(item)} className={booked.includes(item.id) ? "booked" : ""}>{booked.includes(item.id) ? "Booked" : "Book now"}<b>↗</b></button></div></article>)}</div>
          {items.length === 0 && <div className="empty-state"><strong>No spaces found</strong><span>Try a different search or filter.</span></div>}
          <section className="upcoming-bookings"><div className="section-heading"><div><p className="booking-eyebrow">YOUR CALENDAR</p><h2>Upcoming bookings</h2></div><button>View all <span>↗</span></button></div><div className="upcoming-row"><div className="calendar-day"><strong>06/11/2026</strong><span>FRI</span></div><div><strong>Window desk  -  D-118</strong><span>Today  -  09:00  17:00  -  Floor 1</span></div><span className="upcoming-status">Confirmed</span><button className="more-button">More options</button></div></section>
        </div>
      </section>
    </main>
  );
}






