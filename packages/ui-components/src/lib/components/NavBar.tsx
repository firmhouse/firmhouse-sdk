export interface NavBarProps {
  title: string;
}

export function NavBar({ title }: NavBarProps) {
  return (
    <div className="w-full h-8 bg-white fixed top-0 p-4">
      <h1>{title}</h1>
    </div>
  );
}
