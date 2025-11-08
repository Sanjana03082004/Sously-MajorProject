// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// type Contact = { name: string; phone: string; relation?: string };

// export default function SignupPage() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [age, setAge] = useState<number | "">("");
//   const [gender, setGender] = useState<"female" | "male" | "nonbinary" | "prefer_not_to_say" | "">("");
//   const [contacts, setContacts] = useState<Contact[]>([{ name: "", phone: "", relation: "" }]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   const addContact = () => {
//     if (contacts.length >= 3) return;
//     setContacts((c) => [...c, { name: "", phone: "", relation: "" }]);
//   };

//   const removeContact = (idx: number) => {
//     setContacts((c) => c.filter((_, i) => i !== idx));
//   };

//   const updateContact = (idx: number, field: keyof Contact, value: string) => {
//     setContacts((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], [field]: value };
//       return next;
//     });
//   };

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErr(null);

//     if (!name || !email || !password || !age || !gender) {
//       setErr("Please fill all required fields.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch("/api/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//           age,
//           gender,
//           contacts: contacts.filter((c) => c.name && c.phone).slice(0, 3),
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setErr(data?.error || "Failed to create account");
//         setLoading(false);
//         return;
//       }

//       // success → go to login
//       router.push("/login");
//     } catch (e: any) {
//       setErr("Something went wrong. Try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen grid place-items-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
//       <Card className="w-full max-w-lg">
//         <CardHeader>
//           <CardTitle>Create your account</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {err && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertDescription>{err}</AlertDescription>
//             </Alert>
//           )}

//           <form onSubmit={submit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="name">Name</Label>
//                 <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
//               </div>

//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//               </div>

//               <div>
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   minLength={6}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="age">Age</Label>
//                 <Input
//                   id="age"
//                   type="number"
//                   min={10}
//                   max={120}
//                   value={age}
//                   onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
//                   required
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <Label>Gender</Label>
//                 <Select value={gender} onValueChange={(v) => setGender(v as any)}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select gender" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="female">Female</SelectItem>
//                     <SelectItem value="male">Male</SelectItem>
//                     <SelectItem value="nonbinary">Non-binary</SelectItem>
//                     <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between">
//                 <Label>Emergency Contacts (up to 3)</Label>
//                 <Button type="button" variant="secondary" size="sm" onClick={addContact} disabled={contacts.length >= 3}>
//                   + Add contact
//                 </Button>
//               </div>

//               <div className="mt-3 space-y-3">
//                 {contacts.map((c, idx) => (
//                   <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
//                     <div>
//                       <Label>Name</Label>
//                       <Input value={c.name} onChange={(e) => updateContact(idx, "name", e.target.value)} placeholder="e.g., Mom" />
//                     </div>
//                     <div>
//                       <Label>Phone</Label>
//                       <Input value={c.phone} onChange={(e) => updateContact(idx, "phone", e.target.value)} placeholder="+91..." />
//                     </div>
//                     <div className="flex gap-2">
//                       <div className="flex-1">
//                         <Label>Relation (optional)</Label>
//                         <Input
//                           value={c.relation || ""}
//                           onChange={(e) => updateContact(idx, "relation", e.target.value)}
//                           placeholder="Parent / Friend"
//                         />
//                       </div>
//                       {contacts.length > 1 && (
//                         <Button type="button" variant="ghost" onClick={() => removeContact(idx)}>
//                           Remove
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? "Creating account..." : "Sign up"}
//             </Button>

//             <p className="text-sm text-gray-600 text-center">
//               Already have an account? <a href="/login" className="text-emerald-700 underline">Log in</a>
//             </p>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";

type Contact = { name: string; phone: string; relation?: string };

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<
    "female" | "male" | "nonbinary" | "prefer_not_to_say" | ""
  >("");
  const [contacts, setContacts] = useState<Contact[]>([
    { name: "", phone: "", relation: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const addContact = () => {
    if (contacts.length >= 3) return;
    setContacts((c) => [...c, { name: "", phone: "", relation: "" }]);
  };

  const removeContact = (idx: number) => {
    setContacts((c) => c.filter((_, i) => i !== idx));
  };

  const updateContact = (idx: number, field: keyof Contact, value: string) => {
    setContacts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!name || !email || !password || !age || !gender) {
      setErr("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          age,
          gender,
          contacts: contacts.filter((c) => c.name && c.phone).slice(0, 3),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data?.error || "Failed to create account");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (e: any) {
      setErr("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-green-50 overflow-hidden p-4">
      {/* ✨ Background Glow + Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-rose-300 via-pink-400 to-emerald-400 blur-[120px] opacity-50 animate-pulse"></div>
      </div>

      {/* 🪞 Transparent Card */}
      <Card className="relative z-20 w-full max-w-lg bg-white/30 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 drop-shadow-sm">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {err && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={10}
                  max={120}
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label>Gender</Label>
                <Select
                  value={gender}
                  onValueChange={(v) => setGender(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="nonbinary">Non-binary</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Emergency Contacts Section */}
            <div>
              <div className="flex items-center justify-between">
                <Label>Emergency Contacts (up to 3)</Label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addContact}
                  disabled={contacts.length >= 3}
                >
                  + Add contact
                </Button>
              </div>

              <div className="mt-3 space-y-3">
                {contacts.map((c, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
                  >
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={c.name}
                        onChange={(e) =>
                          updateContact(idx, "name", e.target.value)
                        }
                        placeholder="e.g., Mom"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={c.phone}
                        onChange={(e) =>
                          updateContact(idx, "phone", e.target.value)
                        }
                        placeholder="+91..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label>Relation (optional)</Label>
                        <Input
                          value={c.relation || ""}
                          onChange={(e) =>
                            updateContact(idx, "relation", e.target.value)
                          }
                          placeholder="Parent / Friend"
                        />
                      </div>
                      {contacts.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeContact(idx)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl py-2 shadow-lg hover:shadow-rose-200"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </Button>

            <p className="text-sm text-gray-700 text-center mt-2">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-rose-600 underline font-medium hover:text-rose-700"
              >
                Log in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
