export interface NavBarProps {
  title: string;
}

export function NavBar({ title }: NavBarProps) {
  return (
    <div className="w-full h-12 bg-white fixed top-0 p-4 z-10">
      <h1>{title}</h1>
    </div>
  );
}
