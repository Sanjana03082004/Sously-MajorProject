// // // // "use client";
// // // // import { useState } from "react";
// // // // import { useRouter } from "next/navigation";
// // // // import { signIn } from "next-auth/react";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // // // import Link from "next/link";

// // // // export default function LoginPage() {
// // // //   const r = useRouter();
// // // //   const [email, setEmail] = useState("");
// // // //   const [pw, setPw] = useState("");
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [err, setErr] = useState<string | null>(null);

// // // //   async function onLogin(e: React.FormEvent) {
// // // //     e.preventDefault();
// // // //     setErr(null); setLoading(true);
// // // //     const res = await signIn("credentials", { email, password: pw, redirect: false });
// // // //     setLoading(false);
// // // //     if (res?.error) { setErr(res.error); return; }
// // // //     r.push("/");
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen grid place-items-center bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
// // // //       <Card className="w-full max-w-sm">
// // // //         <CardHeader>
// // // //           <CardTitle>Welcome</CardTitle>
// // // //           <CardDescription>Log in to Soulsy</CardDescription>
// // // //         </CardHeader>
// // // //         <CardContent>
// // // //           <form onSubmit={onLogin} className="space-y-3">
// // // //             <input className="w-full rounded-md border px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
// // // //             <input className="w-full rounded-md border px-3 py-2" placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} required />
// // // //             {err && <p className="text-red-600 text-sm">{err}</p>}
// // // //             <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Log in"}</Button>
// // // //           </form>
// // // //           <p className="text-sm text-gray-600 mt-4">
// // // //             New here? <Link href="/signup" className="text-emerald-700 underline">Create an account</Link>
// // // //           </p>
// // // //         </CardContent>
// // // //       </Card>
// // // //     </div>
// // // //   );
// // // // }
// // // "use client";

// // // import { useState } from "react";
// // // import { useRouter } from "next/navigation";
// // // import { signIn } from "next-auth/react";
// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardDescription,
// // //   CardHeader,
// // //   CardTitle,
// // // } from "@/components/ui/card";
// // // import Link from "next/link";

// // // export default function LoginPage() {
// // //   const r = useRouter();
// // //   const [email, setEmail] = useState("");
// // //   const [pw, setPw] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const [err, setErr] = useState<string | null>(null);

// // //   async function onLogin(e: React.FormEvent) {
// // //     e.preventDefault();
// // //     setErr(null);
// // //     setLoading(true);
// // //     const res = await signIn("credentials", {
// // //       email,
// // //       password: pw,
// // //       redirect: false,
// // //     });
// // //     setLoading(false);
// // //     if (res?.error) {
// // //       setErr(res.error);
// // //       return;
// // //     }
// // //     r.push("/");
// // //   }

// // //   return (
// // //     <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-emerald-50 overflow-hidden">
// // //       {/* 💖 Heart background */}
// // //       <div className="absolute inset-0 flex items-center justify-center opacity-20">
// // //         <svg
// // //           xmlns="http://www.w3.org/2000/svg"
// // //           viewBox="0 0 512 512"
// // //           className="w-[600px] h-[600px] animate-pulse text-rose-500"
// // //           fill="currentColor"
// // //         >
// // //           <path d="M471.7 73.4C438.6 40.3 389.6 32 348 50.8c-20.7 11-36.9 27.4-70 65.9-11.1-10.5-27.8-35.9-60-60.9C122.4 12 73.4 40.3 40.3 73.4-13.4 127.1-13.4 216.9 40.3 270.6l192 192c12.5 12.5 32.8 12.5 45.3 0l192-192c53.7-53.7 53.7-143.5 0-197.2z" />
// // //         </svg>
// // //       </div>

