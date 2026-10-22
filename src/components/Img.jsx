import { useState } from 'react'
// Shows the image; if the file is missing (images not downloaded yet) it falls back to the gray box.
export default function Img({ src, alt = '', className }) {
  const [bad, setBad] = useState(false)
  if (!src || bad) return null
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}
