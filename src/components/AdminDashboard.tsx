"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type ResourceType = "Desks" | "Meeting halls" | "Parking slots" | "Office floors";
type ResourceStatus = "Available" | "Booked" | "Unavailable";
type VehicleType = "Two-wheeler" | "Three-wheeler" | "Four-wheeler";
type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  location: string;
  status: ResourceStatus;
  capacity: number;
  parentId?: string;
  vehicleType?: VehicleType;
};

const initialResources: Resource[] = [
  { id: "DSK-204", name: "Quiet corner desks", type: "Desks", location: "Floor 2  -  North wing", status: "Available", capacity: 18 },
  { id: "DSK-118", name: "Window desks", type: "Desks", location: "Floor 1  -  East wing", status: "Booked", capacity: 12 },
  { id: "MTG-01", name: "The Studio", type: "Meeting halls", location: "Floor 1  -  8 people", status: "Available", capacity: 8 },
  { id: "MTG-04", name: "The Commons", type: "Meeting halls", location: "Floor 2  -  14 people", status: "Booked", capacity: 14 },
  { id: "PRK-18", name: "Covered parking", type: "Parking slots", location: "Basement 1  -  Zone A", status: "Available", capacity: 25, vehicleType: "Four-wheeler" },
  { id: "PRK-73", name: "EV charging bays", type: "Parking slots", location: "Basement 2  -  Zone D", status: "Unavailable", capacity: 8, vehicleType: "Four-wheeler" },
  { id: "FLR-01", name: "The Welcome Floor", type: "Office floors", location: "Floor 1  -  Open plan", status: "Available", capacity: 120 },
  { id: "FLR-03", name: "The Collaboration Floor", type: "Office floors", location: "Floor 3  -  Social zone", status: "Booked", capacity: 96 },
];

const navItems = ["Overview", "Desks", "Meeting halls", "Parking slots", "Office floors"];
const typeFromNav: Record<string, ResourceType | undefined> = { Desks: "Desks", "Meeting halls": "Meeting halls", "Parking slots": "Parking slots", "Office floors": "Office floors" };
const prefixForType: Record<ResourceType, string> = { Desks: "DSK", "Meeting halls": "MTG", "Parking slots": "PRK", "Office floors": "FLR" };

