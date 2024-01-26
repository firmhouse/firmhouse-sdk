export interface HeaderProps {
  title: string;
  byline?: string;
  largePadding?: boolean;
}

export function Header({ title, byline, largePadding }: HeaderProps) {
  return (
    <div className="bg-gray-900 text-center items-center text-white text-xs">
      <div
        className={`container mx-auto max-w-2xl pt-16 ${
          largePadding ? 'pb-24' : 'pb-8 -mb-8'
        }`}
      >
        <div className="mb-5 mt-12 px-4 lg:px-0">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {byline && <p className="text-sm opacity-75">{byline}</p>}
        </div>
      </div>
    </div>
  );
}
