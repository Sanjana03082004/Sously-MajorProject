"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default function EmergencyContactsSection() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchContacts() {
    const res = await fetch("/api/emergency");
    const data = await res.json();
    setContacts(data);
  }

  async function addContact() {
    if (!name || !phone) return;
    setLoading(true);
    await fetch("/api/emergency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, relation }),
    });
    setName("");
    setPhone("");
    setRelation("");
    setLoading(false);
    fetchContacts();
  }

  async function deleteContact(id: string) {
    await fetch(`/api/emergency/${id}`, { method: "DELETE" });
    fetchContacts();
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-red-600 text-lg">🆘 Emergency Contacts</span>
        </CardTitle>
        <CardDescription>
          Manage your trusted contacts for SOS or emergency alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            placeholder="Relation (optional)"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
          />
        </div>
        <Button
          onClick={addContact}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          {loading ? "Saving..." : "Add Contact"}
        </Button>

        {/* Contact List */}
        <div className="space-y-2">
          {contacts.length === 0 && (
            <p className="text-gray-500 text-sm">
              No emergency contacts saved yet.
            </p>
          )}
          {contacts.map((c: any, index: number) => (
  <div
    key={c._id || `contact-${index}`}  // ✅ fallback key if _id is missing
    className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"
  >
    <div>
      <div className="font-semibold text-gray-800">{c.name}</div>
      <div className="text-sm text-gray-700">{c.phone}</div>
      {c.relation && (
        <div className="text-xs text-gray-500">{c.relation}</div>
      )}
    </div>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => deleteContact(c._id)}
    >
      <Trash2 className="w-4 h-4 text-red-500" />
    </Button>
  </div>
))}

        </div>
      </CardContent>
    </Card>
  );
}
