"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    const res = await signIn("credentials", { email, password: pw, redirect: false });
    setLoading(false);
    if (res?.error) { setErr(res.error); return; }
    r.push("/");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Log in to MindMate</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin} className="space-y-3">
            <input className="w-full rounded-md border px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input className="w-full rounded-md border px-3 py-2" placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} required />
            {err && <p className="text-red-600 text-sm">{err}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Log in"}</Button>
          </form>
          <p className="text-sm text-gray-600 mt-4">
            New here? <Link href="/signup" className="text-emerald-700 underline">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
