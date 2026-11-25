interface ExpertiseCardProps {
  index: number;
  title: string;
  description: string;
}

export function ExpertiseCard({ index, title, description }: ExpertiseCardProps) {
  return (
    <li className="card flex flex-col gap-3 p-6">
      <span className="font-display text-lg text-teal" aria-hidden="true">
        {String(index).padStart(2, "0")}
      </span>
      <h3 className="text-2xl">{title}</h3>
      <p className="text-muted">{description}</p>
    </li>
  );
}
