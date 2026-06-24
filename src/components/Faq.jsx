/* Shared FAQ accordion (FAQItem + FAQList). Reused by Home + Pricing + FAQ page. */
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import "./faq-extra.css";

function FAQItem({ q, a, open, onToggle }) {
  const reduce = useReducedMotion();
  return (
    <div className={"fx-item" + (open ? " is-open" : "")}>
      <h3 className="fx-h">
        <button className="fx-q" onClick={onToggle} aria-expanded={open}>
          <span className="balance fx-q-text">{q}</span>
          <span className="fx-affordance" aria-hidden="true">
            <span className="fx-bar fx-bar-h" />
            <span className="fx-bar fx-bar-v" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="fx-a"
            initial={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { height: { type: "spring", stiffness: 320, damping: 34, mass: 0.9 }, opacity: { duration: 0.22, ease: "easeOut" } }
            }
            style={{ overflow: "hidden" }}
          >
            <div className="fx-a-inner">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQList({ items }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="fx-list">
      {items.map((it, i) => (
        <FAQItem
          key={i}
          q={it.q}
          a={it.a}
          open={openIdx === i}
          onToggle={() => setOpenIdx((cur) => (cur === i ? -1 : i))}
        />
      ))}
    </div>
  );
}
