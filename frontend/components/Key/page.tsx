import React from "react";

type KeyVariant = "normal" | "shift" | "tab" | "space";

interface KeyProps {
  label: string;
  variant?: KeyVariant;
  onClick?: () => void;
}

const Key: React.FC<KeyProps> = ({ label, variant = "normal", onClick }) => {
  const widthMap: Record<KeyVariant, string> = {
    normal: "w-15",
    shift: "w-28",
    tab: "w-20",
    space: "w-64",
  };

  return (
    <div
      className={`
        ${widthMap[variant]}
        h-13
        rounded-sm
        bg-gradient-to-b from-[#5C5C5C] to-[#171717]
        p-[1px]
        active:translate-x-0.5 active:translate-y-0.5
      `}
    >
      <button
        onClick={onClick}
        className="
          w-full h-full
          rounded-sm
          bg-[#171717]
          text-white
          text-sm font-medium
          flex items-center justify-center
          select-none
        "
      >
        {label}
      </button>
    </div>
  );
};

export default Key;
