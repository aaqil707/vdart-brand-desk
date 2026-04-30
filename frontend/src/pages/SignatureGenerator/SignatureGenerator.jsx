import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CopyButton from '../../components/CopyButton/CopyButton';
import './SignatureGenerator.css';

// ── Instruction Steps Data ──
const OUTLOOK_STEPS = [
  { step: 1, title: 'Fill and Generate Signature', icon: 'form', imagePath: 'images/Outlook_step1.png',
    description: 'Enter your Full Name, Designation, Phone Number (format: 4703238433), Email Address, and LinkedIn Profile URL (optional). Click "Generate Signature".' },
  { step: 2, title: 'Copy Generated Signature', icon: 'copy', imagePath: 'images/Outlook_step2.png',
    description: 'Switch to "Outlook Format" tab in preview section → Review your generated signature → Click "Copy Signature for Outlook" → Wait for the success message.' },
  { step: 3, title: 'Access Outlook Settings', icon: 'settings', imagePath: 'images/Outlook_step3.png',
    description: 'Open Microsoft Outlook → Click "File" in the top menu → Click "Options" → Select "Mail" → Find and click the "Signatures..." button.' },
  { step: 4, title: 'Create New Signature', icon: 'create', imagePath: 'images/Outlook_step4.png',
    description: 'Click the "New" button → Enter a name (e.g., "VDart Signature") → Click "OK" → In the right pane, paste your copied signature (Ctrl+V) → Verify all elements.' },
  { step: 5, title: 'Set Default Signature', icon: 'default', imagePath: 'images/Outlook_step5.png',
    description: 'Under "Choose default signature" → Select your email account → Choose your new signature for "New messages" and optionally "Replies/forwards" → Click "OK".' },
];

const CEIPAL_STEPS = [
  { step: 1, title: 'Fill and Generate Signature', icon: 'form', imagePath: 'images/Ceipal Step1 (1).png',
    description: 'Enter your Full Name, Designation, Phone Number, Email Address, and LinkedIn Profile URL (optional). Click "Generate Signature".' },
  { step: 2, title: 'Copy Generated Signature', icon: 'copy', imagePath: 'images/Ceipal Step2 (1).png',
    description: 'Switch to "CEIPAL Format" tab → Review your generated signature → Click "Copy Signature for CEIPAL" → Wait for the "Signature copied" message.' },
  { step: 3, title: 'Access CEIPAL Settings', icon: 'settings', imagePath: 'images/Ceipal Step3 (1).png',
    description: 'Log into your CEIPAL account → Click on your profile picture/icon → Select "Settings" from the dropdown → Navigate to "Email Settings".' },
  { step: 4, title: 'Paste Your Signature', icon: 'create', imagePath: 'images/Ceipal Step4 (1).png',
    description: 'Locate the "Email Signature" section → Paste your copied signature (Ctrl+V) → Verify all elements appear correctly → Click "Save Changes".' },
  { step: 5, title: 'Verify Signature Display', icon: 'verify', imagePath: 'images/Ceipal Step5 (1).png',
    description: 'Locate the "Email Signature" section → Verify all elements appear correctly → Click "Save Changes" to apply.' },
  { step: 6, title: 'Final Confirmation', icon: 'confirm', imagePath: 'images/Ceipal Step6 (1).png',
    description: 'Confirm your signature is saved → Send a test email to verify appearance → Adjust if needed.' },
];

const SIG_STEP_ICONS = {
  form: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  copy: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>),
  settings: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
  create: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  default: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
  verify: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  confirm: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
};

