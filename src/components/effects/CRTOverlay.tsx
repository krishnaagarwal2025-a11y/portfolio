export default function CRTOverlay({ enabled }: { enabled: boolean }) {
  return <div className={enabled ? "crt" : "crt off"} aria-hidden="true" />;
}
