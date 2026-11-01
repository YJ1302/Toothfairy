// Clinic content and demo data for the sample site.
// Everything marked PLACEHOLDER must be replaced with the clinic's real details.

export const CLINIC = {
  name: "Tooth Fairy Pediatric Dentistry",
  doctor: "Dr. Anusha Killedar",
  doctorShort: "Dr. Anusha",
  credentials: "BDS, MDS in Pediatric and Preventive Dentistry (pursuing)", // confirm wording with the doctor
  addressLines: ["Shop 4, Baner Road", "Baner, Pune", "Maharashtra 411045"], // PLACEHOLDER
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Baner%2C+Pune",
  phoneDisplay: "+91 98XXX XXXXX", // PLACEHOLDER
  phoneHref: "tel:+910000000000", // PLACEHOLDER
  email: "hello@toothfairydental.in", // PLACEHOLDER
  hours: [
    { days: "Monday to Saturday", time: "10:00 am to 1:30 pm, 4:30 pm to 8:30 pm" },
    { days: "Sunday", time: "Closed, emergencies by phone" },
  ],
};

export type ServiceGroup = { title: string; blurb: string; items: { name: string; text: string }[] };

export const SERVICES: ServiceGroup[] = [
  {
    title: "Keep teeth healthy",
    blurb: "Most visits are about stopping problems before they start.",
    items: [
      { name: "Check-ups and cleaning", text: "A gentle look at every tooth, polishing, and a chat about brushing." },
      { name: "Fluoride varnish", text: "A quick paint-on coat that makes enamel harder for cavities to break through." },
      { name: "Pit and fissure sealants", text: "A thin seal over the deep grooves of back teeth, where food likes to hide." },
      { name: "Diet and brushing guidance", text: "Practical advice on snacks, bottles, and the right toothpaste for each age." },
    ],
  },
  {
    title: "Treat problems early",
    blurb: "Milk teeth hold space for adult teeth, so we save them where we can.",
    items: [
      { name: "Tooth-coloured fillings", text: "White fillings that match your child's teeth." },
      { name: "Milk tooth root canal", text: "Pulpotomy and pulpectomy to save an infected baby tooth." },
      { name: "Crowns for children", text: "Strong caps for badly decayed back teeth." },
      { name: "Gentle extractions", text: "When a tooth can't be saved, removed calmly with numbing first." },
    ],
  },
  {
    title: "Guide growing smiles",
    blurb: "Spotting bite and habit issues early makes them easier to fix.",
    items: [
      { name: "Space maintainers", text: "Hold the gap open after a milk tooth is lost too early." },
      { name: "Habit-breaking appliances", text: "Help with thumb sucking and tongue thrusting." },
      { name: "Early orthodontic check", text: "A first look at jaw growth and crowding around age seven." },
      { name: "Dental emergencies", text: "Knocked-out or chipped teeth and sudden toothaches, seen the same day." },
    ],
  },
];

export const FIRST_VISIT = [
  { title: "Book a time that suits your child", text: "Pick a slot online, away from nap time or right after school." },
  { title: "Meet the chair before anything else", text: "Your child rides the chair up and down and counts teeth with the mirror." },
  { title: "A gentle check-up", text: "We explain each step in kid language. You stay right beside them." },
  { title: "Follow along at home", text: "Any medicines and care tips appear in your parent app, day by day." },
];

export const FAQ = [
  {
    q: "When should my child first see a dentist?",
    a: "By their first birthday, or within six months of the first tooth coming in. Early visits are short and mostly about getting comfortable.",
  },
  {
    q: "Are milk teeth really worth treating?",
    a: "Yes. They help children chew and speak, and they hold space for adult teeth. An infected milk tooth can also hurt the adult tooth growing beneath it.",
  },
  {
    q: "My child is scared of dentists. What do you do differently?",
    a: "We go at your child's pace, show and tell before every step, and keep first visits playful. For very anxious children we can discuss calm sedation options.",
  },
  {
    q: "Can I stay with my child during treatment?",
    a: "Of course. Parents are welcome in the room for every visit.",
  },
  {
    q: "How does the parent app work?",
    a: "Sign in with your Google account. You'll see each child's medicines for the day, tick off doses as you give them, and see upcoming appointments.",
  },
];

/* ---------------- demo patients and medicines ---------------- */

export type Slot = "morning" | "afternoon" | "night";
export const SLOT_TIME: Record<Slot, { label: string; hm: [number, number] }> = {
  morning: { label: "8:00 am", hm: [8, 0] },
  afternoon: { label: "2:00 pm", hm: [14, 0] },
  night: { label: "8:30 pm", hm: [20, 30] },
};
export const SLOTS: Slot[] = ["morning", "afternoon", "night"];

export type Medicine = {
  id: string;
  name: string;
  detail: string;
  dose: string;
  slots: Slot[];
  withFood: string;
  /** days relative to today; negative means the course began earlier */
  startOffset: number;
  days: number;
  kind: "syrup" | "rinse" | "gel" | "paste";
};

