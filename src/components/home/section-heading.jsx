export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}