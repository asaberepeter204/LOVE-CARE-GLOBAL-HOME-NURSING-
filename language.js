// Love Care Global - Global Language System
// Include this file in EVERY page: <script src="language.js"></script>

const LCG_LANGUAGES = {
  "en-GH": { name: "English • Ghana (GHS)", code: "en", currency: "GHS", flag: "🇬🇭", lang: "en" },
  "en-NG": { name: "English • Nigeria (NGN)", code: "en", currency: "NGN", flag: "🇳🇬", lang: "en" },
  "en-KE": { name: "English • Kenya (KES)", code: "en", currency: "KES", flag: "🇰🇪", lang: "en" },
  "fr-CI": { name: "Français • Côte d'Ivoire (XOF)", code: "fr", currency: "XOF", flag: "🇨🇮", lang: "fr" },
  "en-ZA": { name: "English • South Africa (ZAR)", code: "en", currency: "ZAR", flag: "🇿🇦", lang: "en" },
  "en-US": { name: "English • USA (USD)", code: "en", currency: "USD", flag: "🇺🇸", lang: "en" }
};

const LCG_TRANSLATIONS = {
  en: {
    home: "Home", bookNurse: "Book Nurse", findNurse: "Find Nurse",
    clientReg: "Client Registration", clientLogin: "Client Login", dashboard: "Dashboard",
    myBookings: "My Bookings", settings: "Settings", nurseReg: "Nurse Registration",
    nurseLogin: "Nurse Login", nurseDashboard: "Nurse Dashboard", groupChat: "Group Chat",
    sos: "Emergency SOS", contact: "Contact Support", about: "About", privacy: "Privacy & Terms",
    heroTitle: "Professional Home Nursing, Anytime ❤️",
    heroSub: "Trusted nurses • 13 services • Verified with CV, Certificate, Licence, Photo & ID",
    bookBtn: "📅 Book a Nurse", joinClient: "👤 Join as Client",
    forClients: "For Clients", forClientsDesc: "Register, set emergency contact & book verified nurses",
    forNurses: "For Nurses", forNursesDesc: "Upload CV, video, certificate, licence, photo, Ghana Card / Drivers",
    emergency: "Emergency?", emergencyDesc: "Tap SOS for immediate help & GPS sharing",
    trusted: "Trusted • Verified • 85% to Nurses • Secure"
  },
  fr: {
    home: "Accueil", bookNurse: "Réserver Infirmière", findNurse: "Trouver Infirmière",
    clientReg: "Inscription Client", clientLogin: "Connexion Client", dashboard: "Tableau de Bord",
    myBookings: "Mes Réservations", settings: "Paramètres", nurseReg: "Inscription Infirmière",
    nurseLogin: "Connexion Infirmière", nurseDashboard: "Tableau Infirmière", groupChat: "Chat de Groupe",
    sos: "SOS d'Urgence", contact: "Support Contact", about: "À Propos", privacy: "Confidentialité & Conditions",
    heroTitle: "Soins Infirmiers Professionnels à Domicile ❤️",
    heroSub: "Infirmières de confiance • 13 services • Vérifiées avec CV, Certificat, Licence, Photo & ID",
    bookBtn: "📅 Réserver une Infirmière", joinClient: "👤 Rejoindre comme Client",
    forClients: "Pour Clients", forClientsDesc: "Inscrivez-vous, définissez contact d'urgence et réservez des infirmières vérifiées",
    forNurses: "Pour Infirmières", forNursesDesc: "Téléchargez CV, vidéo, certificat, licence, photo, Carte Ghana / Permis",
    emergency: "Urgence?", emergencyDesc: "Appuyez sur SOS pour aide immédiate et partage GPS",
    trusted: "Fiable • Vérifié • 85% aux Infirmières • Sécurisé"
  }
};

function getCurrentLangConfig(){
  let saved = localStorage.getItem('app_language_key') || 'en-GH';
  return LCG_LANGUAGES[saved] || LCG_LANGUAGES['en-GH'];
}

function applyGlobalLanguage(){
  let config = getCurrentLangConfig();
  let t = LCG_TRANSLATIONS[config.lang] || LCG_TRANSLATIONS['en'];
  
  // Auto-translate elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    let key = el.getAttribute('data-i18n');
    if(t[key]) el.textContent = t[key];
  });

  // Update html lang attribute
  document.documentElement.lang = config.code;

  // Update currency display anywhere with data-currency
  document.querySelectorAll('[data-currency]').forEach(el=>{
    el.textContent = config.currency;
  });

  // Dispatch event for pages to listen
  window.dispatchEvent(new CustomEvent('lcgLanguageChanged', {detail: config}));
}

// Run on load for every page that includes this file
document.addEventListener('DOMContentLoaded', applyGlobalLanguage);
