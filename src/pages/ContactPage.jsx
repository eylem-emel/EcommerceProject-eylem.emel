import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold">Contact</h1>
        <p className="text-sm text-zinc-600">
          Send us a message and we’ll get back to you.
        </p>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* Left info card */}
        <div className="w-full lg:w-[40%] flex">
          <div className="w-full rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Ecommerce Support</div>
              <div className="text-sm text-zinc-600">
                Available Mon–Fri, 09:00–18:00
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-600">Email</span>
                  <span className="text-sm">support@ecommerce.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-600">Phone</span>
                  <span className="text-sm">+90 (555) 000 00 00</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-600">Address</span>
                  <span className="text-sm">Istanbul, Türkiye</span>
                </div>
              </div>
            </div>

            <div className="w-full rounded-2xl bg-zinc-100 min-h-[160px] flex items-center justify-center text-sm text-zinc-500">
              Map placeholder
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="w-full lg:w-[60%] flex">
          <form className="w-full rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4">
            <div className="w-full flex flex-col sm:flex-row gap-4">
              <div className="w-full flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Full name</label>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
                  placeholder="Your name"
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <label className="text-sm text-zinc-600">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="text-sm text-zinc-600">Subject</label>
              <input
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none"
                placeholder="How can we help?"
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="text-sm text-zinc-600">Message</label>
              <textarea
                rows={6}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none resize-none"
                placeholder="Write your message..."
              />
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-xs text-zinc-500">
                We usually reply within 1–2 business days.
              </div>
              <button
                type="button"
                className="px-5 py-3 rounded-xl bg-zinc-900 text-white text-sm"
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
