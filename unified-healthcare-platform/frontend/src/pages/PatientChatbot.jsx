import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, Volume2, HelpCircle, Globe, VolumeX } from 'lucide-react'
import api from '../services/api'
import './PatientPortal.css'

function PatientChatbot() {
  const [language, setLanguage] = useState(() => localStorage.getItem('chatbot-lang') || 'en')
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const messagesEndRef = useRef(null)

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'es', label: 'Español (Spanish)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' }
  ]

  const ui = {
    en: {
      title: 'AI Public Health Assistant',
      subtitle: 'Ask about disease prevention, hygiene, clean water, or common infections in your language.',
      placeholder: 'Type your question here...',
      send: 'Send',
      quickSuggestions: 'Common Questions:',
      welcomeMsg: 'Hello! I am your AI Public Health Assistant. Ask me questions about hygiene, clean water, malaria prevention, or flu care. I support Text-to-Speech to read responses aloud!'
    },
    hi: {
      title: 'एआई जन स्वास्थ्य सहायक',
      subtitle: 'अपनी भाषा में बीमारियों से बचाव, स्वच्छता, साफ पानी या आम संक्रमणों के बारे में पूछें।',
      placeholder: 'अपना प्रश्न यहाँ टाइप करें...',
      send: 'भेजें',
      quickSuggestions: 'सामान्य प्रश्न:',
      welcomeMsg: 'नमस्ते! मैं आपका एआई जन स्वास्थ्य सहायक हूँ। मुझसे स्वच्छता, स्वच्छ पेयजल, मलेरिया से बचाव या फ्लू की देखभाल के बारे में प्रश्न पूछें। मैं प्रतिक्रियाओं को बोलकर सुनाने के लिए टेक्स्ट-टू-स्पीच का समर्थन करता हूँ!'
    },
    es: {
      title: 'Asistente de Salud Pública con IA',
      subtitle: 'Pregunte sobre prevención de enfermedades, higiene, agua limpia o infecciones comunes en su idioma.',
      placeholder: 'Escriba su pregunta aquí...',
      send: 'Enviar',
      quickSuggestions: 'Preguntas Frecuentes:',
      welcomeMsg: '¡Hola! Soy su Asistente de Salud Pública de IA. Hágame preguntas sobre higiene, agua potable, prevención de malaria o gripe. ¡Soporto Text-to-Speech para leer las respuestas en voz alta!'
    },
    mr: {
      title: 'एआय जन आरोग्य सहाय्यक',
      subtitle: 'आपल्या भाषेत आजार प्रतिबंध, स्वच्छता, स्वच्छ पाणी किंवा सामान्य संसर्गांबद्दल विचारा.',
      placeholder: 'तुमचा प्रश्न येथे टाईप करा...',
      send: 'पाठवा',
      quickSuggestions: 'नेहमीचे प्रश्न:',
      welcomeMsg: 'नमस्कार! मी आपला एआय जन आरोग्य सहाय्यक आहे. मला स्वच्छता, स्वच्छ पाणी, मलेरिया प्रतिबंध आणि फ्लू काळजीबद्दल प्रश्न विचारा. मी उत्तरे वाचून दाखवण्यासाठी टेक्स्ट-टू-स्पीचचे समर्थन करतो!'
    },
    gu: {
      title: 'એઆઈ જન આરોગ્ય સહાયક',
      subtitle: 'આપની ભાષામાં રોગોથી બચાવ, સ્વચ્છતા, પીવાના પાણી કે સામાન્ય ચેપ વિશે પૂછો.',
      placeholder: 'આપનો પ્રશ્ન અહીં લખો...',
      send: 'મોકલો',
      quickSuggestions: 'સામાન્ય પ્રશ્નો:',
      welcomeMsg: 'નમસ્તે! હું આપનો એઆઈ જન આરોગ્ય સહાયક છું. મને સ્વચ્છતા, પીવાના પાણી, મેલેરિયા બચાવ કે ફ્લૂની સારવાર વિશે પ્રશ્નો પૂછો. હું જવાબો મોટેથી વાંચવા માટે ટેક્સ્ટ-ટુ-સ્પીચને સપોર્ટ કરું છું!'
    }
  }

  const defaultSuggestions = {
    en: ["How to prevent malaria?", "Clean water tips", "Flu treatment", "Where is the nearest bed?"],
    hi: ["मलेरिया से बचाव कैसे करें?", "स्वच्छ पानी के टिप्स", "फ्लू का इलाज", "નજદીકી બેડ ક્યાં છે?"],
    es: ["¿Cómo prevenir la malaria?", "Consejos de agua limpia", "Tratamiento de la gripe", "¿Dónde está la cama más cercana?"],
    mr: ["मलेरिया कसा टाळावा?", "स्वच्छ पाण्याचे उपाय", "फ्लूचा उपचार", "जवळचे बेड कुठे आहे?"],
    gu: ["મેલેરિયાથી બચાવ કેવી રીતે કરવો?", "સ્વચ્છ પાણીની ટિપ્સ", "ફ્લૂની સારવાર", "નજીકનું બેડ ક્યાં છે?"]
  }

  // Set initial welcome message & suggestions when language changes
  useEffect(() => {
    localStorage.setItem('chatbot-lang', language)
    
    // Clear speechSynthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    const welcome = ui[language]?.welcomeMsg || ui['en'].welcomeMsg
    setMessages([
      { id: 'welcome', sender: 'ai', text: welcome, timestamp: new Date() }
    ])
    setSuggestions(defaultSuggestions[language] || defaultSuggestions['en'])
  }, [language])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speakText = (text, langCode) => {
    if (!speechEnabled) return
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      
      const langMapping = {
        en: 'en-US',
        hi: 'hi-IN',
        es: 'es-ES',
        mr: 'mr-IN',
        gu: 'gu-IN'
      }
      utterance.lang = langMapping[langCode] || 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputValue
    if (!query.trim()) return

    // Clear input
    setInputValue('')
    setLoading(true)

    // Append user message
    const userMsgId = Date.now().toString()
    setMessages(prev => [...prev, { id: userMsgId, sender: 'patient', text: query, timestamp: new Date() }])

    try {
      const response = await api.post('/api/public-health/chat', {
        message: query,
        language: language
      })

      const botReply = response.data.response
      const botMsgId = (Date.now() + 1).toString()
      
      // Append AI message
      setMessages(prev => [...prev, { id: botMsgId, sender: 'ai', text: botReply, timestamp: new Date() }])
      
      if (response.data.suggestions) {
        setSuggestions(response.data.suggestions)
      }

      // Read Aloud automatically if enabled
      speakText(botReply, language)

    } catch (error) {
      console.error('Chat error:', error)
      const errorMsg = language === 'hi' 
        ? 'क्षमा करें, मुझे सर्वर से प्रतिक्रिया प्राप्त करने में समस्या हो रही है।' 
        : 'Sorry, I am having trouble connecting to the medical servers right now.'
      
      setMessages(prev => [...prev, { id: 'error', sender: 'ai', text: errorMsg, timestamp: new Date() }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const activeUI = ui[language] || ui['en']

  return (
    <div className="patient-chatbot">
      {/* Header */}
      <div className="status-header">
        <MessageSquare size={32} color="#3498DB" />
        <div style={{ flex: 1 }}>
          <h2>{activeUI.title}</h2>
          <p>{activeUI.subtitle}</p>
        </div>
        
        {/* Read Aloud Toggle */}
        <button 
          className={`speech-btn ${speechEnabled ? 'active' : ''}`}
          onClick={() => {
            setSpeechEnabled(!speechEnabled)
            if (speechEnabled && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel()
            }
          }}
          title={speechEnabled ? activeUI.ttsOn : activeUI.ttsOff}
        >
          {speechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* Language Selector chips */}
      <div className="condition-select-panel lang-selector-bar">
        <Globe size={18} color="#7F8C8D" />
        <span className="panel-lbl">Select Language / भाषा चुनें:</span>
        <div className="conditions-chips">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`cond-chip lang-btn ${language === lang.code ? 'active' : ''}`}
              onClick={() => setLanguage(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="chat-window animate-fade-in">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrap ${msg.sender === 'ai' ? 'ai' : 'patient'}`}>
              <div className="bubble-meta">
                <span>{msg.sender === 'ai' ? 'HealthAI Bot' : 'You'}</span>
              </div>
              <div className="chat-bubble">
                <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{msg.text}</p>
                {msg.sender === 'ai' && (
                  <button 
                    className="speak-btn-bubble" 
                    onClick={() => speakText(msg.text, language)}
                    title="Speak"
                  >
                    <Volume2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble-wrap ai">
              <div className="bubble-meta"><span>HealthAI Bot is thinking...</span></div>
              <div className="chat-bubble thinking">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions chips */}
        {suggestions.length > 0 && (
          <div className="quick-prompts-row">
            <span className="prompt-lbl">{activeUI.quickSuggestions}</span>
            <div className="prompt-chips-wrap">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  className="prompt-chip"
                  onClick={() => handleSendMessage(sug)}
                  disabled={loading}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder={activeUI.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button 
            className="btn-send"
            onClick={() => handleSendMessage()}
            disabled={loading || !inputValue.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientChatbot
