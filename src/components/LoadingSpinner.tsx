"use client";

import { motion } from "framer-motion";
import "@/app/styling/loading.scss";

export default function LoadingSpinner() {
  const duration = 1.5;

  return (
    <div className="loading-container">
      <motion.span
        className="letter"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
      >
        m
      </motion.span>
    </div>
  );
}
