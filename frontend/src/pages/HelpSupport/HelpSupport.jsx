import Sidebar from "../../components/Sidebar";
import "../../styles/shared.css";
import "./HelpSupport.css";

const faqs = [
  {
    q: "How do I know if a professor is available?",
    a: "Check the Faculty Status page — it shows real-time availability with color-coded badges.",
  },
  {
    q: "Can I message a faculty member directly?",
    a: "Use the email listed on their profile card, or the Quick Contact option on the Faculty Directory page.",
  },
  {
    q: "What if a professor is on leave?",
    a: "Visit Faculty Absences to see their expected return date and away message.",
  },
];

function HelpSupport() {
  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title">Help & Support</h1>
        <p className="page-subtext">Frequently asked questions and contact info.</p>

        <div className="card" style={{ marginBottom: 16 }}>
          {faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <p className="faq-question">{f.q}</p>
              <p className="faq-answer">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <p className="faq-question">Still need help?</p>
          <p className="faq-answer">
            Email us at{" "}
            <a href="mailto:cit.faculty@cit.edu">cit.faculty@cit.edu</a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default HelpSupport;