// i18n setup for web - mirrors src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const translations = {
  en: {
    translation: {
      appName: 'SaathiCircle',
      tagline: 'You are not alone.',
      greeting: 'Namaste, You are safe here.',
      common: { ok: 'OK', cancel: 'Cancel', back: 'Back', loading: 'Loading...', save: 'Save', submit: 'Submit', edit: 'Edit', delete: 'Delete', confirm: 'Confirm', close: 'Close' },
      login: {
        appName: 'SaathiCircle',
        tagline: 'You are not alone.',
        title: 'Welcome Back',
        emailLabel: 'Email Address',
        emailPlaceholder: 'your@email.com',
        phoneLabel: 'Phone Number',
        phonePlaceholder: '10-digit number',
        sendOtp: 'Send OTP',
        enterOtp: 'Enter OTP',
        otpPlaceholder: '6-digit OTP',
        verify: 'Verify & Sign In',
        resendOtp: 'Resend OTP',
        changeContact: 'Change Details',
        otpSentTo: 'OTP sent to {{email}}',
        invalidEmail: 'Invalid Email',
        enterValidEmail: 'Please enter a valid email address.',
        invalidPhone: 'Invalid Phone',
        enterValidPhone: 'Please enter a valid 10-digit phone number.',
        terms: 'By continuing, you agree to our Terms of Service and Privacy Policy.',
        demoMode: 'Demo Mode',
        loginAsElderly: 'Login as Senior',
        loginAsCaregiver: 'Login as Caregiver',
        loginAsAdmin: 'Login as Admin',
        loginAsNGO: 'Login as NGO',
      },
      register: { title: 'Join SaathiCircle', subtitle: 'Create your account', name: 'Your Name', phone: 'Phone Number', age: 'Your Age', city: 'City', createAccount: 'Create Account' },
      home: {
        greeting: 'Namaste',
        safeMessage: 'You are safe here.',
        moodQuestion: 'How are you feeling today?',
        talkToCompanion: '💬 Talk to a Companion',
        needHelp: '🤝 I Need Help',
        emergency: '🆘 Emergency / SOS',
        quickHelpTitle: 'Quick Help Available',
        quickHelpSubtitle: 'Tap to connect with a caregiver',
      },
      mood: { happy: 'Happy', okay: 'Okay', sad: 'Sad', voicePrompt: 'How are you feeling today?' },
      companion: { title: 'Finding Your Companion', foundMessage: 'We found someone you may enjoy talking to.', language: 'Language', interest: 'Shared Interest', available: 'Available Now', voiceCall: 'Voice Call', textChat: 'Text Chat' },
      help: { title: 'How Can We Help?', subtitle: 'Choose what you need help with', medical: 'Medical Help', emotional: 'Emotional Support', daily: 'Daily Assistance', tech: 'Tech Help', grocery: 'Grocery', transport: 'Transport' },
      sos: { title: 'EMERGENCY SOS', subtitle: 'Press and hold to activate', activated: 'SOS ACTIVATED', sending: 'Sending help...', sent: 'Help is on the way!', cancel: 'Cancel SOS', callEmergency: 'Call 112' },
      caregiver: { dashboard: 'Dashboard', requests: 'Help Requests', alerts: 'SOS Alerts', profile: 'My Profile', session: 'Active Session', noRequests: 'No pending requests' },
      admin: { dashboard: 'Dashboard', users: 'Users', volunteers: 'Volunteers', ngos: 'NGOs', incidents: 'Incidents', analytics: 'Analytics', notifications: 'Notifications', aiRisk: 'AI Risk', profile: 'Profile' },
      ngo: { dashboard: 'Dashboard', requests: 'Open Requests', volunteers: 'Volunteers', alerts: 'Emergency Alerts', cases: 'Case History', profile: 'NGO Profile' },
      chat: { placeholder: 'Type a message...', send: 'Send', voiceMode: 'Switch to Voice', textMode: 'Switch to Text', endSession: 'End Session', connecting: 'Connecting...', connected: 'Connected', waiting: 'Waiting for a companion...' },
      profile: { title: 'My Profile', personalInfo: 'Personal Info', healthInfo: 'Health Info', preferences: 'Preferences', emergencyContacts: 'Emergency Contacts', logout: 'Sign Out' },
    }
  },
  hi: {
    translation: {
      appName: 'साथीसर्कल',
      tagline: 'आप अकेले नहीं हैं।',
      greeting: 'नमस्ते, आप यहाँ सुरक्षित हैं।',
      common: { ok: 'ठीक है', cancel: 'रद्द करें', back: 'वापस', loading: 'लोड हो रहा है...', save: 'सहेजें', submit: 'जमा करें' },
      login: { appName: 'साथीसर्कल', tagline: 'आप अकेले नहीं हैं।', title: 'वापसी पर स्वागत है', emailLabel: 'ईमेल पता', emailPlaceholder: 'your@email.com', phoneLabel: 'फोन नंबर', phonePlaceholder: '10 अंकों का नंबर', sendOtp: 'OTP भेजें', enterOtp: 'OTP दर्ज करें', otpPlaceholder: '6 अंकों का OTP', verify: 'सत्यापित करें', resendOtp: 'OTP दोबारा भेजें', changeContact: 'विवरण बदलें', otpSentTo: '{{email}} पर OTP भेजा गया', terms: 'जारी रखकर, आप हमारी सेवा की शर्तों से सहमत हैं।' },
      home: { greeting: 'नमस्ते', safeMessage: 'आप यहाँ सुरक्षित हैं।', moodQuestion: 'आज आप कैसा महसूस कर रहे हैं?', talkToCompanion: '💬 साथी से बात करें', needHelp: '🤝 मुझे मदद चाहिए', emergency: '🆘 आपातकाल / SOS', quickHelpTitle: 'त्वरित सहायता उपलब्ध', quickHelpSubtitle: 'देखभालकर्ता से जुड़ने के लिए टैप करें' },
      mood: { happy: 'खुश', okay: 'ठीक', sad: 'उदास', voicePrompt: 'आज आप कैसा महसूस कर रहे हैं?' },
      sos: { title: 'आपातकालीन SOS', subtitle: 'सक्रिय करने के लिए दबाए रखें', activated: 'SOS सक्रिय', sending: 'मदद भेज रहे हैं...', sent: 'मदद रास्ते में है!', cancel: 'SOS रद्द करें', callEmergency: '112 पर कॉल करें' },
    }
  },
};

// Add more language stubs
const langCodes = ['bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa'];
langCodes.forEach(code => {
  translations[code] = { translation: { appName: 'SaathiCircle', tagline: 'You are not alone.' } };
});

i18n.use(initReactI18next).init({
  resources: translations,
  lng: localStorage.getItem('i18nLang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nLang', lng);
});

export default i18n;
