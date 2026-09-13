import React, { useState, useRef, useEffect } from "react";
import { Pin, PinOff, Pencil, Trash2, Copy, Plus, X, Check, Clipboard } from "lucide-react";

const COLORS = {
  bg: "#EDEFF3",
  surface: "#FFFFFF",
  surfaceSoft: "#F5F6F8",
  ink: "#1E2230",
  inkSoft: "#6B7280",
  border: "#D7DAE0",
  accent: "#B8863B",
  accentSoft: "#F3E8D3",
  danger: "#B4483A",
  dangerSoft: "#F5E3E0",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 10) return "เมื่อสักครู่";
  if (diff < 60) return `${diff} วินาทีที่แล้ว`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชั่วโมงที่แล้ว`;
  const d = Math.floor(h / 24);
  return `${d} วันที่แล้ว`;
}

let idCounter = 1;
const makeId = () => `item-${idCounter++}-${Date.now()}`;

const SEED = [
  {
    id: makeId(),
    content: "npm run build && npm run deploy",
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 40,
  },
  {
    id: makeId(),
    content: "anek.rienpreecha@example.com",
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: makeId(),
    content: "เดี๋ยวส่งลิงก์ Figma ให้ตอนบ่าย 3 นะครับ",
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
  },
];

function CopiedToast({ show }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: `translateX(-50%) translateY(${show ? "0" : "12px"})`,
        opacity: show ? 1 : 0,
        transition: "all 200ms ease",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
        style={{ background: COLORS.ink, color: "#fff" }}
      >
        <Check size={16} />
        คัดลอกแล้ว
      </div>
    </div>
  );
}

function ItemCard({ item, onTogglePin, onDelete, onEdit, onCopy, variant }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.content);
  const taRef = useRef(null);

  useEffect(() => {
    if (editing && taRef.current) {
      taRef.current.focus();
      taRef.current.setSelectionRange(draft.length, draft.length);
    }
  }, [editing]);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      setDraft(item.content);
      setEditing(false);
      return;
    }
    onEdit(item.id, trimmed);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(item.content);
    setEditing(false);
  };

  const isPinnedCard = variant === "pinned";

  return (
    <div
      className={
        isPinnedCard
          ? "flex-shrink-0 w-64 rounded-xl p-4 flex flex-col justify-between"
          : "w-full rounded-xl p-4 flex items-start gap-3"
      }
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderTop: isPinnedCard ? `3px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`,
      }}
    >
      <div className={isPinnedCard ? "" : "flex-1 min-w-0"}>
        {editing ? (
          <textarea
            ref={taRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
              if (e.key === "Escape") cancel();
            }}
            rows={isPinnedCard ? 4 : 2}
            className="w-full resize-none rounded-md p-2 text-sm outline-none"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              background: COLORS.surfaceSoft,
              color: COLORS.ink,
              border: `1px solid ${COLORS.accent}`,
            }}
          />
        ) : (
          <p
            className={isPinnedCard ? "text-sm whitespace-pre-wrap break-words line-clamp-6" : "text-sm whitespace-pre-wrap break-words"}
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.ink }}
          >
            {item.content}
          </p>
        )}

        <div
          className={isPinnedCard ? "mt-3 flex items-center justify-between" : "mt-1.5 flex items-center gap-3"}
        >
          <span className="text-xs" style={{ color: COLORS.inkSoft, fontFamily: "'Inter', sans-serif" }}>
            {timeAgo(item.createdAt)}
          </span>

          {editing ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={save}
                className="p-1.5 rounded-md transition-colors"
                style={{ color: COLORS.accent }}
                title="บันทึก"
              >
                <Check size={16} />
              </button>
              <button
                onClick={cancel}
                className="p-1.5 rounded-md transition-colors"
                style={{ color: COLORS.inkSoft }}
                title="ยกเลิก"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onCopy(item.content)}
                className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
                style={{ color: COLORS.inkSoft }}
                title="คัดลอก"
              >
                <Copy size={15} />
              </button>
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
                style={{ color: COLORS.inkSoft }}
                title="แก้ไข"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onTogglePin(item.id)}
                className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
                style={{ color: item.pinned ? COLORS.accent : COLORS.inkSoft }}
                title={item.pinned ? "เลิกปักหมุด" : "ปักหมุด"}
              >
                {item.pinned ? <PinOff size={15} /> : <Pin size={15} />}
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
                style={{ color: COLORS.danger }}
                title="ลบ"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClipboardApp() {
  const [items, setItems] = useState(SEED);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState(false);
  const inputRef = useRef(null);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 1400);
  };

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setItems((prev) => [
      { id: makeId(), content: trimmed, pinned: false, createdAt: Date.now() },
      ...prev,
    ]);
    setDraft("");
    inputRef.current && inputRef.current.focus();
  };

  const deleteItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const editItem = (id, content) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, content } : it)));

  const togglePin = (id) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, pinned: !it.pinned } : it)));

  const copyItem = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (e) {
      // clipboard API may be unavailable in this sandbox; fail silently
    }
    showToast();
  };

  const pinned = items.filter((it) => it.pinned).sort((a, b) => b.createdAt - a.createdAt);
  const unpinned = items.filter((it) => !it.pinned).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: COLORS.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <style>{FONTS}</style>

      <div className="max-w-2xl mx-auto px-5 py-10 md:py-14">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: COLORS.ink }}
          >
            <Clipboard size={18} color="#fff" />
          </div>
          <div>
            <h1
              className="text-xl leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: COLORS.ink }}
            >
              คลิปบอร์ดของฉัน
            </h1>
            <p className="text-xs" style={{ color: COLORS.inkSoft }}>
              เก็บ แก้ไข และปักหมุดข้อความที่ใช้บ่อย
            </p>
          </div>
        </div>

        {/* Add bar */}
        <div
          className="rounded-xl p-3 mb-8 flex items-end gap-2"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
        >
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addItem();
            }}
            placeholder="วางหรือพิมพ์ข้อความที่ต้องการเก็บไว้... (Ctrl/Cmd + Enter เพื่อเพิ่ม)"
            rows={2}
            className="flex-1 resize-none outline-none text-sm p-2 rounded-md"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              background: COLORS.surfaceSoft,
              color: COLORS.ink,
            }}
          />
          <button
            onClick={addItem}
            disabled={!draft.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-medium transition-opacity flex-shrink-0"
            style={{
              background: draft.trim() ? COLORS.ink : COLORS.border,
              color: draft.trim() ? "#fff" : COLORS.inkSoft,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: draft.trim() ? "pointer" : "not-allowed",
            }}
          >
            <Plus size={16} />
            เพิ่ม
          </button>
        </div>

        {/* Pinned section */}
        <div className="mb-8">
          <h2
            className="text-sm font-semibold mb-3 flex items-center gap-1.5"
            style={{ color: COLORS.accent, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Pin size={14} />
            ปักหมุด
          </h2>
          {pinned.length === 0 ? (
            <div
              className="rounded-xl p-4 text-sm"
              style={{
                background: COLORS.surfaceSoft,
                color: COLORS.inkSoft,
                border: `1px dashed ${COLORS.border}`,
              }}
            >
              ยังไม่มีรายการที่ปักหมุด — กดไอคอนปักหมุดที่รายการด้านล่างเพื่อเก็บไว้ด้านบน
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {pinned.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  variant="pinned"
                  onTogglePin={togglePin}
                  onDelete={deleteItem}
                  onEdit={editItem}
                  onCopy={copyItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* All items */}
        <div>
          <h2
            className="text-sm font-semibold mb-3"
            style={{ color: COLORS.ink, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            รายการทั้งหมด
          </h2>
          {unpinned.length === 0 ? (
            <div
              className="rounded-xl p-6 text-sm text-center"
              style={{
                background: COLORS.surfaceSoft,
                color: COLORS.inkSoft,
                border: `1px dashed ${COLORS.border}`,
              }}
            >
              ยังไม่มีข้อความ — เพิ่มรายการแรกของคุณด้านบนได้เลย
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {unpinned.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  variant="list"
                  onTogglePin={togglePin}
                  onDelete={deleteItem}
                  onEdit={editItem}
                  onCopy={copyItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CopiedToast show={toast} />
    </div>
  );
}