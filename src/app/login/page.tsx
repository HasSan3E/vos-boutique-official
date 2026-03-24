"use client";
import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      // Direct push to admin after successful click
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <form
        onSubmit={handleLogin}
        className="p-10 border border-stone-200 shadow-xl max-w-sm w-full"
      >
        <h1 className="text-2xl font-serif mb-6 text-center">
          VOS ADMIN ACCESS
        </h1>
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 border mb-4 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 border mb-6 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-3 font-bold uppercase tracking-widest"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
