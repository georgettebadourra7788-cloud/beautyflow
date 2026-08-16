import MaterialIcon from "./icons/MaterialIcon.jsx";

export default function FloatingSelect({ id, label, value, onChange, options, required = false }) {
  return (
    <div>
      <label htmlFor={id} className="block text-on-surface-variant font-label-lg text-label-lg mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full appearance-none px-0 py-3 pr-6 border-0 border-b border-outline-variant bg-transparent focus:ring-0 focus:border-primary text-on-surface font-body-lg"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <MaterialIcon
          name="expand_more"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]"
        />
      </div>
    </div>
  );
}
