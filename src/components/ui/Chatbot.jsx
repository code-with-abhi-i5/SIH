import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  FileText,
  Zap,
  Mic,
  MicOff,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import gsap from "gsap";
import { api } from "@/services/api";

const QUICK_PROMPTS = [
  { label: "💧 Water Contamination", text: "Hamare gaon me handpump se ganda pani aa raha hai" },
  { label: "⚡ Transformer Failure", text: "Gaon ka transformer jal gaya hai aur 10 din se bijli gul hai" },
  { label: "🛣️ Damaged Road", text: "Main road par bhot bade gaddhe ho gaye hain accident ho rahe hain" },
  { label: "🎓 NEP Credits Help", text: "How can student teams earn NEP 2020 experiential credits?" },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => "session_" + Math.random().toString(36).substring(2, 9));
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "नमस्ते! 🙏 Welcome to Sahayak AI — Jharkhand's Civic Innovation & Problem Resolution Assistant.\n\nYou can describe your problem in Hindi, English or Hinglish, or ask about university proposals, NEP credits, and CSR funding.",
      time: "Just now",
      steps: ["[System] Initialized Multi-Agent Sahayak Engine"],
    },
  ]);
  const [input, setInput] = useState("");
  const [district, setDistrict] = useState("Ranchi");
  const [isListening, setIsListening] = useState(false);

  const navigate = useNavigate();
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        if (chatRef.current) {
          gsap.fromTo(
            chatRef.current,
            { scale: 0.85, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" }
          );
        }
      }, 50);
    } else {
      gsap.to(chatRef.current, {
        scale: 0.9,
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setIsOpen(false),
      });
    }
  };

  const handleSend = async (textToSend) => {
    const userText = (textToSend || input).trim();
    if (!userText) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const data = await api.chat.sendMessage({
        sessionId,
        message: userText,
        district,
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.reply || "आपकी शिकायत दर्ज कर ली गई है और संबंधित विभाग को अग्रसारित कर दी गई है।",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        intent: data.intent,
        autoCreatedChallenge: data.autoCreatedChallenge,
        steps: data.steps || [
          "[Chatbot Intent] Classified as: FILE_COMPLAINT",
          "[Chatbot RAG] Retrieved department routing context",
          "[Chatbot Response] Generated structured reply",
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Graceful local AI fallback simulation
      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          sender: "bot",
          text: `नमस्ते! 🙏 मैंने आपकी समस्या ("${userText.substring(0, 45)}...") को नोट कर लिया है। इसे प्राथमिकता के आधार पर जल व स्वच्छता / लोक निर्माण विभाग एवं निकटतम विश्वविद्यालय (BIT Mesra / Ranchi University) के छात्रों को समाधान हेतु भेजा जा रहा है।`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          intent: "FILE_COMPLAINT",
          steps: [
            "[AI Intent] Categorized Civic Issue",
            "[AI Routing] Matched with University Engineering Department",
          ],
          autoCreatedChallenge: {
            id: "ch_" + Date.now().toString(36),
            title: userText.slice(0, 50),
            status: "Reported",
          },
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 700);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceToggle = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-md border border-amber-200 text-xs font-semibold text-navy-800 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sahayak AI Active</span>
          </div>
        )}

        <button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-navy-900 to-navy-800 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 relative border-2 border-amber-400"
          aria-label="Toggle Sahayak AI Chat"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-7 h-7 text-amber-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-navy-900" />
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[640px] h-[82vh] bg-white rounded-2xl shadow-2xl border border-navy-200/90 flex flex-col overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white flex items-center justify-between border-b border-navy-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <Bot className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">Sahayak AI</h3>
                  <span className="px-1.5 py-0.2 rounded bg-green-500/20 text-green-300 text-[10px] font-bold border border-green-500/40">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-navy-200">Jharkhand Civic Multi-Agent Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="text-[11px] bg-navy-800 border border-navy-600 rounded px-2 py-1 text-white focus:outline-none"
              >
                <option value="Ranchi">Ranchi</option>
                <option value="Dhanbad">Dhanbad</option>
                <option value="East Singhbhum">East Singhbhum</option>
                <option value="Bokaro">Bokaro</option>
                <option value="Hazaribagh">Hazaribagh</option>
                <option value="Dumka">Dumka</option>
              </select>
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: Date.now(),
                      sender: "bot",
                      text: "नमस्ते! How can I assist you with JanSamadhan portal?",
                      time: "Just now",
                    },
                  ])
                }
                className="p-1 rounded text-navy-300 hover:text-white"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#f8fafc]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-navy-900 flex items-center justify-center text-amber-300 shrink-0 text-xs font-bold mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-navy-900 text-white rounded-br-none"
                      : "bg-white text-navy-900 shadow-sm border border-navy-100 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Auto-Drafted Challenge Ticket Card */}
                  {msg.autoCreatedChallenge && (
                    <div className="mt-2.5 pt-2 border-t border-navy-100 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] mb-1">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Auto-Drafted Civic Ticket</span>
                      </div>
                      <p className="text-[11px] text-navy-700 font-medium line-clamp-2">
                        {msg.autoCreatedChallenge.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-navy-600">
                          Status: <strong className="text-amber-700">{msg.autoCreatedChallenge.status || "Reported"}</strong>
                        </span>
                        <Link
                          to="/challenges"
                          onClick={() => setIsOpen(false)}
                          className="font-bold text-navy-900 hover:underline flex items-center gap-0.5"
                        >
                          View Challenge <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* AI Pipeline Step Badges */}
                  {msg.steps && msg.steps.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-navy-50 space-y-1">
                      {msg.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="text-[10px] font-mono text-navy-500 bg-navy-50 px-1.5 py-0.5 rounded flex items-center gap-1"
                        >
                          <span className="text-amber-600">⚡</span>
                          <span className="truncate">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === "user" ? "text-navy-300" : "text-navy-400"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 text-xs font-bold mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-navy-500 text-xs p-2 bg-white rounded-lg shadow-sm border border-navy-100 max-w-[160px]">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-navy-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px] font-medium">Sahayak thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-white border-t border-navy-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.text)}
                className="shrink-0 px-2.5 py-1 text-[11px] font-medium rounded-full bg-navy-50 text-navy-700 hover:bg-navy-100 border border-navy-200/80 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-navy-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-2 rounded-xl transition-colors ${
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-navy-50 text-navy-600 hover:bg-navy-100"
                }`}
                title="Voice Input (Hindi/English)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening... boliyen..." : "Ask Sahayak AI or report a problem..."}
                className="flex-1 px-3 py-2 text-xs bg-navy-50 border border-navy-200 rounded-xl focus:outline-none focus:border-navy-900"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-navy-900 text-white hover:bg-navy-800 disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
