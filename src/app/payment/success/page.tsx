export default function PaymentSuccess() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0FDF4" }}>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
        <h1 style={{ color: "#15803D", fontSize: "24px", fontWeight: 800 }}>Payment Successful!</h1>
        <p style={{ color: "#6B7280", marginTop: "8px" }}>Your booking has been confirmed.</p>
      </div>
    </div>
  );
}
