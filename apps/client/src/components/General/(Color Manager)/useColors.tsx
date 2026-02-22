export function useColors() {
  return {
    background: {
      primary: "bg-[var(--bg-primary)]",
      secondary: "bg-[var(--bg-secondary)]",
      accent: "bg-[var(--bg-accent)]",
      special: "bg-[var(--bg-special)]",

      heroPrimary: "bg-[var(--hero-primary)]",
      heroPrimaryFaded: "bg-[var(--hero-primary-faded)]",
      heroSecondary: "bg-[var(--hero-secondary)]",
      heroSecondaryFaded: "bg-[var(--hero-secondary-faded)]",
    },

    text: {
      primary: "text-[var(--text-primary)]",
      secondary: "text-[var(--text-secondary)]",
      special: "text-[var(--text-special)]",
      inverted: "text-[var(--text-inverted)]",
    },

    border: {
      defaultThin: "border border-[var(--border-default)]",
      fadedThin: "border border-[var(--border-faded)]",
      greenThin: "border border-[var(--border-green)]",
      specialThin: "border border-[var(--border-special)]",

      defaultThick: "border-2 border-[var(--border-default)]",
      fadedThick: "border-2 border-[var(--border-faded)]",
      greenThick: "border-2 border-[var(--border-green)]",
      specialThick: "border-2 border-[var(--border-special)]",

      defaultThinRight: "border-r border-[var(--border-default)]",
      fadedThinRight: "border-r border-[var(--border-faded)]",
      greenThinRight: "border-r border-[var(--border-green)]",
      specialThinRight: "border-r border-[var(--border-special)]",

      defaultThickRight: "border-r-2 border-[var(--border-default)]",
      fadedThickRight: "border-r-2 border-[var(--border-faded)]",
      greenThickRight: "border-r-2 border-[var(--border-green)]",
      specialThickRight: "border-r-2 border-[var(--border-special)]",

      defaultThinLeft: "border-l border-[var(--border-default)]",
      fadedThinLeft: "border-l border-[var(--border-faded)]",
      greenThinLeft: "border-l border-[var(--border-green)]",
      specialThinLeft: "border-l border-[var(--border-special)]",

      defaultThickLeft: "border-l-2 border-[var(--border-default)]",
      fadedThickLeft: "border-l-2 border-[var(--border-faded)]",
      greenThickLeft: "border-l-2 border-[var(--border-green)]",
      specialThickLeft: "border-l-2 border-[var(--border-special)]",

      defaultThinTop: "border-t border-[var(--border-default)]",
      fadedThinTop: "border-t border-[var(--border-faded)]",
      greenThinTop: "border-t border-[var(--border-green)]",
      specialThinTop: "border-t border-[var(--border-special)]",

      defaultThickTop: "border-t-2 border-[var(--border-default)]",
      fadedThickTop: "border-t-2 border-[var(--border-faded)]",
      greenThickTop: "border-t-2 border-[var(--border-green)]",
      specialThickTop: "border-t-2 border-[var(--border-special)]",

      defaultThinBottom: "border-b border-[var(--border-default)]",
      fadedThinBottom: "border-b border-[var(--border-faded)]",
      greenThinBottom: "border-b border-[var(--border-green)]",
      specialThinBottom: "border-b border-[var(--border-special)]",

      defaultThickBottom: "border-b-2 border-[var(--border-default)]",
      fadedThickBottom: "border-b-2 border-[var(--border-faded)]",
      greenThickBottom: "border-b-2 border-[var(--border-green)]",
      specialThickBottom: "border-b-2 border-[var(--border-special)]",
    },

    accent: {
      primary: "accent-[var(--accent-primary)]",
      secondary: "accent-[var(--accent-secondary)]",
      special: "accent-[var(--accent-special)]",
    },

    hover: {
      special: "hover:bg-[var(--hover-special)]",
      textSpecial: "hover:text-[var(--text-special)]",
    },

    properties: {
      interactiveButton:
        "cursor-pointer active:scale-95 transition-all duration-150 hover:opacity-90",
    },
  };
}
