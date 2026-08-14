import { useNavigate } from "react-router-dom";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";

export default function Conversations() {
  const navigate = useNavigate();

  return (
    <>
      <header className="bg-surface w-full top-0 sticky flex justify-between items-center px-container-padding h-16 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95 transition-transform"
          >
            <MaterialIcon name="arrow_back" className="text-primary" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-headline-md text-headline-md text-primary">Sarah Johnson</h1>
            <div className="flex items-center gap-2">
              <span className="font-label-lg text-label-lg text-secondary">Balayage</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="font-label-sm text-label-sm text-secondary px-2 py-0.5 bg-surface-container-high rounded-full flex items-center gap-1">
                <MaterialIcon name="photo_camera" className="text-[10px]" /> Instagram
              </span>
            </div>
          </div>
        </div>
        <button
          aria-label="More options"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          <MaterialIcon name="more_vert" className="text-primary" />
        </button>
      </header>

      <main className="flex-grow px-container-padding pt-stack-lg pb-40 flex flex-col gap-stack-lg w-full">
        <section className="flex flex-col gap-stack-md relative z-10">
          <div className="flex w-full justify-start">
            <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl rounded-tl-sm px-4 py-3 shadow-[0px_4px_12px_rgba(45,45,45,0.02)] max-w-[85%]">
              <p className="font-body-md text-body-md text-on-surface">Hi! How much is balayage?</p>
              <span className="font-label-sm text-label-sm text-secondary mt-1 block">10:42 AM</span>
            </div>
          </div>
          <div className="flex w-full justify-end">
            <div className="bg-primary-container text-on-primary-container rounded-2xl rounded-tr-sm px-4 py-3 shadow-[0px_4px_12px_rgba(45,45,45,0.02)] max-w-[85%]">
              <p className="font-body-md text-body-md">Hi Sarah! Our balayage starts at $150.</p>
              <span className="font-label-sm text-label-sm text-on-primary-container opacity-80 mt-1 block text-right">
                11:15 AM
              </span>
            </div>
          </div>
          <div className="flex w-full justify-start">
            <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl rounded-tl-sm px-4 py-3 shadow-[0px_4px_12px_rgba(45,45,45,0.02)] max-w-[85%]">
              <p className="font-body-md text-body-md text-on-surface">Okay, thank you!</p>
              <span className="font-label-sm text-label-sm text-secondary mt-1 block">11:30 AM</span>
            </div>
          </div>
        </section>

        <section className="mt-stack-sm relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-tertiary-container via-primary-container to-tertiary-container rounded-[26px] blur opacity-20" />
          <div className="bg-surface-container-lowest border border-primary-container/50 rounded-[24px] p-5 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-[18px] text-on-surface flex items-center gap-2">
                ✨ BeautyFlow Suggested Follow-up
              </h3>
              <span className="font-label-sm text-label-sm text-primary px-2 py-1 bg-primary-container/30 rounded-full border border-primary-container/50">
                AI-generated suggestion
              </span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-5 border border-surface-container-high">
              <p className="font-body-md text-body-md text-on-surface-variant italic">
                "Hi Sarah 👋 Just checking in! We have a few appointments available this week. Would you like me to
                help you find a time?"
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-primary-container text-on-primary-container font-label-lg text-label-lg py-3 px-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-[0px_4px_12px_rgba(234,199,199,0.3)]">
                <MaterialIcon name="send" className="text-[18px]" />
                Send Follow-up
              </button>
              <div className="flex gap-3 flex-1">
                <button className="flex-1 border border-on-surface text-on-surface font-label-lg text-label-lg py-3 px-4 rounded-xl hover:bg-surface-container-lowest transition-colors active:scale-[0.98] flex justify-center items-center">
                  Edit
                </button>
                <button className="flex-1 text-secondary font-label-lg text-label-lg py-3 px-4 rounded-xl hover:bg-surface-container transition-colors active:scale-[0.98] flex justify-center items-center">
                  Don't Send
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-[24px] p-5 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] border border-surface-container-high/50">
          <h3 className="font-headline-md text-[18px] text-on-surface mb-4">Lead Details</h3>
          <div className="flex flex-col gap-0">
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">Service</span>
              <span className="font-label-lg text-label-lg text-on-surface">Balayage</span>
            </div>
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">Potential value</span>
              <span className="font-label-lg text-label-lg text-[#A68832]">~$150</span>
            </div>
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">Source</span>
              <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                <MaterialIcon name="photo_camera" className="text-[14px]" /> Instagram
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">Status</span>
              <span className="font-label-lg text-label-lg text-primary bg-primary-container/20 px-2 py-0.5 rounded-full">
                Follow-up due
              </span>
            </div>
            <div className="flex justify-between py-3 px-1">
              <span className="font-body-md text-body-md text-secondary">Last contact</span>
              <span className="font-label-lg text-label-lg text-on-surface">2 hours ago</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
