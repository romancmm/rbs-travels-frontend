'use client'

import { MoveUp } from 'lucide-react'

export default function GotoTop() {
  return (
    <button
      className='text-sm cursor-pointer'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      type='button'
    >
      Go Top
      <MoveUp strokeWidth={1.8} className='inline-block ml-1 w-3.5 h-3.5' />
    </button>
  )
}
