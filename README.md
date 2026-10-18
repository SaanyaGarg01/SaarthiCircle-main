# 🧓 SaathiCircle - AI-Powered Senior Care Platform

<div align="center">

![SaathiCircle Logo](assets/icon.png)

**Connecting Seniors with Compassionate Care Through AI**

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2051-black.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange.svg)](https://firebase.google.com/)
[![Azure AI](https://img.shields.io/badge/Azure-AI%20Services-0078D4.svg)](https://azure.microsoft.com/en-us/products/ai-services)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [Demo](#-demo-credentials) • [Status](#-feature-status)

</div>

---

## 📖 Overview

**SaathiCircle** (साथी = Companion in Hindi) is a comprehensive mobile application designed to provide holistic care for elderly individuals in India. The platform connects seniors with volunteer caregivers, family members, and emergency services through an intuitive, accessibility-focused interface.

### 🎯 Problem Statement

India has 140+ million seniors, many living alone with:
- Limited access to immediate help
- Difficulty using complex technology
- Language barriers with English-only apps
- No dedicated platform connecting them with caring volunteers

### 💡 Our Solution

A trilingual (Hindi, English, Marathi), voice-enabled, large-UI mobile app that:
- Provides one-tap emergency SOS
- Connects seniors with verified volunteers
- Uses AI for mood tracking and risk detection
- Offers 24/7 companionship and assistance

---

## ✨ Features

### 👴 For Seniors (Elderly Users)
| Feature | Description | Status |
|---------|-------------|--------|
| 🆘 One-Tap SOS | Emergency alert to contacts & volunteers | ✅ Working |
| 🎤 Voice Help | Speak help requests in native language | ✅ Working |
| 😊 Mood Check-In | Daily emotional wellness tracking | ✅ Working |
| 👥 Companion Matching | AI-matched volunteer companions | ✅ Working |
| 📞 Emergency Contacts | Quick dial family/emergency numbers | ✅ Working |
| 🏥 Health Info | Store medical information | ✅ Working |
| 💬 Chat Support | Real-time chat with volunteers | 🔶 UI Ready |

### 🤝 For Volunteers (Caregivers)
| Feature | Description | Status |
|---------|-------------|--------|
| 📋 Dashboard | View assigned seniors & requests | ✅ Working |
| 📞 Call/Chat/Location | Contact seniors directly | ✅ Working |
| 🚨 SOS Alerts | Receive emergency notifications | ✅ Working |
| ⬆️ Escalate to Admin | Report critical situations | ✅ Working |
| 👤 Profile Management | Update availability & skills | ✅ Working |

### 👨‍💼 For Admins
| Feature | Description | Status |
|---------|-------------|--------|
| ✅ Volunteer Approval | Approve/reject volunteer applications | ✅ Working |
| 📊 Analytics Dashboard | View platform statistics | ✅ Working |
| 🔔 Notifications | System-wide alerts & updates | ✅ Working |
| 🤖 AI Risk Dashboard | AI-powered risk predictions | 🔶 UI Ready |
| 📋 Incident Management | Track and resolve incidents | 🔶 UI Ready |

---

## 🏗 Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SAATHICIRCLE ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   👴 Senior     │  │   🤝 Volunteer  │  │   👨‍💼 Admin     │             │
│  │   Mobile App    │  │   Mobile App    │  │   Mobile App    │             │
│  │                 │  │                 │  │                 │             │
│  │ • Large UI      │  │ • Dashboard     │  │ • Approvals     │             │
│  │ • Voice Input   │  │ • Call/Chat     │  │ • Analytics     │             │
│  │ • SOS Button    │  │ • Location      │  │ • Management    │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
└───────────┼────────────────────┼────────────────────┼───────────────────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     React Native +      │
                    │     Expo Framework      │
                    │     (Cross-Platform)    │
                    └────────────┬────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────────┐
│                         SERVICE LAYER                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Firebase   │  │  Azure AI    │  │   Expo       │  │   Native     │    │
│  │   Firestore  │  │  Services    │  │   Services   │  │   APIs       │    │
│  │              │  │              │  │              │  │              │    │
│  │ • Users      │  │ • Speech     │  │ • Push       │  │ • Phone      │    │
│  │ • Requests   │  │ • OpenAI     │  │ • Location   │  │ • Maps       │    │
│  │ • SOS Alerts │  │ • Language   │  │ • Storage    │  │ • SMS        │    │
│  │ • Analytics  │  │ • Anomaly    │  │              │  │ • WhatsApp   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### User Flow Diagrams

#### 🔐 Authentication Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Splash    │────▶│  Language   │────▶│   Login     │────▶│  Role-Based │
│   Screen    │     │  Selection  │     │  (Phone+OTP)│     │  Navigator  │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                    ┌───────────────────────────────────────────────┤
                    │                    │                          │
                    ▼                    ▼                          ▼
            ┌─────────────┐      ┌─────────────┐            ┌─────────────┐
            │   Elderly   │      │  Caregiver  │            │    Admin    │
            │  Navigator  │      │  Navigator  │            │  Navigator  │
            └─────────────┘      └─────────────┘            └─────────────┘
```

#### 🆘 SOS Emergency Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Senior     │────▶│  SOS Button │────▶│  Firebase   │────▶│  Volunteer  │
│  Triggers   │     │  Pressed    │     │  Alert      │     │  Notified   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                    ┌───────────────────────────────────────────────┘
                    │
                    ▼
            ┌─────────────────────────────────────────────────────────┐
            │                    RESPONSE OPTIONS                      │
            │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
            │  │   Call   │  │   Chat   │  │ Location │  │ Escalate │ │
            │  │  Senior  │  │  Senior  │  │   View   │  │ to Admin │ │
            │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
            └─────────────────────────────────────────────────────────┘
```

#### 📱 Help Request Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Senior     │────▶│   Select    │────▶│  Processing │────▶│  Volunteer  │
│  Home       │     │  Category   │     │  (AI Match) │     │  Assigned   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
      │                                                             │
      │ Voice Help Alternative                                      │
      ▼                                                             ▼
┌─────────────┐     ┌─────────────┐                         ┌─────────────┐
│   Voice     │────▶│  Speech to  │                         │   Status    │
│   Input     │     │    Text     │                         │   Updates   │
└─────────────┘     └─────────────┘                         └─────────────┘
```

### Navigation Structure

```
App.js
│
├── AuthNavigator (Not Logged In)
│   ├── SplashScreen
│   ├── LanguageSelectionScreen
│   ├── LoginScreen
│   └── RegisterScreen (3 Onboarding Steps)
│
├── ElderlyNavigator (Role: elderly)
│   ├── HomeScreen (Main Hub)
│   ├── HelpCategoriesScreen
│   ├── VoiceHelpInputScreen
│   ├── HelpProcessingScreen
│   ├── HelpStatusScreen
│   ├── MoodCheckInScreen
│   ├── CompanionMatchingScreen
│   ├── SOSScreen
│   ├── ChatScreen
│   └── ProfileScreen
│       ├── PersonalInfoScreen
│       ├── EmergencyContactsScreen
│       ├── HealthInfoScreen
│       └── PreferencesScreen
│
├── CaregiverNavigator (Role: volunteer)
│   ├── CaregiverDashboard
│   ├── CaregiverInteractionScreen
│   ├── SOSAlertsScreen
│   └── VolunteerProfileScreen
│
└── AdminNavigator (Role: admin)
    ├── AdminHomeScreen
    ├── VolunteerApprovalScreen
    ├── AnalyticsScreen
    ├── AIRiskDashboardScreen
    ├── IncidentManagementScreen
    ├── AdminNotificationsScreen
    └── AdminProfileScreen
```

---

## 📊 Feature Status Legend

| Status | Meaning |
|--------|---------|
| ✅ **Working** | Fully functional with real data |
| 🔶 **UI Ready** | UI complete, uses dummy/mock data |
| 🔧 **Partial** | Some features working |
| 📋 **Planned** | In development roadmap |

### Detailed Feature Breakdown

#### ✅ Fully Working Features

1. **Authentication System**
   - Phone number login with OTP (Demo: 123456)
   - Role-based routing (elderly/volunteer/admin)
   - AsyncStorage persistence
   - Firebase user registration

2. **Senior Features**
   - Home screen with all navigation cards
   - Help categories selection
   - Voice input for help requests
   - Mood check-in with emoji selection
   - SOS emergency trigger
   - Emergency contacts management
   - Profile editing

3. **Volunteer Features**
   - Dashboard with help requests
   - Call seniors (opens phone dialer)
   - Chat options (WhatsApp/SMS)
   - View senior location (Google Maps)
   - Escalate to admin with reasons
   - Accept/Complete help requests

4. **Admin Features**
   - Dashboard with statistics
   - Volunteer approval/rejection
   - Notification management
   - Profile settings

#### 🔶 UI Ready (Dummy Data)

1. **AI Risk Dashboard** - UI complete, shows sample risk predictions
2. **Incident Management** - UI complete, shows sample incidents
3. **Analytics Dashboard** - UI complete, shows sample charts
4. **Chat Screen** - UI complete, no real-time messaging
5. **Companion Matching** - UI complete, shows sample matches

#### 📋 Azure AI Integration Points (Planned)

| Service | Use Case | Status |
|---------|----------|--------|
| Azure Speech Services | Voice-to-text for help requests | 📋 Planned |
| Azure OpenAI | Companion matching, risk analysis | 📋 Planned |
| Azure Language | Sentiment analysis of mood check-ins | 📋 Planned |
| Azure Anomaly Detector | Unusual pattern detection | 📋 Planned |
| Azure Communication | Push notifications, SMS alerts | 📋 Planned |
| Azure Health Insights | Health data analysis | 📋 Planned |
| Azure Maps | Location services | 📋 Planned |

---

## 🛠 Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo SDK 51** - Development and build tooling
- **React Navigation 6** - Navigation library
- **AsyncStorage** - Local data persistence

### Backend & Database
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Auth** - Authentication (configured)

### AI & Cloud Services (Planned)
- **Microsoft Azure AI Services**
  - Speech Services
  - OpenAI Service
  - Language Service
  - Anomaly Detector

### Development Tools
- **EAS Build** - Cloud builds for APK/AAB
- **VS Code** - IDE
- **Git** - Version control

---

## 📱 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Android Studio (for emulator) or physical device

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/deepak-158/SaarthiCircle.git

# Navigate to project directory
cd SaarthiCircle

# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS (Mac only)
npx expo start --ios
```

### Build APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build -p android --profile preview
```

---

## 🔑 Demo Credentials

### Test Accounts

| Role | Phone Number | OTP |
|------|--------------|-----|
| Senior | Any 10-digit number | 123456 |
| Volunteer | Any 10-digit number | 123456 |
| Admin | +919876543210 | 123456 |

### Role Selection
After OTP verification, select your role:
- **"I need help"** → Senior/Elderly flow
- **"I want to volunteer"** → Volunteer/Caregiver flow
- Admin is auto-detected for the admin phone number

---

## 📁 Project Structure

```
SaathiCircle/
├── App.js                 # Root component with navigation
├── app.json               # Expo configuration
├── eas.json               # EAS Build configuration
├── package.json           # Dependencies
│
├── assets/                # Images, icons, fonts
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
│
└── src/
    ├── components/        # Reusable UI components
    │   └── common/
    │       ├── AccessibleInput.js   # Large, accessible text input
    │       ├── LargeButton.js       # Touch-friendly button
    │       ├── LargeCard.js         # Accessible card component
    │       ├── MoodSelector.js      # Emoji mood picker
    │       └── VoiceButton.js       # Voice input button
    │
    ├── config/            # Configuration files
    │   ├── azure.js       # Azure AI service config
    │   ├── firebase.js    # Firebase config + helpers
    │   └── supabase.js    # Supabase config (backup)
    │
    ├── i18n/              # Internationalization
    │   └── translations.js # Hindi, English, Marathi strings
    │
    ├── navigation/        # Navigation configuration
    │   ├── index.js       # Root navigator
    │   ├── AuthNavigator.js
    │   ├── ElderlyNavigator.js
    │   ├── CaregiverNavigator.js
    │   └── AdminNavigator.js
    │
    ├── screens/           # Screen components
    │   ├── auth/          # Authentication screens
    │   ├── elderly/       # Senior user screens
    │   ├── caregiver/     # Volunteer screens
    │   └── admin/         # Admin screens
    │
    ├── services/          # Business logic
    │   ├── aiService.js   # AI/ML integrations
    │   ├── databaseService.js
    │   └── speechService.js
    │
    └── theme/             # Styling
        └── index.js       # Colors, fonts, spacing
```

---

## 🔥 Firebase Collections

```
firestore/
├── users/
│   └── {phone}/
│       ├── phone: string
│       ├── role: 'elderly' | 'volunteer' | 'admin'
│       ├── name: string
│       ├── language: 'hi' | 'en' | 'mr'
│       ├── status: 'pending' | 'approved' | 'active'
│       └── createdAt: timestamp
│
├── helpRequests/
│   └── {requestId}/
│       ├── seniorId: string
│       ├── seniorName: string
│       ├── type: string
│       ├── description: string
│       ├── status: 'pending' | 'assigned' | 'in_progress' | 'completed'
│       ├── volunteerId: string (optional)
│       └── createdAt: timestamp
│
├── sosAlerts/
│   └── {alertId}/
│       ├── seniorId: string
│       ├── seniorName: string
│       ├── location: geopoint
│       ├── status: 'active' | 'resolved'
│       └── createdAt: timestamp
│
└── moodCheckins/
    └── {checkinId}/
        ├── userId: string
        ├── mood: 'great' | 'good' | 'okay' | 'sad' | 'anxious'
        ├── notes: string
        └── timestamp: timestamp
```

---

## 🌐 Supported Languages

| Language | Code | Status |
|----------|------|--------|
| English | en | ✅ Complete |
| Hindi | hi | ✅ Complete |
| Marathi | mr | ✅ Complete |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Deepak Shukla**
- GitHub: [@deepak-158](https://github.com/deepak-158)

---

## 🙏 Acknowledgments

- React Native community
- Expo team
- Firebase team
- Microsoft Azure AI team
- All volunteers who support senior care

---

<div align="center">

**Made with ❤️ for India's Seniors**

*"साथी" means companion - because no senior should feel alone*

</div>
