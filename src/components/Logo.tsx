import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-9",
    lg: "h-14"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={`${import.meta.env.BASE_URL}logo.svg`} 
        alt="GrupaMar Transporte y Logística" 
        className={`${sizeClasses[size]} w-auto object-contain`} 
      />
    </div>
  );
}
