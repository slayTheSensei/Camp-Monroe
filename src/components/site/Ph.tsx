interface PhProps {
  cap?: string;
  tag?: string;
  src?: string;
  alt?: string;
  tall?: boolean;
  short?: boolean;
}

export default function Ph({ cap, tag, src, alt, tall, short }: PhProps) {
  const cls = ["ph", tall && "ph--tall", short && "ph--short"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      {src ? (
        <img src={src} alt={alt ?? ""} />
      ) : (
        <span className="ph-ghost" aria-hidden="true" />
      )}
      {cap && <p className="ph-cap">{cap}</p>}
      {tag && <span className="ph-tag">{tag}</span>}
    </div>
  );
}
