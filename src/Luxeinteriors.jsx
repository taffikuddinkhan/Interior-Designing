import { useState, useEffect, useRef } from "react";

const COLORS = {
    bg: "#0B0B0B",
    bgCard: "#151515",
    gold: "#C6A36D",
    cream: "#EAE4DA",
    goldLight: "#D4B483",
    goldDim: "#8A6F47",
    white: "#FFFFFF",
    gray: "#888888",
    grayDark: "#333333",
    border: "rgba(198,163,109,0.15)",
    borderHover: "rgba(198,163,109,0.4)",
    glass: "rgba(21,21,21,0.85)",
};

const FONTS = {
    heading: "'Playfair Display', 'Georgia', serif",
    body: "'Inter', 'Helvetica Neue', sans-serif",
};

function useCountUp(target, duration = 2000, trigger = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!trigger) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration, trigger]);
    return count;
}

function useInView(ref) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
        const current = ref.current;
        if (current) obs.observe(current);
        return () => obs.disconnect();
    }, [ref]);
    return inView;
}

function Navbar({ activeSection }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);
    const links = ["Home","Services","Portfolio","Process","Testimonials","Pricing","Team","Contact"];
    const scrollTo = (id) => {
        setMenuOpen(false);
        const el = document.getElementById(id.toLowerCase());
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            background: scrolled ? "rgba(11,11,11,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? `1px solid ${COLORS.border}` : "none",
            transition: "all 0.4s ease", padding: "0 2rem",
            fontFamily: FONTS.body,
        }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, border: `1.5px solid ${COLORS.gold}`, transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ transform: "rotate(-45deg)", color: COLORS.gold, fontSize: 14, fontFamily: FONTS.heading, fontWeight: 700 }}>L</span>
                    </div>
                    <span style={{ color: COLORS.white, fontFamily: FONTS.heading, fontSize: 20, letterSpacing: 2 }}>LUXE<span style={{ color: COLORS.gold }}>STUDIO</span></span>
                </div>
                <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="nav-links">
                    {links.map(l => (
                        <button key={l} onClick={() => scrollTo(l)} style={{
                            background: "none", border: "none", color: activeSection === l.toLowerCase() ? COLORS.gold : COLORS.gray,
                            fontFamily: FONTS.body, fontSize: 13, letterSpacing: 1, cursor: "pointer",
                            textTransform: "uppercase", transition: "color 0.3s", padding: 0,
                        }}
                                onMouseEnter={e => e.target.style.color = COLORS.gold}
                                onMouseLeave={e => e.target.style.color = activeSection === l.toLowerCase() ? COLORS.gold : COLORS.gray}
                        >{l}</button>
                    ))}
                    <button onClick={() => scrollTo("contact")} style={{
                        background: "transparent", border: `1px solid ${COLORS.gold}`,
                        color: COLORS.gold, padding: "8px 20px", fontFamily: FONTS.body, fontSize: 12,
                        letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer",
                        transition: "all 0.3s",
                    }}
                            onMouseEnter={e => { e.target.style.background = COLORS.gold; e.target.style.color = COLORS.bg; }}
                            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = COLORS.gold; }}
                    >Book Consultation</button>
                </div>
                <button onClick={() => setMenuOpen(!menuOpen)} style={{
                    display: "none", background: "none", border: "none", color: COLORS.white,
                    fontSize: 24, cursor: "pointer",
                }} className="menu-btn">☰</button>
            </div>
            {menuOpen && (
                <div style={{
                    background: "rgba(11,11,11,0.97)", padding: "1.5rem 2rem",
                    borderTop: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", gap: 16
                }}>
                    {links.map(l => (
                        <button key={l} onClick={() => scrollTo(l)} style={{
                            background: "none", border: "none", color: COLORS.gray,
                            fontFamily: FONTS.body, fontSize: 14, letterSpacing: 1, cursor: "pointer",
                            textTransform: "uppercase", textAlign: "left", padding: "6px 0"
                        }}>{l}</button>
                    ))}
                </div>
            )}
        </nav>
    );
}

function HeroSection() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [loaded, setLoaded] = useState(false);
    useEffect(() => { setTimeout(() => setLoaded(true), 300); }, []);
    const handleMouse = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: (e.clientX - rect.left) / rect.width - 0.5, y: (e.clientY - rect.top) / rect.height - 0.5 });
    };
    const scrollToPortfolio = () => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
    const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

    return (
        <section id="home" onMouseMove={handleMouse} style={{
            height: "100vh", minHeight: 700, position: "relative", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg,
        }}>
            <div style={{
                position: "absolute", inset: 0,
                background: `
          radial-gradient(ellipse 80% 60% at 20% 50%, rgba(198,163,109,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 80% 20%, rgba(198,163,109,0.04) 0%, transparent 50%),
          linear-gradient(180deg, #0B0B0B 0%, #101008 50%, #0B0B0B 100%)
        `,
                transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -8}px)`,
                transition: "transform 0.8s ease",
            }} />

            {/* Floating geometric lines */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }} viewBox="0 0 1400 800">
                <line x1="0" y1="200" x2="400" y2="0" stroke={COLORS.gold} strokeWidth="0.5"/>
                <line x1="1400" y1="600" x2="1000" y2="800" stroke={COLORS.gold} strokeWidth="0.5"/>
                <line x1="700" y1="0" x2="700" y2="800" stroke={COLORS.gold} strokeWidth="0.3"/>
                <rect x="250" y="150" width="200" height="200" fill="none" stroke={COLORS.gold} strokeWidth="0.4" transform="rotate(15, 350, 250)"/>
                <rect x="950" y="400" width="150" height="150" fill="none" stroke={COLORS.gold} strokeWidth="0.4" transform="rotate(-20, 1025, 475)"/>
                <circle cx="1100" cy="150" r="80" fill="none" stroke={COLORS.gold} strokeWidth="0.4"/>
                <circle cx="300" cy="600" r="60" fill="none" stroke={COLORS.gold} strokeWidth="0.3"/>
            </svg>

            {/* Ambient orbs */}
            <div style={{
                position: "absolute", width: 600, height: 600, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(198,163,109,0.06) 0%, transparent 70%)",
                top: "50%", left: "30%", transform: "translate(-50%,-50%)",
                animation: "pulse 6s ease-in-out infinite",
            }} />
            <div style={{
                position: "absolute", width: 400, height: 400, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(198,163,109,0.04) 0%, transparent 70%)",
                bottom: "10%", right: "20%",
                animation: "pulse 8s ease-in-out infinite 2s",
            }} />

            <div style={{
                position: "relative", zIndex: 2, textAlign: "center", padding: "0 2rem", maxWidth: 900,
                opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 1s ease 0.3s",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 32 }}>
                    <div style={{ height: 1, width: 60, background: `linear-gradient(to right, transparent, ${COLORS.gold})` }} />
                    <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: 11, letterSpacing: 4, textTransform: "uppercase" }}>Award-Winning Interiors</span>
                    <div style={{ height: 1, width: 60, background: `linear-gradient(to left, transparent, ${COLORS.gold})` }} />
                </div>
                <h1 style={{
                    fontFamily: FONTS.heading, fontWeight: 700, color: COLORS.white,
                    fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 1.1, marginBottom: 12,
                    letterSpacing: -1,
                }}>
                    Design Beyond<br /><span style={{ color: COLORS.gold, fontStyle: "italic" }}>Imagination</span>
                </h1>
                <p style={{
                    color: COLORS.gray, fontFamily: FONTS.body, fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7, letterSpacing: 0.3,
                }}>
                    We craft extraordinary spaces that blend timeless elegance with contemporary vision — where every detail tells your story.
                </p>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={scrollToContact} style={{
                        background: COLORS.gold, border: "none", color: COLORS.bg,
                        padding: "14px 36px", fontFamily: FONTS.body, fontSize: 13, letterSpacing: 2,
                        textTransform: "uppercase", cursor: "pointer", fontWeight: 600, transition: "all 0.3s",
                    }}
                            onMouseEnter={e => { e.target.style.background = COLORS.goldLight; e.target.style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { e.target.style.background = COLORS.gold; e.target.style.transform = "translateY(0)"; }}
                    >Start Your Project</button>
                    <button onClick={scrollToPortfolio} style={{
                        background: "transparent", border: `1px solid rgba(255,255,255,0.25)`, color: COLORS.white,
                        padding: "14px 36px", fontFamily: FONTS.body, fontSize: 13, letterSpacing: 2,
                        textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s",
                    }}
                            onMouseEnter={e => { e.target.style.borderColor = COLORS.gold; e.target.style.color = COLORS.gold; }}
                            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.25)"; e.target.style.color = COLORS.white; }}
                    >View Portfolio</button>
                </div>

                {/* Trust stats */}
                <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
                    {[["200+","Projects Completed"],["8+","Years Experience"],["98%","Client Satisfaction"]].map(([num, label]) => (
                        <div key={label} style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: FONTS.heading, fontSize: "2rem", color: COLORS.gold, fontWeight: 700 }}>{num}</div>
                            <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.gray, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll indicator */}
            <div style={{
                position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                animation: "bounce 2s ease-in-out infinite",
            }}>
                <span style={{ color: COLORS.gray, fontFamily: FONTS.body, fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
                <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${COLORS.gold}, transparent)` }} />
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:.6;transform:scale(1) translate(-50%,-50%)} 50%{opacity:1;transform:scale(1.1) translate(-50%,-50%)} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideLeft { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes countUp { from{opacity:0} to{opacity:1} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0B0B0B; color: #fff; overflow-x: hidden; }
        section { scroll-margin-top: 70px; }
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}</style>
        </section>
    );
}