export default function SignatureGenerator({ entity, onBack }) {
  // Config per entity
  const SIGNATURE_CONFIG = {
    'vdart': {
      logo: 'http://vdpl.co/dnimg/vdartlogo.png',
      banner: 'http://vdpl.co/dnimg/greatplacebanner.jpg',
      color: '#242299',
      linkColor: '#0066cc',
      unsubscribe: 'https://www.surveymonkey.com/r/Opout',
      about: 'https://www.vdart.com/what-we-do/media/',
      linkedinIcon: 'http://vdpl.co/dnimg/linkedinlogo.png'
    },
    'vdart-digital': {
      logo: 'http://vdpl.co/dnimg/VDart_Digital_Blue_Logo.png',
      banner: 'http://vdpl.co/dnimg/VDart_Digital_Email_Banner.png',
      color: '#0066cc',
      linkColor: '#0066cc',
      unsubscribe: 'https://www.surveymonkey.com/r/Opout',
      about: 'https://www.vdart.com/what-we-do/media/vdart-celebrates-five-consecutive-wins-receives-national-supplier-of-the-year-class-iv-award-from-nmsdc',
      linkedinIcon: 'http://vdpl.co/dnimg/linkedinlogo.png'
    },
    'trustpeople': {
      logo: 'http://vdpl.co/dnimg/trustpeople.png',
      banner: 'http://vdpl.co/dnimg/trustpeoplefinal.png',
      color: '#242299',
      linkColor: '#0066cc',
      unsubscribe: 'https://www.surveymonkey.com/r/Opout',
      about: 'https://www.vdart.com/what-we-do/media/',
      linkedinIcon: 'http://vdpl.co/dnimg/linkedinlogo.png'
    }
  };

  const config = SIGNATURE_CONFIG[entity.id] || SIGNATURE_CONFIG['vdart'];

  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('sigGenTab') || 'outlook';
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const [instrTab, setInstrTab] = useState('outlook');
  const [isGenerated, setIsGenerated] = useState(() => {
    return sessionStorage.getItem('sigGenGenerated') === 'true';
  });
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('sigGenFormData');
    return saved ? JSON.parse(saved) : {
      name: '',
      title: '',
      phone: '',
      email: '',
      linkedin: ''
    };
  });

  useEffect(() => {
    sessionStorage.setItem('sigGenTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('sigGenGenerated', isGenerated);
  }, [isGenerated]);

  useEffect(() => {
    sessionStorage.setItem('sigGenFormData', JSON.stringify(formData));
  }, [formData]);

  const previewRef = useRef(null);

  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGenerate = () => {
    if (formData.name && formData.title && formData.phone && formData.email) {
      setIsGenerated(true);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      title: '',
      phone: '',
      email: '',
      linkedin: ''
    });
    setIsGenerated(false);
    sessionStorage.removeItem('sigGenTab');
    sessionStorage.removeItem('sigGenGenerated');
    sessionStorage.removeItem('sigGenFormData');
  };

  const copyToClipboard = async () => {
    if (activeTab === 'outlook') {
      if (previewRef.current) {
        const range = document.createRange();
        range.selectNodeContents(previewRef.current);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
      }
    } else {
      try {
        await navigator.clipboard.writeText(previewRef.current.innerHTML);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const isFormFilled = formData.name && formData.title && formData.phone && formData.email;
  const isComplete = isFormFilled && isGenerated;
  const formattedPhone = formatPhone(formData.phone);

  return (
    <div className="sig-gen">
      <Header />
      <main className="sig-gen__main">
        {/* Hero */}
        <motion.div
          className="sig-gen__hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="sig-gen__back" onClick={onBack} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>

          <div className="sig-gen__hero-content">
            <img src={entity.logoUrl} alt={entity.title} className="sig-gen__entity-logo" />
            <div>
              <h2 className="sig-gen__title">
                Email Signature <span className="text-gradient">Generator</span>
              </h2>
              <p className="sig-gen__subtitle">
                Generate your branded email signature for <strong>{entity.title}</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Instruction Content Block ── */}
        <motion.div
          className="sig-gen__instructions card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <button
            className="sig-gen__instructions-toggle"
            onClick={() => setShowInstructions(!showInstructions)}
            type="button"
            aria-expanded={showInstructions}
          >
            <div className="sig-gen__instructions-toggle-left">
              <div className="sig-gen__instructions-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="sig-gen__instructions-title">How to Set Up Your Email Signature</h3>
                <p className="sig-gen__instructions-desc">
                  Follow the step-by-step guide for Outlook or CEIPAL to apply your signature
                </p>
              </div>
            </div>
            <svg
              className={`sig-gen__instructions-chevron ${showInstructions ? 'open' : ''}`}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <AnimatePresence>
            {showInstructions && (
              <motion.div
                className="sig-gen__steps-wrapper"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Tab Switcher */}
                <div className="sig-gen__instr-tabs">
                  <button
                    type="button"
                    className={`sig-gen__instr-tab ${instrTab === 'outlook' ? 'active' : ''}`}
                    onClick={() => setInstrTab('outlook')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Outlook Steps
                  </button>
                  <button
                    type="button"
                    className={`sig-gen__instr-tab ${instrTab === 'ceipal' ? 'active' : ''}`}
                    onClick={() => setInstrTab('ceipal')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    CEIPAL Steps
                  </button>
                </div>

                {/* Step Cards */}
                <div className="sig-gen__steps-grid">
                  {(instrTab === 'outlook' ? OUTLOOK_STEPS : CEIPAL_STEPS).map((step, index) => (
                    <motion.div
                      key={`${instrTab}-${step.step}`}
                      className="sig-gen__step-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                    >
                      <div className="sig-gen__step-number">{step.step}</div>
                      <div className="sig-gen__step-icon-wrap">
                        {SIG_STEP_ICONS[step.icon]}
                      </div>
                      <h4 className="sig-gen__step-title">{step.title}</h4>
                      <p className="sig-gen__step-desc">{step.description}</p>
                      {/* Image placeholder — images at: {step.imagePath} */}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="sig-gen__grid">
          {/* Left: Input Form */}
          <motion.div
            className="sig-gen__form card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="sig-gen__section-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Your Details
            </h3>

            <div className="sig-gen__input-group">
              <div className="input-field">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                  required
                />
              </div>

              <div className="input-field">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>

              <div className="input-field">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., (123) 456-7890"
                  required
                />
              </div>

              <div className="input-field">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g., john.doe@vdart.com"
                  required
                />
              </div>

              <div className="input-field">
                <label htmlFor="linkedin">LinkedIn URL (Optional)</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="sig-gen__actions">
               <button
                 type="button"
                 className="btn btn-primary sig-gen__generate-btn"
                 onClick={handleGenerate}
                 disabled={!isFormFilled}
               >
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <polyline points="20 6 9 17 4 12" />
                 </svg>
                 Generate Signature
               </button>
               {isGenerated && (
                 <button 
                   className="btn btn-secondary" 
                   onClick={handleReset} 
                   type="button" 
                   style={{ marginLeft: '10px' }}
                 >
                   Start Over
                 </button>
               )}
            </div>
          </motion.div>

          {/* Right: Preview */}
          <motion.div
            className="sig-gen__preview-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="sig-gen__tabs">
              <button
                type="button"
                className={`sig-gen__tab ${activeTab === 'outlook' ? 'active' : ''}`}
                onClick={() => setActiveTab('outlook')}
              >
                Outlook / Webmail
              </button>
              <button
                type="button"
                className={`sig-gen__tab ${activeTab === 'ceipal' ? 'active' : ''}`}
                onClick={() => setActiveTab('ceipal')}
              >
                CEIPAL (Raw HTML)
              </button>
            </div>

            <div className="sig-gen__preview-card card">
              <div className="sig-gen__preview-header">
                <h3>Preview</h3>
                {isComplete && (
                  <CopyButton 
                    text="Signature" 
                    onCopy={copyToClipboard}
                    className="sig-gen__copy-btn"
                  />
                )}
              </div>

              <div className="sig-gen__preview-content">
                {!isComplete ? (
                  <div className="sig-gen__empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-4">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    <p>Fill out the required fields to generate your signature</p>
                  </div>
                ) : (
                  <div className="sig-gen__rendered-container">
                    <div className="sig-gen__rendered" ref={previewRef}>
                      {activeTab === 'outlook' ? (
                        // OUTLOOK SIGNATURE
                        <div style={{ fontFamily: "'Montserrat', Arial, sans-serif", fontSize: "12px", color: "#000000", lineHeight: 1.2, maxWidth: "600px", margin: 0, padding: 0, border: "none" }}>
                          <table cellPadding="0" cellSpacing="0" style={{ width: "330px", borderCollapse: "collapse", margin: 0, padding: 0 }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: 0, border: "none" }}>
                                  <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody>
                                      <tr>
                                        <td width="80" valign="top" style={{ paddingRight: "20px", border: "none" }}>
                                          <a href="https://www.vdart.com" target="_blank" rel="noreferrer" style={{ border: "none", textDecoration: "none" }}>
                                            <img src={config.logo} alt={entity.title} width="90" style={{ display: "block", maxWidth: "110px", height: "auto", border: "none" }} />
                                          </a>
                                        </td>
                                        <td valign="top" style={{ border: "none" }}>
                                          <div style={{ color: config.color, fontSize: "13.33px", fontWeight: "bold", marginBottom: "3px", fontFamily: "'Montserrat', Arial, sans-serif" }}>{formData.name}</div>
                                          <div style={{ color: "#000000", fontSize: "10.67px", marginBottom: "6px", fontFamily: "'Montserrat', Arial, sans-serif" }}>{formData.title}</div>
                                          <div style={{ fontSize: "10.67px", marginBottom: "3px", fontFamily: "'Montserrat', Arial, sans-serif" }}><span style={{ fontWeight: "bold", border: "none", fontFamily: "'Montserrat', Arial, sans-serif" }}>P:</span> {formattedPhone}</div>
                                          <div style={{ fontSize: "10.67px", marginBottom: "6px", fontFamily: "'Montserrat', Arial, sans-serif" }}><span style={{ fontWeight: "bold", border: "none", fontFamily: "'Montserrat', Arial, sans-serif" }}>E:</span> <a href={`mailto:${formData.email}`} style={{ color: config.linkColor, textDecoration: "none", border: "none" }}>{formData.email}</a></div>
                                          <div style={{ marginBottom: "6px", border: "none" }}>
                                            {formData.linkedin && (
                                              <a href={formData.linkedin} style={{ display: "inline-block", textDecoration: "none", border: "none" }}>
                                                <img src={config.linkedinIcon} alt="LinkedIn" width="15" height="15" />
                                              </a>
                                            )}
                                          </div>
                                          <div>
                                            <a href="https://www.surveymonkey.com/r/Vsupport" style={{ color: "rgb(12, 12, 12)", textDecoration: "none", fontSize: "10.67px", fontWeight: "bold", fontStyle: "italic", border: "none", fontFamily: "'Montserrat', Arial, sans-serif" }}>Need help? Click for assistance</a>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ padding: "2px 0", border: "none" }}>
                                  <table cellPadding="0" cellSpacing="0" style={{ width: "330px", borderCollapse: "collapse", margin: 0 }}>
                                    <tbody>
                                      <tr>
                                        <td style={{ border: "none" }}>
                                          <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <tbody>
                                              <tr>
                                                <td style={{ padding: 0, margin: 0, height: "8px", lineHeight: "1px", border: "none" }}>
                                                  <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: "collapse" }}>
                                                    <tbody>
                                                      <tr>
                                                        <td bgcolor={config.color} style={{ height: "1px", lineHeight: "1px", padding: 0, margin: 0, fontSize: "1px", border: "none" }}></td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style={{ padding: "2px 0 0 0", border: "none" }}>
                                          <img src={config.banner} alt="Banner" width="330" style={{ display: "block", border: "none" }} />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingTop: "8px", border: "none" }}>
                                  <p style={{ margin: 0, fontSize: "8px", color: "#A9A9A9", lineHeight: 1.3, border: "none", fontFamily: "'Montserrat', Arial, sans-serif" }}>
                                    The content of this email is confidential and intended for the recipient specified in the message only. It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingBottom: "8px", paddingTop: "8px", border: "none", textAlign: "center", borderCollapse: "collapse" }}>
                                  <a href={config.unsubscribe} style={{ color: config.linkColor, textDecoration: "none", fontSize: "10px", border: "none", borderCollapse: "collapse" }}>Unsubscribe</a>
                                  <span style={{ color: "#666666", fontSize: "10px", fontFamily: "'Montserrat', Arial, sans-serif" }}> | </span>
                                  <a href={config.about} style={{ color: config.linkColor, textDecoration: "none", fontSize: "10px", border: "none", borderCollapse: "collapse" }}>Want to know more About Us?</a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        // CEIPAL SIGNATURE
                        <div style={{ fontFamily: "'Montserrat', Arial, sans-serif !important", fontSize: "12px !important", color: "#000000 !important", lineHeight: "1.2 !important", maxWidth: "600px !important", margin: "0 !important", padding: "0 !important" }}>
                          <table cellPadding="0" cellSpacing="0" border="0" style={{ width: "330px !important", borderCollapse: "collapse !important" }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: "0 !important", border: "none !important" }}>
                                  <table cellPadding="0" cellSpacing="0" border="0" style={{ width: "100% !important", borderCollapse: "collapse !important" }}>
                                    <tbody>
                                      <tr>
                                        <td width="80" valign="top" style={{ paddingRight: "20px", border: "none !important" }}>
                                          <a href="https://www.vdart.com" target="_blank" rel="noreferrer" style={{ border: "none", textDecoration: "none" }}>
                                            <img src={config.logo} alt={entity.title} width="90" style={{ display: "block", maxWidth: "110px", height: "auto", border: "none" }} />
                                          </a>
                                        </td>
                                        <td valign="top" style={{ border: "none !important" }}>
                                          <div style={{ color: `${config.color} !important`, fontSize: "13.33px !important", fontWeight: "bold !important", marginBottom: "3px !important", fontFamily: "'Montserrat', Arial, sans-serif !important" }}>{formData.name}</div>
                                          <div style={{ color: "#000000 !important", fontSize: "10.67px !important", marginBottom: "6px !important", fontFamily: "'Montserrat', Arial, sans-serif !important" }}>{formData.title}</div>
                                          <div style={{ fontSize: "10.67px !important", marginBottom: "3px !important", fontFamily: "'Montserrat', Arial, sans-serif !important" }}><span style={{ fontWeight: "bold", fontFamily: "'Montserrat', Arial, sans-serif !important" }}>P:</span> {formattedPhone}</div>
                                          <div style={{ fontSize: "10.67px !important", marginBottom: "6px !important", fontFamily: "'Montserrat', Arial, sans-serif !important" }}><span style={{ fontWeight: "bold", fontFamily: "'Montserrat', Arial, sans-serif !important" }}>E:</span> <a href={`mailto:${formData.email}`} style={{ color: `${config.linkColor} !important`, textDecoration: "none !important" }}>{formData.email}</a></div>
                                          <div style={{ marginBottom: "6px !important" }}>
                                            {formData.linkedin && (
                                              <a href={formData.linkedin} style={{ display: "inline-block !important", textDecoration: "none !important" }}>
                                                <img src={config.linkedinIcon} alt="LinkedIn" width="18" height="15" />
                                              </a>
                                            )}
                                          </div>
                                          <div>
                                            <a href="https://www.surveymonkey.com/r/Vsupport" style={{ color: "rgb(11, 11, 11) !important", textDecoration: "none !important", fontSize: "10px !important", fontWeight: "bold !important", fontStyle: "italic !important", fontFamily: "'Montserrat', Arial, sans-serif !important" }}>Need help? Click for assistance</a>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ padding: "2px 0", border: "none" }}>
                                  <table cellPadding="0" cellSpacing="0" style={{ width: "330px", borderCollapse: "collapse", margin: 0 }}>
                                    <tbody>
                                      <tr>
                                        <td style={{ border: "none" }}>
                                          <table cellPadding="0" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <tbody>
                                              <tr>
                                                <td style={{ padding: 0, margin: 0, height: "8px", lineHeight: "1px", border: "none" }}>
                                                  <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: "collapse" }}>
                                                    <tbody>
                                                      <tr>
                                                        <td bgcolor={config.color} style={{ height: "1px", lineHeight: "1px", padding: 0, margin: 0, fontSize: "1px", border: "none" }}></td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style={{ padding: "2px 0 0 0", border: "none" }}>
                                          <img src={config.banner} alt="Banner" width="330" style={{ display: "block", border: "none" }} />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingTop: "8px", border: "none !important", textAlign: "center" }}>
                                  <a href={config.unsubscribe} style={{ color: `${config.linkColor} !important`, textDecoration: "none !important", fontSize: "10px !important", fontFamily: "'Montserrat', Arial, sans-serif !important" }}>Unsubscribe</a>
                                  <span style={{ color: "#666666 !important", fontSize: "10px !important", fontFamily: "'Montserrat', Arial, sans-serif !important" }}> | </span>
                                  <a href={config.about} style={{ color: `${config.linkColor} !important`, textDecoration: "none !important", fontSize: "10px !important", fontFamily: "'Montserrat', Arial, sans-serif !important" }}>Want to know more About Us?</a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {activeTab === 'ceipal' && isComplete && (
              <div className="sig-gen__ceipal-note">
                <p>Clicking "Copy HTML Code" will copy the raw HTML source, which you can paste directly into CEIPAL's signature settings.</p>
              </div>
            )}
            {activeTab === 'outlook' && isComplete && (
              <div className="sig-gen__ceipal-note">
                <p>Clicking "Copy Signature" will copy the rich text. You can paste it directly into Outlook or Webmail.</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* ── CTA Banner ── */}
      <div className="sig-gen__cta-banner">
        <div className="sig-gen__cta-inner">
          <div className="sig-gen__cta-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="sig-gen__cta-text">
            <span className="sig-gen__cta-question">Need help setting up your email signature?</span>
            <span className="sig-gen__cta-hint">Follow our step-by-step guides for Outlook and CEIPAL</span>
          </div>
          <button
            className="sig-gen__cta-action"
            onClick={() => {
              setShowInstructions(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            type="button"
          >
            View Instructions
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
