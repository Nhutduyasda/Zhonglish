import { AuthForm } from "@/components/auth/auth-form";
import { redirectAuthenticated } from "@/lib/supabase/profile";
export default async function Page() { await redirectAuthenticated(); return <AuthForm mode="sign-up" />; }
