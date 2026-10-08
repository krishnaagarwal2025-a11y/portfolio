import { put, list } from "@vercel/blob";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
  userAgent?: string;
  ip?: string;
}

const BLOB_PATH = "inbox/messages.json";

// In-memory fallback if blob storage is ever unreachable
let memoryFallback: ContactMessage[] = [];

export async function getAllMessages(): Promise<ContactMessage[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (!blobs || blobs.length === 0) {
      return memoryFallback;
    }

    const targetBlob = blobs.find((b) => b.pathname === BLOB_PATH) || blobs[0];
    const res = await fetch(`${targetBlob.url}?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) return memoryFallback;

    const data = await res.json();
    if (Array.isArray(data)) {
      memoryFallback = data;
      return data;
    }
    return memoryFallback;
  } catch (err) {
    console.error("Error reading messages from blob:", err);
    return memoryFallback;
  }
}

export async function addMessage(entry: {
  name: string;
  email: string;
  message: string;
  userAgent?: string;
}): Promise<ContactMessage> {
  const current = await getAllMessages();

  const newMessage: ContactMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: entry.name.trim(),
    email: entry.email.trim(),
    message: entry.message.trim(),
    createdAt: new Date().toISOString(),
    read: false,
    userAgent: entry.userAgent || "Web Browser",
  };

  const updated = [newMessage, ...current];

  try {
    await put(BLOB_PATH, JSON.stringify(updated, null, 2), {
      access: "public",
      addRandomSuffix: false,
    });
    memoryFallback = updated;
  } catch (err) {
    console.error("Error saving message to blob:", err);
    memoryFallback = updated;
  }

  return newMessage;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const current = await getAllMessages();
  const filtered = current.filter((m) => m.id !== id);

  try {
    await put(BLOB_PATH, JSON.stringify(filtered, null, 2), {
      access: "public",
      addRandomSuffix: false,
    });
    memoryFallback = filtered;
    return true;
  } catch (err) {
    console.error("Error deleting message from blob:", err);
    return false;
  }
}

export async function markMessageRead(id: string, readState = true): Promise<boolean> {
  const current = await getAllMessages();
  const updated = current.map((m) => (m.id === id ? { ...m, read: readState } : m));

  try {
    await put(BLOB_PATH, JSON.stringify(updated, null, 2), {
      access: "public",
      addRandomSuffix: false,
    });
    memoryFallback = updated;
    return true;
  } catch (err) {
    console.error("Error updating message status in blob:", err);
    return false;
  }
}

export async function clearAllMessages(): Promise<boolean> {
  try {
    await put(BLOB_PATH, JSON.stringify([], null, 2), {
      access: "public",
      addRandomSuffix: false,
    });
    memoryFallback = [];
    return true;
  } catch (err) {
    console.error("Error clearing messages:", err);
    return false;
  }
}
