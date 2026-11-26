import { signIn } from "../actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <section className="max-w-sm">
      <h1 className="font-display text-3xl">Sign in</h1>
      <form action={signIn} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input name="email" type="email" required autoComplete="username" className="border border-gold/50 bg-paper px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input name="password" type="password" required autoComplete="current-password" className="border border-gold/50 bg-paper px-3 py-2" />
        </label>
        {error ? <p role="alert" className="text-sm text-clay">That email and password did not work.</p> : null}
        <button type="submit" className="bg-teal px-5 py-2.5 text-paper hover:bg-charcoal">Sign in</button>
      </form>
    </section>
  );
}
