import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import Avatar from "../components/Avatar.jsx";

const OPPORTUNITIES = [
  {
    name: "Sarah Johnson",
    initial: "S",
    service: "Balayage • Instagram",
    price: "$150",
    intent: "High Intent",
    lastContact: "Last contact: 2 hours ago",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGoybtSg7E-g1vESs9sq9vRMYJCBtByt6zIIYDcUQya4CCEI9GAMk_r8KFaxky9wYiQovjDEL1uzkWh2jXDY5vzzcMdH3j5zs3vmx7t8BqgNJN6fYWCijKEF6wgjo4jHhkJj72M1NCY1zgYIWkjGgV4LgKmW6nlEEtBDnd1FpWrDffEN_W8_66lvRDhH3CuHRc2i61VxccZ0ES1VDpJ_mhH4mm6GA4_EsT7amUUSzSJudBfLuLX9jb",
  },
  {
    name: "Maya Williams",
    initial: "M",
    service: "Hair Color • WhatsApp",
    price: "$80",
    intent: "High Intent",
    lastContact: "Last contact: Yesterday",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDawh42m39saD87xA4nyZ215PBjcgXEtwLB18kpoUeIoOx69z-Wfnp-h0Fiuudr4nL0OkXutIFIzjAqnUBWVwvrNy7TcrMWncOu_DMYaDzzE3cIR1pdxAm5N7Ikrmq5gCItSNT7J1fnGlYQTjCfwq8-GH55Ep2_2dlNA2O6pnxse-aBWGaqexhU43XaHf9BWKbWb9XSymyAwQsY8kSmPXqG2BMdZE6xvl_myXAgCVjQz8aBms4cBjND",
  },
  {
    name: "Emma Davis",
    initial: "E",
    service: "Facial • Website",
    price: "$120",
    intent: "Medium Intent",
    lastContact: "Last contact: 2 days ago",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_pTxrSak4Z_BQEiFcRu-czXoDg3_5BfLE594czT0hnfRomtfi1NomZE0lJbT2c5PQhBmQvdAqOlFDcnxAsd2cFN-PWyS2CnFYnJOtjzeGEjM-UVJssYsilmXwx6qqGfTRygbimIZ0kK11NkZglC5XTa5w6RWYxvocF6D2W3tpZNbjB9stAi4jRQIovQEixCYSXJ6-Nhfh8hoHl1vqgFo7cP49yclwLRFM2ZK0pWkZf3whjvMl_vmc",
  },
];

export default function Opportunities() {
  return (
    <>
      <header className="bg-surface flex justify-between items-center px-container-padding pt-stack-lg pb-stack-md w-full sticky top-0 z-30">
        <h1 className="font-headline-md text-headline-md text-primary">Opportunities</h1>
        <button
          aria-label="Notifications"
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <MaterialIcon name="notifications" className="text-primary" />
        </button>
      </header>

      <main className="flex-1 px-container-padding pb-40 space-y-stack-lg">
        <section className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] border border-primary-container/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">7 Customers Ready to Recover</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                These customers showed interest but haven't booked yet.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-1">
                <span className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
                  Potential Revenue
                </span>
                <p className="font-headline-md text-headline-md text-primary">$1,240</p>
              </div>
              <div className="space-y-1">
                <span className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
                  High-Intent Leads
                </span>
                <p className="font-headline-md text-headline-md text-primary">4</p>
              </div>
            </div>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-error-container text-on-error-container px-3 py-1.5 rounded-full">
                <MaterialIcon name="schedule" className="text-[16px]" />
                <span className="font-label-lg text-label-lg">Follow-ups Due: 7</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-stack-md">
          <h3 className="font-headline-md text-[20px] leading-tight text-on-surface">Top Opportunities</h3>
          <div className="space-y-4">
            {OPPORTUNITIES.map((opp) => (
              <article
                key={opp.name}
                className="bg-surface-container-lowest rounded-[24px] p-5 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <Avatar src={opp.avatar} alt={opp.name} initial={opp.initial} />
                    <div>
                      <h4 className="font-label-lg text-body-lg text-on-surface font-semibold">{opp.name}</h4>
                      <p className="font-body-md text-label-lg text-on-surface-variant">{opp.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">{opp.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 ${
                      opp.intent === "High Intent"
                        ? "bg-surface-container text-on-surface"
                        : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    {opp.intent === "High Intent" && <span className="text-[12px]">🔥</span>}
                    {opp.intent}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant ml-auto">{opp.lastContact}</span>
                </div>
                <button className="w-full py-3 mt-1 border border-outline-variant rounded-xl font-label-lg text-label-lg text-on-surface hover:bg-surface-variant transition-colors">
                  Review
                </button>
              </article>
            ))}
          </div>
          <button className="w-full py-4 bg-primary-container text-on-primary-container font-label-lg text-label-lg rounded-xl hover:opacity-90 transition-opacity mt-4 shadow-sm">
            Review All Opportunities
          </button>
        </section>

        <section className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] space-y-5">
          <h3 className="font-headline-md text-[20px] leading-tight text-on-surface">Recovered This Month</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1">
                Bookings
              </span>
              <span className="font-headline-md text-[20px] text-on-surface">18</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1">
                Revenue
              </span>
              <span className="font-headline-md text-[20px] text-primary">$2,350</span>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between font-label-sm text-label-sm">
              <span className="text-on-surface-variant">Potential ($1,240)</span>
              <span className="text-primary font-semibold">Recovered ($2,350)</span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden flex">
              <div className="h-full bg-secondary-fixed-dim" style={{ width: "34%" }} />
              <div className="h-full bg-primary" style={{ width: "66%" }} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
