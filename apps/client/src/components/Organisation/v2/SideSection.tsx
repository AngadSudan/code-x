"use client";

import {
    Building2,
    Menu,
    Pencil,
    DoorOpen,
} from "lucide-react";

import "./profile_styles.css";
import toast from "react-hot-toast";
import { ReactNode, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/components/General/(Color Manager)/ThemeSwitcher";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import axiosInstance from "@/utils/axiosInstance";
import EditProfileModal from "./EditProfileModal";
import { useOrgStore } from "@/store/org-store";


export type Organization = {
    id: string;
    name: string;
    username: string;
    email: string;
    tagline?: string | null;
    profileUrl?: string | null;
    bannerUrl?: string | null;
};

export default function SideSection() {
    const Colors = useColors();
    const router = useRouter();
    const { info: orgInfo, setData: setOrgInfo } = useOrgStore();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const [data, setData] = useState<Organization | null>(orgInfo as Organization | null);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const getData = async () => {
        try {
            const res = await axiosInstance.get(backendUrl + "/api/v1/organizations/me", {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res) throw new Error("Unable to get Data");

            const result = await res.data;
            setData(result.data);
            setOrgInfo(result.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (backendUrl) getData();
    }, []);

    const uploadProfilePic = async (file: File) => {
        const toastId = toast.loading("Uploading profile picture...");
        try {
            const formData = new FormData();
            formData.append("Org-Profile-Pic", file);

            const res = await axiosInstance.put(`${backendUrl}/api/v1/organizations/update-org-profilePic`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (!res) throw new Error("Upload failed");

            const result = await res.data;

            if (!result.data?.profileUrl) {
                throw new Error(result.message || "Upload failed");
            }

            setData((prev) => {
                if (!prev) return prev;
                const next = {
                    ...prev,
                    profileUrl: `${result.data.profileUrl}?t=${Date.now()}`,
                };
                setOrgInfo(next as any);
                return next;
            });
            toast.success("Upload Success!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Unable to Upload", { id: toastId });
        }
    };

    function handleLogout() {
        // Clear cookies and redirect to "/"
        // TODO
        console.log("Logging out...");
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/");
    }

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [knowMoreOpen, setKnowMoreOpen] = useState(false);

    return (
        <div
            className={`${Colors.background.secondary} w-full min-h-full p-4 flex flex-col justify-between rounded-xl font-mono`}
        >
            {/* hidden file input  */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadProfilePic(file);
                }}
            />


            <div>
                <div className="flex justify-center mb-4">
                    <div
                        className={`
      relative w-50 h-50 rounded-full overflow-hidden
      ${Colors.background.primary}
      group cursor-pointer
      flex items-center justify-center
    `}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {data?.profileUrl ? (
                            <img
                                src={data.profileUrl}
                                alt="Profile"
                                className="
        block
        w-full h-full
        object-cover
        rounded-full
        leading-none
        transition-all duration-200
        group-hover:blur-sm group-hover:opacity-60
      "
                            />
                        ) : (
                            <Building2
                                className="
        w-32 h-32
        text-white
        transition-all duration-200
        group-hover:blur-sm group-hover:opacity-60
      "
                            />
                        )}

                        {/* Hover overlay */}
                        <div
                            className="
      absolute inset-0
      flex items-center justify-center
      bg-black/40
      opacity-0
      group-hover:opacity-100
      transition-opacity duration-200
    "
                        >
                            <Pencil className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                <div
                    className={`${Colors.background.primary} rounded-xl px-4 py-3 flex items-center justify-between`}
                >
                    <div>
                        <p
                            className={`${Colors.text.primary} font-mono text-2xl leading-none`}
                        >
                            {data?.name ?? "Organization"}
                        </p>
                        <p
                            className={`text-md ${Colors.text.secondary} font-mono font-bold`}
                        >
                            {data?.username ?? "@username"}
                        </p>
                    </div>

                    <div className="relative" ref={menuRef}>
                        <Menu
                            className={`${Colors.text.primary} w-8 h-8 cursor-pointer`}
                            onClick={() => setOpen((prev) => !prev)}
                        />

                        {open && (
                            <div
                                className={`absolute right-0 top-8 z-50 w-48 rounded-xl ${Colors.background.secondary} backdrop-blur-sm ${Colors.border.defaultThin} shadow-lg`}
                            >
                                <MenuItem
                                    label="Know More"
                                    onClick={() => {
                                        setKnowMoreOpen(true);
                                        setOpen(false);
                                    }}
                                />
                                <Divider />
                                <MenuItem label="Add to Wishlist" />
                                <Divider />
                                <MenuItem
                                    label="Edit Profile"
                                    onClick={() => {
                                        setEditOpen(true);
                                        setOpen(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`mt-6 ${Colors.background.primary} rounded-xl p-4 max-h-82 overflow-y-auto`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className={`${Colors.text.primary} text-2xl font-mono`}>
                            Organization Info
                        </p>
                    </div>
                    <div className={`${Colors.border.defaultThinBottom} mb-3`} />

                    <p className={`${Colors.text.secondary} font-mono text-sm`}>
                        Email
                    </p>
                    <p className={`${Colors.text.primary} font-mono text-base break-all`}>
                        {data?.email || "-"}
                    </p>

                    <div className={`my-3 ${Colors.border.defaultThinBottom}`} />

                    <p className={`${Colors.text.secondary} font-mono text-sm`}>
                        Tagline
                    </p>
                    <p className={`${Colors.text.primary} font-mono text-base`}>
                        {data?.tagline || "No tagline added yet"}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2">
                <ThemeSwitcher />
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-3">
                <button
                    className={`${Colors.background.special} ${Colors.properties.interactiveButton} flex-1 py-3 rounded-xl flex items-center justify-center`}
                >
                    <DoorOpen className={`${Colors.text.inverted}`} /> <span className={`ml-2 ${Colors.text.inverted} font-semibold`} onClick={handleLogout}>Logout</span>
                </button>
                {/* <button
          className={`${Colors.background.special} ${Colors.properties.interactiveButton} flex-1 py-3 rounded-xl flex items-center justify-center`}
        >
          <MessageSquare className={`${Colors.text.inverted}`} />
        </button> */}
            </div>

            {/* Edit profile Modal  */}
            <EditProfileModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                onSave={(payload) => {
                    console.log(payload);
                    setEditOpen(false);
                }}
            />

            {/* Know more Modal  */}

        </div>
    );
}

function MenuItem({ label, onClick }: { label: string; onClick?: () => void }) {
    const Colors = useColors();

    return (
        <div
            onClick={onClick}
            className={`px-4 py-2 ${Colors.text.primary} rounded-xl font-mono text-sm cursor-pointer hover:opacity-80 transition`}
        >
            {label}
        </div>
    );
}

function Divider() {
    const Colors = useColors();
    return <div className={`mx-3 ${Colors.border.defaultThinBottom}`} />;
}
