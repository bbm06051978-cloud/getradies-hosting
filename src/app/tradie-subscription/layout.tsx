export default function TradieDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (!document.cookie.includes('token=')) {
              window.location.replace('/login-tradie');
            }
          `,
        }}
      />
      {children}
    </>
  );
}