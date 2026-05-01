"""
Multilingual Support Manager
Provides translations for Hindi, English, Marathi, Gujarati, Punjabi, Tamil, Telugu, Kannada, Urdu, Bengali
"""

class MultilingualManager:
    """Handles translations and language management"""
    
    def __init__(self):
        self.translations = {
            'en': {
                # Navigation
                'nav.dashboard': 'Dashboard',
                'nav.symptoms': 'Symptoms',
                'nav.doctors': 'Find Doctors',
                'nav.medicines': 'Find Medicines',
                'nav.blood': 'Blood Bank',
                'nav.reports': 'Reports',
                'nav.appointments': 'Appointments',
                'nav.profile': 'Profile',
                
                # Symptom Assessment
                'symptom.title': 'Symptom Assessment',
                'symptom.describe': 'Tell me about your symptoms',
                'symptom.question.duration': 'How long have you been experiencing this?',
                'symptom.question.severity': 'Rate the severity (1-10)',
                'symptom.question.pattern': 'Is it constant or intermittent?',
                'symptom.question.recent': 'Is this a new symptom?',
                'symptom.question.medication': 'Are you taking any medication?',
                'symptom.next': 'Next',
                'symptom.previous': 'Previous',
                'symptom.submit': 'Analyze',
                
                # Diagnosis
                'diagnosis.title': 'Diagnostic Results',
                'diagnosis.confidence': 'Confidence',
                'diagnosis.urgency': 'Urgency Level',
                'diagnosis.description': 'Description',
                'diagnosis.urgent': 'URGENT - Seek medical attention',
                'diagnosis.moderate': 'Moderate - Schedule appointment',
                'diagnosis.nonurgent': 'Non-Urgent - Regular checkup',
                'diagnosis.emergency': 'EMERGENCY - Call ambulance',
                
                # Doctor Recommendation
                'doctor.title': 'Recommended Doctors',
                'doctor.rating': 'Rating',
                'doctor.experience': 'Experience',
                'doctor.fees': 'Consultation Fee',
                'doctor.hospital': 'Hospital',
                'doctor.location': 'Location',
                'doctor.available': 'Available From',
                'doctor.book': 'Book Appointment',
                'doctor.languages': 'Languages',
                
                # Appointment
                'appointment.title': 'Book Appointment',
                'appointment.date': 'Select Date',
                'appointment.time': 'Select Time',
                'appointment.confirm': 'Confirm Booking',
                'appointment.confirmed': 'Appointment Confirmed!',
                'appointment.id': 'Appointment ID',
                'appointment.cancel': 'Cancel Appointment',
                
                # Medicines
                'medicine.title': 'Find Medicines',
                'medicine.search': 'Search Medicines',
                'medicine.generic': 'Generic Name',
                'medicine.brand': 'Brand Names',
                'medicine.dosage': 'Dosage',
                'medicine.price': 'Price',
                'medicine.availability': 'Availability',
                'medicine.pharmacy': 'Pharmacy',
                'medicine.instock': 'In Stock',
                'medicine.order': 'Order Now',
                'medicine.delivery': 'Home Delivery',
                
                # Blood Bank
                'blood.title': 'Blood Bank',
                'blood.bloodtype': 'Blood Type',
                'blood.available': 'Available Units',
                'blood.bank': 'Blood Bank',
                'blood.contact': 'Contact',
                'blood.emergency': 'Emergency 24/7',
                'blood.reserve': 'Reserve Blood',
                'blood.reserved': 'Blood Reserved Successfully',
                
                # General
                'general.loading': 'Loading...',
                'general.error': 'Error occurred',
                'general.success': 'Success!',
                'general.cancel': 'Cancel',
                'general.save': 'Save',
                'general.continue': 'Continue',
                'general.language': 'Language',
                'general.callambulance': 'Call Ambulance',
                'general.emergency': 'Emergency',
            },
            
            'hi': {
                # Navigation
                'nav.dashboard': 'डैशबोर्ड',
                'nav.symptoms': 'लक्षण',
                'nav.doctors': 'डॉक्टर खोजें',
                'nav.medicines': 'दवाएं खोजें',
                'nav.blood': 'रक्त बैंक',
                'nav.reports': 'रिपोर्ट',
                'nav.appointments': 'अपॉइंटमेंट',
                'nav.profile': 'प्रोफाइल',
                
                # Symptom Assessment
                'symptom.title': 'लक्षण मूल्यांकन',
                'symptom.describe': 'अपने लक्षणों के बारे में बताएं',
                'symptom.question.duration': 'आप कितने समय से इसका अनुभव कर रहे हैं?',
                'symptom.question.severity': 'गंभीरता दर करें (1-10)',
                'symptom.question.pattern': 'क्या यह लगातार है या कभी-कभी?',
                'symptom.question.recent': 'क्या यह एक नया लक्षण है?',
                'symptom.question.medication': 'क्या आप कोई दवा ले रहे हैं?',
                'symptom.next': 'अगला',
                'symptom.previous': 'पिछला',
                'symptom.submit': 'विश्लेषण करें',
                
                # Diagnosis
                'diagnosis.title': 'निदान परिणाम',
                'diagnosis.confidence': 'आत्मविश्वास',
                'diagnosis.urgency': 'आपातकाल स्तर',
                'diagnosis.description': 'विवरण',
                'diagnosis.urgent': 'जरूरी - चिकित्सा सहायता लें',
                'diagnosis.moderate': 'मध्यम - अपॉइंटमेंट शेड्यूल करें',
                'diagnosis.nonurgent': 'गैर-आपातकालीन - नियमित जांच',
                'diagnosis.emergency': 'आपातकाल - एम्बुलेंस बुलाएं',
                
                # Doctor Recommendation
                'doctor.title': 'अनुशंसित डॉक्टर',
                'doctor.rating': 'रेटिंग',
                'doctor.experience': 'अनुभव',
                'doctor.fees': 'परामर्श शुल्क',
                'doctor.hospital': 'अस्पताल',
                'doctor.location': 'स्थान',
                'doctor.available': 'उपलब्ध',
                'doctor.book': 'अपॉइंटमेंट बुक करें',
                'doctor.languages': 'भाषाएं',
                
                # Appointment
                'appointment.title': 'अपॉइंटमेंट बुक करें',
                'appointment.date': 'तारीख चुनें',
                'appointment.time': 'समय चुनें',
                'appointment.confirm': 'बुकिंग की पुष्टि करें',
                'appointment.confirmed': 'अपॉइंटमेंट की पुष्टि हुई!',
                'appointment.id': 'अपॉइंटमेंट ID',
                'appointment.cancel': 'अपॉइंटमेंट रद्द करें',
                
                # Medicines
                'medicine.title': 'दवाएं खोजें',
                'medicine.search': 'दवाएं खोजें',
                'medicine.generic': 'जेनेरिक नाम',
                'medicine.brand': 'ब्रांड नाम',
                'medicine.dosage': 'खुराक',
                'medicine.price': 'कीमत',
                'medicine.availability': 'उपलब्धता',
                'medicine.pharmacy': 'फार्मेसी',
                'medicine.instock': 'स्टॉक में है',
                'medicine.order': 'अभी ऑर्डर करें',
                'medicine.delivery': 'होम डिलीवरी',
                
                # Blood Bank
                'blood.title': 'रक्त बैंक',
                'blood.bloodtype': 'रक्त का प्रकार',
                'blood.available': 'उपलब्ध इकाइयां',
                'blood.bank': 'रक्त बैंक',
                'blood.contact': 'संपर्क',
                'blood.emergency': 'आपातकाल 24/7',
                'blood.reserve': 'रक्त आरक्षित करें',
                'blood.reserved': 'रक्त सफलतापूर्वक आरक्षित',
                
                # General
                'general.loading': 'लोड हो रहा है...',
                'general.error': 'त्रुटि हुई',
                'general.success': 'सफलता!',
                'general.cancel': 'रद्द करें',
                'general.save': 'सहेजें',
                'general.continue': 'जारी रखें',
                'general.language': 'भाषा',
                'general.callambulance': 'एम्बुलेंस बुलाएं',
                'general.emergency': 'आपातकाल',
            },
            
            'mr': {
                'nav.dashboard': 'डॅशबोर्ड',
                'nav.symptoms': 'लक्षणे',
                'nav.doctors': 'डॉक्टर शोधा',
                'nav.medicines': 'औषधे शोधा',
                'nav.blood': 'रक्त बँक',
                'nav.appointments': 'नियुक्ती',
                
                'symptom.title': 'लक्षण मूल्यांकन',
                'symptom.describe': 'तुमच्या लक्षणांबद्दल सांगा',
                'symptom.question.duration': 'तुम्ही हे किती काळापासून अनुभवत आहात?',
                'symptom.question.severity': 'गंभीरता रेट करा (1-10)',
                'symptom.submit': 'विश्लेषण करा',
                
                'diagnosis.title': 'निदान परिणाम',
                'diagnosis.urgent': 'जरुरी - वैद्यकीय मदत घ्या',
                'diagnosis.emergency': 'आपात - अँबुलन्स बोला',
                
                'doctor.title': 'शिफारस केलेले डॉक्टर',
                'doctor.book': 'नियुक्ती बुक करा',
                
                'medicine.title': 'औषधे शोधा',
                'medicine.order': 'आता ऑर्डर करा',
                
                'blood.title': 'रक्त बँक',
                'blood.reserve': 'रक्त राखीव करा',
                
                'general.language': 'भाषा',
                'general.emergency': 'आपात',
            },
            
            'gu': {
                'nav.dashboard': 'ડેશબોર્ડ',
                'nav.symptoms': 'લક્ષણો',
                'nav.doctors': 'ડોક્ટરો શોધો',
                'nav.medicines': 'દવાઓ શોધો',
                'nav.blood': 'રક્ત બેંક',
                
                'symptom.title': 'લક્ષણ મૂલ્યાંકન',
                'symptom.describe': 'તમારા લક્ષણો વિશે કહો',
                'symptom.submit': 'વિશ્લેષણ કરો',
                
                'diagnosis.title': 'નિદાન પરિણામો',
                'diagnosis.urgent': 'તાત્કાલિક - તબીબી મદદ લો',
                
                'doctor.title': 'ભલામણ આપવામાં આવેલ ડોક્ટરો',
                'doctor.book': 'મુલાકાત બુક કરો',
                
                'medicine.title': 'દવાઓ શોધો',
                'blood.title': 'રક્ત બેંક',
                
                'general.language': 'ભાષા',
                'general.emergency': 'તાત્કાલિક',
            },
            
            'pa': {
                'nav.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
                'nav.symptoms': 'ਲੱਛਣ',
                'nav.doctors': 'ਡਾਕਟਰ ਲੱਭੋ',
                'nav.medicines': 'ਦਵਾਵਾਂ ਲੱਭੋ',
                'nav.blood': 'ਬਲੱਡ ਬੈਂਕ',
                
                'symptom.title': 'ਲੱਛਣ ਮੂਲਿਆਂਕਨ',
                'symptom.describe': 'ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਦੱਸੋ',
                'symptom.submit': 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
                
                'diagnosis.title': 'ਤਸ਼ਖੀਸ ਦੇ ਨਤੀਜੇ',
                'diagnosis.urgent': 'ਤਾਜ਼ - ਡਾਕਟਰੀ ਮਦਦ ਲਓ',
                
                'doctor.title': 'ਸਿਫਾਰਿਸ਼ ਸ਼ੁਦਾ ਡਾਕਟਰ',
                'doctor.book': 'ਮੁਲਾਕਾਤ ਬੁਕ ਕਰੋ',
                
                'medicine.title': 'ਦਵਾਵਾਂ ਲੱਭੋ',
                'blood.title': 'ਬਲੱਡ ਬੈਂਕ',
                
                'general.language': 'ਭਾਸ਼ਾ',
                'general.emergency': 'ਤਾਜ਼',
            },
            
            'ta': {
                'nav.dashboard': 'டேஷ்போர்ட்',
                'nav.symptoms': 'அறிகுறிகள்',
                'nav.doctors': 'மருத்துவர்களை கண்டறியவும்',
                'nav.medicines': 'மருந்துகளைக் கண்டறியவும்',
                'nav.blood': 'இரத்த வங்கி',
                
                'symptom.title': 'அறிகுறி மதிப்பீடு',
                'symptom.describe': 'உங்கள் அறிகுறிகளைப் பற்றி சொல்லுங்கள்',
                'symptom.submit': 'பகுப்பாய்வு செய்யவும்',
                
                'diagnosis.title': 'நோய் निदान முடிவுகள்',
                'diagnosis.urgent': 'அவசரம் - மருத்துவ உதவி பெறவும்',
                
                'doctor.title': 'பரிந்துரைக்கப்பட்ட மருத்துவர்கள்',
                'doctor.book': 'நியமனத்தை பதிவு செய்யவும்',
                
                'medicine.title': 'மருந்துகளைக் கண்டறியவும்',
                'blood.title': 'இரத்த வங்கி',
                
                'general.language': 'மொழி',
                'general.emergency': 'அவசரம்',
            },
            
            'te': {
                'nav.dashboard': 'డ్యాష్‌బోర్డ్',
                'nav.symptoms': 'లక్ష్యలు',
                'nav.doctors': 'డాక్టర్లను కనుగొనండి',
                'nav.medicines': 'మందులను కనుగొనండి',
                'nav.blood': 'రక్త బ్యాంకు',
                
                'symptom.title': 'సంకేత మూల్యాంకనం',
                'symptom.describe': 'మీ లక్ష్యల గురించి చెప్పండి',
                'symptom.submit': 'విశ్లేషించండి',
                
                'diagnosis.title': 'రోగ నిర్ధారణ ఫలితాలు',
                'diagnosis.urgent': 'వెంటనే - వైద్య సహాయం పొందండి',
                
                'doctor.title': 'సిఫార్సు చేసిన డాక్టర్లు',
                'doctor.book': 'నియామకాన్ని బుక్ చేయండి',
                
                'medicine.title': 'మందులను కనుగొనండి',
                'blood.title': 'రక్త బ్యాంకు',
                
                'general.language': 'భాష',
                'general.emergency': 'వెంటనే',
            }
        }
    
    def get_translation(self, key: str, language: str = 'en') -> str:
        """Get translated text"""
        if language not in self.translations:
            language = 'en'
        
        return self.translations[language].get(key, key)
    
    def get_all_translations_for_key(self, key: str) -> dict:
        """Get translations for a key in all languages"""
        result = {}
        for lang, translations in self.translations.items():
            result[lang] = translations.get(key, key)
        return result
    
    def get_supported_languages(self) -> list:
        """Get list of supported languages"""
        return list(self.translations.keys())
