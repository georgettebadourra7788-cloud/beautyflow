import { useState } from "react";

export default function Avatar({ src, alt, initial, size = "w-12 h-12", textClassName = "font-headline-md" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${size} rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant ${textClassName} flex-shrink-0`}
      >
        {initial || alt?.charAt(0)}
      </div>
    );
  }

  return (
    <div className={`${size} rounded-full overflow-hidden border border-surface-variant flex-shrink-0`}>
      <img alt={alt} className="w-full h-full object-cover" src={src} onError={() => setFailed(true)} />
    </div>
  );
}
