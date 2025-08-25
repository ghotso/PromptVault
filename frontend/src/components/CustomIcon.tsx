interface CustomIconProps {
  type: 'icon' | 'logo'
  className?: string
  size?: number
}

export function CustomIcon({ type, className = '', size = 24 }: CustomIconProps) {
  if (type === 'icon') {
    return (
      <img
        src="/PromptVault_Icon_No_BG.svg"
        alt="PromptVault Icon"
        className={className}
        style={{ width: size, height: size }}
      />
    )
  }
  
  // For logo, we'll use the same SVG but with different styling
  return (
    <img
      src="/PromptVault_Icon_No_BG.svg"
      alt="PromptVault Logo"
      className={className}
      style={{ width: size, height: size }}
    />
  )
}
