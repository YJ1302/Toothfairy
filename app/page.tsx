import Link from "next/link";
import { CalendarCheck, Check, ChevronRight, Clock, MapPin, Moon, Phone, Sun, Sunrise } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/Hero";
import { LogoMark } from "@/components/Logo";
import { CLINIC, FAQ, FIRST_VISIT, SERVICES } from "@/lib/data";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        {/* Treatments */}
        <section id="services" className="scroll-mt-20 bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="text-[2.2rem] sm:text-5xl">Everything a growing smile needs</h2>
              <p className="mt-4 text-lg text-ink-2">
                From the first check-up to the last milk tooth, treatment is planned around your child&apos;s age, comfort and
                growth.
              </p>
            </div>
            <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
              {SERVICES.map((g) => (
                <div key={g.title}>
                  <h3 className="text-2xl text-lav-700">{g.title}</h3>
                  <p className="mt-2 text-[0.97rem] text-ink-2">{g.blurb}</p>
                  <ul className="mt-6 divide-y divide-line border-y border-line">
                    {g.items.map((s) => (
                      <li key={s.name} className="py-4">
                        <p className="font-semibold">{s.name}</p>
                        <p className="mt-1 text-[0.95rem] text-ink-2">{s.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* First visit */}
        <section id="first-visit" className="scroll-mt-20 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div>
              <h2 className="text-[2.2rem] sm:text-5xl">How a first visit goes</h2>
              <p className="mt-4 text-lg text-ink-2">
                A first visit sets the tone for years. We keep it short, unhurried and on your child&apos;s terms.
              </p>
              <Link href="/book" className="btn btn-primary mt-8">
                <CalendarCheck size={18} /> Book a first visit
              </Link>
            </div>
            <ol className="relative grid gap-8">
              <span className="absolute bottom-6 left-[1.35rem] top-6 w-0.5 bg-lav-200" aria-hidden="true" />
              {FIRST_VISIT.map((s, i) => (
                <li key={s.title} className="relative flex gap-5">
                  <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lav-600 font-display text-lg text-white">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <p className="text-lg font-semibold">{s.title}</p>
                    <p className="mt-1 text-ink-2">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Doctor */}
        <section id="doctor" className="scroll-mt-20 bg-lav-50 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-b from-lav-200 to-lav-300">
                <div className="flex h-full flex-col items-center justify-center gap-4 text-lav-700">
                  <span className="grid h-28 w-28 place-items-center rounded-full bg-white/70 font-display text-5xl">AK</span>
                  <span className="text-sm font-medium">Doctor&apos;s photo goes here</span>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-3 rounded-2xl bg-white p-3 shadow-[0_0_0_1px_var(--color-line)]">
                <LogoMark size={44} />
              </div>
            </div>
            <div>
              <h2 className="text-[2.2rem] sm:text-5xl">{CLINIC.doctor}</h2>
              <p className="mt-3 font-medium text-lav-700">{CLINIC.credentials}</p>
              <div className="mt-6 space-y-4 text-lg text-ink-2">
                <p>
                  Dr. Anusha is training as a specialist in children&apos;s dentistry, the branch of dentistry focused on
                  infants, children and teenagers, including children who need extra care and patience.
                </p>
                <p>
                  Her approach is simple: prevent what can be prevented, explain everything in words a child understands, and
                  never rush a nervous patient.
                </p>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2">
                {["Infant oral health", "Preventive care", "Anxious children", "Special healthcare needs"].map((t) => (
                  <li key={t} className="rounded-full bg-white px-4 py-2 text-[0.92rem] font-medium text-ink-2 shadow-[0_0_0_1px_var(--color-line)]">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Parent app */}
        <section id="parent-app" className="scroll-mt-20 overflow-hidden bg-ink py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 md:grid-cols-2">
            <div>
              <h2 className="text-[2.2rem] text-white sm:text-5xl">Your child&apos;s medicines, day by day</h2>
              <p className="mt-5 text-lg text-white/75">
                After a treatment, Dr. Anusha adds any medicines to your child&apos;s account. Sign in with Google to see exactly
                what to give and when, tick off each dose, and know the course is on track.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Today's doses for each of your children, in one place",
                  "A weekly view so nothing is forgotten on busy days",
                  "Your dentist sees if a dose was missed and can check in",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-white/85">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lav-500/40 text-lav-200">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="btn mt-9 bg-white text-ink hover:bg-lav-100">
                Try the parent app <ChevronRight size={18} />
              </Link>
            </div>

            <div className="relative mx-auto w-full max-w-[320px]">
              <div className="absolute -inset-10 rounded-full bg-lav-500/25 blur-3xl" aria-hidden="true" />
              <div className="relative rounded-[2.6rem] bg-[#1d1630] p-3 shadow-2xl ring-1 ring-white/10">
                <div className="overflow-hidden rounded-[2rem] bg-page text-ink">
                  <div className="flex items-center justify-between px-5 pb-3 pt-5">
                    <div>
                      <p className="text-xs text-ink-3">Today</p>
                      <p className="font-display text-xl">Aarav&apos;s medicines</p>
                    </div>
                    <LogoMark size={30} />
                  </div>
                  <div className="space-y-2.5 px-4 pb-6">
                    {[
                      { icon: Sunrise, time: "8:00 am", name: "Amoxicillin", dose: "5 ml after food", done: true },
                      { icon: Sun, time: "2:00 pm", name: "Amoxicillin", dose: "5 ml after food", done: true },
                      { icon: Moon, time: "8:30 pm", name: "Amoxicillin", dose: "5 ml after food", done: false },
                      { icon: Moon, time: "8:30 pm", name: "Paracetamol", dose: "5 ml if in pain", done: false },
                    ].map((d, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_0_0_1px_var(--color-line)]">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-lav-100 text-lav-600">
                          <d.icon size={17} />
                        </span>
                        <div className="min-w-0 flex-1 leading-tight">
                          <p className="text-sm font-semibold">{d.name}</p>
                          <p className="text-xs text-ink-3">
                            {d.time}, {d.dose}
                          </p>
                        </div>
                        {d.done ? (
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-mint text-white">
                            <Check size={15} strokeWidth={3} />
                          </span>
                        ) : (
                          <span className="h-7 w-7 rounded-full border-2 border-lav-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-[2.2rem] sm:text-5xl">Questions parents ask</h2>
            <div className="mt-10 divide-y divide-line border-y border-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lav-100 text-lav-600 transition-transform group-open:rotate-45">
                      <span className="text-xl leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[60ch] text-ink-2">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20 pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid overflow-hidden rounded-[2rem] bg-lav-600 text-white md:grid-cols-[1.2fr_1fr]">
              <div className="p-8 sm:p-12">
                <h2 className="text-[2.2rem] text-white sm:text-5xl">Come and say hello</h2>
                <p className="mt-4 max-w-md text-lg text-white/80">
                  Book online in a minute, or call us and we&apos;ll find a time that works around school.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/book" className="btn bg-white text-lav-700 hover:bg-lav-100">
                    <CalendarCheck size={18} /> Book a visit
                  </Link>
                  <a href={CLINIC.phoneHref} className="btn bg-white/15 text-white hover:bg-white/25">
                    <Phone size={18} /> Call the clinic
                  </a>
                </div>
              </div>
              <div className="space-y-6 bg-lav-700/60 p-8 sm:p-12">
                <div className="flex gap-4">
                  <MapPin className="mt-1 shrink-0 text-lav-200" size={20} />
                  <div>
                    {CLINIC.addressLines.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                    <a href={CLINIC.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block font-semibold underline underline-offset-4">
                      Open in Google Maps
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="mt-1 shrink-0 text-lav-200" size={20} />
                  <div className="space-y-2">
                    {CLINIC.hours.map((h) => (
                      <p key={h.days}>
                        <span className="block font-semibold">{h.days}</span>
                        <span className="text-white/80">{h.time}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
