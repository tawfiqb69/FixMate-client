export default function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <Heading className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {title}
      </Heading>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}