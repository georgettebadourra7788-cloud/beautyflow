import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import Avatar from "../components/Avatar.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { useSalon } from "../lib/SalonContext.jsx";
import { listLeads } from "../lib/api/leads.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";
import { serviceLabel } from "../lib/serviceOptions.js";

const STATUS_CLASS = {
  new: "bg-surface-container-high text-on-surface-variant",
  follow_up: "bg-[#FFE4E1] text-[#D84B4B]",
  booked: "bg-[#E8F5E9] text-[#2E7D32]",
  lost: "bg-surface-container text-on-surface-variant",
};

export default function Dashboard() {
  const { profile } = useAuth();
  const { salon } = useSalon();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!salon) return;
    let cancelled = false;
    setLoading(true);
    listLeads(salon.id).then(({ data }) => {
      if (!cancelled) {
        setLeads(data ?? []);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [salon]);

  const newLeads = leads.filter((l) => l.status === "new");
  const followUpsDue = leads.filter((l) => l.status === "follow_up");
  const recoveredBookings = leads.filter((l) => l.status === "booked");
  const estimatedRevenue = leads
    .filter((l) => l.status === "new" || l.status === "follow_up")
    .reduce((sum, l) => sum + (Number(l.potential_value) || 0), 0);

  const KPIS = [
    { label: t("dashboard.kpis.newLeads"), value: newLeads.length, icon: "person_add", iconWrap: "bg-primary-container/30", iconColor: "text-primary" },
    { label: t("dashboard.kpis.followUpsDue"), value: followUpsDue.length, icon: "event_available", iconWrap: "bg-tertiary-container/30", iconColor: "text-tertiary" },
    { label: t("dashboard.kpis.recoveredBookings"), value: recoveredBookings.length, icon: "refresh", iconWrap: "bg-surface-container-highest", iconColor: "text-secondary" },
    {
      label: t("dashboard.kpis.estimatedRevenue"),
      value: `$${estimatedRevenue.toLocaleString()}`,
      icon: "payments",
      iconWrap: "bg-primary-container",
      iconColor: "text-on-primary-container",
      valueColor: "text-primary",
      gradient: true,
    },
  ];

  const todaysFollowUps = followUpsDue.slice(0, 3);
  const firstName = profile?.full_name?.split(" ")[0] || t("dashboard.defaultFirstName");

  return (
    <>
      <header className="bg-surface flex justify-between items-center px-container-padding pt-stack-lg pb-stack-md w-full sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Avatar
            size="w-10 h-10"
            textClassName="font-label-lg text-label-lg"
            alt={profile?.full_name || "Profile"}
            initial={firstName.charAt(0).toUpperCase()}
          />
          <div>
            <h1 className="font-headline-md text-headline-md text-primary truncate">
              {t("dashboard.greeting", { firstName })}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {salon?.name
                ? t("dashboard.subtitleWithSalon", { salonName: salon.name })
                : t("dashboard.subtitleNoSalon")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <LanguageToggle />
          <button
            aria-label={t("common.notifications")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-primary flex-shrink-0"
          >
            <MaterialIcon name="notifications" />
          </button>
        </div>
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
                <div className={`font-display text-display ${kpi.valueColor || "text-on-surface"}`}>
                  {loading ? t("common.dash") : kpi.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-stack-md">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-body-lg text-[18px] font-semibold text-on-surface">{t("dashboard.todaysFollowUps")}</h2>
            <button
              onClick={() => navigate("/leads")}
              className="font-label-lg text-label-lg text-primary uppercase hover:opacity-80 transition-opacity"
            >
              {t("dashboard.viewAll")}
            </button>
          </div>

          {loading ? (
            <p className="font-body-md text-body-md text-on-surface-variant">{t("common.loading")}</p>
          ) : todaysFollowUps.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow border border-surface-variant/50 text-center">
              <MaterialIcon name="event_available" className="text-on-surface-variant text-3xl mb-2" />
              <p className="font-body-md text-body-md text-on-surface-variant">{t("dashboard.noFollowUps")}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todaysFollowUps.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-surface-container-lowest rounded-xl p-4 soft-shadow border border-surface-variant/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Avatar initial={lead.customer_name.charAt(0).toUpperCase()} alt={lead.customer_name} />
                    <div>
                      <div className="font-body-lg font-semibold text-on-surface leading-tight">
                        {lead.customer_name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-label-lg text-label-lg text-on-surface-variant">
                          {serviceLabel(t, lead.service) || t("common.dash")}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-surface-variant" />
                        <span
                          className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${
                            STATUS_CLASS[lead.status] ?? STATUS_CLASS.new
                          }`}
                        >
                          {t(`statuses.${lead.status}`)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/conversations/${lead.id}`)}
                    className="font-label-lg text-label-lg px-4 py-2 rounded-lg hover:opacity-90 transition-opacity bg-primary-container text-on-primary-container"
                  >
                    {t("dashboard.followUp")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
