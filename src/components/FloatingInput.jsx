export default function FloatingInput({ id, label, type = "text", value, onChange, required = false, autoComplete }) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        required={required}
        autoComplete={autoComplete}
        className="block w-full px-0 py-3 border-0 border-b border-outline-variant bg-transparent focus:ring-0 focus:border-primary peer text-on-surface font-body-lg placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute start-0 -top-2.5 text-on-surface-variant font-label-lg text-label-lg transition-all peer-placeholder-shown:text-body-lg peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-label-lg peer-focus:text-primary"
      >
        {label}
      </label>
    </div>
  );
}
