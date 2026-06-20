/* Caastor v2 — 404 */
import { Button } from "../ds/components.jsx";

export function NotFoundPage({ navigate }) {
  return (
    <div className="page-enter">
      <section className="section surface-canvas" style={{ textAlign: "center", paddingTop: 120, minHeight: "60vh" }}>
        <div className="container container-narrow">
          <img src="/assets/mascot-violet.png" alt="" style={{ width: 88, marginBottom: 24 }} />
          <div className="t-mono" style={{ color: "var(--text-tertiary)", marginBottom: 10 }}>404</div>
          <h1 className="t-display-sm balance" style={{ marginBottom: 16 }}>
            This page wandered off.
          </h1>
          <p className="pretty" style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto 28px" }}>
            The link may be old or the page moved. Let’s get you back on track.
          </p>
          <Button variant="primary" size="lg" iconEnd="arrowRight" onClick={() => navigate("home")}>
            Back home
          </Button>
        </div>
      </section>
    </div>
  );
}