export default function AdminDashboard() {
  const [resources, setResources] = useState(initialResources);
  const [activeNav, setActiveNav] = useState("Overview");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Resource | null>(null);
  const [typeFilter, setTypeFilter] = useState<ResourceType | "All">("All");
  const [name, setName] = useState("");
  const [type, setType] = useState<ResourceType>("Desks");
  const [capacity, setCapacity] = useState("10");
  const [vehicleType, setVehicleType] = useState<VehicleType>("Four-wheeler");

  const visibleResources = useMemo(() => resources.filter((resource) => typeFilter === "All" || resource.type === typeFilter), [resources, typeFilter]);
  const children = selectedParent ? resources.filter((resource) => resource.parentId === selectedParent.id) : [];
  const totalCapacity = resources.reduce((sum, resource) => sum + resource.capacity, 0);
  const available = resources.filter((resource) => resource.status === "Available").length;
  const booked = resources.filter((resource) => resource.status === "Booked").length;
  const unavailable = resources.filter((resource) => resource.status === "Unavailable").length;

  function selectSection(item: string) {
    setActiveNav(item);
    setTypeFilter(typeFromNav[item] || "All");
    setSelectedParent(null);
  }

  function openSpace(resource: Resource) {
    setSelectedParent(resource);
    setType(resource.type);
  }

  function updateStatus(id: string, status: ResourceStatus) {
    setResources((current) => current.map((resource) => resource.id === id ? { ...resource, status } : resource));
  }

  function addResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    const id = `${prefixForType[type]}-${String(resources.length + 1).padStart(2, "0")}`;
    setResources((current) => [{
      id,
      name: name.trim(),
      type,
      parentId: selectedParent?.id,
      location: selectedParent ? `Inside ${selectedParent.name}` : "Newly added space",
      status: "Available",
      capacity: Number(capacity) || 1,
      ...(type === "Parking slots" ? { vehicleType } : {}),
    }, ...current]);
    setName("");
    setCapacity("10");
    setShowAdd(false);
  }

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link href="/" className="booking-brand"><span className="brand-mark"><span /></span><span>flex<span>office</span></span></Link>
        <p className="admin-sidebar-label">BUILDING ADMIN</p>
        <nav className="admin-nav">{navItems.map((item) => <button key={item} className={activeNav === item ? "active" : ""} onClick={() => selectSection(item)}><span>{item === "Overview" ? "" : item === "Desks" ? "" : item === "Meeting halls" ? "" : item === "Parking slots" ? "" : ""}</span>{item}</button>)}</nav>
        <div className="admin-sidebar-bottom"><div className="admin-building"><span className="building-avatar">SN</span><div><strong>Studio North</strong><span>Building account</span></div><b></b></div><Link href="/" className="back-home"> Back to website</Link></div>
      </aside>
      <section className="admin-dashboard-content">
        <header className="admin-dashboard-header"><div className="admin-mobile-brand">flex<span>office</span></div><div className="admin-header-actions"><button aria-label="Notifications"></button><span className="header-divider" /><div className="admin-avatar">RM</div><div className="admin-header-user"><strong>Rhea Menon</strong><span>Building administrator</span></div><Link href="/admin/login" className="admin-logout">Log out</Link></div></header>
        <div className="admin-main-content">
          <div className="admin-page-heading"><div><p className="booking-eyebrow">05/11/2026</p><h1>Good morning, Rhea.</h1><p>Manage your floors, rooms, desks, and vehicle spaces from one place.</p></div><button className="admin-primary-button" onClick={() => { setSelectedParent(null); setType(typeFilter === "All" ? "Desks" : typeFilter); setShowAdd(true); }}>+ Add a space</button></div>
          <div className="admin-stat-grid"><article><span className="admin-stat-icon"></span><div><span>Total capacity</span><strong>{totalCapacity}</strong><small>across all spaces</small></div></article><article><span className="admin-stat-icon green"></span><div><span>Available now</span><strong>{available}</strong><small className="up"> 12% from yesterday</small></div></article><article><span className="admin-stat-icon orange"></span><div><span>Currently booked</span><strong>{booked}</strong><small>active reservations</small></div></article><article><span className="admin-stat-icon muted"></span><div><span>Unavailable</span><strong>{unavailable}</strong><small>needs attention</small></div></article></div>
          {selectedParent && <section className="admin-panel" style={{ marginBottom: 24 }}><div className="admin-panel-heading"><div><p className="booking-eyebrow">SELECTED SPACE</p><h2>{selectedParent.name}</h2><p>{selectedParent.type}  -  {selectedParent.location}</p></div><button onClick={() => { setType(selectedParent.type); setShowAdd(true); }}>Add inside this space <span>↗</span></button></div><div className="inventory-table"><div className="inventory-table-head"><span>CHILD SPACE</span><span>TYPE</span><span>STATUS</span><span>CAPACITY</span><span /></div>{children.length ? children.map((resource) => <InventoryRow key={resource.id} resource={resource} updateStatus={updateStatus} openSpace={openSpace} />) : <div className="empty-state"><strong>No child spaces yet</strong><span>Add a desk, room, or vehicle slot inside this space.</span></div>}</div></section>}
          <div className="admin-content-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="booking-eyebrow">SPACE INVENTORY</p><h2>{activeNav === "Overview" ? "Manage your spaces" : activeNav}</h2></div><button onClick={() => { setSelectedParent(null); setType(typeFilter === "All" ? "Desks" : typeFilter); setShowAdd(true); }}>Add space <span>↗</span></button></div><div className="admin-filter-tabs"><button className={typeFilter === "All" ? "active" : ""} onClick={() => selectSection("Overview")}>All spaces</button>{Object.values(typeFromNav).filter(Boolean).map((item) => <button key={item} className={typeFilter === item ? "active" : ""} onClick={() => selectSection(item!)}>{item}</button>)}</div><div className="inventory-table"><div className="inventory-table-head"><span>SPACE</span><span>TYPE</span><span>STATUS</span><span>CAPACITY</span><span /></div>{visibleResources.filter((resource) => !resource.parentId).map((resource) => <InventoryRow key={resource.id} resource={resource} updateStatus={updateStatus} openSpace={openSpace} />)}</div></section><aside className="admin-side-panel"><div className="admin-panel-heading"><div><p className="booking-eyebrow">TODAY&apos;S ACTIVITY</p><h2>Live overview</h2></div></div><div className="occupancy-ring"><div><strong>{resources.length ? Math.round((booked / resources.length) * 100) : 0}%</strong><span>occupied</span></div></div><div className="occupancy-legend"><span><i className="legend-available" />Available <b>{available}</b></span><span><i className="legend-booked" />Booked <b>{booked}</b></span><span><i className="legend-unavailable" />Unavailable <b>{unavailable}</b></span></div><div className="admin-alert"><span>!</span><div><strong>{unavailable} items need attention</strong><p>Review unavailable spaces before the afternoon rush.</p><button onClick={() => selectSection("Overview")}>Review now ↗</button></div></div></aside></div>
        </div>
      </section>
      {showAdd && <div className="admin-modal-backdrop" onClick={() => setShowAdd(false)}><section className="admin-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowAdd(false)}></button><p className="booking-eyebrow">{selectedParent ? `ADD INSIDE ${selectedParent.name.toUpperCase()}` : "NEW SPACE"}</p><h2>{selectedParent ? "Add a child space" : "Add to your inventory"}</h2><p className="modal-description">{selectedParent ? "Give this desk, room, floor, or vehicle slot its own name." : "Create a new bookable space."}</p><form onSubmit={addResource} className="admin-add-form"><label className="admin-field"><span>SPACE NAME</span><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Room A or Slot 01" /></label><label className="admin-field"><span>SPACE TYPE</span><select value={type} onChange={(event) => setType(event.target.value as ResourceType)}><option>Desks</option><option>Meeting halls</option><option>Parking slots</option><option>Office floors</option></select></label>{type === "Parking slots" && <label className="admin-field"><span>VEHICLE TYPE</span><select value={vehicleType} onChange={(event) => setVehicleType(event.target.value as VehicleType)}><option>Two-wheeler</option><option>Three-wheeler</option><option>Four-wheeler</option></select></label>}<label className="admin-field"><span>CAPACITY</span><input type="number" min="1" value={capacity} onChange={(event) => setCapacity(event.target.value)} /></label><button className="admin-submit" type="submit">Add space <span>↗</span></button></form></section></div>}
    </main>
  );
}

function InventoryRow({ resource, updateStatus, openSpace }: { resource: Resource; updateStatus: (id: string, status: ResourceStatus) => void; openSpace: (resource: Resource) => void }) {
  return <div className="inventory-row" onDoubleClick={() => openSpace(resource)}><div><button className="inventory-symbol" onClick={() => openSpace(resource)} aria-label={`Open ${resource.name}`}>{resource.type === "Parking slots" ? "" : resource.type === "Meeting halls" ? "" : resource.type === "Office floors" ? "" : ""}</button><div><button className="inventory-name-button" onClick={() => openSpace(resource)}><strong>{resource.name}</strong></button><small>{resource.id}  -  {resource.location}{resource.vehicleType ? `  -  ${resource.vehicleType}` : ""}</small></div></div><span className="inventory-type">{resource.type}</span><select aria-label={`Status for ${resource.name}`} value={resource.status} onChange={(event) => updateStatus(resource.id, event.target.value as ResourceStatus)}><option>Available</option><option>Booked</option><option>Unavailable</option></select><span className="inventory-capacity">{resource.capacity} <small>spots</small></span><button className="row-menu" aria-label={`Open ${resource.name}`}>More options</button></div>;
}




