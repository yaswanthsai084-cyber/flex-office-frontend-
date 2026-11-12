"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type WorkspaceKind = "Desk" | "Meeting room" | "Parking";
type Availability = "Available" | "Occupied" | "Reserved" | "Inactive";
type View =
  | "overview"
  | "properties"
  | "floors"
  | "workspaces"
  | "map"
  | "meeting-rooms"
  | "parking"
  | "bookings"
  | "pricing"
  | "amenities"
  | "analytics"
  | "reviews"
  | "settings";

type Workspace = {
  id: string;
  name: string;
  category: string;
  kind: WorkspaceKind;
  capacity: number;
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  status: Availability;
  amenities: string[];
  x: number;
  y: number;
};

type Floor = {
  id: string;
  name: string;
  number: number;
  area: number;
  capacity: number;
  mapImage?: string;
  spaces: Workspace[];
};

type Property = {
  id: string;
  name: string;
  address: string;
  description: string;
  type: string;
  operatingHours: string;
  contact: string;
  status: "Active" | "Draft";
  amenities: string[];
  floors: Floor[];
};

type Booking = {
  id: string;
  customer: string;
  workspace: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  total: number;
};

type ProviderData = {
  properties: Property[];
  bookings: Booking[];
};

type Modal = "property" | "floor" | "workspace" | "amenity" | null;

function isProviderData(value: unknown): value is ProviderData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ProviderData>;
  return Array.isArray(candidate.properties)
    && candidate.properties.every((property) => property
      && typeof property.id === "string"
      && Array.isArray(property.floors)
      && property.floors.every((floor) => floor
        && typeof floor.id === "string"
        && Array.isArray(floor.spaces)
        && floor.spaces.every((space) => space && typeof space.id === "string" && typeof space.name === "string")))
    && Array.isArray(candidate.bookings)
    && candidate.bookings.every((booking) => booking && typeof booking.id === "string");
}

const navigation: { id: View; label: string; icon: string; group: string }[] = [
  { id: "overview", label: "Overview", icon: "⌂", group: "WORKSPACE" },
  { id: "properties", label: "My properties", icon: "▦", group: "WORKSPACE" },
  { id: "floors", label: "Floor management", icon: "▤", group: "WORKSPACE" },
  { id: "workspaces", label: "Workspaces", icon: "▣", group: "WORKSPACE" },
  { id: "map", label: "Floor map", icon: "⌗", group: "WORKSPACE" },
  { id: "meeting-rooms", label: "Meeting rooms", icon: "▧", group: "MANAGEMENT" },
  { id: "parking", label: "Parking", icon: "▱", group: "MANAGEMENT" },
  { id: "bookings", label: "Bookings", icon: "◷", group: "MANAGEMENT" },
  { id: "pricing", label: "Pricing & packages", icon: "＄", group: "MANAGEMENT" },
  { id: "amenities", label: "Facilities", icon: "✳", group: "MANAGEMENT" },
  { id: "analytics", label: "Analytics", icon: "▥", group: "INSIGHTS" },
  { id: "reviews", label: "Reviews", icon: "☆", group: "INSIGHTS" },
  { id: "settings", label: "Settings", icon: "⚙", group: "ACCOUNT" },
];

const initialData: ProviderData = {
  properties: [
    {
      id: "property-studio-north",
      name: "Studio North",
      address: "28 Richmond Road, Bengaluru",
      description: "Flexible coworking, team spaces, and meeting rooms in central Bengaluru.",
      type: "Coworking office",
      operatingHours: "Mon–Fri, 8:00 AM–8:00 PM",
      contact: "+91 80 5555 0142",
      status: "Active",
      amenities: ["High-speed Wi-Fi", "Reception", "Cafeteria", "Power backup", "Security", "Meeting rooms"],
      floors: [
        {
          id: "floor-1",
          name: "First floor",
          number: 1,
          area: 4200,
          capacity: 64,
          spaces: [
            { id: "DSK-101", name: "Window desk 01", category: "Window-side desk", kind: "Desk", capacity: 1, hourly: 8, daily: 42, weekly: 180, monthly: 520, status: "Available", amenities: ["Natural light", "Power socket", "Wi-Fi"], x: 2, y: 2 },
            { id: "DSK-102", name: "Focus desk 02", category: "Hot desk", kind: "Desk", capacity: 1, hourly: 7, daily: 38, weekly: 160, monthly: 460, status: "Occupied", amenities: ["Power socket", "Ergonomic chair", "Wi-Fi"], x: 5, y: 2 },
            { id: "DSK-103", name: "Corner desk 03", category: "Corner desk", kind: "Desk", capacity: 1, hourly: 9, daily: 48, weekly: 195, monthly: 560, status: "Reserved", amenities: ["Natural light", "Monitor", "Wi-Fi"], x: 8, y: 2 },
            { id: "MTG-01", name: "The Studio", category: "Meeting room", kind: "Meeting room", capacity: 8, hourly: 28, daily: 160, weekly: 690, monthly: 2100, status: "Available", amenities: ["Projector", "Whiteboard", "Video conferencing"], x: 3, y: 5 },
            { id: "MTG-02", name: "The Commons", category: "Conference room", kind: "Meeting room", capacity: 14, hourly: 42, daily: 240, weekly: 980, monthly: 3200, status: "Available", amenities: ["Smart TV", "Whiteboard", "Soundproofing"], x: 7, y: 5 },
          ],
        },
        {
          id: "floor-2",
          name: "Second floor",
          number: 2,
          area: 3600,
          capacity: 48,
          spaces: [
            { id: "DSK-204", name: "Quiet corner desk", category: "Dedicated desk", kind: "Desk", capacity: 1, hourly: 9, daily: 46, weekly: 195, monthly: 580, status: "Available", amenities: ["Quiet zone", "Power socket", "Wi-Fi"], x: 2, y: 2 },
            { id: "PRK-18", name: "Covered bay 18", category: "Covered parking", kind: "Parking", capacity: 1, hourly: 3, daily: 16, weekly: 65, monthly: 210, status: "Available", amenities: ["Covered", "Security"], x: 6, y: 4 },
          ],
        },
      ],
    },
  ],
  bookings: [
    { id: "BK-2408", customer: "Aarav Mehta", workspace: "The Studio", date: "Today, 10:00 AM", time: "2 hours", status: "Confirmed", total: 56 },
    { id: "BK-2407", customer: "Maya Iyer", workspace: "Window desk 01", date: "Today, 11:30 AM", time: "Full day", status: "Pending", total: 42 },
    { id: "BK-2406", customer: "Rohan Das", workspace: "The Commons", date: "Tomorrow, 9:00 AM", time: "3 hours", status: "Confirmed", total: 126 },
  ],
};

