export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 flex items-center justify-between gap-4">
        <span className="text-sm text-zinc-600">© {new Date().getFullYear()} Ecommerce</span>
        <div className="flex gap-3">
          <a className="text-sm text-zinc-600 hover:text-zinc-900" href="#">
            Privacy
          </a>
          <a className="text-sm text-zinc-600 hover:text-zinc-900" href="#">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
