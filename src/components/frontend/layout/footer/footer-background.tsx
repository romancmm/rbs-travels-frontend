export function FooterBackground() {
  return (
    <div
      className='absolute inset-0 overflow-hidden pointer-events-none'
      style={{
        background: `
          radial-gradient(ellipse 800px 600px at top right, rgba(var(--primary-rgb, 59, 130, 246), 0.15), transparent 50%),
          radial-gradient(ellipse 700px 500px at bottom left, rgba(var(--primary-rgb, 59, 130, 246), 0.1), transparent 50%)
        `
      }}
    />
  )
}
