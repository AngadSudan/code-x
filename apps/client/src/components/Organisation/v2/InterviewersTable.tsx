"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Spinner from "@/components/General/Spinner";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { Trash2, Eye, Plus, Search, X, User, AtSign, Mail, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

type Interviewer = {
    id: string;
    name: string;
    username: string;
    email: string;
    // Orgnization id to be added
};


/* ── reusable pill badge ── */
function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="bg-[#64e5af12] border border-[#64e5af30] text-[#64e5af] text-xs px-2 py-0.5 rounded-full">
            {children}
        </span>
    );
}
async function handleCreateInterviewer(data: { name: string; username: string; email: string }) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
        await axios.post(`${backendUrl}/api/v1/auth/register/interviewer`, data, { withCredentials: true });
        toast.success("Interviewer created successfully");
    } catch (err) {
        console.error("Failed to create interviewer", err);
        toast.error("Failed to create interviewer");
    }
}
/* ── modal wrapper ── */
function Modal({
    children,
    onClose,
}: {
    children: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,19,19,0.85)] backdrop-blur-[6px]"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#1e1e1e",
                    border: "1px solid #64e5af25",
                    boxShadow: "0 0 60px #64e5af15, 0 24px 48px rgba(0,0,0,0.6)",
                    animation: "modalIn 0.2s cubic-bezier(.22,1,.36,1)",
                }}
                className="w-[440px] rounded-2xl p-7 relative"
            >
                {children}
            </div>

            <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
}

/* ── styled input ── */
function Field({
    icon: Icon,
    placeholder,
    value,
    onChange,
}: {
    icon: React.ElementType;
    placeholder: string;
    value?: string;
    onChange?: (v: string) => void;
}) {
    return (
        <div
            style={{ border: "1px solid #64e5af20", background: "#121313" }}
            className="flex items-center gap-3 rounded-xl px-4 py-3 focus-within:outline focus-within:outline-1"
        >
            <Icon size={15} color="#64e5af" className="flex-shrink-0 opacity-70" />
            <input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                style={{
                    background: "transparent",
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    outline: "none",
                    width: "100%",
                    fontFamily: "inherit",
                }}
                className="placeholder:text-white/25"
            />
        </div>
    );
}

