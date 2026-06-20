/* Shared FAQ accordion (FAQItem + FAQList). */
import { useState, useRef } from "react";
import { Icon } from "../ds/components.jsx";

function FAQItem({ q, a, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const ref = useRef(null);
  return (
    <div className={"faq-item" + (open ? " open" : "")}>
      <button className="faq-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="balance">{q}</span>
        <span className="faq-icon">
          <Icon name="plus" size={22} />
        </span>
      </button>
      <div className="faq-a" style={{ maxHeight: open ? (ref.current ? ref.current.scrollHeight + 4 : 400) : 0 }}>
        <div className="faq-a-inner" ref={ref}>
          {a}
        </div>
      </div>
    </div>
  );
}

export function FAQList({ items }) {
  return (
    <div>
      {items.map((it, i) => (
        <FAQItem key={i} q={it.q} a={it.a} defaultOpen={i === 0} />
      ))}
    </div>
  );
}