function ServicesSection() {
    const ref = useRef();
    const inView = useInView(ref);
    const services = [
        { icon: "🏠", title: "Residential Interior", desc: "Luxurious homes that reflect your personality and lifestyle with bespoke design solutions." },
        { icon: "🏢", title: "Commercial Interior", desc: "Inspiring workspaces that enhance productivity and leave lasting impressions on clients." },
        { icon: "🍳", title: "Modular Kitchen", desc: "Functional and elegant kitchens with premium finishes and smart storage solutions." },
        { icon: "🛏", title: "Bedroom Design", desc: "Tranquil sanctuaries designed for ultimate comfort, rest, and personal expression." },
        { icon: "🛋", title: "Living Room Design", desc: "Inviting social spaces that balance aesthetics with everyday comfort and flow." },
        { icon: "🪑", title: "Furniture Design", desc: "Custom furniture crafted to fit your space perfectly — built for generations." },
        { icon: "🏗", title: "Office Interior", desc: "Professional environments designed to inspire creativity and drive performance." },
        { icon: "🔨", title: "Renovation", desc: "Transform existing spaces with thoughtful redesign and precision craftsmanship." },
    ];
    return (
        <section id="services" ref={ref} style={{ background: COLORS.bg, padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <SectionHeader label="What We Do" title="Our Expertise" subtitle="From concept to completion, we deliver spaces that transcend expectations" inView={inView} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 2, marginTop: 64 }}>
                    {services.map((s, i) => (
                        <ServiceCard key={s.title} {...s} delay={i * 80} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ icon, title, desc, delay, inView }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                background: hov ? COLORS.bgCard : "rgba(21,21,21,0.5)",
                border: `1px solid ${hov ? COLORS.border : "rgba(255,255,255,0.04)"}`,
                padding: "36px 32px", cursor: "pointer",
                transition: "all 0.4s ease",
                transform: inView ? "translateY(0)" : "translateY(40px)",
                opacity: inView ? 1 : 0,
                transitionDelay: `${delay}ms`,
                position: "relative", overflow: "hidden",
            }}
        >
            {hov && <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`,
            }} />}
            <div style={{ fontSize: 36, marginBottom: 20 }}>{icon}</div>
            <h3 style={{ color: hov ? COLORS.gold : COLORS.white, fontFamily: FONTS.heading, fontSize: "1.15rem", marginBottom: 12, transition: "color 0.3s" }}>{title}</h3>
            <p style={{ color: COLORS.gray, fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
            <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, color: hov ? COLORS.gold : COLORS.grayDark, fontSize: 13, letterSpacing: 1, transition: "color 0.3s" }}>
                <span>EXPLORE</span>
                <span style={{ transform: hov ? "translateX(4px)" : "translateX(0)", transition: "transform 0.3s" }}>→</span>
            </div>
        </div>
    );
}

const PROJECTS = [
    { title: "The Meridian Penthouse", style: "Modern Luxury", area: "4,200 sq ft", budget: "₹85L", location: "Mumbai", tags: ["Modern","Luxury"], img: "linear-gradient(135deg, #1a1208 0%, #2d1f0a 40%, #1a1208 100%)" },
    { title: "Casa Blanca Villa", style: "Scandinavian", area: "3,800 sq ft", budget: "₹72L", location: "Bangalore", tags: ["Scandinavian","Minimal"], img: "linear-gradient(135deg, #0d1a1a 0%, #0f2424 40%, #0d1a1a 100%)" },
    { title: "The Urban Loft", style: "Industrial Minimal", area: "2,100 sq ft", budget: "₹38L", location: "Delhi", tags: ["Minimal"], img: "linear-gradient(135deg, #111118 0%, #1a1a28 40%, #111118 100%)" },
    { title: "Serene Sanctuary", style: "Traditional Luxury", area: "5,500 sq ft", budget: "₹1.2Cr", location: "Hyderabad", tags: ["Luxury","Traditional"], img: "linear-gradient(135deg, #150c0c 0%, #200f0f 40%, #150c0c 100%)" },
    { title: "Nexus HQ", style: "Contemporary Office", area: "8,000 sq ft", budget: "₹95L", location: "Pune", tags: ["Modern"], img: "linear-gradient(135deg, #0c1215 0%, #111a1e 40%, #0c1215 100%)" },
    { title: "The Ivory Suite", style: "Classic Elegance", area: "3,200 sq ft", budget: "₹64L", location: "Chennai", tags: ["Luxury","Traditional"], img: "linear-gradient(135deg, #141408 0%, #1e1e0c 40%, #141408 100%)" },
];

function PortfolioSection() {
    const ref = useRef();
    const inView = useInView(ref);
    const [filter, setFilter] = useState("All");
    const filters = ["All","Modern","Luxury","Minimal","Scandinavian","Traditional"];
    const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.tags.includes(filter));
    return (
        <section id="portfolio" ref={ref} style={{ background: "#0D0D0D", padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <SectionHeader label="Our Work" title="Featured Projects" subtitle="A curated selection of spaces we've transformed into extraordinary experiences" inView={inView} />
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 48, marginBottom: 56 }}>
                    {filters.map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            background: filter === f ? COLORS.gold : "transparent",
                            border: `1px solid ${filter === f ? COLORS.gold : COLORS.border}`,
                            color: filter === f ? COLORS.bg : COLORS.gray,
                            padding: "8px 20px", fontFamily: FONTS.body, fontSize: 12, letterSpacing: 1.5,
                            textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s",
                            fontWeight: filter === f ? 600 : 400,
                        }}>{f}</button>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 2 }}>
                    {filtered.map((p, i) => <ProjectCard key={p.title} {...p} delay={i * 100} inView={inView} />)}
                </div>
            </div>
        </section>
    );
}

function ProjectCard({ title, style, area, budget, location, img, delay, inView }) {
    const [hov, setHov] = useState(false);
    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
             style={{
                 position: "relative", overflow: "hidden", height: 420, cursor: "pointer",
                 opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(50px)",
                 transition: `all 0.7s ease ${delay}ms`,
             }}>
            {/* Background image simulation */}
            <div style={{
                position: "absolute", inset: 0, background: img,
                transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.7s ease",
            }} />
            {/* Gold accent lines (simulate room) */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
                <svg viewBox="0 0 400 420" style={{ width: "100%", height: "100%" }}>
                    <line x1="80" y1="140" x2="320" y2="140" stroke={COLORS.gold} strokeWidth="0.5"/>
                    <line x1="80" y1="140" x2="20" y2="420" stroke={COLORS.gold} strokeWidth="0.5"/>
                    <line x1="320" y1="140" x2="380" y2="420" stroke={COLORS.gold} strokeWidth="0.5"/>
                    <rect x="120" y="220" width="80" height="120" fill="none" stroke={COLORS.gold} strokeWidth="0.5"/>
                    <rect x="220" y="220" width="80" height="120" fill="none" stroke={COLORS.gold} strokeWidth="0.5"/>
                    <rect x="140" y="50" width="120" height="80" fill="none" stroke={COLORS.gold} strokeWidth="0.5"/>
                    <line x1="200" y1="0" x2="200" y2="140" stroke={COLORS.gold} strokeWidth="0.5"/>
                </svg>
            </div>
            {/* Gradient overlay */}
            <div style={{
                position: "absolute", inset: 0,
                background: hov
                    ? "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.1) 100%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                transition: "background 0.5s",
            }} />
            {/* Gold corner accent */}
            <div style={{
                position: "absolute", top: 20, right: 20, width: 40, height: 40,
                borderTop: `1.5px solid ${COLORS.gold}`, borderRight: `1.5px solid ${COLORS.gold}`,
                opacity: hov ? 1 : 0.4, transition: "opacity 0.3s",
            }} />
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px",
                transform: hov ? "translateY(0)" : "translateY(10px)", transition: "transform 0.4s",
            }}>
                <div style={{ color: COLORS.gold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontFamily: FONTS.body }}>{style}</div>
                <h3 style={{ color: COLORS.white, fontFamily: FONTS.heading, fontSize: "1.3rem", marginBottom: 16 }}>{title}</h3>
                <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
                    opacity: hov ? 1 : 0, transform: hov ? "translateY(0)" : "translateY(10px)",
                    transition: "all 0.4s ease 0.1s",
                }}>
                    {[["📐", area],["💰", budget],["📍", location]].map(([ic, val]) => (
                        <div key={val} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 12 }}>{ic}</div>
                            <div style={{ color: COLORS.cream, fontSize: 12, fontFamily: FONTS.body, marginTop: 4 }}>{val}</div>
                        </div>
                    ))}
                </div>
                <div style={{
                    marginTop: 20, display: "flex", alignItems: "center", gap: 8,
                    color: COLORS.gold, fontSize: 12, letterSpacing: 1.5,
                    opacity: hov ? 1 : 0, transition: "opacity 0.4s ease 0.2s",
                }}>
                    <span>VIEW PROJECT</span><span>→</span>
                </div>
            </div>
        </div>
    );
}

function BeforeAfterSection() {
    const ref = useRef();
    const inView = useInView(ref);
    const [sliderPos, setSliderPos] = useState(50);
    const [dragging, setDragging] = useState(false);
    const containerRef = useRef();
    const handleMove = (clientX) => {
        if (!dragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const pos = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
        setSliderPos(pos);
    };
    return (
        <section id="beforeafter" ref={ref} style={{ background: COLORS.bg, padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <SectionHeader label="Transformation" title="Before & After" subtitle="Witness the power of thoughtful design — the same space, reimagined" inView={inView} />
                <div ref={containerRef}
                     style={{
                         position: "relative", height: 500, marginTop: 64, cursor: "col-resize", overflow: "hidden",
                         opacity: inView ? 1 : 0, transition: "opacity 1s ease 0.3s", userSelect: "none",
                     }}
                     onMouseDown={() => setDragging(true)}
                     onMouseUp={() => setDragging(false)}
                     onMouseLeave={() => setDragging(false)}
                     onMouseMove={e => handleMove(e.clientX)}
                     onTouchMove={e => { setDragging(true); handleMove(e.touches[0].clientX); }}
                     onTouchEnd={() => setDragging(false)}
                >
                    {/* BEFORE */}
                    <div style={{ position: "absolute", inset: 0 }}>
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(135deg, #1a1008 0%, #251508 60%, #1a1008 100%)",
                        }} />
                        <svg viewBox="0 0 1100 500" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.2 }}>
                            <rect x="50" y="80" width="400" height="320" fill="none" stroke="#666" strokeWidth="1"/>
                            <rect x="100" y="180" width="100" height="120" fill="#333" stroke="#555" strokeWidth="0.5"/>
                            <rect x="250" y="200" width="150" height="100" fill="#2a2a2a" stroke="#444" strokeWidth="0.5"/>
                            <line x1="50" y1="400" x2="450" y2="400" stroke="#555" strokeWidth="2"/>
                        </svg>
                        <div style={{ position: "absolute", top: 24, left: 24, background: "rgba(0,0,0,0.7)", padding: "8px 16px", border: "1px solid rgba(255,255,255,0.15)" }}>
                            <span style={{ color: COLORS.gray, fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>Before</span>
                        </div>
                    </div>
                    {/* AFTER */}
                    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(135deg, #0f0c05 0%, #1a1508 40%, #241c0a 100%)",
                        }} />
                        <svg viewBox="0 0 1100 500" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }}>
                            <rect x="50" y="60" width="1000" height="380" fill="none" stroke={COLORS.goldDim} strokeWidth="0.5"/>
                            <line x1="50" y1="220" x2="1050" y2="220" stroke={COLORS.goldDim} strokeWidth="0.3"/>
                            <rect x="100" y="270" width="200" height="150" fill={`${COLORS.gold}22`} stroke={COLORS.goldDim} strokeWidth="0.8"/>
                            <rect x="350" y="250" width="300" height="170" fill={`${COLORS.gold}15`} stroke={COLORS.goldDim} strokeWidth="0.8"/>
                            <rect x="700" y="270" width="150" height="150" fill={`${COLORS.gold}18`} stroke={COLORS.goldDim} strokeWidth="0.8"/>
                            <circle cx="870" cy="160" r="50" fill="none" stroke={COLORS.gold} strokeWidth="0.8"/>
                            <line x1="870" y1="100" x2="870" y2="60" stroke={COLORS.gold} strokeWidth="0.8"/>
                            <line x1="870" y1="220" x2="870" y2="260" stroke={COLORS.gold} strokeWidth="0.8"/>
                            <rect x="200" y="80" width="600" height="80" fill={`${COLORS.gold}08`} stroke={COLORS.goldDim} strokeWidth="0.5"/>
                        </svg>
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(to bottom, transparent 50%, rgba(10,8,3,0.6) 100%)",
                        }} />
                        <div style={{ position: "absolute", top: 24, right: 24, background: `rgba(198,163,109,0.15)`, padding: "8px 16px", border: `1px solid ${COLORS.border}` }}>
                            <span style={{ color: COLORS.gold, fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>After</span>
                        </div>
                    </div>
                    {/* Slider line */}
                    <div style={{
                        position: "absolute", top: 0, bottom: 0, left: `${sliderPos}%`, transform: "translateX(-50%)",
                        width: 2, background: COLORS.gold, zIndex: 3, pointerEvents: "none",
                    }}>
                        <div style={{
                            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                            width: 44, height: 44, borderRadius: "50%", background: COLORS.gold,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 0 20px rgba(198,163,109,0.5)",
                        }}>
                            <span style={{ color: COLORS.bg, fontSize: 16, fontWeight: 700 }}>⇔</span>
                        </div>
                    </div>
                </div>
                <p style={{ textAlign: "center", color: COLORS.gray, fontSize: 13, marginTop: 20, letterSpacing: 1 }}>Drag the slider to reveal the transformation</p>
            </div>
        </section>
    );
}

function ProcessSection() {
    const ref = useRef();
    const inView = useInView(ref);
    const steps = [
        { n: "01", title: "Discovery", desc: "Deep dive into your vision, lifestyle, and aesthetic preferences through detailed consultation." },
        { n: "02", title: "Concept", desc: "Develop mood boards, space planning, and initial design concepts tailored to your brief." },
        { n: "03", title: "3D Visualization", desc: "Photorealistic 3D renders that let you experience your space before execution begins." },
        { n: "04", title: "Approval", desc: "Review, refine, and approve every detail until the design perfectly matches your vision." },
        { n: "05", title: "Execution", desc: "Our skilled craftsmen bring the design to life with precision and premium materials." },
        { n: "06", title: "Delivery", desc: "Final walkthrough, styling touches, and handover of your dream space." },
    ];
    return (
        <section id="process" ref={ref} style={{ background: "#0D0D0D", padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <SectionHeader label="How We Work" title="Our Design Process" subtitle="A transparent, collaborative journey from concept to completion" inView={inView} />
                <div style={{ position: "relative", marginTop: 80 }}>
                    {/* Connecting line */}
                    <div style={{
                        position: "absolute", top: 28, left: "calc(8.33% + 24px)", right: "calc(8.33% + 24px)",
                        height: 1, background: `linear-gradient(to right, ${COLORS.gold}33, ${COLORS.gold}88, ${COLORS.gold}33)`,
                        opacity: inView ? 1 : 0, transition: "opacity 1s ease 0.5s",
                    }} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 32 }}>
                        {steps.map((s, i) => (
                            <div key={s.n} style={{
                                opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)",
                                transition: `all 0.6s ease ${i * 100 + 200}ms`,
                            }}>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, position: "relative" }}>
                                    <div style={{
                                        width: 56, height: 56, borderRadius: "50%",
                                        border: `1px solid ${COLORS.gold}`,
                                        background: `radial-gradient(circle, rgba(198,163,109,0.15) 0%, transparent 70%)`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontFamily: FONTS.body, fontSize: 12, color: COLORS.gold, letterSpacing: 1,
                                        fontWeight: 600, zIndex: 1,
                                    }}>{s.n}</div>
                                </div>
                                <h3 style={{ fontFamily: FONTS.heading, color: COLORS.white, fontSize: "1.1rem", textAlign: "center", marginBottom: 12 }}>{s.title}</h3>
                                <p style={{ color: COLORS.gray, fontSize: 13, lineHeight: 1.7, textAlign: "center" }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function RoomVisualizer() {
    const ref = useRef();
    const inView = useInView(ref);
    const [room, setRoom] = useState("Living Room");
    const [theme, setTheme] = useState("Modern");
    const [wallColor, setWallColor] = useState("#1a1510");
    const [lighting, setLighting] = useState("Warm");

    const themes = { Modern: COLORS.gold, Luxury: "#D4AF37", Minimal: "#9E9E9E", Scandinavian: "#B8C5C0", Traditional: "#8B5E3C" };
    const rooms = ["Living Room","Bedroom","Kitchen","Office","Dining Room"];
    const themeKeys = Object.keys(themes);
    const lightings = ["Warm","Cool","Daylight","Dramatic"];
    const lightColors = { Warm: "rgba(255,200,100,0.06)", Cool: "rgba(100,150,255,0.05)", Daylight: "rgba(255,255,255,0.04)", Dramatic: "rgba(198,163,109,0.08)" };

    return (
        <section id="visualizer" ref={ref} style={{ background: COLORS.bg, padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <SectionHeader label="Explore & Customize" title="Room Visualizer" subtitle="Experiment with styles, colors, and lighting to envision your space" inView={inView} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, marginTop: 64, alignItems: "start" }}>
                    {/* Preview */}
                    <div style={{
                        position: "relative", height: 480, overflow: "hidden",
                        background: wallColor, border: `1px solid ${COLORS.border}`,
                        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
                        transition: "all 0.8s ease 0.2s",
                    }}>
                        <div style={{ position: "absolute", inset: 0, background: lightColors[lighting], transition: "background 0.5s" }} />
                        {/* Room SVG */}
                        <svg viewBox="0 0 700 480" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                            {/* Floor */}
                            <path d="M0 340 L700 340 L700 480 L0 480 Z" fill={`${themes[theme]}15`} />
                            {/* Back wall */}
                            <path d="M120 80 L580 80 L580 340 L120 340 Z" fill={`${themes[theme]}08`} />
                            {/* Perspective lines */}
                            <line x1="0" y1="0" x2="120" y2="80" stroke={themes[theme]} strokeWidth="0.5" opacity="0.3"/>
                            <line x1="700" y1="0" x2="580" y2="80" stroke={themes[theme]} strokeWidth="0.5" opacity="0.3"/>
                            <line x1="0" y1="480" x2="120" y2="340" stroke={themes[theme]} strokeWidth="0.5" opacity="0.3"/>
                            <line x1="700" y1="480" x2="580" y2="340" stroke={themes[theme]} strokeWidth="0.5" opacity="0.3"/>
                            {/* Sofa */}
                            <rect x="200" y="250" width="300" height="80" rx="4" fill={`${themes[theme]}25`} stroke={themes[theme]} strokeWidth="0.8"/>
                            <rect x="210" y="220" width="280" height="40" rx="4" fill={`${themes[theme]}20`} stroke={themes[theme]} strokeWidth="0.6"/>
                            {/* Coffee table */}
                            <rect x="270" y="340" width="160" height="10" fill={`${themes[theme]}30`} stroke={themes[theme]} strokeWidth="0.5"/>
                            {/* Lamp */}
                            <line x1="540" y1="200" x2="540" y2="340" stroke={themes[theme]} strokeWidth="1" opacity="0.6"/>
                            <ellipse cx="540" cy="190" rx="30" ry="15" fill="none" stroke={themes[theme]} strokeWidth="0.8" opacity="0.8"/>
                            {lighting === "Warm" || lighting === "Dramatic" ? <ellipse cx="540" cy="200" rx="60" ry="40" fill={`${themes[theme]}12`}/> : null}
                            {/* Window */}
                            <rect x="240" y="100" width="220" height="140" fill={`${themes[theme]}10`} stroke={themes[theme]} strokeWidth="0.8" opacity="0.8"/>
                            <line x1="350" y1="100" x2="350" y2="240" stroke={themes[theme]} strokeWidth="0.5" opacity="0.6"/>
                            <line x1="240" y1="170" x2="460" y2="170" stroke={themes[theme]} strokeWidth="0.5" opacity="0.6"/>
                            {/* Rug */}
                            <ellipse cx="350" cy="370" rx="120" ry="25" fill="none" stroke={`${themes[theme]}40`} strokeWidth="0.8"/>
                        </svg>
                        <div style={{ position: "absolute", bottom: 20, left: 20, display: "flex", gap: 12 }}>
                            <div style={{ background: "rgba(0,0,0,0.6)", padding: "6px 14px", border: `1px solid ${COLORS.border}` }}>
                                <span style={{ color: COLORS.gold, fontSize: 11, letterSpacing: 1 }}>{room} · {theme}</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div style={{
                        opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(30px)",
                        transition: "all 0.8s ease 0.4s",
                    }}>
                        <VisualizerControl label="Room Type" options={rooms} value={room} onChange={setRoom} accent={COLORS.gold} />
                        <VisualizerControl label="Design Theme" options={themeKeys} value={theme} onChange={setTheme} accent={COLORS.gold} />
                        <VisualizerControl label="Lighting Mood" options={lightings} value={lighting} onChange={setLighting} accent={COLORS.gold} />
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ color: COLORS.gray, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Wall Color</div>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                {["#1a1510","#0f1a1a","#111118","#150c0c","#181210","#0c1215"].map(c => (
                                    <button key={c} onClick={() => setWallColor(c)} style={{
                                        width: 36, height: 36, background: c, border: wallColor === c ? `2px solid ${COLORS.gold}` : `1px solid ${COLORS.border}`,
                                        cursor: "pointer", transition: "border 0.2s",
                                    }}/>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{
                            width: "100%", background: COLORS.gold, border: "none", color: COLORS.bg,
                            padding: "14px 24px", fontFamily: FONTS.body, fontSize: 12, letterSpacing: 2,
                            textTransform: "uppercase", cursor: "pointer", fontWeight: 600, marginTop: 8,
                        }}>Request Full Design</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function VisualizerControl({ label, options, value, onChange, accent }) {
    return (
        <div style={{ marginBottom: 28 }}>
            <div style={{ color: COLORS.gray, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{label}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {options.map(o => (
                    <button key={o} onClick={() => onChange(o)} style={{
                        background: value === o ? `${accent}20` : "transparent",
                        border: `1px solid ${value === o ? accent : COLORS.border}`,
                        color: value === o ? accent : COLORS.gray,
                        padding: "7px 14px", fontFamily: FONTS.body, fontSize: 12,
                        cursor: "pointer", transition: "all 0.25s", letterSpacing: 0.5,
                    }}>{o}</button>
                ))}
            </div>
        </div>
    );
}

function TestimonialsSection() {
    const ref = useRef();
    const inView = useInView(ref);
    const [active, setActive] = useState(0);
    const testimonials = [
        { name: "Priya Mehta", role: "Homeowner, Mumbai", rating: 5, text: "LuxeStudio transformed our 3BHK into a magazine-worthy home. The attention to detail and understanding of our vision was unparalleled. Every corner feels intentional and beautiful.", avatar: "PM" },
        { name: "Arjun Kapoor", role: "CEO, Nexus Corp", rating: 5, text: "Our office redesign exceeded every expectation. The team created a space that embodies our brand values while dramatically improving team morale and productivity.", avatar: "AK" },
        { name: "Sneha Reddy", role: "Homeowner, Bangalore", rating: 5, text: "From the first consultation to the final delivery, the experience was seamless. The Scandinavian kitchen they designed has become the heart of our home.", avatar: "SR" },
        { name: "Vikram Singh", role: "Villa Owner, Goa", rating: 5, text: "The luxury villa project was a dream come true. LuxeStudio's creativity and craftsmanship are truly world-class. Guests constantly ask who designed it.", avatar: "VS" },
    ];
    // NEW
    useEffect(() => {
        const len = testimonials.length;
        const t = setInterval(() => setActive(a => (a + 1) % len), 5000);
        return () => clearInterval(t);
    }, [testimonials.length]);
    return (
        <section id="testimonials" ref={ref} style={{ background: "#0D0D0D", padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <SectionHeader label="Client Stories" title="What They Say" subtitle="Every project is a relationship built on trust, creativity, and excellence" inView={inView} />
                <div style={{ position: "relative", marginTop: 64, minHeight: 280 }}>
                    {testimonials.map((t, i) => (
                        <div key={t.name} style={{
                            position: i === active ? "relative" : "absolute", top: 0, left: 0, right: 0,
                            opacity: i === active ? 1 : 0, transform: i === active ? "translateY(0)" : "translateY(20px)",
                            transition: "all 0.6s ease", pointerEvents: i === active ? "auto" : "none",
                            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                            padding: "48px 56px",
                        }}>
                            <div style={{ color: COLORS.gold, fontSize: 48, lineHeight: 1, marginBottom: 24, opacity: 0.5, fontFamily: FONTS.heading }}>"</div>
                            <p style={{ color: COLORS.cream, fontFamily: FONTS.heading, fontSize: "1.15rem", lineHeight: 1.8, fontStyle: "italic", marginBottom: 32 }}>{t.text}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{
                                        width: 50, height: 50, borderRadius: "50%",
                                        background: `linear-gradient(135deg, ${COLORS.goldDim}, ${COLORS.gold})`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: COLORS.bg, fontWeight: 700, fontSize: 15, fontFamily: FONTS.body,
                                    }}>{t.avatar}</div>
                                    <div>
                                        <div style={{ color: COLORS.white, fontWeight: 600, fontSize: 15 }}>{t.name}</div>
                                        <div style={{ color: COLORS.gray, fontSize: 12, letterSpacing: 0.5, marginTop: 2 }}>{t.role}</div>
                                    </div>
                                </div>
                                <div style={{ color: COLORS.gold, fontSize: 18, letterSpacing: 2 }}>{"★".repeat(t.rating)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
                    {testimonials.map((_, i) => (
                        <button key={i} onClick={() => setActive(i)} style={{
                            width: i === active ? 32 : 8, height: 8,
                            background: i === active ? COLORS.gold : COLORS.grayDark,
                            border: "none", cursor: "pointer", transition: "all 0.3s", borderRadius: 4,
                        }}/>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StatsSection() {
    const ref = useRef();
    const inView = useInView(ref);
    const stats = [
        { target: 200, suffix: "+", label: "Projects Completed", sublabel: "Across India" },
        { target: 98, suffix: "%", label: "Client Satisfaction", sublabel: "5-star reviews" },
        { target: 8, suffix: "+", label: "Years Experience", sublabel: "Premium design" },
        { target: 50, suffix: "+", label: "Design Awards", sublabel: "Industry recognition" },
    ];
    return (
        <section style={{ background: COLORS.bg, padding: "100px 2rem", fontFamily: FONTS.body }}>
            <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 2 }}>
                    {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} inView={inView} />)}
                </div>
            </div>
        </section>
    );
}

function StatCard({ target, suffix, label, sublabel, index, inView }) {
    const count = useCountUp(target, 2000, inView);
    return (
        <div style={{
            textAlign: "center", padding: "48px 32px",
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
            opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: `all 0.6s ease ${index * 150}ms`,
        }}>
            <div style={{ fontFamily: FONTS.heading, fontSize: "3.5rem", fontWeight: 700, color: COLORS.gold, lineHeight: 1 }}>
                {count}{suffix}
            </div>
            <div style={{ color: COLORS.white, fontFamily: FONTS.body, fontSize: 15, marginTop: 12, fontWeight: 500 }}>{label}</div>
            <div style={{ color: COLORS.gray, fontFamily: FONTS.body, fontSize: 12, marginTop: 6, letterSpacing: 1 }}>{sublabel}</div>
        </div>
    );
}

function PricingSection() {
    const ref = useRef();
    const inView = useInView(ref);
    const plans = [
        { name: "Essential", price: "₹1,500", unit: "/sq ft", tag: null, color: COLORS.grayDark,
            features: ["Space Planning","2D Floor Plans","3D Visualization (2 rooms)","Material Selection","Vendor Coordination","Site Visits (4)","6-month support"] },
        { name: "Signature", price: "₹2,500", unit: "/sq ft", tag: "Most Popular", color: COLORS.gold,
            features: ["Everything in Essential","Full 3D Rendering","Custom Furniture Design","Premium Material Sourcing","Dedicated Project Manager","Unlimited Site Visits","1-year support","Styling & Accessorizing"] },
        { name: "Prestige", price: "Custom", unit: "pricing", tag: "Bespoke", color: "#D4B483",
            features: ["Everything in Signature","International Designer Collab","Bespoke Art Curation","Smart Home Integration","Concierge Sourcing","VIP Client Experience","Lifetime support","Quarterly refreshes"] },
    ];
    return (
        <section id="pricing" ref={ref} style={{ background: "#0D0D0D", padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <SectionHeader label="Investment" title="Design Packages" subtitle="Transparent pricing for extraordinary spaces — tailored to every vision" inView={inView} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 2, marginTop: 64 }}>
                    {plans.map((p, i) => <PricingCard key={p.name} {...p} delay={i * 150} inView={inView} />)}
                </div>
            </div>
        </section>
    );
}

function PricingCard({ name, price, unit, tag, color, features, delay, inView }) {
    const featured = !!tag && color === COLORS.gold;
    const [hov, setHov] = useState(false);
    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
             style={{
                 background: featured ? "rgba(198,163,109,0.05)" : COLORS.bgCard,
                 border: `1px solid ${featured ? color : hov ? COLORS.border : "rgba(255,255,255,0.04)"}`,
                 padding: "48px 36px", position: "relative",
                 opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)",
                 transition: `all 0.7s ease ${delay}ms`,
             }}>
            {tag && (
                <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: color, color: COLORS.bg, padding: "4px 16px",
                    fontSize: 11, letterSpacing: 1.5, fontWeight: 700, textTransform: "uppercase",
                }}>{tag}</div>
            )}
            <div style={{ color: color, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>{name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 32 }}>
                <span style={{ fontFamily: FONTS.heading, color: COLORS.white, fontSize: "2.5rem", fontWeight: 700 }}>{price}</span>
                <span style={{ color: COLORS.gray, fontSize: 13 }}>{unit}</span>
            </div>
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 32, marginBottom: 32 }}>
                {features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                        <span style={{ color: color, fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
                        <span style={{ color: COLORS.gray, fontSize: 13, lineHeight: 1.5 }}>{f}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{
                width: "100%", background: featured ? color : "transparent",
                border: `1px solid ${featured ? color : COLORS.border}`,
                color: featured ? COLORS.bg : COLORS.gray,
                padding: "13px 24px", fontFamily: FONTS.body, fontSize: 12, letterSpacing: 2,
                textTransform: "uppercase", cursor: "pointer", fontWeight: featured ? 700 : 400,
                transition: "all 0.3s",
            }}
                    onMouseEnter={e => { if (!featured) { e.target.style.borderColor = color; e.target.style.color = color; } }}
                    onMouseLeave={e => { if (!featured) { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.gray; } }}
            >Get Started</button>
        </div>
    );
}

function TeamSection() {
    const ref = useRef();
    const inView = useInView(ref);
    const team = [
        { name: "Anika Sharma", role: "Principal Designer", exp: "12 years", initials: "AS", speciality: "Luxury Residential" },
        { name: "Rohan Desai", role: "Lead Architect", exp: "9 years", initials: "RD", speciality: "Commercial Spaces" },
        { name: "Kavya Nair", role: "Interior Stylist", exp: "7 years", initials: "KN", speciality: "Scandinavian & Minimal" },
        { name: "Aryan Patel", role: "3D Visualization", exp: "8 years", initials: "AP", speciality: "Digital Renders" },
    ];
    return (
        <section id="team" ref={ref} style={{ background: COLORS.bg, padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <SectionHeader label="The Creatives" title="Meet Our Team" subtitle="A collective of passionate designers, architects, and craftspeople" inView={inView} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 2, marginTop: 64 }}>
                    {team.map((m, i) => <TeamCard key={m.name} {...m} delay={i * 120} inView={inView} />)}
                </div>
            </div>
        </section>
    );
}

function TeamCard({ name, role, exp, initials, speciality, delay, inView }) {
    const [hov, setHov] = useState(false);
    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
             style={{
                 background: COLORS.bgCard, border: `1px solid ${hov ? COLORS.border : "rgba(255,255,255,0.04)"}`,
                 padding: "40px 32px", textAlign: "center", transition: "all 0.4s",
                 opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)",
                 transitionDelay: `${delay}ms`,
             }}>
            <div style={{
                width: 90, height: 90, borderRadius: "50%", margin: "0 auto 24px",
                background: hov
                    ? `linear-gradient(135deg, ${COLORS.goldDim}, ${COLORS.gold})`
                    : `linear-gradient(135deg, ${COLORS.grayDark}, #222)`,
                border: `2px solid ${hov ? COLORS.gold : COLORS.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 700, color: hov ? COLORS.bg : COLORS.gray,
                transition: "all 0.4s", fontFamily: FONTS.body,
            }}>{initials}</div>
            <h3 style={{ color: COLORS.white, fontFamily: FONTS.heading, fontSize: "1.1rem", marginBottom: 6 }}>{name}</h3>
            <div style={{ color: COLORS.gold, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{role}</div>
            <div style={{ color: COLORS.gray, fontSize: 13, marginBottom: 4 }}>{speciality}</div>
            <div style={{ color: COLORS.grayDark, fontSize: 12, letterSpacing: 0.5 }}>{exp} experience</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }}>
                {["in","be","tw"].map(s => (
                    <span key={s} style={{ color: COLORS.gold, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>{s}</span>
                ))}
            </div>
        </div>
    );
}

function GallerySection() {
    const ref = useRef();
    const inView = useInView(ref);
    const items = [
        { h: 280, label: "Kitchen Elegance", bg: "linear-gradient(135deg, #1a1208, #281a08)" },
        { h: 180, label: "Bedroom Suite", bg: "linear-gradient(135deg, #0f1018, #141520)" },
        { h: 320, label: "Living Luxury", bg: "linear-gradient(135deg, #150c0c, #200f0f)" },
        { h: 200, label: "Minimal Office", bg: "linear-gradient(135deg, #0d1a1a, #0f2020)" },
        { h: 240, label: "Dining Space", bg: "linear-gradient(135deg, #141408, #1e1e0c)" },
        { h: 300, label: "Villa Terrace", bg: "linear-gradient(135deg, #0c1215, #111820)" },
        { h: 180, label: "Powder Room", bg: "linear-gradient(135deg, #150c15, #200f20)" },
        { h: 260, label: "Loft Concept", bg: "linear-gradient(135deg, #111118, #18181f)" },
    ];
    return (
        <section id="gallery" ref={ref} style={{ background: "#0D0D0D", padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <SectionHeader label="Inspiration" title="Design Gallery" subtitle="A curated portfolio of spaces that push the boundaries of design" inView={inView} />
                <div style={{ columns: "4 200px", gap: 2, marginTop: 64 }}>
                    {items.map((item, i) => <GalleryItem key={i} {...item} delay={i * 80} inView={inView} />)}
                </div>
            </div>
        </section>
    );
}

function GalleryItem({ h, label, bg, delay, inView }) {
    const [hov, setHov] = useState(false);
    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
             style={{
                 breakInside: "avoid", marginBottom: 2, height: h, position: "relative",
                 overflow: "hidden", cursor: "pointer",
                 opacity: inView ? 1 : 0, transition: `opacity 0.6s ease ${delay}ms`,
             }}>
            <div style={{ position: "absolute", inset: 0, background: bg, transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s" }} />
            <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
                <svg viewBox={`0 0 200 ${h}`} style={{ width: "100%", height: "100%" }}>
                    <line x1="0" y1={h*0.4} x2="200" y2={h*0.4} stroke={COLORS.gold} strokeWidth="0.4"/>
                    <rect x="30" y={h*0.5} width="60" height={h*0.3} fill="none" stroke={COLORS.gold} strokeWidth="0.5"/>
                    <rect x="110" y={h*0.5} width="60" height={h*0.3} fill="none" stroke={COLORS.gold} strokeWidth="0.5"/>
                </svg>
            </div>
            <div style={{
                position: "absolute", inset: 0,
                background: hov ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.2)",
                transition: "background 0.4s",
            }} />
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px",
                transform: hov ? "translateY(0)" : "translateY(100%)", transition: "transform 0.4s",
            }}>
                <span style={{ color: COLORS.cream, fontFamily: FONTS.heading, fontSize: "0.95rem", fontStyle: "italic" }}>{label}</span>
            </div>
        </div>
    );
}

function FAQSection() {
    const ref = useRef();
    const inView = useInView(ref);
    const [open, setOpen] = useState(null);
    const faqs = [
        { q: "What is the typical cost of an interior design project?", a: "Our projects start from ₹1,500/sq ft for the Essential package. The total investment depends on the scope, materials selected, and customization required. We provide detailed quotes after a complimentary consultation." },
        { q: "How long does a complete interior design project take?", a: "A typical 1,000-2,000 sq ft residential project takes 8-12 weeks from concept approval to final delivery. Larger projects or those with custom furniture may take 16-20 weeks. We provide detailed timelines upfront." },
        { q: "Do you work on projects outside your home city?", a: "Yes, we work across India and have completed projects in over 15 cities. We partner with trusted local contractors and visit sites at key project milestones to maintain our quality standards." },
        { q: "What materials do you typically use?", a: "We source only premium materials — from Italian marble and engineered hardwood to custom laminates and certified sustainable timber. We work with vetted vendors to ensure quality, durability, and fair pricing." },
        { q: "Is there a warranty on the completed work?", a: "All our projects come with a 1-year workmanship warranty (Signature and above include extended coverage). We also provide guidance on maintenance and are available for post-delivery support." },
        { q: "Can I make changes during the design process?", a: "Absolutely. We include revision rounds at each design stage — concept, 3D visualization, and execution. Our collaborative process ensures the final result perfectly matches your vision." },
    ];
    return (
        <section id="faq" ref={ref} style={{ background: COLORS.bg, padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <SectionHeader label="Questions" title="Frequently Asked" subtitle="Everything you need to know before starting your design journey" inView={inView} />
                <div style={{ marginTop: 64 }}>
                    {faqs.map((f, i) => (
                        <div key={i} style={{
                            borderBottom: `1px solid ${COLORS.border}`,
                            opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
                            transition: `all 0.5s ease ${i * 80}ms`,
                        }}>
                            <button onClick={() => setOpen(open === i ? null : i)} style={{
                                width: "100%", background: "none", border: "none", padding: "24px 0",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                cursor: "pointer", textAlign: "left", gap: 20,
                            }}>
                                <span style={{ color: open === i ? COLORS.gold : COLORS.white, fontFamily: FONTS.heading, fontSize: "1rem", transition: "color 0.3s", lineHeight: 1.4 }}>{f.q}</span>
                                <span style={{
                                    color: COLORS.gold, fontSize: 20, flexShrink: 0,
                                    transform: open === i ? "rotate(45deg)" : "rotate(0)",
                                    transition: "transform 0.3s",
                                }}>+</span>
                            </button>
                            <div style={{
                                maxHeight: open === i ? 200 : 0, overflow: "hidden",
                                transition: "max-height 0.4s ease",
                            }}>
                                <p style={{ color: COLORS.gray, fontSize: 14, lineHeight: 1.8, paddingBottom: 24 }}>{f.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ContactSection() {
    const ref = useRef();
    const inView = useInView(ref);
    const [form, setForm] = useState({ name: "", email: "", phone: "", budget: "", property: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = () => {
        if (form.name && form.email) setSubmitted(true);
    };
    return (
        <section id="contact" ref={ref} style={{ background: "#0D0D0D", padding: "120px 2rem", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <SectionHeader label="Get In Touch" title="Start Your Project" subtitle="Tell us about your vision — we'll bring it to life" inView={inView} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80, marginTop: 64, alignItems: "start" }}>
                    {/* Contact info */}
                    <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-30px)", transition: "all 0.8s ease 0.2s" }}>
                        <div style={{ marginBottom: 40 }}>
                            <h3 style={{ color: COLORS.gold, fontFamily: FONTS.heading, fontSize: "1.5rem", marginBottom: 16 }}>Let's Create Something Extraordinary</h3>
                            <p style={{ color: COLORS.gray, fontSize: 14, lineHeight: 1.8 }}>Book a free 30-minute consultation to discuss your project. We work across India and handle complete end-to-end interior design.</p>
                        </div>
                        {[["📍","Studio Address","42, Design District, Bandra West, Mumbai 400050"],
                            ["📞","Phone","+91 98765 43210"],
                            ["✉","Email","hello@luxestudio.in"],
                            ["⏰","Working Hours","Mon–Sat: 10am – 7pm"]
                        ].map(([ic, label, val]) => (
                            <div key={label} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                                <span style={{ fontSize: 18, flexShrink: 0 }}>{ic}</span>
                                <div>
                                    <div style={{ color: COLORS.gray, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                                    <div style={{ color: COLORS.cream, fontSize: 14 }}>{val}</div>
                                </div>
                            </div>
                        ))}
                        {/* WhatsApp button */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 10,
                            background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)",
                            padding: "12px 20px", marginTop: 16, cursor: "pointer",
                        }}>
                            <span style={{ fontSize: 18 }}>💬</span>
                            <span style={{ color: "#25D366", fontSize: 13, letterSpacing: 1 }}>Chat on WhatsApp</span>
                        </div>
                    </div>

                    {/* Form */}
                    <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(30px)", transition: "all 0.8s ease 0.4s" }}>
                        {submitted ? (
                            <div style={{ textAlign: "center", padding: "80px 40px", border: `1px solid ${COLORS.border}` }}>
                                <div style={{ fontSize: 48, marginBottom: 24 }}>✨</div>
                                <h3 style={{ color: COLORS.gold, fontFamily: FONTS.heading, fontSize: "1.5rem", marginBottom: 12 }}>Thank You!</h3>
                                <p style={{ color: COLORS.gray, fontSize: 14, lineHeight: 1.7 }}>We've received your inquiry and will get back to you within 24 hours to schedule your complimentary consultation.</p>
                            </div>
                        ) : (
                            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, padding: "48px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                                    {[["name","Your Name","text"],["email","Email Address","email"],["phone","Phone Number","tel"],["budget","Budget Range","text"]].map(([k,ph,t]) => (
                                        <input key={k} type={t} placeholder={ph} value={form[k]}
                                               onChange={e => setForm({...form,[k]:e.target.value})}
                                               style={{
                                                   background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`,
                                                   color: COLORS.white, padding: "14px 16px", fontFamily: FONTS.body, fontSize: 14,
                                                   outline: "none", width: "100%",
                                               }}
                                               onFocus={e => e.target.style.borderColor = COLORS.gold}
                                               onBlur={e => e.target.style.borderColor = COLORS.border}
                                        />
                                    ))}
                                </div>
                                <select value={form.property} onChange={e => setForm({...form,property:e.target.value})}
                                        style={{
                                            width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`,
                                            color: form.property ? COLORS.white : COLORS.gray, padding: "14px 16px",
                                            fontFamily: FONTS.body, fontSize: 14, marginBottom: 20, outline: "none",
                                        }}>
                                    <option value="" style={{background:COLORS.bg}}>Property Type</option>
                                    {["Apartment","Villa","Office","Restaurant","Retail"].map(o => <option key={o} value={o} style={{background:COLORS.bg}}>{o}</option>)}
                                </select>
                                <textarea placeholder="Describe your project and vision..." value={form.message}
                                          onChange={e => setForm({...form,message:e.target.value})} rows={4}
                                          style={{
                                              width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`,
                                              color: COLORS.white, padding: "14px 16px", fontFamily: FONTS.body, fontSize: 14,
                                              outline: "none", resize: "vertical", marginBottom: 24,
                                          }}
                                          onFocus={e => e.target.style.borderColor = COLORS.gold}
                                          onBlur={e => e.target.style.borderColor = COLORS.border}
                                />
                                <button onClick={handleSubmit} style={{
                                    width: "100%", background: COLORS.gold, border: "none", color: COLORS.bg,
                                    padding: "16px 24px", fontFamily: FONTS.body, fontSize: 13, letterSpacing: 2,
                                    textTransform: "uppercase", cursor: "pointer", fontWeight: 700, transition: "all 0.3s",
                                }}
                                        onMouseEnter={e => e.target.style.background = COLORS.goldLight}
                                        onMouseLeave={e => e.target.style.background = COLORS.gold}
                                >Send Inquiry</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    return (
        <footer style={{ background: "#080808", borderTop: `1px solid ${COLORS.border}`, padding: "80px 2rem 40px", fontFamily: FONTS.body }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: 64, marginBottom: 64 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 32, height: 32, border: `1.5px solid ${COLORS.gold}`, transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ transform: "rotate(-45deg)", color: COLORS.gold, fontSize: 12, fontWeight: 700 }}>L</span>
                            </div>
                            <span style={{ color: COLORS.white, fontFamily: FONTS.heading, fontSize: 18, letterSpacing: 2 }}>LUXE<span style={{ color: COLORS.gold }}>STUDIO</span></span>
                        </div>
                        <p style={{ color: COLORS.gray, fontSize: 13, lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
                            Award-winning interior design studio crafting extraordinary spaces across India since 2016.
                        </p>
                        <div style={{ display: "flex", gap: 12 }}>
                            {["IG","FB","BE","LI","YT"].map(s => (
                                <div key={s} style={{
                                    width: 36, height: 36, border: `1px solid ${COLORS.border}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: COLORS.gray, fontSize: 11, cursor: "pointer", letterSpacing: 0.5,
                                    transition: "all 0.3s",
                                }}
                                     onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.color = COLORS.gold; }}
                                     onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.gray; }}
                                >{s}</div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: COLORS.white, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Navigate</div>
                        {["Home","Services","Portfolio","Process","Team","Blog"].map(l => (
                            <div key={l} onClick={() => scrollTo(l.toLowerCase())} style={{
                                color: COLORS.gray, fontSize: 13, marginBottom: 12, cursor: "pointer",
                                transition: "color 0.3s", letterSpacing: 0.3,
                            }}
                                 onMouseEnter={e => e.target.style.color = COLORS.gold}
                                 onMouseLeave={e => e.target.style.color = COLORS.gray}
                            >{l}</div>
                        ))}
                    </div>
                    <div>
                        <div style={{ color: COLORS.white, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Services</div>
                        {["Residential","Commercial","Luxury Villas","Kitchens","Office Design","Furniture"].map(s => (
                            <div key={s} style={{ color: COLORS.gray, fontSize: 13, marginBottom: 12, letterSpacing: 0.3 }}
                                 onMouseEnter={e => e.target.style.color = COLORS.gold}
                                 onMouseLeave={e => e.target.style.color = COLORS.gray}
                            >{s}</div>
                        ))}
                    </div>
                    <div>
                        <div style={{ color: COLORS.white, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Newsletter</div>
                        <p style={{ color: COLORS.gray, fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>Design inspiration, project reveals, and interior trends — delivered monthly.</p>
                        <div style={{ display: "flex" }}>
                            <input placeholder="Your email" style={{
                                flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.border}`,
                                borderRight: "none", color: COLORS.white, padding: "12px 16px",
                                fontFamily: FONTS.body, fontSize: 13, outline: "none",
                            }}/>
                            <button style={{
                                background: COLORS.gold, border: "none", color: COLORS.bg,
                                padding: "12px 16px", cursor: "pointer", fontSize: 16, fontWeight: 700,
                            }}>→</button>
                        </div>
                    </div>
                </div>
                <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <span style={{ color: COLORS.grayDark, fontSize: 12, letterSpacing: 0.5 }}>© 2024 LuxeStudio Interior Design. All rights reserved.</span>
                    <div style={{ display: "flex", gap: 24 }}>
                        {["Privacy Policy","Terms","Sitemap"].map(l => (
                            <span key={l} style={{ color: COLORS.grayDark, fontSize: 12, cursor: "pointer", letterSpacing: 0.5 }}>{l}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FloatingCTA() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const fn = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);
    if (!visible) return null;
    return (
        <div style={{
            position: "fixed", bottom: 32, right: 32, zIndex: 99,
            display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end",
        }}>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{
                background: COLORS.gold, border: "none", color: COLORS.bg,
                padding: "14px 20px", fontFamily: FONTS.body, fontSize: 12, letterSpacing: 1.5,
                textTransform: "uppercase", cursor: "pointer", fontWeight: 700,
                boxShadow: `0 4px 24px rgba(198,163,109,0.35)`,
                animation: "fadeUp 0.4s ease",
            }}>Book Free Consult</button>
        </div>
    );
}

function SectionHeader({ label, title, subtitle, inView }) {
    return (
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20,
                opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease",
            }}>
                <div style={{ height: 1, width: 40, background: `linear-gradient(to right, transparent, ${COLORS.gold})` }} />
                <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: 11, letterSpacing: 4, textTransform: "uppercase" }}>{label}</span>
                <div style={{ height: 1, width: 40, background: `linear-gradient(to left, transparent, ${COLORS.gold})` }} />
            </div>
            <h2 style={{
                fontFamily: FONTS.heading, fontWeight: 700, color: COLORS.white,
                fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, marginBottom: 16,
                opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease 0.1s",
            }}>{title}</h2>
            <p style={{
                color: COLORS.gray, fontFamily: FONTS.body, fontSize: 15, lineHeight: 1.7,
                opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease 0.2s",
            }}>{subtitle}</p>
        </div>
    );
}

export default function App() {
    const [activeSection, setActiveSection] = useState("home");
    useEffect(() => {
        const sections = ["home","services","portfolio","process","testimonials","pricing","team","contact"];
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
        }, { threshold: 0.3 });
        sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, []);

    return (
        <div style={{ background: COLORS.bg, color: COLORS.white, fontFamily: FONTS.body }}>
            <Navbar activeSection={activeSection} />
            <HeroSection />
            <ServicesSection />
            <PortfolioSection />
            <BeforeAfterSection />
            <ProcessSection />
            <RoomVisualizer />
            <TestimonialsSection />
            <StatsSection />
            <PricingSection />
            <TeamSection />
            <GallerySection />
            <FAQSection />
            <ContactSection />
            <Footer />
            <FloatingCTA />
        </div>
    );
}