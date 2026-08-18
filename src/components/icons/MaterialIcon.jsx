// Icons whose meaning is directional (point "forward"/"back" in reading
// order) need to mirror in RTL layouts; everything else (e.g. chevron_down)
// stays as-is. See the [dir="rtl"] .rtl-flip rule in index.css.
const DIRECTIONAL_ICONS = new Set(["arrow_forward", "arrow_back", "chevron_right", "chevron_left"]);

export default function MaterialIcon({ name, filled = false, className = "", style = {}, "aria-hidden": ariaHidden = true, ...rest }) {
  const flipClass = DIRECTIONAL_ICONS.has(name) ? "rtl-flip" : "";
  return (
    <span
      className={`material-symbols-outlined ${flipClass} ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}`, ...style }}
      aria-hidden={ariaHidden}
      {...rest}
    >
      {name}
    </span>
  );
}