// // //       {/* Login Card */}
// // //       <Card className="relative z-10 w-full max-w-sm backdrop-blur-md bg-white/70 shadow-xl border border-pink-100">
// // //         <CardHeader className="text-center">
// // //           <CardTitle className="text-2xl font-bold text-gray-800">
// // //             Welcome
// // //           </CardTitle>
// // //           <CardDescription className="text-gray-600">
// // //             Log in to <span className="text-rose-500 font-semibold">Soulsy</span>
// // //           </CardDescription>
// // //         </CardHeader>
// // //         <CardContent>
// // //           <form onSubmit={onLogin} className="space-y-3">
// // //             <input
// // //               className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-rose-300 focus:outline-none"
// // //               placeholder="Email"
// // //               type="email"
// // //               value={email}
// // //               onChange={(e) => setEmail(e.target.value)}
// // //               required
// // //             />
// // //             <input
// // //               className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-rose-300 focus:outline-none"
// // //               placeholder="Password"
// // //               type="password"
// // //               value={pw}
// // //               onChange={(e) => setPw(e.target.value)}
// // //               required
// // //             />
// // //             {err && <p className="text-red-600 text-sm">{err}</p>}
// // //             <Button
// // //               type="submit"
// // //               className="w-full bg-rose-500 hover:bg-rose-600 text-white transition"
// // //               disabled={loading}
// // //             >
// // //               {loading ? "Signing in..." : "Log in"}
// // //             </Button>
// // //           </form>
// // //           <p className="text-sm text-gray-600 mt-4 text-center">
// // //             New here?{" "}
// // //             <Link href="/signup" className="text-rose-600 font-semibold underline">
// // //               Create an account
// // //             </Link>
// // //           </p>
// // //         </CardContent>
// // //       </Card>
// // //     </div>
// // //   );
// // // }
// // "use client";

// // import { useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { signIn } from "next-auth/react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import Link from "next/link";
// // import Image from "next/image";

// // export default function LoginPage() {
// //   const r = useRouter();
// //   const [email, setEmail] = useState("");
// //   const [pw, setPw] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [err, setErr] = useState<string | null>(null);

// //   async function onLogin(e: React.FormEvent) {
// //     e.preventDefault();
// //     setErr(null);
// //     setLoading(true);
// //     const res = await signIn("credentials", {
// //       email,
// //       password: pw,
// //       redirect: false,
// //     });
// //     setLoading(false);
// //     if (res?.error) {
// //       setErr(res.error);
// //       return;
// //     }
// //     r.push("/");
// //   }

// //   return (
// //     <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-emerald-50 overflow-hidden">
      
// //       {/* 🌿 Transparent Logo Background */}
// //       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
// //         <Image
// //           src="/soulsylogo8.png"   // 👈 place your logo inside /public folder
// //           alt="Soulsy Logo Background"
// //           width={400}
// //           height={400}
// //           className="opacity-10 blur-[1px] object-contain select-none"
// //         />
// //       </div>

// //       {/* ✨ Login Card */}
// //       <Card className="relative z-10 w-full max-w-sm backdrop-blur-lg bg-white/80 shadow-xl border border-rose-100">
// //         <CardHeader className="text-center">
// //           <CardTitle className="text-2xl font-bold text-gray-800">
// //             Welcome 💫
// //           </CardTitle>
// //           <CardDescription className="text-gray-600">
// //             Log in to <span className="text-rose-500 font-semibold">Soulsy</span>
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={onLogin} className="space-y-3">
// //             <input
// //               className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-rose-300 focus:outline-none"
// //               placeholder="Email"
// //               type="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               required
// //             />
// //             <input
// //               className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-rose-300 focus:outline-none"
// //               placeholder="Password"
// //               type="password"
// //               value={pw}
// //               onChange={(e) => setPw(e.target.value)}
// //               required
// //             />
// //             {err && <p className="text-red-600 text-sm">{err}</p>}
// //             <Button
// //               type="submit"
// //               className="w-full bg-rose-500 hover:bg-rose-600 text-white transition"
// //               disabled={loading}
// //             >
// //               {loading ? "Signing in..." : "Log in"}
// //             </Button>
// //           </form>
// //           <p className="text-sm text-gray-600 mt-4 text-center">
// //             New here?{" "}
// //             <Link href="/signup" className="text-rose-600 font-semibold underline">
// //               Create an account
// //             </Link>
// //           </p>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import Link from "next/link";
// import Image from "next/image";

