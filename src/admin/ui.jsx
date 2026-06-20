/* Small admin form primitives + helpers. */

export function humanize(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function Field({ label, children }) {
  return (
    <div className="af">
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}

export function Text({ label, value, onChange, placeholder, multiline }) {
  return (
    <Field label={label}>
      {multiline ? (
        <textarea value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
    </Field>
  );
}