const makeId = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase()}`;
const money = (value: number) => `$${value.toLocaleString("en-US")}`;

function getUserInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

export default function ProviderWorkspace() {
  const [data, setData] = useState<ProviderData>(initialData);
  const [hydrated, setHydrated] = useState(false);
  const [ownerId, setOwnerId] = useState("demo");
  const [ownerName, setOwnerName] = useState("Workspace provider");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [loadError, setLoadError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [view, setView] = useState<View>("overview");
  const [propertyId, setPropertyId] = useState(initialData.properties[0].id);
  const [floorId, setFloorId] = useState(initialData.properties[0].floors[0].id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [modal, setModal] = useState<Modal>(null);
  const [editingId, setEditingId] = useState("");
  const [modalFloorId, setModalFloorId] = useState("");
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [toast, setToast] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<"All bookings" | Booking["status"]>("All bookings");
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    let user: { id?: string; name?: string; email?: string; role?: string } | null = null;
    try {
      user = JSON.parse(localStorage.getItem("flexoffice_user") || "null");
    } catch {
      localStorage.removeItem("flexoffice_user");
    }

    if (!user) {
      window.location.replace("/signin");
      return;
    }
    if (user.role !== "occupant") {
      window.location.replace("/bookings");
      return;
    }

    const id = user.id || user.email || "occupant";
    setOwnerId(id);
    setOwnerName(user.name?.trim() || "Workspace provider");
    setOwnerEmail(user.email || "");
    try {
      const saved = localStorage.getItem(`flexoffice_provider_data_v1:${id}`);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isProviderData(parsed)) {
          setData(parsed);
          setPropertyId(parsed.properties[0]?.id || "");
          setFloorId(parsed.properties[0]?.floors[0]?.id || "");
        } else setLoadError("Saved workspace data is incomplete or invalid.");
      }
    } catch (error) {
      setLoadError(error instanceof Error ? `Saved workspace data could not be loaded: ${error.message}` : "Saved workspace data could not be loaded.");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || loadError) return;
    try {
      localStorage.setItem(`flexoffice_provider_data_v1:${ownerId}`, JSON.stringify(data));
      setStorageError("");
    } catch (error) {
      setStorageError(error instanceof Error ? `Workspace changes could not be saved: ${error.message}` : "Workspace changes could not be saved.");
    }
  }, [data, hydrated, loadError, ownerId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const currentProperty = data.properties.find((property) => property.id === propertyId) || data.properties[0];
  const currentFloor = currentProperty?.floors.find((floor) => floor.id === floorId) || currentProperty?.floors[0];
  const spaces = useMemo(() => data.properties.flatMap((property) => property.floors.flatMap((floor) =>
    floor.spaces.map((space) => ({ ...space, propertyName: property.name, floorName: floor.name, propertyId: property.id, floorId: floor.id }))
  )), [data.properties]);
  const propertySpaces = currentProperty?.floors.flatMap((floor) => floor.spaces) || [];
  const allBookings = data.bookings;
  const spaceCount = spaces.length;
  const availableCount = spaces.filter((space) => space.status === "Available").length;
  const occupiedCount = spaces.filter((space) => space.status === "Occupied").length;
  const activeBookings = allBookings.filter((booking) => booking.status !== "Cancelled").length;
  const revenue = allBookings.filter((booking) => booking.status === "Confirmed").reduce((sum, booking) => sum + booking.total, 0);
  const selectedSpace = propertySpaces.find((space) => space.id === selectedSpaceId);
  const page = navigation.find((item) => item.id === view);
  const filteredSpaces = spaces.filter((space) => {
    const matchesText = `${space.id} ${space.name} ${space.kind} ${space.propertyName} ${space.floorName}`.toLowerCase().includes(search.toLowerCase());
    return matchesText && (statusFilter === "All status" || space.status === statusFilter);
  });

  function showToast(message: string) {
    setToast(message);
  }

  function patchProperty(propertyKey: string, change: (property: Property) => Property) {
    setData((current) => ({
      ...current,
      properties: current.properties.map((property) => property.id === propertyKey ? change(property) : property),
    }));
  }

  function updateWorkspace(propertyKey: string, targetFloorId: string, workspaceId: string, change: (space: Workspace) => Workspace) {
    patchProperty(propertyKey, (property) => ({
      ...property,
      floors: property.floors.map((floor) => floor.id === targetFloorId
        ? { ...floor, spaces: floor.spaces.map((space) => space.id === workspaceId ? change(space) : space) }
        : floor),
    }));
  }

  function openModal(type: Modal, id = "", targetFloorId = "") {
    setEditingId(id);
    setModalFloorId(targetFloorId);
    setModal(type);
  }

  function closeModal() {
    setModal(null);
    setEditingId("");
    setModalFloorId("");
  }

  function saveModal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (key: string, fallback = "") => String(form.get(key) || fallback).trim();
    const numeric = (key: string, fallback = "0") => Math.max(0, Number(form.get(key) || fallback) || 0);

    if (modal === "property") {
      const property: Property = {
        id: editingId || makeId("property"),
        name: value("name"),
        address: value("address"),
        description: value("description"),
        type: value("type", "Coworking office"),
        operatingHours: value("operatingHours", "Mon–Fri, 8:00 AM–8:00 PM"),
        contact: value("contact"),
        status: value("status", "Active") as Property["status"],
        amenities: editingId ? currentProperty?.amenities || [] : ["High-speed Wi-Fi", "Reception"],
        floors: editingId ? currentProperty?.floors || [] : [],
      };
      if (!property.name || !property.address) return showToast("Add a property name and address.");
      if (editingId) {
        setData((current) => ({ ...current, properties: current.properties.map((item) => item.id === editingId ? property : item) }));
        showToast("Property details saved.");
      } else {
        setData((current) => ({ ...current, properties: [...current.properties, property] }));
        setPropertyId(property.id);
        showToast("Property added.");
      }
      closeModal();
      return;
    }

    if (modal === "floor") {
      const floor: Floor = {
        id: editingId || makeId("floor"),
        name: value("name"),
        number: numeric("number", "1"),
        area: numeric("area"),
        capacity: numeric("capacity", "1"),
        spaces: editingId ? currentProperty?.floors.find((item) => item.id === editingId)?.spaces || [] : [],
      };
      if (!floor.name) return showToast("Enter a floor name.");
      patchProperty(propertyId, (property) => ({
        ...property,
        floors: editingId
          ? property.floors.map((item) => item.id === editingId ? floor : item)
          : [...property.floors, floor],
      }));
      setFloorId(floor.id);
      showToast(editingId ? "Floor details saved." : "Floor added.");
      closeModal();
      return;
    }

    if (modal === "workspace") {
      const targetFloorId = value("floorId", modalFloorId || currentFloor?.id || "");
      if (!targetFloorId) return showToast("Create a floor before adding a workspace.");
      const existing = currentProperty?.floors.flatMap((floor) => floor.spaces).find((space) => space.id === editingId);
      const amenities = value("amenities").split(",").map((item) => item.trim()).filter(Boolean);
      const workspace: Workspace = {
        id: value("id", editingId || makeId("space")),
        name: value("name"),
        category: value("category", value("kind")),
        kind: value("kind", "Desk") as WorkspaceKind,
        capacity: numeric("capacity", "1"),
        hourly: numeric("hourly"),
        daily: numeric("daily"),
        weekly: numeric("weekly"),
        monthly: numeric("monthly"),
        status: value("status", "Available") as Availability,
        amenities,
        x: existing?.x || Math.min(9, (propertySpaces.length % 8) + 2),
        y: existing?.y || Math.min(5, (propertySpaces.length % 4) + 2),
      };
      if (!workspace.id || !workspace.name) return showToast("Workspace ID and name are required.");
      const duplicate = spaces.some((space) => space.id.toLowerCase() === workspace.id.toLowerCase() && space.id !== editingId);
      if (duplicate) return showToast("That workspace ID is already in use.");
      if (editingId && existing) {
        const oldFloor = currentProperty?.floors.find((floor) => floor.spaces.some((space) => space.id === editingId));
        if (oldFloor && oldFloor.id !== targetFloorId) {
          patchProperty(propertyId, (property) => ({
            ...property,
            floors: property.floors.map((floor) => floor.id === oldFloor.id
              ? { ...floor, spaces: floor.spaces.filter((space) => space.id !== editingId) }
              : floor.id === targetFloorId ? { ...floor, spaces: [...floor.spaces, workspace] } : floor),
          }));
        } else {
          updateWorkspace(propertyId, targetFloorId, editingId, () => workspace);
        }
        showToast("Workspace updated.");
      } else {
        patchProperty(propertyId, (property) => ({
          ...property,
          floors: property.floors.map((floor) => floor.id === targetFloorId ? { ...floor, spaces: [...floor.spaces, workspace] } : floor),
        }));
        showToast("Workspace added.");
      }
      setFloorId(targetFloorId);
      closeModal();
    }

    if (modal === "amenity") {
      const amenity = value("name");
      if (!amenity) return showToast("Enter a facility name.");
      patchProperty(propertyId, (property) => property.amenities.includes(amenity)
        ? property
        : { ...property, amenities: [...property.amenities, amenity] });
      showToast("Facility added.");
      closeModal();
    }
  }

  function removeProperty(id: string) {
    if (!window.confirm("Delete this property and all of its floors and spaces?")) return;
    const next = data.properties.filter((property) => property.id !== id);
    setData((current) => ({ ...current, properties: next }));
    setPropertyId(next[0]?.id || "");
    showToast("Property removed.");
  }

  function removeFloor(id: string) {
    if (!window.confirm("Delete this floor and all workspaces on it?")) return;
    const nextFloors = currentProperty?.floors.filter((floor) => floor.id !== id) || [];
    patchProperty(propertyId, (property) => ({ ...property, floors: nextFloors }));
    setFloorId(nextFloors[0]?.id || "");
    showToast("Floor removed.");
  }

  function removeWorkspace(propertyKey: string, targetFloorId: string, id: string) {
    if (!window.confirm("Remove this workspace?")) return;
    patchProperty(propertyKey, (property) => ({
      ...property,
      floors: property.floors.map((floor) => floor.id === targetFloorId
        ? { ...floor, spaces: floor.spaces.filter((space) => space.id !== id) }
        : floor),
    }));
    if (selectedSpaceId === id) setSelectedSpaceId("");
    showToast("Workspace removed.");
  }

  function changeBooking(id: string, status: Booking["status"]) {
    setData((current) => ({
      ...current,
      bookings: current.bookings.map((booking) => booking.id === id ? { ...booking, status } : booking),
    }));
    showToast(`Booking ${status.toLowerCase()}.`);
  }

  function signOut() {
    localStorage.removeItem("flexoffice_token");
    localStorage.removeItem("flexoffice_user");
    window.location.href = "/signin";
  }

  function renderWorkspaceTable(items = filteredSpaces) {
    if (!items.length) return <div className="provider-empty"><span>▣</span><strong>No workspaces found</strong><p>Add a workspace or change your search.</p></div>;
    return (
      <div className="provider-table-wrap">
        <table className="provider-table">
          <thead><tr><th>WORKSPACE</th><th>TYPE</th><th>LOCATION</th><th>CAPACITY</th><th>PRICE / HOUR</th><th>STATUS</th><th /></tr></thead>
          <tbody>{items.map((space) => (
            <tr key={`${space.propertyId}-${space.id}`}>
              <td><strong>{space.name}</strong><span>{space.id}</span></td>
              <td>{space.kind}</td>
              <td>{space.propertyName}<span>{space.floorName}</span></td>
              <td>{space.capacity} {space.kind === "Desk" ? space.capacity === 1 ? "seat" : "seats" : "people"}</td>
              <td>{money(space.hourly)}</td>
              <td><span className={`provider-status status-${space.status.toLowerCase()}`}>{space.status}</span></td>
              <td><button className="provider-row-action" aria-label={`Edit ${space.name}`} onClick={() => { setPropertyId(space.propertyId); openModal("workspace", space.id, space.floorId); }}>•••</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    );
  }

  function renderOverview() {
    const stats = [
      { label: "Properties", value: data.properties.length, hint: "Across your portfolio", icon: "▦" },
      { label: "Floors", value: data.properties.reduce((sum, property) => sum + property.floors.length, 0), hint: "Configured floors", icon: "▤" },
      { label: "Workspaces", value: spaceCount, hint: `${availableCount} currently available`, icon: "▣" },
      { label: "Active bookings", value: activeBookings, hint: "Across all properties", icon: "◷" },
    ];
    const chart = [34, 51, 42, 68, 55, 81, 64, 74, 58, 91, 73, 86];
    return (
      <>
        <div className="provider-welcome"><div><p className="provider-eyebrow">YOUR WORKSPACE, AT A GLANCE</p><h1>Good morning, {ownerName.split(" ")[0]}.</h1><p>Here’s what’s happening across your spaces today.</p></div><button className="provider-primary" onClick={() => openModal("workspace", "", currentFloor?.id || "")}>＋ Add workspace</button></div>
        <div className="provider-stats">{stats.map((stat) => <article className="provider-stat" key={stat.label}><div className="provider-stat-top"><span>{stat.label}</span><i>{stat.icon}</i></div><strong>{stat.value.toLocaleString()}</strong><small>{stat.hint}</small></article>)}</div>
        <div className="provider-overview-grid">
          <section className="provider-card provider-revenue"><div className="provider-card-heading"><div><h2>Revenue overview</h2><p>Confirmed bookings · this month</p></div><span className="provider-period">This month⌄</span></div><div className="provider-revenue-total">{money(revenue)}<span>+12.8% <small>vs. last month</small></span></div><div className="provider-chart">{chart.map((height, index) => <div className="provider-chart-column" key={index}><span style={{ height: `${height}%` }} /><small>{["1", "", "5", "", "9", "", "13", "", "17", "", "21", ""][index]}</small></div>)}</div><div className="provider-chart-labels"><span>Nov 1</span><span>Nov 30</span></div></section>
          <section className="provider-card provider-occupancy"><div className="provider-card-heading"><div><h2>Workspace occupancy</h2><p>Current availability</p></div><span className="provider-mini-menu">•••</span></div><div className="provider-occupancy-ring" style={{ "--occupancy": `${spaceCount ? Math.round((occupiedCount / spaceCount) * 100) : 0}%` } as React.CSSProperties}><div><strong>{spaceCount ? Math.round((occupiedCount / spaceCount) * 100) : 0}%</strong><span>occupied</span></div></div><div className="provider-legend"><span><i className="legend-occupied" />Occupied <b>{occupiedCount}</b></span><span><i className="legend-available" />Available <b>{availableCount}</b></span><span><i className="legend-reserved" />Reserved <b>{spaces.filter((space) => space.status === "Reserved").length}</b></span></div></section>
        </div>
        <section className="provider-card provider-booking-preview"><div className="provider-card-heading"><div><h2>Upcoming bookings</h2><p>Recent activity from your customers</p></div><button className="provider-link-button" onClick={() => setView("bookings")}>View all →</button></div>{renderBookingRows(allBookings.slice(0, 3))}</section>
      </>
    );
  }

  function renderBookingRows(bookings: Booking[]) {
    return bookings.length ? <div className="provider-booking-list">{bookings.map((booking) => (
      <div className="provider-booking-row" key={booking.id}><span className="provider-booking-icon">◷</span><div className="provider-booking-person"><strong>{booking.customer}</strong><span>{booking.workspace} · {booking.date}</span></div><span className={`provider-status status-${booking.status.toLowerCase()}`}>{booking.status}</span><strong className="provider-booking-price">{money(booking.total)}</strong>{booking.status === "Pending" && <div className="provider-booking-actions"><button onClick={() => changeBooking(booking.id, "Confirmed")} aria-label="Approve booking">✓</button><button onClick={() => changeBooking(booking.id, "Cancelled")} aria-label="Reject booking">×</button></div>}</div>
    ))}</div> : <div className="provider-empty"><strong>No bookings yet</strong><p>Customer reservations will appear here.</p></div>;
  }

  function renderProperties() {
    return <><div className="provider-section-heading"><div><p className="provider-eyebrow">PORTFOLIO</p><h1>My properties</h1><p>Manage your office locations and their details.</p></div><button className="provider-primary" onClick={() => openModal("property")}>＋ Add property</button></div>
      <div className="provider-property-grid">{data.properties.map((property) => <article className="provider-property-card" key={property.id}><div className="provider-property-image"><span className="provider-property-monogram">{property.name.slice(0, 1)}</span><span className={`provider-status status-${property.status.toLowerCase()}`}>{property.status}</span><button aria-label={`Edit ${property.name}`} onClick={() => { setPropertyId(property.id); openModal("property", property.id); }}>•••</button></div><div className="provider-property-body"><span className="provider-eyebrow">{property.type.toUpperCase()}</span><h2>{property.name}</h2><p>{property.address}</p><div className="provider-property-meta"><span><b>{property.floors.length}</b> floors</span><span><b>{property.floors.reduce((sum, floor) => sum + floor.spaces.length, 0)}</b> workspaces</span></div><div className="provider-property-footer"><button onClick={() => { setPropertyId(property.id); setView("floors"); }}>Manage property <span>→</span></button><button className="provider-danger-link" onClick={() => removeProperty(property.id)}>Remove</button></div></div></article>)}{!data.properties.length && <div className="provider-empty"><strong>Add your first property</strong><p>Set up a location to start creating floors and workspaces.</p><button className="provider-primary" onClick={() => openModal("property")}>＋ Add property</button></div>}</div>
    </>;
  }

  function renderFloors() {
    return <><div className="provider-section-heading"><div><p className="provider-eyebrow">{currentProperty?.name || "PROPERTY"}</p><h1>Floor management</h1><p>Organize floors and the spaces within each property.</p></div><button className="provider-primary" disabled={!currentProperty} onClick={() => openModal("floor")}>＋ Add floor</button></div><div className="provider-inline-filter"><label htmlFor="floor-property">Property</label><select id="floor-property" value={currentProperty?.id || ""} onChange={(event) => setPropertyId(event.target.value)}>{data.properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select></div><div className="provider-floor-list">{(currentProperty?.floors || []).map((floor) => <article className="provider-floor-card" key={floor.id}><div className="provider-floor-mark">F{String(floor.number).padStart(2, "0")}</div><div className="provider-floor-info"><h2>{floor.name}</h2><p>{floor.area.toLocaleString()} sq ft · Capacity {floor.capacity}</p><span>{floor.spaces.length} workspaces</span></div><div className="provider-floor-types"><span>{floor.spaces.filter((space) => space.kind === "Desk").length} desks</span><span>{floor.spaces.filter((space) => space.kind === "Meeting room").length} meeting rooms</span><span>{floor.spaces.filter((space) => space.kind === "Parking").length} parking</span></div><div className="provider-floor-actions"><button onClick={() => { setFloorId(floor.id); setView("map"); }}>Open map</button><button onClick={() => openModal("floor", floor.id)}>Edit</button><button className="provider-icon-danger" aria-label={`Remove ${floor.name}`} onClick={() => removeFloor(floor.id)}>×</button></div></article>)}{!currentProperty?.floors.length && <div className="provider-empty"><strong>No floors for this property</strong><p>Add a floor to start placing workspaces.</p></div>}</div></>;
  }

  function renderWorkspaces(items = filteredSpaces) {
    return <><div className="provider-section-heading"><div><p className="provider-eyebrow">{view === "meeting-rooms" ? "COLLABORATION SPACES" : view === "parking" ? "VEHICLE SPACES" : "INVENTORY"}</p><h1>{view === "meeting-rooms" ? "Meeting rooms" : view === "parking" ? "Parking management" : "Workspace management"}</h1><p>Configure workspace availability, capacity, pricing, and facilities.</p></div><button className="provider-primary" disabled={!currentFloor} onClick={() => openModal("workspace", "", currentFloor?.id || "")}>＋ Add workspace</button></div><div className="provider-toolbar"><div className="provider-search"><span>⌕</span><input aria-label="Search workspaces" placeholder="Search by name, ID, or location" value={search} onChange={(event) => setSearch(event.target.value)} /></div><select aria-label="Filter by availability" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All status</option>{(["Available", "Occupied", "Reserved", "Inactive"] as Availability[]).map((status) => <option key={status}>{status}</option>)}</select></div>{renderWorkspaceTable(items)}</>;
  }

  function renderMap() {
    const floorSpaces = currentFloor?.spaces || [];
    const selected = floorSpaces.find((space) => space.id === selectedSpaceId);
    const cells = Array.from({ length: 60 }, (_, index) => ({ x: (index % 10) + 1, y: Math.floor(index / 10) + 1 }));
    const uploadMap = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !currentProperty || !currentFloor) return;
      if (!file.type.startsWith("image/")) return showToast("Choose an image file for the floor plan.");
      if (file.size > 2 * 1024 * 1024) return showToast("Floor plan images must be smaller than 2 MB.");
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") return showToast("The floor plan image could not be read.");
        const mapImage = reader.result;
        patchProperty(currentProperty.id, (property) => ({
          ...property,
          floors: property.floors.map((floor) => floor.id === currentFloor.id ? { ...floor, mapImage } : floor),
        }));
        showToast("Floor plan image uploaded.");
      };
      reader.onerror = () => showToast("The floor plan image could not be read.");
      reader.readAsDataURL(file);
    };

    return (
      <>
        <div className="provider-section-heading">
          <div>
            <p className="provider-eyebrow">INTERACTIVE FLOOR PLAN</p>
            <h1>Floor map</h1>
            <p>{previewMode ? "Customer preview · colors show workspace availability." : "Drag workspaces to move them, or select one to edit its details."}</p>
          </div>
          <div className="provider-map-actions">
            <button className="provider-secondary" onClick={() => setPreviewMode((current) => !current)}>{previewMode ? "Back to editor" : "Preview as customer"}</button>
            <label className="provider-secondary provider-upload-button">Upload floor plan<input type="file" accept="image/*" onChange={uploadMap} /></label>
            {currentFloor?.mapImage && <button className="provider-secondary" onClick={() => currentProperty && currentFloor && patchProperty(currentProperty.id, (property) => ({ ...property, floors: property.floors.map((floor) => floor.id === currentFloor.id ? { ...floor, mapImage: undefined } : floor) }))}>Remove image</button>}
            <button className="provider-primary" onClick={() => showToast("Floor layout saved to this browser.")}>Save layout</button>
          </div>
        </div>
        <div className="provider-map-toolbar">
          <label>Property<select value={currentProperty?.id || ""} onChange={(event) => { setPropertyId(event.target.value); setFloorId(data.properties.find((property) => property.id === event.target.value)?.floors[0]?.id || ""); }}>{data.properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select></label>
          <label>Floor<select value={currentFloor?.id || ""} onChange={(event) => setFloorId(event.target.value)}>{(currentProperty?.floors || []).map((floor) => <option key={floor.id} value={floor.id}>{floor.name}</option>)}</select></label>
          <span className="provider-map-legend"><i className="status-available-dot" />Available <i className="status-occupied-dot" />Occupied <i className="status-reserved-dot" />Reserved <i className="status-inactive-dot" />Inactive</span>
        </div>
        <div className={`provider-map-layout ${previewMode ? "provider-preview-layout" : ""}`}>
          <div className="provider-map-canvas">
            <div className="provider-map-grid" style={currentFloor?.mapImage ? { backgroundImage: `linear-gradient(rgba(255,255,255,.55), rgba(255,255,255,.55)), url("${currentFloor.mapImage}")` } : undefined}>
              {cells.map((cell) => (
                <div
                  key={`${cell.x}-${cell.y}`}
                  className="provider-map-cell"
                  style={{ gridColumn: cell.x, gridRow: cell.y }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const id = event.dataTransfer.getData("text/workspace-id");
                    if (!previewMode && currentProperty && currentFloor) updateWorkspace(currentProperty.id, currentFloor.id, id, (space) => ({ ...space, x: cell.x, y: cell.y }));
                  }}
                />
              ))}
              {floorSpaces.map((space) => (
                <button
                  key={space.id}
                  draggable={!previewMode}
                  className={`provider-map-space map-${space.status.toLowerCase()} ${selectedSpaceId === space.id ? "map-selected" : ""}`}
                  style={{ gridColumn: space.x, gridRow: space.y }}
                  onClick={() => !previewMode && setSelectedSpaceId(space.id)}
                  onDragStart={(event) => { if (!previewMode) event.dataTransfer.setData("text/workspace-id", space.id); }}
                  title={`${space.name} · ${space.status}`}
                >
                  <strong>{space.kind === "Meeting room" ? "▧" : space.kind === "Parking" ? "▱" : "▣"} {space.id}</strong>
                  <span>{space.name}</span>
                </button>
              ))}
            </div>
            <div className="provider-map-canvas-footer"><span>{currentFloor?.name || "Select a floor"}</span><span>{floorSpaces.length} spaces · {previewMode ? "Customer preview" : "Drag to rearrange"}</span></div>
          </div>
          {!previewMode && <aside className="provider-map-inspector">{selected ? <><div className="provider-map-inspector-top"><span>SELECTED WORKSPACE</span><button onClick={() => setSelectedSpaceId("")} aria-label="Close workspace details">×</button></div><span className="provider-eyebrow">{selected.kind.toUpperCase()} · {selected.id}</span><h2>{selected.name}</h2><p>{selected.category}</p><dl><div><dt>Capacity</dt><dd>{selected.capacity} {selected.kind === "Desk" ? "seat(s)" : "people"}</dd></div><div><dt>Hourly price</dt><dd>{money(selected.hourly)}</dd></div><div><dt>Availability</dt><dd>{selected.status}</dd></div><div><dt>Floor</dt><dd>{currentFloor?.name}</dd></div></dl><button className="provider-secondary provider-full-button" onClick={() => openModal("workspace", selected.id, currentFloor?.id)}>Edit details</button></> : <div className="provider-inspector-empty"><span>⌗</span><strong>Select a workspace</strong><p>Choose an item on the floor plan to see its details and edit its configuration.</p><button className="provider-link-button" onClick={() => openModal("workspace", "", currentFloor?.id || "")}>＋ Add workspace</button></div>}</aside>}
        </div>
      </>
    );
  }

  function renderBookings() {
    const bookings = bookingFilter === "All bookings" ? allBookings : allBookings.filter((booking) => booking.status === bookingFilter);
    return <><div className="provider-section-heading"><div><p className="provider-eyebrow">RESERVATIONS</p><h1>Bookings</h1><p>Review reservations and update their status.</p></div><select className="provider-booking-filter" aria-label="Filter bookings" value={bookingFilter} onChange={(event) => setBookingFilter(event.target.value as typeof bookingFilter)}><option>All bookings</option><option>Pending</option><option>Confirmed</option><option>Cancelled</option></select></div><section className="provider-card provider-booking-page"><div className="provider-card-heading"><div><h2>Recent reservations</h2><p>Mock booking data for your provider workspace</p></div><span className="provider-period">{activeBookings} active</span></div>{renderBookingRows(bookings)}</section></>;
  }

  function renderPricing() {
    return <><div className="provider-section-heading"><div><p className="provider-eyebrow">REVENUE SETTINGS</p><h1>Pricing & packages</h1><p>Set rates per workspace for flexible booking durations.</p></div><button className="provider-secondary" onClick={() => setView("workspaces")}>Manage workspaces</button></div><div className="provider-pricing-note"><span>＄</span><div><strong>Workspace-specific pricing</strong><p>Edit any workspace to configure hourly, daily, weekly, and monthly rates.</p></div></div><div className="provider-table-wrap"><table className="provider-table"><thead><tr><th>WORKSPACE</th><th>HOURLY</th><th>DAILY</th><th>WEEKLY</th><th>MONTHLY</th><th /></tr></thead><tbody>{spaces.map((space) => <tr key={`${space.propertyId}-${space.id}`}><td><strong>{space.name}</strong><span>{space.id} · {space.kind}</span></td><td>{money(space.hourly)}</td><td>{money(space.daily)}</td><td>{money(space.weekly)}</td><td>{money(space.monthly)}</td><td><button className="provider-row-action" onClick={() => { setPropertyId(space.propertyId); openModal("workspace", space.id, space.floorId); }}>Edit rates</button></td></tr>)}</tbody></table></div></>;
  }

  function renderAmenities() {
    return <><div className="provider-section-heading"><div><p className="provider-eyebrow">{currentProperty?.name || "PROPERTY"}</p><h1>Facilities & amenities</h1><p>Maintain the facilities offered across this property.</p></div><button className="provider-primary" disabled={!currentProperty} onClick={() => openModal("amenity")}>＋ Add facility</button></div><div className="provider-amenity-grid">{(currentProperty?.amenities || []).map((amenity) => <article className="provider-amenity-card" key={amenity}><span>✳</span><strong>{amenity}</strong><button aria-label={`Remove ${amenity}`} onClick={() => patchProperty(propertyId, (property) => ({ ...property, amenities: property.amenities.filter((item) => item !== amenity) }))}>×</button></article>)}{!currentProperty?.amenities.length && <div className="provider-empty"><strong>No facilities added</strong><p>Add the amenities available to your customers.</p></div>}</div></>;
  }

  function renderAnalytics() {
    const typeCounts = ["Desk", "Meeting room", "Parking"].map((kind) => ({ kind, count: spaces.filter((space) => space.kind === kind).length }));
    const peak = Math.max(1, ...typeCounts.map((item) => item.count));
    return <><div className="provider-section-heading"><div><p className="provider-eyebrow">BUSINESS PERFORMANCE</p><h1>Analytics & reports</h1><p>A live snapshot based on your saved workspace and booking data.</p></div><span className="provider-period">Last 30 days⌄</span></div><div className="provider-stats"><article className="provider-stat"><div className="provider-stat-top"><span>Confirmed revenue</span><i>＄</i></div><strong>{money(revenue)}</strong><small>From confirmed bookings</small></article><article className="provider-stat"><div className="provider-stat-top"><span>Occupancy rate</span><i>◉</i></div><strong>{spaceCount ? Math.round((occupiedCount / spaceCount) * 100) : 0}%</strong><small>{occupiedCount} occupied spaces</small></article><article className="provider-stat"><div className="provider-stat-top"><span>Active bookings</span><i>◷</i></div><strong>{activeBookings}</strong><small>Pending and confirmed</small></article><article className="provider-stat"><div className="provider-stat-top"><span>Available spaces</span><i>▣</i></div><strong>{availableCount}</strong><small>Ready to be booked</small></article></div><div className="provider-analytics-grid"><section className="provider-card"><div className="provider-card-heading"><div><h2>Workspace mix</h2><p>Spaces by category</p></div></div><div className="provider-type-bars">{typeCounts.map((item) => <div key={item.kind}><div><span>{item.kind}s</span><strong>{item.count}</strong></div><i><b style={{ width: `${(item.count / peak) * 100}%` }} /></i></div>)}</div></section><section className="provider-card"><div className="provider-card-heading"><div><h2>Booking status</h2><p>Current reservation breakdown</p></div></div><div className="provider-legend provider-analytics-legend">{(["Confirmed", "Pending", "Cancelled"] as Booking["status"][]).map((status) => <span key={status}><i className={`legend-${status.toLowerCase()}`} />{status}<b>{allBookings.filter((booking) => booking.status === status).length}</b></span>)}</div></section></div></>;
  }

  function renderReviews() {
    const reviews = [
      { name: "Maya Iyer", date: "Nov 10, 2026", rating: 5, text: "The workspace was bright, easy to find, and had everything I needed for a focused day." },
      { name: "Rohan Das", date: "Nov 08, 2026", rating: 4, text: "Great meeting room and smooth check-in. The screen and whiteboard were especially useful." },
      { name: "Aarav Mehta", date: "Nov 03, 2026", rating: 5, text: "Friendly reception and a really comfortable desk. I will definitely book again." },
    ];
    return <><div className="provider-section-heading"><div><p className="provider-eyebrow">CUSTOMER FEEDBACK</p><h1>Reviews</h1><p>Recent feedback across your workspace.</p></div><span className="provider-rating">★ 4.8 <small>average rating</small></span></div><div className="provider-review-list">{reviews.map((review) => <article className="provider-card provider-review" key={review.name}><div className="provider-review-avatar">{getUserInitials(review.name)}</div><div><div className="provider-review-heading"><strong>{review.name}</strong><span>{review.date}</span><b>{"★".repeat(review.rating)}<i>{"★".repeat(5 - review.rating)}</i></b></div><p>{review.text}</p></div></article>)}</div></>;
  }

  function renderSettings() {
    return <><div className="provider-section-heading"><div><p className="provider-eyebrow">ACCOUNT</p><h1>Settings</h1><p>Your provider account and current property preferences.</p></div></div><section className="provider-card provider-settings-card"><div className="provider-card-heading"><div><h2>Account profile</h2><p>Signed-in occupant account details</p></div><span className="provider-profile-role">OCCUPANT</span></div><div className="provider-setting-row"><span>Full name</span><strong>{ownerName}</strong></div><div className="provider-setting-row"><span>Email address</span><strong>{ownerEmail || "Not provided"}</strong></div><div className="provider-setting-row"><span>Account role</span><strong>Space provider</strong></div><div className="provider-setting-row"><span>Saved workspace data</span><strong>Stored in this browser</strong></div><button className="provider-secondary provider-signout" onClick={signOut}>Sign out</button></section><p className="provider-demo-disclaimer">Provider dashboard data is a local demo saved in this browser. It is not yet synced to the server.</p></>;
  }

  if (!hydrated) return <main className="provider-loading"><span className="provider-loader" />Loading your workspace…</main>;
  if (loadError) return <main className="provider-load-error"><section><span>!</span><h1>Workspace data unavailable</h1><p>{loadError}</p><button className="provider-primary" onClick={() => { localStorage.removeItem(`flexoffice_provider_data_v1:${ownerId}`); setData(initialData); setLoadError(""); }}>Reset demo workspace</button></section></main>;

  return (
    <main className="provider-app">
      <aside className={`provider-sidebar ${mobileNavOpen ? "provider-sidebar-open" : ""}`}>
        <Link href="/" className="provider-brand"><span className="brand-mark"><span /></span><span>flex<span>office</span></span></Link>
        <div className="provider-workspace-picker"><span>ACTIVE PROPERTY</span><select aria-label="Select active property" value={currentProperty?.id || ""} onChange={(event) => { setPropertyId(event.target.value); setFloorId(data.properties.find((property) => property.id === event.target.value)?.floors[0]?.id || ""); }}>{data.properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select></div>
        <nav className="provider-nav" aria-label="Provider navigation">{(["WORKSPACE", "MANAGEMENT", "INSIGHTS", "ACCOUNT"] as const).map((group) => <div className="provider-nav-group" key={group}><span className="provider-nav-label">{group}</span>{navigation.filter((item) => item.group === group).map((item) => <button key={item.id} className={`provider-nav-item ${view === item.id ? "provider-nav-active" : ""}`} onClick={() => { setView(item.id); setMobileNavOpen(false); }}><span>{item.icon}</span>{item.label}{item.id === "bookings" && allBookings.some((booking) => booking.status === "Pending") && <i>1</i>}</button>)}</div>)}</nav>
        <div className="provider-sidebar-bottom"><div className="provider-help-card"><span>Need a hand?</span><strong>Visit the help centre ↗</strong></div><button onClick={() => setView("settings")} className="provider-sidebar-user"><span>{getUserInitials(ownerName) || "SP"}</span><div><strong>{ownerName}</strong><small>Space provider</small></div><b>⌄</b></button></div>
      </aside>
      <section className="provider-main">
        <header className="provider-topbar"><button className="provider-menu-toggle" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation">☰</button><div className="provider-breadcrumb">Workspace <span>/</span> {page?.label || "Overview"}</div><div className="provider-topbar-actions"><button className="provider-notification-button" onClick={() => setNotificationsOpen((open) => !open)} aria-label="Notifications">♧{allBookings.some((booking) => booking.status === "Pending") && <i />}</button><div className="provider-topbar-divider" /><button className="provider-topbar-profile" onClick={() => setView("settings")}><span className="provider-avatar">{getUserInitials(ownerName) || "SP"}</span><span><strong>{ownerName}</strong><small>Space provider</small></span><b>⌄</b></button>{notificationsOpen && <div className="provider-notifications"><strong>Notifications</strong><p>{allBookings.filter((booking) => booking.status === "Pending").length ? "You have pending booking requests to review." : "You’re all caught up."}</p><button onClick={() => { setView("bookings"); setNotificationsOpen(false); }}>Review bookings →</button></div>}</div></header>
        <div className="provider-content">{storageError && <p className="provider-storage-warning" role="alert">{storageError}</p>}{view === "overview" && renderOverview()}{view === "properties" && renderProperties()}{view === "floors" && renderFloors()}{view === "workspaces" && renderWorkspaces()}{view === "meeting-rooms" && renderWorkspaces(filteredSpaces.filter((space) => space.kind === "Meeting room"))}{view === "parking" && renderWorkspaces(filteredSpaces.filter((space) => space.kind === "Parking"))}{view === "map" && renderMap()}{view === "bookings" && renderBookings()}{view === "pricing" && renderPricing()}{view === "amenities" && renderAmenities()}{view === "analytics" && renderAnalytics()}{view === "reviews" && renderReviews()}{view === "settings" && renderSettings()}</div>
      </section>

      {modal && <div className="provider-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}><section className="provider-modal" role="dialog" aria-modal="true" aria-labelledby="provider-modal-title"><div className="provider-modal-header"><div><p className="provider-eyebrow">{editingId ? "UPDATE DETAILS" : "ADD TO YOUR WORKSPACE"}</p><h2 id="provider-modal-title">{modal === "property" ? editingId ? "Edit property" : "Add a property" : modal === "floor" ? editingId ? "Edit floor" : "Add a floor" : modal === "workspace" ? editingId ? "Edit workspace" : "Add a workspace" : "Add a facility"}</h2></div><button onClick={closeModal} aria-label="Close dialog">×</button></div><form onSubmit={saveModal} className="provider-modal-form">
        {modal === "property" && <><label>Property name<input name="name" required defaultValue={editingId ? currentProperty?.name : ""} placeholder="e.g. Studio North" /></label><label>Property address<input name="address" required defaultValue={editingId ? currentProperty?.address : ""} placeholder="Street, city, country" /></label><label>Description<input name="description" defaultValue={editingId ? currentProperty?.description : ""} placeholder="Describe this workspace" /></label><div className="provider-form-row"><label>Property type<select name="type" defaultValue={editingId ? currentProperty?.type : "Coworking office"}><option>Coworking office</option><option>Business center</option><option>Private office</option><option>Mixed-use workspace</option></select></label><label>Status<select name="status" defaultValue={editingId ? currentProperty?.status : "Active"}><option>Active</option><option>Draft</option></select></label></div><div className="provider-form-row"><label>Operating hours<input name="operatingHours" defaultValue={editingId ? currentProperty?.operatingHours : "Mon–Fri, 8:00 AM–8:00 PM"} /></label><label>Contact information<input name="contact" defaultValue={editingId ? currentProperty?.contact : ""} placeholder="Phone or email" /></label></div></>}
        {modal === "floor" && <><label>Floor name<input name="name" required defaultValue={editingId ? currentProperty?.floors.find((floor) => floor.id === editingId)?.name : ""} placeholder="e.g. First floor" /></label><div className="provider-form-row"><label>Floor number<input name="number" type="number" min="0" required defaultValue={editingId ? currentProperty?.floors.find((floor) => floor.id === editingId)?.number : currentProperty?.floors.length || 1} /></label><label>Total area (sq ft)<input name="area" type="number" min="0" defaultValue={editingId ? currentProperty?.floors.find((floor) => floor.id === editingId)?.area : ""} placeholder="e.g. 2400" /></label></div><label>Floor capacity<input name="capacity" type="number" min="1" defaultValue={editingId ? currentProperty?.floors.find((floor) => floor.id === editingId)?.capacity : 1} /></label></>}
        {modal === "workspace" && <><div className="provider-form-row"><label>Workspace ID<input name="id" required defaultValue={editingId} placeholder="e.g. DSK-110" /></label><label>Workspace type<select name="kind" defaultValue={editingId ? currentProperty?.floors.flatMap((floor) => floor.spaces).find((space) => space.id === editingId)?.kind : "Desk"}><option>Desk</option><option>Meeting room</option><option>Parking</option></select></label></div><label>Workspace name<input name="name" required defaultValue={editingId ? currentProperty?.floors.flatMap((floor) => floor.spaces).find((space) => space.id === editingId)?.name : ""} placeholder="e.g. Window desk 04" /></label><div className="provider-form-row"><label>Category<input name="category" defaultValue={editingId ? currentProperty?.floors.flatMap((floor) => floor.spaces).find((space) => space.id === editingId)?.category : ""} placeholder="e.g. Hot desk" /></label><label>Floor<select name="floorId" defaultValue={modalFloorId || currentFloor?.id}>{(currentProperty?.floors || []).map((floor) => <option key={floor.id} value={floor.id}>{floor.name}</option>)}</select></label></div><div className="provider-form-row"><label>Capacity<input name="capacity" type="number" min="1" defaultValue={editingId ? currentProperty?.floors.flatMap((floor) => floor.spaces).find((space) => space.id === editingId)?.capacity : 1} /></label><label>Availability<select name="status" defaultValue={editingId ? currentProperty?.floors.flatMap((floor) => floor.spaces).find((space) => space.id === editingId)?.status : "Available"}>{(["Available", "Occupied", "Reserved", "Inactive"] as Availability[]).map((status) => <option key={status}>{status}</option>)}</select></label></div><div className="provider-modal-subtitle">PRICING · USD</div><div className="provider-form-row provider-rate-fields">{(["hourly", "daily", "weekly", "monthly"] as const).map((rate) => <label key={rate}>{rate}<input name={rate} type="number" min="0" step="0.01" defaultValue={editingId ? currentProperty?.floors.flatMap((floor) => floor.spaces).find((space) => space.id === editingId)?.[rate] : 0} /></label>)}</div><label>Amenities<input name="amenities" defaultValue={editingId ? currentProperty?.floors.flatMap((floor) => floor.spaces).find((space) => space.id === editingId)?.amenities.join(", ") : ""} placeholder="Wi-Fi, monitor, natural light" /><small>Separate amenities with commas.</small></label></>}
        {modal === "amenity" && <label>Facility name<input name="name" required placeholder="e.g. First aid" /></label>}
        <div className="provider-modal-footer"><button type="button" className="provider-secondary" onClick={closeModal}>Cancel</button><button type="submit" className="provider-primary">{editingId ? "Save changes" : modal === "amenity" ? "Add facility" : "Create"}</button></div>
      </form></section></div>}
      {toast && <div className="provider-toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}
