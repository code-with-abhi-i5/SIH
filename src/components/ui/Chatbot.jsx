import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  RotateCcw,
  Phone,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  FileText,
  Search,
  Zap,
  Droplets,
  Trash2,
  AlertTriangle,
  Languages,
} from "lucide-react";
import gsap from "gsap";

// Quick reply categories in Hindi and English
const TOPICS_BY_LANG = {
  hi: [
    { id: "new_report", label: "📝 शिकायत दर्ज करें" },
    { id: "track_status", label: "🔍 शिकायत स्थिति" },
    { id: "road_issue", label: "🛣️ सड़क व गड्ढे" },
    { id: "water_issue", label: "💧 पेयजल व लीकेज" },
    { id: "electric_issue", label: "💡 बिजली व स्ट्रीट लाइट" },
    { id: "garbage_issue", label: "🗑️ कचरा व सफाई" },
    { id: "helpline", label: "📞 मुख्य हेल्पलाइन" },
    { id: "ai_info", label: "🤖 AI Dup-Check क्या है?" },
    { id: "login_help", label: "🔑 लॉगिन / खाता" },
  ],
  en: [
    { id: "new_report", label: "📝 File New Complaint" },
    { id: "track_status", label: "🔍 Track Status" },
    { id: "road_issue", label: "🛣️ Roads & Potholes" },
    { id: "water_issue", label: "💧 Water Supply & Leak" },
    { id: "electric_issue", label: "💡 Electricity & Lights" },
    { id: "garbage_issue", label: "🗑️ Waste & Sanitation" },
    { id: "helpline", label: "📞 Emergency Helplines" },
    { id: "ai_info", label: "🤖 How AI Dup-Check Works" },
    { id: "login_help", label: "🔑 Login & Account Help" },
  ],
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState("en"); // Default is 'en', user can switch to 'hi'

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! Welcome to the Govt. of Jharkhand JanSamadhan Citizen Portal.\n\nHow can I help you today? Choose from the options below or type your issue:\n*(हिंदी में बात करने के लिए ऊपर 'हिंदी' बटन दबाएं)*",
      time: "Just now",
      quickActions: [
        { label: "➕ File a Complaint", action: "navigate", target: "/report" },
        { label: "🔍 Track Status", action: "navigate", target: "/dashboard" },
      ],
    },
  ]);
  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Hide tooltip after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setHasUnread(false);
      setShowTooltip(false);
      setTimeout(() => {
        if (chatRef.current) {
          gsap.fromTo(
            chatRef.current,
            { y: 25, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.4)" }
          );
        }
      }, 10);
    } else {
      if (chatRef.current) {
        gsap.to(chatRef.current, {
          y: 20,
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => setIsOpen(false),
        });
      } else {
        setIsOpen(false);
      }
    }
  };

  // Toggle Language Handler
  const toggleLanguage = () => {
    const nextLang = language === "hi" ? "en" : "hi";
    setLanguage(nextLang);

    const confirmationMsg =
      nextLang === "en"
        ? {
            id: Date.now(),
            sender: "bot",
            text: "🌐 Language switched to **English**.\n\nWelcome to Jharkhand Govt JanSamadhan Citizen Portal! How may I assist you today?",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            quickActions: [
              { label: "➕ File a Complaint", action: "navigate", target: "/report" },
              { label: "🔍 Check Status", action: "navigate", target: "/dashboard" },
            ],
          }
        : {
            id: Date.now(),
            sender: "bot",
            text: "🌐 भाषा बदलकर **हिंदी** कर दी गई है।\n\nझारखण्ड सरकार के जनसमाधान पोर्टल में आपका स्वागत है। मैं आपकी क्या सहायता कर सकता हूँ?",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            quickActions: [
              { label: "➕ नई शिकायत दर्ज करें", action: "navigate", target: "/report" },
              { label: "🔍 स्थिति जांचें", action: "navigate", target: "/dashboard" },
            ],
          };

    setMessages((prev) => [...prev, confirmationMsg]);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text:
          language === "hi"
            ? "बातचीत रीसेट कर दी गई है। नमस्ते! आप जनसमाधान पोर्टल से संबंधित कोई भी प्रश्न पूछ सकते हैं।"
            : "Conversation has been reset. Hello! Feel free to ask any question regarding the JanSamadhan portal.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickActions:
          language === "hi"
            ? [
                { label: "➕ नई शिकायत दर्ज करें", action: "navigate", target: "/report" },
                { label: "🔍 स्थिति जांचें", action: "navigate", target: "/dashboard" },
              ]
            : [
                { label: "➕ File a Complaint", action: "navigate", target: "/report" },
                { label: "🔍 Check Status", action: "navigate", target: "/dashboard" },
              ],
      },
    ]);
  };

  // Detect language if user explicitly inputs in English or Hindi
  const detectLanguage = (text) => {
    const isDevanagari = /[\u0900-\u097F]/.test(text);
    if (isDevanagari) return "hi";

    const lower = text.toLowerCase();
    if (
      lower.includes("in english") ||
      lower.includes("english please") ||
      lower.includes("english me")
    ) {
      return "en";
    }
    if (
      lower.includes("in hindi") ||
      lower.includes("hindi me") ||
      lower.includes("hindi please")
    ) {
      return "hi";
    }

    // Common Hinglish terms
    const hinglishMarkers = [
      "kya", "kaise", "kare", "karna", "hai", "mera", "meri", "paani", "sadak",
      "gaddha", "bijli", "kachra", "batao", "madad", "chahiye", "nahi", "naam",
    ];
    for (const word of hinglishMarkers) {
      if (new RegExp(`\\b${word}\\b`, "i").test(lower)) {
        return "hi";
      }
    }

    // Pure English sentence indicators
    const englishMarkers = [
      "how to", "where is", "what is", "file", "complaint", "status", "track",
      "pothole", "leakage", "street light", "waste", "garbage", "helpline", "login",
      "register", "officer", "help", "hello", "hi", "good morning", "can you",
    ];
    for (const phrase of englishMarkers) {
      if (lower.includes(phrase)) {
        return language; // retain or use current context
      }
    }

    return language;
  };

  const handleSend = (textToSend) => {
    const userText = (textToSend || input).trim();
    if (!userText) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Check language intent
    const detectedLang = detectLanguage(userText);
    if (detectedLang !== language) {
      setLanguage(detectedLang);
    }

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
      time: currentTime,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Realistic bot response delay
    setTimeout(() => {
      const botResponse = generateKnowledgeResponse(userText, detectedLang);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botResponse.text,
          quickActions: botResponse.quickActions || [],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 500);
  };

  // Comprehensive rule-based knowledge engine for JanSamadhan (Hindi + English)
  const generateKnowledgeResponse = (rawText, currentLang) => {
    const text = rawText.toLowerCase();

    // 0. Language Switch request in text
    if (text.includes("english please") || text.includes("in english") || text.includes("speak english")) {
      return {
        text: `I have switched to English! How can I help you today? You can report civic problems, track complaint status, or check emergency helplines.`,
        quickActions: [
          { label: "➕ File a Complaint", action: "navigate", target: "/report" },
          { label: "🔍 Track Status", action: "navigate", target: "/dashboard" },
        ],
      };
    }
    if (text.includes("hindi please") || text.includes("in hindi") || text.includes("hindi me")) {
      return {
        text: `मैंने भाषा हिंदी कर दी है! मैं आपकी क्या सहायता कर सकता हूँ? आप सड़क, पानी, बिजली आदि की शिकायत दर्ज कर सकते हैं या स्थिति ट्रैक कर सकते हैं।`,
        quickActions: [
          { label: "➕ नई शिकायत दर्ज करें", action: "navigate", target: "/report" },
          { label: "🔍 शिकायत स्थिति", action: "navigate", target: "/dashboard" },
        ],
      };
    }

    // 1. Report Grievance / Complain
    if (
      text.includes("शिकायत दर्ज") ||
      text.includes("report") ||
      text.includes("complain") ||
      text.includes("new issue") ||
      text.includes("problem darj") ||
      text.includes("file new") ||
      text.includes("file complaint") ||
      text.includes("how to report") ||
      text.includes("new_report")
    ) {
      if (currentLang === "en") {
        return {
          text: `📌 *3 Easy Steps to File a Grievance on JanSamadhan:*\n\n1️⃣ Click the **'File a Complaint'** button.\n2️⃣ Choose your Department (Roads, Water, Electricity, Sanitation, etc.).\n3️⃣ Upload a photo with GPS location tag and submit.\n\nUpon submission, you will instantly receive an 8-digit Reference Tracking ID.`,
          quickActions: [
            { label: "🚀 File Complaint Now", action: "navigate", target: "/report" },
            { label: "📊 View Dashboard", action: "navigate", target: "/dashboard" },
          ],
        };
      }
      return {
        text: `📌 *जनसमाधान पर शिकायत दर्ज करने के 3 आसान चरण:*\n\n1️⃣ 'शिकायत दर्ज करें' बटन दबाएं।\n2️⃣ सही विभाग (सड़क, पानी, बिजली, कचरा आदि) चुनें।\n3️⃣ जीपीएस लोकेशन के साथ समस्या की फोटो अपलोड करें और सबमिट करें।\n\nसबमिट करते ही आपको एक 8-अंकों का संदर्भ ट्रैकिंग नंबर (Tracking ID) मिलेगा।`,
        quickActions: [
          { label: "🚀 अभी शिकायत दर्ज करें", action: "navigate", target: "/report" },
          { label: "📊 डैशबोर्ड देखें", action: "navigate", target: "/dashboard" },
        ],
      };
    }

    // 2. Track Grievance Status
    if (
      text.includes("status") ||
      text.includes("स्थिति") ||
      text.includes("track") ||
      text.includes("check") ||
      text.includes("track_status") ||
      text.includes("kaha tak pahucha")
    ) {
      if (currentLang === "en") {
        return {
          text: `🔍 *How to Track Your Grievance Status:*\n\n1. Log in to your citizen account using your mobile number.\n2. Open your **Dashboard** to view live updates for your complaints:\n\n• 🟡 **Submitted:** Received and assigned to the nodal department officer.\n• 🔵 **In Review:** Site inspection underway by engineers.\n• 🟠 **In Progress:** Field repairs or sanitation team actively working.\n• 🟢 **Resolved:** Issue resolved with resolution confirmation photo!`,
          quickActions: [
            { label: "📊 Track on Dashboard", action: "navigate", target: "/dashboard" },
            { label: "➕ File New Complaint", action: "navigate", target: "/report" },
          ],
        };
      }
      return {
        text: `🔍 *शिकायत की स्थिति (Tracking) जानने का तरीका:*\n\n1. अपने रजिस्टर्ड मोबाइल से डैशबोर्ड में लॉगिन करें।\n2. 'Dashboard' पेज पर आपकी सभी दर्ज शिकायतें और उनकी वर्तमान स्थिति दिखाई देगी:\n\n• 🟡 *Submitted (दर्ज):* शिकायत अधिकारी को भेज दी गई है।\n• 🔵 *In Review (सत्यापन):* संबंधित विभाग द्वारा जांच की जा रही है।\n• 🟠 *In Progress (कार्य जारी):* ठेकेदार/इंजीनियर फील्ड में काम कर रहे हैं।\n• 🟢 *Resolved (निराकरण):* समस्या का समाधान कर दिया गया है।`,
        quickActions: [
          { label: "📊 डैशबोर्ड पर स्थिति जांचें", action: "navigate", target: "/dashboard" },
          { label: "➕ नई शिकायत दर्ज करें", action: "navigate", target: "/report" },
        ],
      };
    }

    // 3. Roads & Potholes
    if (
      text.includes("road") ||
      text.includes("सड़क") ||
      text.includes("sadak") ||
      text.includes("gaddha") ||
      text.includes("pothole") ||
      text.includes("गड्ढे") ||
      text.includes("road_issue")
    ) {
      if (currentLang === "en") {
        return {
          text: `🛣️ *Road Damage & Potholes Grievance:*\n\n• Maintained by Public Works Department (PWD) and local Municipal Corporations.\n• Under standard civic SLA, major road potholes are targeted for inspection and repair within 48-72 hours.\n• Ensure you capture a clear daytime photo with GPS location tag enabled.`,
          quickActions: [
            { label: "📸 Report Road Issue", action: "navigate", target: "/report" },
            { label: "📞 PWD Helpline: 181", action: "call", target: "181" },
          ],
        };
      }
      return {
        text: `🛣️ *सड़क एवं गड्ढों से संबंधित शिकायत:* \n\n• पथ निर्माण विभाग (PWD) व नगर निगम द्वारा गड्ढों की मरम्मत की जाती है।\n• जनसमाधान पोर्टल पर लाइव कैमरा फोटो व GPS लोकेशन अपलोड करने से त्वरित कार्रवाई होती है।\n• मानक SLA के अनुसार मुख्य सड़कों के गड्ढे 48 से 72 घंटे में चिन्हित कर लिए जाते हैं।`,
        quickActions: [
          { label: "📸 सड़क की शिकायत दर्ज करें", action: "navigate", target: "/report" },
          { label: "📞 PWD हेल्पलाइन: 181", action: "call", target: "181" },
        ],
      };
    }

    // 4. Water supply & Leakage
    if (
      text.includes("water") ||
      text.includes("पानी") ||
      text.includes("paani") ||
      text.includes("leakage") ||
      text.includes("पेयजल") ||
      text.includes("नल") ||
      text.includes("pipe") ||
      text.includes("water_issue")
    ) {
      if (currentLang === "en") {
        return {
          text: `💧 *Drinking Water & Pipeline Grievances (PHED):*\n\n• Report main pipe bursts, contaminated water, or water supply disruption.\n• Include nearby landmark details and photo for faster dispatch of the rapid repair squad.\n• For emergency water tanker requests, contact the Municipal Corporation helpline.`,
          quickActions: [
            { label: "💧 Report Water Problem", action: "navigate", target: "/report" },
            { label: "📞 Water Helpline: 1800-890-4115", action: "call", target: "18008904115" },
          ],
        };
      }
      return {
        text: `💧 *पेयजल एवं स्वच्छता विभाग (PHED) सहायता:*\n\n• पाइपलाइन लीकेज, गंदे पानी की आपूर्ति या पानी न आने की शिकायत तुरंत दर्ज करें।\n• कृपया लीकेज स्थल का सटीक लैंडमार्क और फोटो अवश्य दें ताकि रिपेयर टीम तुरंत पहुंच सके।\n• आपातकालीन टैंकर आवश्यकता हेतु नगर निगम कॉल सेंटर से भी संपर्क कर सकते हैं।`,
        quickActions: [
          { label: "💧 पानी की समस्या रिपोर्ट करें", action: "navigate", target: "/report" },
          { label: "📞 RMC वाटर हेल्पलाइन: 1800-890-4115", action: "call", target: "18008904115" },
        ],
      };
    }

    // 5. Electricity & Street Lights
    if (
      text.includes("electric") ||
      text.includes("bijli") ||
      text.includes("बिजली") ||
      text.includes("street light") ||
      text.includes("light") ||
      text.includes("बत्ती") ||
      text.includes("pole") ||
      text.includes("तार") ||
      text.includes("electric_issue")
    ) {
      if (currentLang === "en") {
        return {
          text: `💡 *Electricity & Street Light Faults (JBVNL / Nagar Nigam):*\n\n• Report non-functional streetlights, open transformers, or snapped power cables.\n• Jharkhand Bijli Vitran Nigam Ltd (JBVNL) 24x7 toll-free helpline is **1912**.\n⚠️ **Safety Warning:** Stay clear of snapped or hanging electric wires and report immediately!`,
          quickActions: [
            { label: "💡 Report Streetlight Fault", action: "navigate", target: "/report" },
            { label: "📞 Power Helpline: 1912", action: "call", target: "1912" },
          ],
        };
      }
      return {
        text: `💡 *बिजली व स्ट्रीट लाइट समस्या (JBVNL / निगम):*\n\n• बंद स्ट्रीट लाइट, खुला ट्रांसफार्मर या गिरे हुए बिजली के तारों की सूचना तुरंत दें।\n• झारखण्ड बिजली वितरण निगम (JBVNL) टोल-फ्री नंबर 1912 पर भी 24x7 सेवा उपलब्ध है।\n⚠️ *चेतावनी:* खुले तारों से दूर रहें और तुरंत आपातकालीन शिकायत दर्ज करें।`,
        quickActions: [
          { label: "💡 स्ट्रीट लाइट रिपोर्ट करें", action: "navigate", target: "/report" },
          { label: "📞 बिजली शिकायत: 1912", action: "call", target: "1912" },
        ],
      };
    }

    // 6. Garbage & Sanitation
    if (
      text.includes("garbage") ||
      text.includes("kachra") ||
      text.includes("कचरा") ||
      text.includes("सफाई") ||
      text.includes("drain") ||
      text.includes("नाली") ||
      text.includes("sewage") ||
      text.includes("safai") ||
      text.includes("sanitation") ||
      text.includes("waste") ||
      text.includes("garbage_issue")
    ) {
      if (currentLang === "en") {
        return {
          text: `🗑️ *Waste Collection & Sanitation Complaints:*\n\n• Report uncleared roadside garbage heaps, overflowing bins, or missed door-to-door garbage trucks.\n• Sanitation squads attend to reported spots within 24 hours.\n• Live photo upload directly notifies the Ward Sanitation Supervisor.`,
          quickActions: [
            { label: "🗑️ Report Sanitation Issue", action: "navigate", target: "/report" },
            { label: "📞 Municipal Call Center: 1800-890-4115", action: "call", target: "18008904115" },
          ],
        };
      }
      return {
        text: `🗑️ *कचरा उठाव एवं स्वच्छता समस्या:*\n\n• सड़क पर कचरे का ढेर, खुला डस्टबिन या डोर-टू-डोर कचरा गाड़ी न आने की शिकायत दर्ज करें।\n• सफाई कर्मचारी दल 24 घंटे के भीतर स्थल की सफाई सुनिश्चित करेगा।\n• फोटो अपलोड करने से संबंधित वार्ड सुपरवाइजर को सीधा अलर्ट जाता है।`,
        quickActions: [
          { label: "🗑️ कचरा शिकायत दर्ज करें", action: "navigate", target: "/report" },
          { label: "📞 रांची नगर निगम: 1800-890-4115", action: "call", target: "18008904115" },
        ],
      };
    }

    // 7. Emergency & Helplines
    if (
      text.includes("helpline") ||
      text.includes("नंबर") ||
      text.includes("number") ||
      text.includes("phone") ||
      text.includes("contact") ||
      text.includes("संपर्क") ||
      text.includes("emergency")
    ) {
      if (currentLang === "en") {
        return {
          text: `📞 *Jharkhand Government Official Emergency Directory:*\n\n• 🏛️ **Chief Minister Jan Samadhan:** 181\n• 🚨 **Unified Emergency (Police/Fire/Ambulance):** 112\n• ⚡ **JBVNL Electricity Complaints:** 1912\n• 🏥 **National Ambulance Service:** 108\n• 🚒 **Fire Brigade:** 101\n• 👩 **Women Safety Helpline:** 1091 / 181\n• 🏙️ **Ranchi Municipal Corporation (RMC):** 1800-890-4115`,
          quickActions: [
            { label: "📞 Call 181 (CM Helpline)", action: "call", target: "181" },
            { label: "🚨 Call 112 (Emergency)", action: "call", target: "112" },
          ],
        };
      }
      return {
        text: `📞 *झारखण्ड सरकार महत्वपूर्ण आपातकालीन नंबर:*\n\n• 🏛️ *मुख्यमंत्री जन संवाद हेल्पलाइन:* 181\n• 🚨 *आपातकालीन एकीकृत सेवा (Police/Fire/Ambulance):* 112\n• ⚡ *JBVNL बिजली आपूर्ति शिकायत:* 1912\n• 🏥 *सरकारी एम्बुलेंस:* 108\n• 🚒 *अग्निशामक (Fire Brigade):* 101\n• 👩 *महिला हेल्पलाइन:* 1091 / 181\n• 🏙️ *रांची नगर निगम (RMC):* 1800-890-4115`,
        quickActions: [
          { label: "📞 डायल 181 (CM Helpline)", action: "call", target: "181" },
          { label: "🚨 डायल 112 (Emergency)", action: "call", target: "112" },
        ],
      };
    }

    // 8. AI Duplicate & Intelligence
    if (
      text.includes("ai") ||
      text.includes("duplicate") ||
      text.includes("dup-check") ||
      text.includes("तकनीक") ||
      text.includes("fake") ||
      text.includes("ai_info")
    ) {
      if (currentLang === "en") {
        return {
          text: `🤖 *How JanSamadhan AI Intelligence Works:*\n\n1. **Duplicate Clustering:** If multiple citizens report the same pothole or water burst within a 50m radius, AI merges them into a single high-priority ticket.\n2. **Severity Scoring:** Analyzes images to flag high-risk hazards (e.g. exposed live cables or massive road cave-ins) for immediate escalation.\n3. **Geo-Auto Routing:** Instantly forwards reports to the exact local ward engineer without manual clerical delays.`,
          quickActions: [
            { label: "➕ Test AI Grievance Submission", action: "navigate", target: "/report" },
          ],
        };
      }
      return {
        text: `🤖 *जनसमाधान AI कैसे काम करता है?*\n\n1. *Duplicate Detection:* जब एक ही गड्ढे या कचरे की रिपोर्ट कई नागरिक करते हैं, तो AI उन्हें 50 मीटर के दायरे में क्लस्टर कर देता है ताकि अधिकारियों का समय न बर्बाद हो।\n2. *Severity Scoring:* AI फोटो का विश्लेषण कर गंभीर खतरों (जैसे खुले तार, मुख्य मार्ग का बड़ा गड्ढा) को उच्च प्राथमिकता (High Priority) पर रखता है।\n3. *Automated Routing:* शिकायत सीधे संबंधित क्षेत्र के जूनियर इंजीनियर/वार्ड ऑफिसर को फॉरवर्ड हो जाती है।`,
        quickActions: [
          { label: "➕ AI पावर्ड रिपोर्ट टेस्ट करें", action: "navigate", target: "/report" },
        ],
      };
    }

    // 9. Login & Account Help
    if (
      text.includes("login") ||
      text.includes("लॉगिन") ||
      text.includes("signup") ||
      text.includes("password") ||
      text.includes("account") ||
      text.includes("otp") ||
      text.includes("पासवर्ड") ||
      text.includes("login_help")
    ) {
      if (currentLang === "en") {
        return {
          text: `🔑 *Citizen & Officer Account Support:*\n\n• Citizens can sign in or register with their 10-digit mobile number.\n• Department officers can sign in using their official department credentials.\n• If you forget your password, click 'Forgot Password' on the Auth page.\n• You can also file reports as a guest citizen if needed!`,
          quickActions: [
            { label: "🔐 Go to Login Page", action: "navigate", target: "/auth" },
            { label: "➕ File as Guest Citizen", action: "navigate", target: "/report" },
          ],
        };
      }
      return {
        text: `🔑 *लॉगिन एवं खाता सहायता:*\n\n• नागरिक अपने 10-अंकों के मोबाइल नंबर और पासवर्ड से लॉगिन कर सकते हैं।\n• नया खाता बनाने के लिए 'Sign Up' टैब पर क्लिक करें।\n• सरकारी अधिकारी अपने आधिकारिक विभाग क्रेडेंशियल्स के साथ 'Officer Portal' से लॉगिन कर सकते हैं।\n• यदि पासवर्ड भूल गए हों तो 'Forgot Password' विकल्प का उपयोग करें।`,
        quickActions: [
          { label: "🔐 लॉगिन पेज पर जाएं", action: "navigate", target: "/auth" },
          { label: "➕ शिकायत दर्ज करें (Guest)", action: "navigate", target: "/report" },
        ],
      };
    }

    // 10. Greetings
    if (
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("namaste") ||
      text.includes("hey") ||
      text.includes("नमस्ते") ||
      text.includes("pranam")
    ) {
      if (currentLang === "en") {
        return {
          text: `Hello! Welcome to JanSamadhan 24x7 Citizen Assistance. How can I help you today? You can select any quick option below or type your query directly.`,
          quickActions: [
            { label: "📝 File a Complaint", action: "navigate", target: "/report" },
            { label: "🔍 Track Status", action: "navigate", target: "/dashboard" },
          ],
        };
      }
      return {
        text: `नमस्ते! जनसमाधान 24x7 सहायता डेस्क में आपका स्वागत है। आप अपनी समस्या नीचे दिए गए क्विक बटनों से चुन सकते हैं या सीधे टाइप कर सकते हैं।`,
        quickActions: [
          { label: "📝 शिकायत दर्ज करें", action: "navigate", target: "/report" },
          { label: "🔍 शिकायत स्थिति", action: "navigate", target: "/dashboard" },
        ],
      };
    }

    // 11. About Project / SIH
    if (
      text.includes("about") ||
      text.includes("sih") ||
      text.includes("portal") ||
      text.includes("jansamadhan") ||
      text.includes("kya hai")
    ) {
      if (currentLang === "en") {
        return {
          text: `🇮🇳 *About JanSamadhan (SIH Project):*\n\nJanSamadhan is an advanced AI-powered civic grievance redressal portal built for the Smart India Hackathon (SIH) for the Government of Jharkhand. It bridges the gap between citizens and municipal authorities for lightning-fast road, water, electricity, and sanitation resolution.`,
          quickActions: [
            { label: "🚀 Explore Portal", action: "navigate", target: "/" },
            { label: "📝 File New Complaint", action: "navigate", target: "/report" },
          ],
        };
      }
      return {
        text: `🇮🇳 *JanSamadhan (जनसमाधान) क्या है?*\n\nयह स्मार्ट इंडिया हैकाथॉन (SIH) के तहत झारखण्ड राज्य के नागरिकों के लिए विकसित एक अत्याधुनिक नागरिक शिकायत निवारण मंच है। इसके माध्यम से नागरिक बुनियादी ढांचे (सड़क, पानी, बिजली, सफाई) की समस्याओं को जीपीएस फोटो के साथ दर्ज कर सकते हैं और वास्तविक समय में समाधान ट्रैक कर सकते हैं।`,
        quickActions: [
          { label: "🚀 पोर्टल एक्सप्लोर करें", action: "navigate", target: "/" },
          { label: "📝 नई शिकायत दर्ज करें", action: "navigate", target: "/report" },
        ],
      };
    }

    // Default Fallback
    if (currentLang === "en") {
      return {
        text: `Thank you for reaching out. Your query has been noted. You can pick from our quick service buttons below or navigate directly:`,
        quickActions: [
          { label: "➕ File a Complaint", action: "navigate", target: "/report" },
          { label: "🔍 Track Complaint Status", action: "navigate", target: "/dashboard" },
          { label: "📞 181 CM Helpline", action: "call", target: "181" },
        ],
      };
    }

    return {
      text: `धन्यवाद। आपकी पूछताछ नोट कर ली गई है। आप नीचे दिए गए मुख्य विषयों में से तुरंत चुन सकते हैं या सीधे 'शिकायत दर्ज करें' पर जा सकते हैं:`,
      quickActions: [
        { label: "➕ नई शिकायत दर्ज करें", action: "navigate", target: "/report" },
        { label: "🔍 शिकायत की स्थिति देखें", action: "navigate", target: "/dashboard" },
        { label: "📞 181 सीएम हेल्पलाइन", action: "call", target: "181" },
      ],
    };
  };

  const handleActionClick = (action) => {
    if (action.action === "navigate") {
      navigate(action.target);
      if (window.innerWidth < 640) {
        setIsOpen(false);
      }
    } else if (action.action === "call") {
      window.location.href = `tel:${action.target}`;
    }
  };

  const currentTopics = TOPICS_BY_LANG[language] || TOPICS_BY_LANG.hi;

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans select-none">
      {/* Floating Tooltip Callout */}
      {!isOpen && showTooltip && (
        <div className="absolute bottom-16 right-0 mb-2 w-64 bg-white/95 backdrop-blur-md text-navy-900 p-3 rounded-2xl shadow-xl border border-emerald-200 animate-bounce text-xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
            <Sparkles size={16} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-emerald-800 text-[11px] leading-tight">
              {language === "hi" ? "नागरिक सहायता 24x7" : "Citizen Support 24x7"}
            </p>
            <p className="text-[10px] text-navy-600 mt-0.5">
              {language === "hi"
                ? "सड़क, पानी, बिजली समस्या हेतु यहाँ चैट करें!"
                : "Chat here for roads, water & electricity issues!"}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-navy-400 hover:text-navy-700 p-0.5"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className="absolute bottom-16 right-0 w-[92vw] sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col origin-bottom-right transition-all duration-300"
          style={{ height: "570px", maxHeight: "84vh" }}
        >
          {/* Official Government Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 p-3.5 text-white shadow-md relative z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Government Logo / Avatar */}
                <div className="relative w-10 h-10 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center ring-2 ring-emerald-300/60 overflow-hidden shrink-0">
                  <img
                    src="/jharkhand-logo.png"
                    alt="Jharkhand Emblem"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm tracking-wide text-white flex items-center gap-1">
                      {language === "hi" ? "जनसमाधान AI सहायक" : "JanSamadhan AI"}
                    </h3>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-400/30">
                      {language === "hi" ? "झारखण्ड सरकार" : "Govt. of JH"}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/90 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping inline-block" />
                    {language === "hi" ? "24x7 नागरिक सेवा सक्रिय" : "24x7 Support Online"}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Language Switch, Reset, Close */}
              <div className="flex items-center gap-1">
                {/* Language Toggle Pill */}
                <button
                  onClick={toggleLanguage}
                  className="px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 border border-white/25 text-[11px] font-black text-white flex items-center gap-1 transition-all shadow-sm"
                  title="भाषा बदलें / Switch Language"
                >
                  <Languages size={13} />
                  <span>{language === "hi" ? "EN" : "हिंदी"}</span>
                </button>

                <button
                  onClick={handleResetChat}
                  className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/15 rounded-xl transition-all"
                  title={language === "hi" ? "बातचीत रीसेट करें" : "Reset Conversation"}
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/15 rounded-xl transition-all"
                  title="Close"
                >
                  <X size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* Subheader Banner */}
          <div className="bg-emerald-50/90 border-b border-emerald-100 px-4 py-1.5 flex items-center justify-between text-[11px] text-emerald-900">
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <ShieldCheck size={13} className="text-emerald-600" />
              {language === "hi"
                ? "आधिकारिक जन शिकायत पोर्टल (SIH)"
                : "Official Grievance Redressal (SIH)"}
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-medium">
              CM Helpline: 181
            </span>
          </div>

          {/* Messages Area with Faint Jharkhand Emblem Watermark */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 relative">
            {/* Authentic Faint Jharkhand Watermark in Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
              <img
                src="/jharkhand-logo.png"
                alt="Jharkhand Watermark"
                className="w-64 h-64 object-contain opacity-[0.055] filter contrast-125"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex relative z-10 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-2.5 max-w-[88%] ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-xs font-bold ${
                      msg.sender === "user"
                        ? "bg-navy-800 text-white"
                        : "bg-gradient-to-tr from-emerald-600 to-green-600 text-white"
                    }`}
                  >
                    {msg.sender === "user" ? <User size={13} /> : <Bot size={13} />}
                  </div>

                  <div>
                    <div
                      className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm whitespace-pre-line ${
                        msg.sender === "user"
                          ? "bg-navy-900 text-white rounded-tr-none font-medium"
                          : "bg-white text-navy-900 border border-slate-200/80 rounded-tl-none font-normal"
                      }`}
                    >
                      {msg.text}

                      {/* Interactive Action Buttons inside message */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {msg.quickActions.map((qa, i) => (
                            <button
                              key={i}
                              onClick={() => handleActionClick(qa)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm group"
                            >
                              <span>{qa.label}</span>
                              <ChevronRight
                                size={12}
                                className="group-hover:translate-x-0.5 transition-transform"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span
                      className={`block text-[10px] text-slate-400 mt-1 ${
                        msg.sender === "user" ? "text-right mr-1" : "text-left ml-1"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs">
                  <Bot size={13} />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="text-[11px] text-slate-500 font-medium ml-1">
                    {language === "hi"
                      ? "सहायक टाइप कर रहा है..."
                      : "Assistant is typing..."}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Category Carousel */}
          <div className="px-3 py-2 bg-emerald-50/60 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-1 px-1">
              <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                {language === "hi" ? "⚡ त्वरित विकल्प:" : "⚡ Quick Options:"}
              </p>
              <button
                onClick={toggleLanguage}
                className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold underline"
              >
                {language === "hi" ? "Switch to English" : "हिंदी में देखें"}
              </button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-emerald-200">
              {currentTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSend(topic.label)}
                  className="whitespace-nowrap px-3 py-1 bg-white hover:bg-emerald-600 hover:text-white text-emerald-900 border border-emerald-200/80 hover:border-emerald-600 rounded-full text-[11px] font-semibold transition-all shadow-2xs shrink-0 flex items-center gap-1.5"
                >
                  <span>{topic.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                language === "hi"
                  ? "सड़क, पानी, बिजली या स्थिति के बारे में पूछें..."
                  : "Ask about roads, water, electricity or status..."
              }
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-10 h-10 flex items-center justify-center shrink-0 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl transition-all shadow-sm shadow-emerald-600/30 disabled:shadow-none"
              title={language === "hi" ? "संदेश भेजें" : "Send message"}
            >
              <Send size={16} className={input.trim() ? "translate-x-0.5" : ""} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="relative group w-14 h-14 bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 hover:from-emerald-800 hover:to-green-600 text-white rounded-full shadow-lg shadow-emerald-700/35 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-700/50 active:scale-95 ring-4 ring-emerald-500/20"
          aria-label="Open JanSamadhan Chatbot"
        >
          {/* Pulsing ring animation */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />

          {/* Logo or Message Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <MessageCircle size={26} className="text-white drop-shadow-sm" />
          </div>

          {/* Notification Badge */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-white shadow-sm animate-pulse">
              1
            </span>
          )}
        </button>
      )}
    </div>
  );
}
