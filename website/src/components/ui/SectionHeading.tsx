type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  className = "",
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={`max-w-[18ch] ${className}`.trim()}>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <Tag className="text-[clamp(2.4rem,6vw,5.4rem)] text-paper">{title}</Tag>
      {body ? <p className="lead mt-6">{body}</p> : null}
    </div>
  );
}