// export default function LoginPage() {
//   const r = useRouter();
//   const [email, setEmail] = useState("");
//   const [pw, setPw] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   async function onLogin(e: React.FormEvent) {
//     e.preventDefault();
//     setErr(null);
//     setLoading(true);
//     const res = await signIn("credentials", {
//       email,
//       password: pw,
//       redirect: false,
//     });
//     setLoading(false);
//     if (res?.error) {
//       setErr(res.error);
//       return;
//     }
//     r.push("/");
//   }

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-emerald-50 overflow-hidden">
//       {/* 🌿 Soft Glow Behind Logo */}
//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//         <div className="absolute w-[420px] h-[420px] rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-emerald-950 blur-3xl opacity-35 animate-pulse"></div>
        
//       </div>

//       {/* 🪞 Transparent Login Card */}
//       <Card className="relative z-20 w-full max-w-sm bg-transparent shadow-none border-none flex flex-col items-center">
//         <CardHeader className="text-center mb-4">
//           <CardTitle className="text-3xl font-bold text-gray-800 drop-shadow-sm">
//             Welcome
//           </CardTitle>
//           <CardDescription className="text-gray-700 text-lg">
//             Log in to <span className="text-rose-500 font-semibold">Soulsy</span>
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="w-full space-y-4">
//           <form onSubmit={onLogin} className="space-y-3">
//             <input
//               className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-white/50 backdrop-blur-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-rose-300 focus:outline-none transition"
//               placeholder="Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <input
//               className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-white/50 backdrop-blur-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-rose-300 focus:outline-none transition"
//               placeholder="Password"
//               type="password"
//               value={pw}
//               onChange={(e) => setPw(e.target.value)}
//               required
//             />
//             {err && <p className="text-red-600 text-sm">{err}</p>}
//             <Button
//               type="submit"
//               className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl py-2 transition-all shadow-lg hover:shadow-rose-200"
//               disabled={loading}
//             >
//               {loading ? "Signing in..." : "Log in"}
//             </Button>
//           </form>
//           <p className="text-sm text-gray-700 mt-2 text-center">
//             New here?{" "}
//             <Link
//               href="/signup"
//               className="text-rose-600 font-semibold underline hover:text-rose-700"
//             >
//               Create an account
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password: pw,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setErr(res.error);
      return;
    }
    r.push("/");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-green-50 overflow-hidden">
      {/* ✨ Gradient Glow Behind Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[460px] h-[460px] rounded-full bg-gradient-to-r from-rose-500 via-pink-400 to-emerald-600 blur-[120px] opacity-50 animate-pulse"></div>
        
      </div>

      {/* 🪞 Transparent Login Card */}
      <Card className="relative z-20 w-full max-w-sm bg-transparent shadow-none border-none flex flex-col items-center">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-bold text-gray-800 drop-shadow-sm">
            Welcome
          </CardTitle>
          <CardDescription className="text-gray-700 text-lg">
            Log in to <span className="text-rose-500 font-semibold">Soulsy</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full space-y-4">
          <form onSubmit={onLogin} className="space-y-3">
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-white/50 backdrop-blur-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-rose-300 focus:outline-none transition"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-2 bg-white/50 backdrop-blur-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-rose-300 focus:outline-none transition"
              placeholder="Password"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
            {err && <p className="text-red-600 text-sm">{err}</p>}
            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl py-2 transition-all shadow-lg hover:shadow-rose-200"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Log in"}
            </Button>
          </form>
          <p className="text-sm text-gray-700 mt-2 text-center">
            New here?{" "}
            <Link
              href="/signup"
              className="text-rose-600 font-semibold underline hover:text-rose-700"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
