import { signIn } from "../actions";

const kicker = "text-[11px] font-medium uppercase tracking-[0.3em] text-gold";
const input = "w-full border border-[rgba(28,24,19,0.2)] bg-white px-3.5 py-3 text-[15px] text-charcoal";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <section className="flex flex-col gap-8 bg-white p-10">
      <div className="flex flex-col gap-3">
        <span className={kicker}>Back office</span>
        <h1 className="font-display text-[40px] font-normal leading-tight">Sign in</h1>
      </div>
      <form action={signIn} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-[13px] font-medium">
          Email
          <input name="email" type="email" required autoComplete="username" className={input} />
        </label>
        <label className="flex flex-col gap-2 text-[13px] font-medium">
          Password
          <input name="password" type="password" required autoComplete="current-password" className={input} />
        </label>
        {error ? (
          <p role="alert" className="text-sm text-[#7A5219]">
            That email and password did not work.
          </p>
        ) : null}
        <button type="submit" className="h-12 bg-gold text-[15px] font-medium text-ivory hover:bg-gold-deep">
          Sign in
        </button>
      </form>
    </section>
  );
}
