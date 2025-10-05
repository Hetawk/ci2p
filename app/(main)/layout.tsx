export type ViewMode = "patience" | "organization";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Let child layouts handle navigation rendering
  // This prevents double rendering of nav elements
  return <>{children}</>;
}
