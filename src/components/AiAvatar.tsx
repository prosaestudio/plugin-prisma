import { motion } from "framer-motion";
import aiAvatarBg from "@/assets/ai-avatar-bg.png";

interface AiAvatarProps {
  size?: number;
  animate?: boolean;
}

export function AiAvatar({ size = 40, animate = true }: AiAvatarProps) {
  return (
    <motion.div
      className="rounded-full overflow-hidden shrink-0"
      style={{ width: size, height: size }}
      animate={animate ? { y: [0, -3, 0] } : undefined}
      transition={animate ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <img
        src={aiAvatarBg}
        alt="AI Assistant"
        className="w-full h-full object-cover"
        style={{ filter: "saturate(1.2)" }}
      />
    </motion.div>
  );
}
