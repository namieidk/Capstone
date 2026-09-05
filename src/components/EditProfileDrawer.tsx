"use client";

import React, { useEffect, useState } from "react";
import { s, XCircleIcon } from "@/components/Adminshared";

interface EditProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: {
    first_name?: string;
    last_name?: string;
    title?: string;
    department?: string;
    bio?: string;
    phone_number?: string;
  };
  saving?: boolean;
  error?: string;
  onSave: (values: {
    first_name: string;
    last_name: string;
    title: string;
    department: string;
    bio: string;
  }) => void;
}

export default function EditProfileDrawer({
  open,
  onClose,
  initialValues,
  saving = false,
  error,
  onSave,
}: EditProfileDrawerProps) {
  const [firstName, setFirstName] = useState(initialValues?.first_name ?? "");
  const [lastName, setLastName] = useState(initialValues?.last_name ?? "");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [department, setDepartment] = useState(
    initialValues?.department ?? "",
  );
  const [bio, setBio] = useState(initialValues?.bio ?? "");

  useEffect(() => {
    if (open) {
      setFirstName(initialValues?.first_name ?? "");
      setLastName(initialValues?.last_name ?? "");
      setTitle(initialValues?.title ?? "");
      setDepartment(initialValues?.department ?? "");
      setBio(initialValues?.bio ?? "");
    }
  }, [open, initialValues]);

  if (!open) return null;

  return (
    <div style={s.drawerOverlay} onClick={onClose}>
      <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
        <div style={s.drawerHeader}>
          <div style={{ flexGrow: 1 }}>
            <h3 style={s.drawerName}>Edit profile</h3>
            <p style={s.drawerMeta}>Update your personal information</p>
          </div>
          <button
            style={s.drawerCloseBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <XCircleIcon />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <p style={drawerFieldLabel}>First name</p>
            <input
              style={s.input}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <p style={drawerFieldLabel}>Last name</p>
            <input
              style={s.input}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <p style={drawerFieldLabel}>Title</p>
            <input
              style={s.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <p style={drawerFieldLabel}>Department</p>
            <input
              style={s.input}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div>
            <p style={drawerFieldLabel}>Bio</p>
            <textarea
              style={{ ...s.input, height: 90, resize: "vertical" }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div style={drawerErrorBanner}>
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            borderTop: "1px solid #ECE7DA",
            paddingTop: 20,
          }}
        >
          <button style={s.reviewEditLink} onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            style={{
              ...s.continueBtnSmall,
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
            disabled={saving}
            onClick={() =>
              onSave({
                first_name: firstName,
                last_name: lastName,
                title,
                department,
                bio,
              })
            }
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

const drawerFieldLabel: React.CSSProperties = {
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "#9a9a94",
  marginBottom: 6,
};

const drawerErrorBanner: React.CSSProperties = {
  background: "#FDEBEC",
  color: "#B3261E",
  border: "1px solid #F5C2C0",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: "0.88rem",
  lineHeight: 1.5,
  marginBottom: 20,
};