export type Child = {
  id: string;
  name: string;
  age: number;
  parent: string;
  parentPhone: string;
  treatment: string;
  lastVisitOffset: number;
  nextVisit?: { offset: number; time: string; reason: string };
  medicines: Medicine[];
  /** chance a past dose was given, for generated history */
  reliability: number;
  /** belongs to the demo parent account */
  demoFamily?: boolean;
};

export const PATIENTS: Child[] = [
  {
    id: "aarav",
    name: "Aarav Deshpande",
    age: 7,
    parent: "Priya Deshpande",
    parentPhone: "+91 98XXX X1204",
    treatment: "Milk tooth root canal, lower left molar",
    lastVisitOffset: -2,
    nextVisit: { offset: 5, time: "5:00 pm", reason: "Review and crown fitting" },
    reliability: 0.95,
    demoFamily: true,
    medicines: [
      {
        id: "amox",
        name: "Amoxicillin",
        detail: "Oral suspension, 250 mg in 5 ml",
        dose: "5 ml",
        slots: ["morning", "afternoon", "night"],
        withFood: "After food",
        startOffset: -2,
        days: 5,
        kind: "syrup",
      },
      {
        id: "pcm",
        name: "Paracetamol",
        detail: "Syrup, 250 mg in 5 ml",
        dose: "5 ml",
        slots: ["morning", "night"],
        withFood: "After food, only if in pain",
        startOffset: -2,
        days: 3,
        kind: "syrup",
      },
    ],
  },
  {
    id: "myra",
    name: "Myra Deshpande",
    age: 4,
    parent: "Priya Deshpande",
    parentPhone: "+91 98XXX X1204",
    treatment: "Fluoride varnish and sealants",
    lastVisitOffset: -9,
    nextVisit: { offset: 81, time: "11:00 am", reason: "Three-month check-up" },
    reliability: 0.86,
    demoFamily: true,
    medicines: [
      {
        id: "fpaste",
        name: "Fluoride toothpaste",
        detail: "1000 ppm children's paste",
        dose: "Pea-sized amount",
        slots: ["morning", "night"],
        withFood: "Brush for two minutes, spit, don't rinse",
        startOffset: -9,
        days: 30,
        kind: "paste",
      },
    ],
  },
  {
    id: "kabir",
    name: "Kabir Shah",
    age: 9,
    parent: "Neha Shah",
    parentPhone: "+91 98XXX X3381",
    treatment: "Extraction of broken milk tooth",
    lastVisitOffset: -4,
    nextVisit: { offset: 0, time: "6:30 pm", reason: "Healing check" },
    reliability: 0.42,
    medicines: [
      {
        id: "chx",
        name: "Chlorhexidine 0.12%",
        detail: "Mouth rinse",
        dose: "10 ml, swish for 30 seconds",
        slots: ["morning", "night"],
        withFood: "30 minutes after brushing",
        startOffset: -4,
        days: 7,
        kind: "rinse",
      },
      {
        id: "pcm",
        name: "Paracetamol",
        detail: "Syrup, 250 mg in 5 ml",
        dose: "7.5 ml",
        slots: ["morning", "night"],
        withFood: "After food, only if in pain",
        startOffset: -4,
        days: 5,
        kind: "syrup",
      },
    ],
  },
  {
    id: "ira",
    name: "Ira Menon",
    age: 3,
    parent: "Arjun Menon",
    parentPhone: "+91 98XXX X7720",
    treatment: "Pulpectomy, upper front tooth",
    lastVisitOffset: -3,
    nextVisit: { offset: 4, time: "11:30 am", reason: "Review" },
    reliability: 0.72,
    medicines: [
      {
        id: "amox",
        name: "Amoxicillin",
        detail: "Oral suspension, 125 mg in 5 ml",
        dose: "5 ml",
        slots: ["morning", "afternoon", "night"],
        withFood: "After food",
        startOffset: -3,
        days: 5,
        kind: "syrup",
      },
    ],
  },
  {
    id: "reyansh",
    name: "Reyansh Gaikwad",
    age: 8,
    parent: "Sneha Gaikwad",
    parentPhone: "+91 98XXX X4415",
    treatment: "Chipped front tooth after a fall",
    lastVisitOffset: -1,
    nextVisit: { offset: 0, time: "5:15 pm", reason: "Bonding repair" },
    reliability: 0.66,
    medicines: [
      {
        id: "ibu",
        name: "Ibuprofen",
        detail: "Suspension, 100 mg in 5 ml",
        dose: "7.5 ml",
        slots: ["morning", "afternoon", "night"],
        withFood: "After food",
        startOffset: -1,
        days: 3,
        kind: "syrup",
      },
    ],
  },
  {
    id: "vihaan",
    name: "Vihaan Bhosale",
    age: 11,
    parent: "Rahul Bhosale",
    parentPhone: "+91 98XXX X9052",
    treatment: "Space maintainer fitted",
    lastVisitOffset: -6,
    nextVisit: { offset: 24, time: "6:00 pm", reason: "Appliance check" },
    reliability: 0.92,
    medicines: [
      {
        id: "chxgel",
        name: "Chlorhexidine gel",
        detail: "Oral gel, 1%",
        dose: "Thin layer around the band",
        slots: ["morning", "night"],
        withFood: "After brushing",
        startOffset: -6,
        days: 10,
        kind: "gel",
      },
    ],
  },
  {
    id: "diya",
    name: "Diya Sharma",
    age: 10,
    parent: "Kavita Sharma",
    parentPhone: "+91 98XXX X6618",
    treatment: "Pit and fissure sealants",
    lastVisitOffset: -12,
    nextVisit: { offset: 0, time: "11:00 am", reason: "Sealant check" },
    reliability: 0.81,
    medicines: [
      {
        id: "fwash",
        name: "Fluoride mouthwash",
        detail: "0.05% sodium fluoride",
        dose: "10 ml, swish for one minute",
        slots: ["night"],
        withFood: "Before bed, nothing to eat after",
        startOffset: -12,
        days: 30,
        kind: "rinse",
      },
    ],
  },
  {
    id: "anaya",
    name: "Anaya Patil",
    age: 6,
    parent: "Meera Patil",
    parentPhone: "+91 98XXX X2047",
    treatment: "Two tooth-coloured fillings",
    lastVisitOffset: -20,
    nextVisit: { offset: 0, time: "12:30 pm", reason: "Routine check-up" },
    reliability: 1,
    medicines: [],
  },
  {
    id: "saanvi",
    name: "Saanvi Iyer",
    age: 5,
    parent: "Lakshmi Iyer",
    parentPhone: "+91 98XXX X8831",
    treatment: "Routine check-up and cleaning",
    lastVisitOffset: -35,
    nextVisit: { offset: 2, time: "10:30 am", reason: "Cleaning" },
    reliability: 1,
    medicines: [],
  },
  {
    id: "arjun",
    name: "Arjun Pawar",
    age: 12,
    parent: "Sunil Pawar",
    parentPhone: "+91 98XXX X5573",
    treatment: "Habit-breaking appliance",
    lastVisitOffset: -14,
    nextVisit: { offset: 0, time: "7:30 pm", reason: "Appliance adjustment" },
    reliability: 1,
    medicines: [],
  },
];

