import React, { useState } from 'react';
import './HelpSupportPage.css';

function HelpSupportPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const faqs = [
    {
      q: "How do I check if an instructor is available?",
      a: "Navigate to the 'Faculty Status' tab in the left sidebar menu. This lists all instructors with their real-time statuses (Available, Class Ongoing, In a Meeting, Do Not Disturb). Clicking on any instructor displays their daily schedule timeline details."
    },
    {
      q: "How can I check the consultation schedules of teachers?",
      a: "Click on 'Consultation Schedule' in the sidebar. This loads the master-detail panel. Search or select a teacher from the left-side list, and their weekly consultation hours, modality (Face-to-Face vs Online), and locations (e.g. room number or Microsoft Teams link) will display on the right."
    },
    {
      q: "Where do I see formal teacher absences or leave notices?",
      a: "Formal absence announcements are posted on the 'Faculty Absences' page. These notices show the reason for the absence, the date range, and the expected date of return."
    },
    {
      q: "How does the notification board sync?",
      a: "The CIT-U Faculty Board system updates instantly when a faculty member edits their status, publishes a new weekly consultation hour, or creates an absence announcement. Updates trigger notifications in the student notifications tab."
    }
  ];

  return (
    <div className="help-page-container">
      {/* FAQ Panel */}
      <div className="help-section-card">
        <h3 className="help-card-title">Frequently Asked Questions</h3>
        <p className="help-card-subtitle">Find quick answers to common questions about the CIT-U Faculty Board system.</p>

        <div className="faq-accordion-list">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className={`faq-item-row ${isOpen ? 'faq-open' : ''}`}>
                <button onClick={() => toggleFaq(index)} className="faq-question-btn">
                  <span>{faq.q}</span>
                  <span className="faq-chevron-icon">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* System Specs Bar */}
      <div className="help-specs-card">
        <div className="system-specs-list">
          <div className="spec-row">
            <span className="spec-label">Version:</span>
            <span className="spec-value">v1.2.0-stable</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Platform Build:</span>
            <span className="spec-value">React SPA (Vite)</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Developers:</span>
            <span className="spec-value">CSIT 321 Crammers Group</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpSupportPage;
