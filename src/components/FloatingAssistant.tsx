import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";
import { AiAvatar } from "@/components/AiAvatar";
import { MonsterAvatar, AvatarConfig, defaultAvatarConfig } from "@/components/MonsterAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface Message {
 role: "user" | "assistant";
 content: string;
}

export function FloatingAssistant() {
 const { user } = useAuth();
 const [open, setOpen] = useState(false);
 const [messages, setMessages] = useState<Message[]>([]);
 const [input, setInput] = useState("");
 const [loading, setLoading] = useState(false);
 const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultAvatarConfig);
 const chatEndRef = useRef<HTMLDivElement>(null);

 // Load avatar config from profile
 useEffect(() => {
 if (!user?.id) return;
 supabase
 .from("profiles")
 .select("avatar_config")
 .eq("user_id", user.id)
 .single()
 .then(({ data }) => {
 if (data?.avatar_config && typeof data.avatar_config === "object") {
 setAvatarConfig({ ...defaultAvatarConfig, ...(data.avatar_config as Partial<AvatarConfig>) });
 }
 });
 }, [user?.id]);

 useEffect(() => {
 chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
 }, [messages]);

 const sendMessage = async () => {
 if (!input.trim() || loading) return;
 const userMsg: Message = { role: "user", content: input.trim() };
 const newMessages = [...messages, userMsg];
 setMessages(newMessages);
 setInput("");
 setLoading(true);

 try {
 const { data, error } = await supabase.functions.invoke("ai-assistant", {
 body: {
 messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
 userName: user?.name || "Usuario",
 },
 });

 if (error) throw error;
 setMessages([...newMessages, { role: "assistant", content: data.reply || "No pude procesar tu mensaje." }]);
 } catch {
 setMessages([...newMessages, { role: "assistant", content: "Hubo un error al procesar tu mensaje. Intenta de nuevo." }]);
 } finally {
 setLoading(false);
 }
 };

 if (!user) return null;

 return (
 <>
 {/* Floating avatar button */}
 <motion.button
 onClick={() => setOpen(!open)}
 data-tour="assistant"
 className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-shadow p-0 border-0 bg-transparent"
 whileHover={{ scale: 1.08 }}
 whileTap={{ scale: 0.95 }}
 >
 <AiAvatar size={56} animate />
 </motion.button>

 {/* Chat panel */}
 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ opacity: 0, y: 20, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 20, scale: 0.95 }}
 className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] flex flex-col rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
 >
 {/* Header */}
 <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-accent/30">
 <AiAvatar size={32} animate={false} />
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-foreground">Tu Asistente</p>
 <p className="text-xs text-muted-foreground flex items-center gap-1">
 <Sparkles className="w-3 h-3" /> Powered by AI
 </p>
 </div>
 <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
 <X className="w-4 h-4 text-muted-foreground" />
 </button>
 </div>

 {/* Messages */}
 <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[340px]">
 {messages.length === 0 && (
 <div className="text-center py-8">
 <MonsterAvatar config={avatarConfig} size={64} animate />
 <p className="text-sm text-muted-foreground mt-3">¡Hola {user.name?.split(" ")[0]}! </p>
 <p className="text-xs text-muted-foreground mt-1">Pregúntame lo que necesites sobre tus cursos</p>
 </div>
 )}
 {messages.map((msg, i) => (
 <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
 <div
 className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
 msg.role === "user"
 ? "bg-primary text-primary-foreground rounded-br-md"
 : "bg-accent text-accent-foreground rounded-bl-md"
 }`}
 >
 {msg.role === "assistant" ? (
 <div className="prose prose-sm max-w-none [&_p]:m-0 [&_ul]:m-0 [&_li]:m-0">
 <ReactMarkdown>{msg.content}</ReactMarkdown>
 </div>
 ) : (
 msg.content
 )}
 </div>
 </div>
 ))}
 {loading && (
 <div className="flex justify-start">
 <div className="bg-accent rounded-2xl rounded-bl-md px-4 py-2.5">
 <motion.div className="flex gap-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>
 <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
 <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
 <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
 </motion.div>
 </div>
 </div>
 )}
 <div ref={chatEndRef} />
 </div>

 {/* Input */}
 <div className="border-t border-border p-3">
 <form
 onSubmit={(e) => {
 e.preventDefault();
 sendMessage();
 }}
 className="flex items-center gap-2"
 >
 <input
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Escribe tu pregunta..."
 className="flex-1 bg-accent/50 rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
 disabled={loading}
 />
 <button
 type="submit"
 disabled={!input.trim() || loading}
 className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 transition-opacity hover:opacity-90"
 >
 <Send className="w-4 h-4" />
 </button>
 </form>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </>
 );
}