export default function InterviewersTable() {
    const Colors = useColors();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
    const [editData, setEditData] = useState<Interviewer | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ name: "", username: "", email: "" });
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function fetchInterviewers() {
        try {
            const res = await axios.get(
                `${backendUrl}/api/v1/organizations/interviewers`,
                { withCredentials: true }
            );
            setInterviewers(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch interviewers", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchInterviewers(); }, []);

    async function deleteInterviewer(id: string) {
        setDeletingId(id);
        try {
            await axios.delete(`${backendUrl}/api/v1/organizations/interviewers/${id}`, {
                withCredentials: true,
            });
            setInterviewers((prev) => prev.filter((i) => i.id !== id));
        } catch (err) {
            toast.error("Failed to delete interviewer");
            console.error("Delete failed", err);
        } finally {
            toast.success("Interviewer deleted");
            setDeletingId(null);
        }
    }

    async function editInterviewer(data: Interviewer) {
        try {
            await axios.put(
                `${backendUrl}/api/v1/organizations/interviewers/${data.id}`,
                data,
                { withCredentials: true }
            );
            fetchInterviewers();
            setSelectedInterviewer(null);
        } catch (err) {
            console.error("Edit failed", err);
        }
    }

    const filtered = interviewers.filter((i) =>
        `${i.name} ${i.username} ${i.email}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div
                style={{ background: "#121313", minHeight: "300px" }}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl"
            >
                <div
                    style={{
                        width: 44,
                        height: 44,
                        border: "2px solid #64e5af30",
                        borderTop: "2px solid #64e5af",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                    }}
                />
                <p style={{ color: "#64e5af80", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>
                    loading interviewers...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <>


            <div
                style={{
                    fontFamily: "'Syne', sans-serif",
                    color: "#ffffff",
                }}
                className="space-y-5"
            >

                <div className="flex items-center justify-between gap-4">

                    <div className="bg-[#1e1e1e] border border-[#64e5af18] rounded-[14px] flex items-center gap-[10px] px-[14px] py-[9px] w-[80%] transition-colors duration-200">
                        <Search size={14} color="#64e5af" style={{ opacity: 0.6, flexShrink: 0 }} />
                        <input
                            placeholder="Search interviewers…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                background: "transparent",
                                color: "#fff",
                                fontSize: "0.84rem",
                                outline: "none",
                                width: "100%",
                                fontFamily: "'Syne', sans-serif",
                            }}
                            className="placeholder:text-white/25"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="opacity-40 hover:opacity-70">
                                <X size={13} color="#fff" />
                            </button>
                        )}
                    </div>



                    <button
                        onClick={() => setShowAddModal(true)}
                        className="iv-btn-primary flex items-center gap-2 bg-[#64e5af] text-[#121313] px-4 py-2 rounded-lg"
                    >
                        <Plus size={15} />
                        Add Interviewer
                    </button>
                </div>

                {/* ── TABLE ── */}
                <div
                    style={{
                        background: "#1e1e1e",
                        border: "1px solid #64e5af18",
                        borderRadius: "18px",
                        overflow: "hidden",
                    }}
                >
                    {/* table header */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1.5fr 2fr 100px",
                            padding: "12px 20px",
                            borderBottom: "1px solid #64e5af12",
                            background: "#121313",
                        }}
                    >
                        {["Interviewer", "Username", "Email", ""].map((h, i) => (
                            <span
                                key={i}
                                className="iv-tag-header"
                                style={{ textAlign: i === 3 ? "right" : "left" }}
                            >
                                {h}
                            </span>
                        ))}
                    </div>

                    {/* rows */}
                    {filtered.length === 0 ? (
                        <div
                            style={{ padding: "48px 24px", textAlign: "center", color: "#64e5af40" }}
                        >
                            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem" }}>
                                no interviewers found
                            </p>
                        </div>
                    ) : (
                        filtered.map((it, idx) => (
                            <div
                                key={it.id}
                                onClick={() => {
                                    setSelectedInterviewer(it);
                                    setEditData({ ...it });
                                }}
                                className="iv-row cursor-pointer hover:bg-[#64e5af10] transition-colors"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1.5fr 2fr 100px",
                                    padding: "14px 20px",
                                    alignItems: "center",
                                    borderBottom: idx < filtered.length - 1 ? "1px solid #64e5af0a" : "none",
                                    animationDelay: `${idx * 40}ms`,
                                }}
                            >
                                {/* name + avatar */}
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{it.name}</span>
                                    <ChevronRight size={13} className="iv-chevron" color="#64e5af" />
                                </div>

                                {/* username */}
                                <div>
                                    <Pill>@{it.username}</Pill>
                                </div>

                                {/* email */}
                                <span style={{ color: "#ffffff70", fontSize: "0.84rem", fontFamily: "'DM Mono', monospace" }}>
                                    {it.email}
                                </span>

                                {/* actions */}
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => { setSelectedInterviewer(it); setEditData({ ...it }); }}
                                        className="iv-btn iv-btn-ghost"
                                        title="View"
                                    >
                                        <Eye size={14} />
                                    </button>

                                    <button
                                        onClick={() => deleteInterviewer(it.id)}
                                        disabled={deletingId === it.id}
                                        className="iv-btn iv-btn-danger"
                                        title="Delete"
                                    >
                                        {deletingId === it.id ? (
                                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>…</span>
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* ── VIEW / EDIT MODAL ── */}
                {selectedInterviewer && editData && (
                    <Modal onClose={() => setSelectedInterviewer(null)}>
                        {/* close btn */}
                        <button
                            onClick={() => setSelectedInterviewer(null)}
                            style={{ position: "absolute", top: 18, right: 18, color: "#ffffff40" }}
                            className="hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div
                                style={{
                                    width: 52, height: 52,
                                    background: "linear-gradient(135deg,#64e5af22,#64e5af44)",
                                    border: "1px solid #64e5af55",
                                    borderRadius: "14px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#64e5af",
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: "1rem", fontWeight: 700,
                                }}
                            >
                                {selectedInterviewer.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: "1rem" }}>{selectedInterviewer.name}</p>
                                <p style={{ color: "#64e5af80", fontSize: "0.75rem", fontFamily: "'DM Mono', monospace" }}>
                                    @{selectedInterviewer.username}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <Field
                                icon={User}
                                placeholder="Name"
                                value={editData.name}
                                onChange={(v) => setEditData({ ...editData, name: v })}
                            />
                            <Field
                                icon={AtSign}
                                placeholder="Username"
                                value={editData.username}
                                onChange={(v) => setEditData({ ...editData, username: v })}
                            />
                            <Field
                                icon={Mail}
                                placeholder="Email"
                                value={editData.email}
                                onChange={(v) => setEditData({ ...editData, email: v })}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedInterviewer(null)}
                                className="iv-btn iv-btn-ghost"
                                style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #ffffff15" }}
                            >
                                Cancel
                            </button>
                            <button onClick={() => editInterviewer(editData)} className="iv-btn-primary bg-[#64e5af] text-[#121313] px-4 py-2 rounded-lg">
                                Save Changes
                            </button>
                        </div>
                    </Modal>
                )}

                {/* ── ADD MODAL ── */}
                {showAddModal && (
                    <Modal onClose={() => setShowAddModal(false)}>
                        <button
                            onClick={() => setShowAddModal(false)}
                            style={{ position: "absolute", top: 18, right: 18, color: "#ffffff40" }}
                            className="hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="mb-6">
                            <div
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 8,
                                    background: "#64e5af12", border: "1px solid #64e5af30",
                                    borderRadius: "10px", padding: "6px 12px",
                                    color: "#64e5af", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem",
                                    marginBottom: "10px",
                                }}
                            >
                                <Plus size={11} /> new interviewer
                            </div>
                            <h2 style={{ fontWeight: 700, fontSize: "1.15rem" }}>Add Interviewer</h2>
                            <p style={{ color: "#ffffff50", fontSize: "0.82rem", marginTop: 3 }}>
                                They'll receive an invite to join your workspace.
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <Field
                                icon={User}
                                placeholder="Name"
                                value={addForm.name}
                                onChange={(v) => setAddForm({ ...addForm, name: v })}
                            />
                            <Field
                                icon={Mail}
                                placeholder="email"
                                value={addForm.email}
                                onChange={(v) => setAddForm({ ...addForm, email: v })}
                            />
                            <Field
                                icon={AtSign}
                                placeholder="Username"
                                value={addForm.username}
                                onChange={(v) => setAddForm({ ...addForm, username: v })}
                            />

                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="iv-btn iv-btn-ghost"
                                style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #ffffff15" }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleCreateInterviewer(addForm);
                                    setShowAddModal(false);
                                    setAddForm({ name: "", username: "", email: "" });
                                }}
                                className="iv-btn-primary bg-[#64e5af] text-[#121313] px-4 py-2 rounded-lg"
                            >
                                Send Invite
                            </button>
                        </div>
                    </Modal>
                )}

            </div>
        </>
    );
}