/* ---------------- dates ---------------- */

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
export function iso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
export const fmtDay = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
export const fmtLong = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

/* ---------------- dose status ---------------- */

export type DoseStatus = "given" | "missed" | "due" | "upcoming";
export type Overrides = Record<string, string>; // key -> ISO time it was marked given

export const doseKey = (childId: string, medId: string, day: string, slot: Slot) => `${childId}|${medId}|${day}|${slot}`;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export function medActiveOn(med: Medicine, day: Date, today: Date) {
  const offset = Math.round((startOfDay(day).getTime() - startOfDay(today).getTime()) / 86400000);
  return offset >= med.startOffset && offset < med.startOffset + med.days;
}

export function slotPassed(slot: Slot, now: Date) {
  const [h, m] = SLOT_TIME[slot].hm;
  return now.getHours() * 60 + now.getMinutes() >= h * 60 + m + 60;
}

export function doseStatus(child: Child, med: Medicine, day: Date, slot: Slot, now: Date, overrides: Overrides): DoseStatus {
  const key = doseKey(child.id, med.id, iso(day), slot);
  if (overrides[key]) return "given";
  const today = startOfDay(now);
  const d = startOfDay(day);
  if (d > today) return "upcoming";
  const generated = hash(key) < child.reliability ? "given" : "missed";
  if (d < today) return generated;
  // today
  if (child.demoFamily) return slotPassed(slot, now) ? "due" : "upcoming";
  return slotPassed(slot, now) ? generated : "upcoming";
}

export function dosesOn(child: Child, day: Date, now: Date, overrides: Overrides) {
  const out: { med: Medicine; slot: Slot; status: DoseStatus; key: string }[] = [];
  for (const slot of SLOTS) {
    for (const med of child.medicines) {
      if (!med.slots.includes(slot) || !medActiveOn(med, day, now)) continue;
      out.push({ med, slot, status: doseStatus(child, med, day, slot, now, overrides), key: doseKey(child.id, med.id, iso(day), slot) });
    }
  }
  return out;
}

/** given / (given + missed) across the last `days` days including today */
export function adherence(child: Child, now: Date, overrides: Overrides, days = 7) {
  let given = 0;
  let missed = 0;
  for (let i = days - 1; i >= 0; i--) {
    for (const d of dosesOn(child, addDays(now, -i), now, overrides)) {
      if (d.status === "given") given++;
      else if (d.status === "missed") missed++;
    }
  }
  const total = given + missed;
  return { given, missed, total, pct: total ? Math.round((given / total) * 100) : null };
}

export function hasActiveCourse(child: Child, now: Date) {
  return child.medicines.some((m) => medActiveOn(m, now, now));
}
