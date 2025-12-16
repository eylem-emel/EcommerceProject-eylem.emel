export default function PageContent({ children }) {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-6 flex">
      <div className="w-full flex flex-col">{children}</div>
    </main>
  );
}
