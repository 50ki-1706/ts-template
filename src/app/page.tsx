export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-white sm:text-6xl">
          Welcome to{' '}
          <a href="https://nextjs.org" className="text-blue-600 hover:underline">
            Next.js!
          </a>
        </h1>
        <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300 sm:text-xl">
          Get started by editing{' '}
          <code className="rounded bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            src/app/page.tsx
          </code>
        </p>
      </main>
    </div>
  );
}
