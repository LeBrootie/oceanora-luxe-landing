import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowRight, ChevronDown, Clock3, Globe2, Link2, Mail, MapPin, Menu, Phone, Play, Share2, UserRound, X } from 'lucide-react'

const TOTAL_FRAMES = 600
const referenceAsset = 'https://realestate.thestyles.shop/'

const properties = [
  { number: '01', title: 'Cliffside Estate', location: 'Malibu, California', image: `${referenceAsset}property_cliffside.png` },
  { number: '02', title: 'Oceanview Villa', location: 'Miami, Florida', image: `${referenceAsset}property_oceanview.png` },
  { number: '03', title: 'Hillside Mansion', location: 'Beverly Hills, California', image: `${referenceAsset}property_hillside.png` },
  { number: '04', title: 'Waterfront Residence', location: 'Palm Beach, Florida', image: `${referenceAsset}property_waterfront.png` },
]

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'OCEANORA — Luxury Coastal Estates' },
    { name: 'description', content: 'A rare collection of oceanfront residences crafted for timeless living.' },
  ] }),
  component: OceanoraHome,
})

function OceanoraMark({ large = false }: { large?: boolean }) {
  return <div className={`brand-mark ${large ? 'brand-mark-large' : ''}`}><span className="wave-mark">∿</span><span>OCEANORA</span>{large && <small>LUXURY REAL ESTATE</small>}</div>
}

function CanvasSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(0)
  const images = useRef<HTMLImageElement[]>([])
  const currentFrame = useRef(0)
  const targetFrame = useRef(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    const framePath = (number: number) => `/frames/frame_${String(number).padStart(4, '0')}.jpg`
    const draw = (index: number) => {
      const image = images.current[index]
      if (!image?.naturalWidth) return
      const width = window.innerWidth
      const height = window.innerHeight
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
    }
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(currentFrame.current)
    }
    const animate = () => {
      const difference = targetFrame.current - currentFrame.current
      if (Math.abs(difference) < 1) { currentFrame.current = targetFrame.current; draw(currentFrame.current); raf.current = null; return }
      currentFrame.current = Math.round(currentFrame.current + difference * 0.22)
      draw(currentFrame.current)
      raf.current = requestAnimationFrame(animate)
    }
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0
      targetFrame.current = Math.round(progress * (TOTAL_FRAMES - 1))
      if (raf.current === null) raf.current = requestAnimationFrame(animate)
    }
    resize()
    const loadedImages = Array.from({ length: TOTAL_FRAMES }, (_, index) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = framePath(index + 1)
      image.onload = image.onerror = () => setLoaded(value => value + 1)
      return image
    })
    images.current = loadedImages
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('scroll', onScroll); if (raf.current) cancelAnimationFrame(raf.current) }
  }, [])

  return <><canvas ref={canvasRef} className="sequence-canvas" aria-label="Oceanora coastal estate visual sequence" /><div className={`loader ${loaded === TOTAL_FRAMES ? 'loader-hidden' : ''}`}><div className="loader-line"><span style={{ width: `${(loaded / TOTAL_FRAMES) * 100}%` }} /></div><span>PREPARING YOUR ARRIVAL · {Math.round((loaded / TOTAL_FRAMES) * 100)}%</span></div></>
}

function OceanoraHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const scrollTo = (progress: number) => { window.scrollTo({ top: progress * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'smooth' }); setMenuOpen(false) }
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubscribed(true) }

  return <main className="oceanora-page">
    <CanvasSequence />
    <div className="canvas-shade" />
    <div className="sequence-space" />
    <header className="site-header"><OceanoraMark /><button className="menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button></header>

    <section className="hero-screen" aria-label="Oceanora introduction">
      <div className="hero-copy"><span className="eyebrow">LUXURY SCUBA & COASTAL ESTATES</span><span className="pre-title">D E S C U B R A</span><h1><em>L</em>uxury</h1><span className="date-line">2 2 · D E · A B R I L</span><p className="hero-description">O COMEÇO DE UMA NOVA ERA EM<br />SOLO <strong>BRASILEIRO.</strong></p></div>
      <div className="hero-actions"><a className="gold-button" href="#residences">Explore Trips <ArrowRight /></a><button className="glass-button" onClick={() => scrollTo(0.28)}><span className="play-disc"><Play /></span> Watch Film</button></div>
      <div className="hero-footer"><div className="social-row"><Share2 /><Link2 /><Play /><span>/ OCEANORA</span></div><div className="contact-pill"><span><Phone /> +55 21 0000-0000</span><i /><span><MapPin /> RUA DAS ONDAS, 210<br />RIO DE JANEIRO, RJ</span></div><button className="scroll-prompt" onClick={() => scrollTo(0.18)}><span className="scroll-rule" />SCROLL TO EXPLORE<ArrowDown /></button></div>
    </section>

    <section id="residences" className="story-section residence-section"><div className="watermark">OCEANORA</div><div className="section-grid"><div><span className="eyebrow">CLIFFSIDE LUXURY</span><h2>Where Elegance<br />Meets the Ocean</h2><p className="section-lead">A rare collection of oceanfront residences crafted for those who value timeless design and exceptional living.</p><div className="button-row"><a className="light-button" href="#properties">View Residences <ArrowRight /></a><button className="glass-button"><span className="play-disc small"><Play /></span> Watch Video</button></div></div><div className="feature-list"><Feature icon="▧" title="Panoramic Views" text="Uninterrupted ocean and sunset views." /><Feature icon="✦" title="World Class Design" text="Award-winning architecture and interiors." /><Feature icon="♧" title="Concierge Service" text="Bespoke services for effortless living." /></div></div><div className="stats-row"><Stat value="12+" label="Exclusive Residences" /><Stat value="30,000+" label="Sq. Ft. Of Living Space" /><Stat value="180°" label="Oceanfront Views" /><Stat value="24/7" label="Private Concierge" /></div></section>

    <section id="properties" className="story-section agent-section"><div className="agent-heading"><div><span className="eyebrow">MEET YOUR AGENT</span><h2>Martin</h2><div className="gold-rule" /><p>Luxury Real Estate Specialist</p><div className="agent-socials"><Share2 /><Link2 /><UserRound /></div></div><div className="agent-portrait"><img src={`${referenceAsset}martin_agent.png`} alt="Martin, luxury real estate specialist" /><span><b /> Top Producer 2026</span></div></div><div className="property-grid">{properties.map(property => <article className="property-card" key={property.number} style={{ backgroundImage: `url(${property.image})` }}><span className="property-number">{property.number}</span><div><h3>{property.title}</h3><p>{property.location}</p><div className="card-socials"><Share2 /><Link2 /></div></div></article>)}</div><a className="outline-button" href="#newsletter">View All Properties <ArrowRight /></a></section>

    <footer id="newsletter" className="site-footer"><div className="newsletter"><div><span className="eyebrow">STAY CONNECTED</span><h2>Exceptional homes,<br />extraordinary living.</h2></div><p>Subscribe to receive exclusive property updates, luxury insights and off-market opportunities.</p><form onSubmit={submit}><div className="subscribe-field"><input type="email" placeholder="Enter your email" required /><button>{subscribed ? 'Subscribed' : 'Subscribe'} <ArrowRight /></button></div><small><Mail /> We respect your privacy.</small></form></div><div className="footer-main"><div className="footer-brand"><OceanoraMark large /><div className="gold-rule" /><p>Redefining luxury real estate through exceptional properties, world-class service and timeless experiences.</p><div className="agent-socials"><Share2 /><Link2 /><Play /><UserRound /></div></div><FooterColumn title="EXPLORE" items={['Properties', 'Off-Market Listings', 'New Developments', 'Sell Your Property', 'Luxury Collections']} /><FooterColumn title="ABOUT" items={['About Us', 'Our Story', 'Our Team', 'Careers', 'Press & Media']} /><FooterColumn title="RESOURCES" items={['Market Insights', 'Buying Guide', 'Selling Guide', 'Investors', 'FAQ']} /><div className="footer-contact"><h4>CONTACT</h4><Contact icon={<MapPin />} text={<>Rua das Ondas, 210<br />Rio de Janeiro, RJ 22640</>} /><Contact icon={<Phone />} text="+55 21 0000-0000" /><Contact icon={<Mail />} text="concierge@oceanora.com" /><Contact icon={<Clock3 />} text="Mon – Sun: 9:00 AM – 6:00 PM" /></div></div><div className="footer-bottom"><span>© 2026 OCEANORA. All rights reserved.</span><span>Privacy Policy | Terms of Use | Cookies Policy</span><span><Globe2 /> English <ChevronDown /></span></div></footer>

    {menuOpen && <div className="nav-drawer"><button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu" /><div className="drawer-panel"><div className="drawer-top"><OceanoraMark /><button className="menu-trigger" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button></div><nav>{[['01', 'Home', 0], ['02', 'About Us', 0.2], ['03', 'Residences', 0.36], ['04', 'Meet Martin', 0.62], ['05', 'Contact Us', 0.92]].map(([number, label, progress]) => <button key={label} onClick={() => scrollTo(progress as number)}><small>{number}</small>{label}<ArrowRight /></button>)}</nav><div className="drawer-footer"><span>LUXURY CONCIERGE</span><b>+55 21 0000-0000</b><b>concierge@oceanora.com</b></div></div></div>}
  </main>
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) { return <div className="feature"><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></div> }
function Stat({ value, label }: { value: string; label: string }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div> }
function FooterColumn({ title, items }: { title: string; items: string[] }) { return <div className="footer-column"><h4>{title}</h4>{items.map(item => <a href="#properties" key={item}>{item}<ArrowRight /></a>)}</div> }
function Contact({ icon, text }: { icon: ReactNode; text: ReactNode }) { return <div className="contact-line">{icon}<span>{text}</span></div> }
