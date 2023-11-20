export interface NavBarProps {
  title: string;
  children?: React.ReactNode;
}

export function NavBar({ title, children }: NavBarProps) {
  return (
    <div className="w-full flex justify-between items-center h-12 bg-white fixed top-0 p-4 z-10">
      <h1>{title}</h1>
      <div>{children}</div>
    </div>
  );
}
