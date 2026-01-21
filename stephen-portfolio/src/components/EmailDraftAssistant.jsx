import React, { useState } from 'react';
import { generateEmailDrafts } from '../services/aiService';
import { FaPaperPlane, FaMagic, FaSpinner } from 'react-icons/fa';

const EmailDraftAssistant = () => {
    const [intent, setIntent] = useState('');
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDraft, setSelectedDraft] = useState(null);

    const handleGenerate = async () => {
        if (!intent.trim()) return;

        setLoading(true);
        setError('');
        setDrafts([]);
        setSelectedDraft(null);

        try {
            const results = await generateEmailDrafts(intent);
            setDrafts(results);
        } catch (err) {
            setError('Failed to generate drafts. Please check your API key or try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = (draft) => {
        const mailtoLink = `mailto:agyemangstephen2580@gmail.com?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
        window.location.href = mailtoLink;
    };

    const isMobile = window.innerWidth < 768;

    return (
        <section id="contact-assistant" style={{
            padding: isMobile ? "60px 16px" : "80px 20px",
            background: "linear-gradient(135deg, #fff 0%, #f9f9f9 100%)",
            borderTop: "1px solid #eaeaea",
            textAlign: "center"
        }}>
            <h2 style={{
                fontSize: isMobile ? "1.8rem" : "2.5rem",
                marginBottom: "20px",
                color: "#444",
                fontFamily: "'Courier New', Courier, monospace"
            }}>
                Email Draft Assistant
            </h2>
            <p style={{
                marginBottom: "30px",
                color: "#666",
                fontFamily: "'Inter', sans-serif",
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto"
            }}>
                Not sure what to say? Describe what you want to contact me about, and I'll draft the email for you.
            </p>

            <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "left" }}>
                <textarea
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    placeholder="e.g., 'I want to discuss a freelance React project for my startup...'"
                    style={{
                        width: "100%",
                        padding: "15px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        minHeight: "120px",
                        fontSize: "1rem",
                        marginBottom: "20px",
                        fontFamily: "'Inter', sans-serif",
                        resize: "vertical"
                    }}
                />

                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !intent.trim()}
                        style={{
                            padding: "12px 30px",
                            borderRadius: "30px",
                            border: "none",
                            background: loading ? "#ccc" : "#4a7c59",
                            color: "white",
                            fontSize: "1rem",
                            cursor: loading ? "not-allowed" : "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "transform 0.2s"
                        }}
                    >
                        {loading ? <FaSpinner className="spin" /> : <FaMagic />}
                        {loading ? "Drafting..." : "Generate Magic Drafts"}
                    </button>
                </div>

                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

                {drafts.length > 0 && (
                    <div style={{ display: "grid", gap: "20px", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
                        {drafts.map((draft, idx) => (
                            <div key={idx} style={{
                                padding: "20px",
                                border: selectedDraft === idx ? "2px solid #4a7c59" : "1px solid #ddd",
                                borderRadius: "10px",
                                background: "white",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                                onClick={() => setSelectedDraft(idx)}
                            >
                                <div style={{
                                    textTransform: "uppercase",
                                    fontSize: "0.8rem",
                                    color: "#888",
                                    marginBottom: "10px",
                                    fontWeight: "bold",
                                    letterSpacing: "1px"
                                }}>
                                    {draft.style}
                                </div>
                                <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
                                    Subject: {draft.subject}
                                </div>
                                <div style={{
                                    fontSize: "0.9rem",
                                    color: "#555",
                                    whiteSpace: "pre-wrap",
                                    marginBottom: "20px",
                                    lineHeight: "1.4"
                                }}>
                                    {draft.body}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSend(draft);
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        border: "none",
                                        background: "#4a7c59",
                                        color: "white",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px"
                                    }}
                                >
                                    <FaPaperPlane /> Send to Stephen
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </section>
    );
};

export default EmailDraftAssistant;
