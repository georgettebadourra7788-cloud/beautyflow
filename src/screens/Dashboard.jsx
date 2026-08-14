import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import Avatar from "../components/Avatar.jsx";

const FOLLOW_UPS = [
  {
    name: "Sarah Johnson",
    service: "Balayage",
    status: { label: "Hot", className: "bg-[#FFE4E1] text-[#D84B4B]" },
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-xnspGFqWsm0RwdKkDkxMfYDTYdynw--qTSdhpA7lHDZE5HuD1FSDDwkU8mu2fn7KBgdfoY731wwaSqHBEUVBaq2FyIFCqFXH5AE38uAGGGoZX-jotno8GwNcbtVLwRs-f1dIpos_19AClXPzzJT7KvSQ5tXPCszkOGBvLxwDrxMrdcN9jck1CQ_V8u_yUeVc_koUJzgbPtFa9xjCE7LJHnDiRxj4Wqy7GEUfTYKipGADcQ73apya",
    action: "Follow Up",
    actionStyle: "bg-primary-container text-on-primary-container",
  },
  {
    name: "Maya",
    service: "Hair Color",
    status: { label: "Waiting", className: "bg-surface-container-high text-on-surface-variant" },
    initial: "M",
    action: "View",
    actionStyle: "border border-outline text-on-surface hover:bg-surface-variant",
  },
  {
    name: "Emma",
    service: "Nails",
    status: { label: "Ready", className: "bg-[#E8F5E9] text-[#2E7D32]" },
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDE1uhhkXANb2k-Hob2hV-mWpbuzu9uT6icEWre9l6t3YkisCVRgmkDa0iqNsbaToAXwnLfCUCDB418aKKKtkepBHfKkA8D5iIml4zrxdWrlE00OytVn-IKauuooROnnNIMsmw6ChbDHjHg9ilIFNIXTp19JoCJHDCOQtmR9haAAgD7zOKyZNUVq5TJJsZ_Lk44PTgoI25gtBy5PZjOepz3k132PaiVj2RtJ3SunRr67tyfG2nlKIdZ",
    action: "Follow Up",
    actionStyle: "bg-primary-container text-on-primary-container",
  },
];

const KPIS = [
  { label: "New Leads", value: "12", icon: "person_add", iconWrap: "bg-primary-container/30", iconColor: "text-primary" },
  { label: "Follow-ups Due", value: "7", icon: "event_available", iconWrap: "bg-tertiary-container/30", iconColor: "text-tertiary" },
  { label: "Recovered Bookings", value: "4", icon: "refresh", iconWrap: "bg-surface-container-highest", iconColor: "text-secondary" },
  {
    label: "Estimated Revenue",
    value: "$620",
    icon: "payments",
    iconWrap: "bg-primary-container",
    iconColor: "text-on-primary-container",
    valueColor: "text-primary",
    gradient: true,
  },
];

export default function Dashboard() {
  return (
    <>
      <header className="bg-surface flex justify-between items-center px-container-padding pt-stack-lg pb-stack-md w-full sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Avatar
            size="w-10 h-10"
            textClassName="font-label-lg text-label-lg"
            alt="Sarah's Profile Picture"
            initial="S"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNMMJQjmGNYvkXZVPz-4nybylOxT63T40gQEE5QLncxblWytHufSz_h6OvnyjDaJI9jLX3UaZek4Bf-loG_W1Tv4wTyDWFWUPWZNpSeY-e5wN80awH7TYEhgff1o-pQ6JRVIjAXPNkYoFfy7nLtkCKCZoRQgV95K1FtaTDNPc3lZmZpzidaV4akoqdQqjI4Yo6xEaxVARsABeNfssn8X6IPyM0V4hoNNsFdKpEe5Uep5_10RdOKlAf"
          />
          <div>
            <h1 className="font-headline-md text-headline-md text-primary truncate">Good morning, Sarah 👋</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Your salon is doing well today.</p>
          </div>
        </div>
        <button
          aria-label="Notifications"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-primary flex-shrink-0"
        >
          <MaterialIcon name="notifications" />
        </button>
      </header>

      <main className="px-container-padding pt-stack-md pb-32 flex flex-col gap-stack-lg">
        <section>
          <div className="grid grid-cols-2 gap-gutter">
            {KPIS.map((kpi) => (
              <div
                key={kpi.label}
                className={`bg-surface-container-lowest rounded-[24px] p-5 soft-shadow flex flex-col justify-between border border-surface-variant/50 min-h-[120px] ${
                  kpi.gradient ? "bg-gradient-to-br from-surface-container-lowest to-primary-container/10" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-lg text-label-lg text-on-surface-variant">{kpi.label}</span>
                  <div className={`w-8 h-8 rounded-full ${kpi.iconWrap} flex items-center justify-center`}>
                    <MaterialIcon name={kpi.icon} className={`${kpi.iconColor} text-sm`} />
                  </div>
                </div>
                <div className={`font-display text-display ${kpi.valueColor || "text-on-surface"}`}>{kpi.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-stack-md">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-body-lg text-[18px] font-semibold text-on-surface">Today's Follow-ups</h2>
            <button className="font-label-lg text-label-lg text-primary uppercase hover:opacity-80 transition-opacity">
              View All
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {FOLLOW_UPS.map((item) => (
              <div
                key={item.name}
                className="bg-surface-container-lowest rounded-xl p-4 soft-shadow border border-surface-variant/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar src={item.avatar} alt={item.name} initial={item.initial} />
                  <div>
                    <div className="font-body-lg font-semibold text-on-surface leading-tight">{item.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-label-lg text-label-lg text-on-surface-variant">{item.service}</span>
                      <span className="w-1 h-1 rounded-full bg-surface-variant" />
                      <span
                        className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full flex items-center gap-1 ${item.status.className}`}
                      >
                        {item.status.label === "Hot" && <span className="text-[10px]">🔥</span>}
                        {item.status.label}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className={`font-label-lg text-label-lg px-4 py-2 rounded-lg hover:opacity-90 transition-opacity ${item.actionStyle}`}
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
