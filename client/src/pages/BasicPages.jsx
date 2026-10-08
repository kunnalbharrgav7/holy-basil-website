import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Leaf,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  PackageSearch,
  Factory,
  Beaker,
  BadgeCheck,
  Microscope,
  Award,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Building2,
  Send,
} from "lucide-react";
import gsap from "gsap";
import { createEnquiry } from "../services/enquiryService";
import toast from "react-hot-toast";

import aboutHero from "../assets/AboutImages/aboutHero.png";
import aboutImage1 from "../assets/AboutImages/aboutImage1.png";
import aboutImage2 from "../assets/AboutImages/aboutImage2.png";
import manufacturingHero from "../assets/ManufacturingImages/manufacturingHero.png";
import blog1 from "../assets/BlogImages/blog1.png";
import blog2 from "../assets/BlogImages/blog2.png";
import blog3 from "../assets/BlogImages/blog3.png";

// Reusable Page wrapper
const Page = ({ eyebrow, title, children, cta }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
    );
  }, []);

  return (
    <main className="min-h-screen py-8 bg-[#080D0A] text-[#F5F2EB] overflow-hidden">
      <div
        ref={containerRef}
        className="container-hba mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center"
      >
        <span className="eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
          {eyebrow}
        </span>
        <h1 className="display mt-4 font-serif text-4xl text-white sm:text-5xl md:text-6xl leading-[1.1]">
          {title}
        </h1>
        <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-[#F5F2EB]/70">
          {children}
        </div>
        {cta && (
          <div className="mt-12">
            <Link
              to="/quote"
              className="btn-primary inline-flex items-center gap-2"
            >
              {cta} <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export function Manufacturing() {
  const sectionRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      sectionRef.current.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" },
    );
  }, []);

  return (
    <main className="min-h-screen py-8 bg-[#080D0A] text-[#F5F2EB] overflow-hidden">
      <div
        ref={sectionRef}
        className="container-hba mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
      >
        <div className="max-w-3xl text-center flex flex-col items-center">
          <span className="eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
            Manufacturing Excellence
          </span>
          <h1 className="display mt-4 font-serif text-4xl text-white sm:text-5xl md:text-6xl leading-[1.1]">
            Your Ayurvedic product.
            <br />
            <span className="text-emerald-400/70 italic font-normal">
              Our manufacturing expertise.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#F5F2EB]/70">
            We support global wellness brands with turnkey private-label,
            contract, and bulk manufacturing pathways built for absolute
            botanical precision and scale.
          </p>
        </div>

        <div className="mt-16 w-full max-w-6xl relative group">
          <div className="absolute -inset-1 rounded-[3rem] bg-gradient-to-r from-emerald-500/20 to-emerald-900/40 blur-xl opacity-50 transition duration-1000 group-hover:opacity-100" />
          <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden rounded-[3rem] shadow-2xl border border-emerald-900/30">
            <img
              src={manufacturingHero}
              alt="Premium Ayurvedic Botanicals and Oils"
              className="h-full w-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080D0A]/90 via-[#080D0A]/30 to-transparent flex flex-col justify-end p-8 md:p-12 text-center md:text-left">
              <p className="text-[#F5F2EB] font-serif text-2xl md:text-3xl italic">
                "Scaling ancient formulations for the modern wellness brand."
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 w-full max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Private Label",
                desc: "End-to-end custom branding, bottling, and packaging solutions ready for market.",
                icon: <PackageSearch size={28} />,
              },
              {
                title: "Contract Manufacturing",
                desc: "Production built strictly to your proprietary formulations and exact specifications.",
                icon: <Factory size={28} />,
              },
              {
                title: "Bulk Manufacturing",
                desc: "High-capacity extraction and production runs designed for global distribution.",
                icon: <FlaskConical size={28} />,
              },
              {
                title: "Custom Formulation",
                desc: "Collaborative R&D with expert Vaidyas to develop unique, highly potent herbal blends.",
                icon: <Beaker size={28} />,
              },
              {
                title: "Packaging Support",
                desc: "Sustainable amber glass, UV-protective containers, and luxury retail labeling.",
                icon: <Leaf size={28} />,
              },
              {
                title: "Quality Audit Trail",
                desc: "Transparent batch tracking, lab reports, and full regulatory documentation.",
                icon: <BadgeCheck size={28} />,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative bg-[#121E1A] p-8 rounded-[2rem] border border-emerald-900/30 shadow-md transition-all duration-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] hover:-translate-y-2 hover:border-emerald-500/40 flex flex-col items-center text-center overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-900/20 opacity-50 transition-transform duration-500 group-hover:scale-150 blur-xl" />
                <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl bg-[#080D0A] border border-emerald-500/20 text-emerald-400 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  {item.icon}
                </div>
                <h3 className="relative z-10 font-serif text-2xl text-white">
                  {item.title}
                </h3>
                <p className="relative z-10 mt-3 text-sm text-[#F5F2EB]/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 flex flex-col items-center">
          <Link
            to="/quote"
            className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-sm tracking-wider"
          >
            Request a Custom Quote <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}

export function About() {
  const sectionRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      sectionRef.current.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" },
    );
  }, []);

  return (
    <main className="py-8 bg-[#080D0A] text-[#F5F2EB] overflow-hidden">
      <div
        ref={sectionRef}
        className="container-hba mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
      >
        <div className="max-w-3xl text-center flex flex-col items-center">
          <span className="eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
            Our Story
          </span>
          <h1 className="display mt-4 font-serif text-4xl text-white sm:text-5xl md:text-6xl leading-[1.1]">
            Rooted in Ayurveda.
            <br />
            <span className="text-emerald-400/70 italic font-normal">
              Created for today.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#F5F2EB]/60 max-w-2xl">
            Holy Basil Ayurveda is envisioned as a premium wellness brand
            bringing Ayurvedic traditions into contemporary routines.
          </p>
        </div>

        <div className="mt-16 w-full max-w-6xl relative group">
          <div className="absolute -inset-1 rounded-[3rem] bg-gradient-to-r from-emerald-900/40 to-[#121E1A]/80 blur-2xl opacity-50 transition duration-1000 group-hover:opacity-100" />
          <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-emerald-900/30">
            <img
              src={aboutHero}
              alt="Ayurvedic herbs"
              className="h-full w-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
          </div>
        </div>

        <div className="mt-20 w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center bg-[#121E1A] p-10 md:p-16 rounded-[3rem] border border-emerald-900/30 shadow-lg hover:shadow-[0_10px_40px_rgba(16,185,129,0.05)] transition duration-500">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/60">
              The Philosophy
            </span>
            <h2 className="mt-3 font-serif text-3xl text-white">
              Thoughtful Formulations
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#F5F2EB]/60">
              Our product philosophy centers on thoughtful formulations,
              carefully selected ingredients, and a quality-focused approach to
              manufacturing. We believe that true wellness comes from the
              perfect balance of ancient botanical wisdom and modern scientific
              rigor.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-2xl shadow-sm h-48 w-full group border border-emerald-900/30">
              <img
                src={aboutImage1}
                alt="Mortar and pestle"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-sm h-48 w-full mt-8 group border border-emerald-900/30">
              <img
                src={aboutImage2}
                alt="Botanical extracts"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function Quality() {
  const sectionRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      sectionRef.current.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" },
    );
  }, []);

  return (
    <main className="min-h-screen py-8 bg-[#080D0A] text-[#F5F2EB] overflow-hidden">
      <div
        ref={sectionRef}
        className="container-hba mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
      >
        <div className="max-w-3xl text-center flex flex-col items-center">
          <span className="eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
            Uncompromising Standards
          </span>
          <h1 className="display mt-4 font-serif text-4xl text-white sm:text-5xl md:text-6xl leading-[1.1]">
            Quality isn't a feature.
            <br />
            <span className="text-emerald-400/70 italic font-normal">
              It's our foundational law.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#F5F2EB]/60 max-w-2xl">
            We bridge ancient Ayurvedic wisdom with rigorous modern science.
            Every formulation undergoes exhaustive clinical testing to ensure
            absolute purity, safety, and potency.
          </p>
        </div>

        <div className="mt-16 w-full max-w-6xl relative group">
          <div className="absolute -inset-1 rounded-[3rem] bg-gradient-to-r from-emerald-900/30 to-[#121E1A]/40 blur-2xl opacity-50 transition duration-1000 group-hover:opacity-100" />
          <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden rounded-[3rem] shadow-2xl border border-emerald-900/30 bg-[#080D0A]">
            <img
              src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000&auto=format&fit=crop"
              alt="Scientific glassware"
              className="h-full w-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-105 opacity-70 group-hover:opacity-90 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080D0A] via-[#080D0A]/40 to-transparent flex flex-col justify-end p-8 md:p-14 text-center md:text-left">
              <p className="text-[#F5F2EB] font-serif text-2xl md:text-4xl italic max-w-2xl">
                "Subjecting nature’s finest ingredients to the highest standards
                of modern verification."
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 w-full max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-white">
              The Four Pillars of Verification
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Heavy Metal Screening",
                desc: "Ayurvedic herbs are inherently mineral-rich. We utilize advanced ICP-MS technology to screen every batch, ensuring lead, mercury, and arsenic levels remain strictly below international safety thresholds.",
              },
              {
                icon: Microscope,
                title: "Microbiological Purity",
                desc: "From raw harvest to final bottling, our extracts are rigorously cultured to guarantee the absolute absence of harmful pathogens, yeast, mold, and E. coli.",
              },
              {
                icon: FlaskConical,
                title: "Active Compound Profiling",
                desc: "We don't just test for safety; we test for efficacy. Using HPLC (High-Performance Liquid Chromatography), we verify that the active medicinal compounds meet therapeutic concentrations.",
              },
              {
                icon: Award,
                title: "GMP Certified Production",
                desc: "All Holy Basil Ayurveda formulations are processed in state-of-the-art, ISO-certified cleanrooms adhering strictly to Good Manufacturing Practices (GMP).",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#121E1A] p-8 md:p-10 rounded-[2.5rem] border border-emerald-900/30 shadow-md transition hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] duration-300"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#080D0A] border border-emerald-500/20 text-emerald-400 mb-6 shadow-inner">
                  <item.icon size={26} />
                </div>
                <h3 className="font-serif text-2xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-[#F5F2EB]/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center text-center max-w-2xl bg-[#050807] rounded-[2.5rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-emerald-900/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-900/10 blur-3xl rounded-full" />
          <h2 className="relative z-10 font-serif text-3xl text-white">
            Require manufacturing compliance documents?
          </h2>
          <p className="relative z-10 mt-4 text-sm text-[#F5F2EB]/60 mb-8">
            Independent Certificates of Analysis (COAs) and regulatory
            documentation are available for all B2B and private-label partners
            upon request.
          </p>
          <Link
            to="/quote"
            className="btn-primary relative z-10 inline-flex items-center gap-3 px-8 py-4 text-sm tracking-wider"
          >
            Contact Quality Assurance <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}

export function Blog() {
  const sectionRef = useRef(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" },
    );
  }, []);

  const mockPosts = [
    {
      id: 1,
      title: "The Science of Shilajit: Nature's Potent Resin",
      excerpt:
        "Discover the geological origins and modern clinical benefits of Himalayan Shilajit for cellular energy and vitality.",
      content: (
        <div className="space-y-5 mt-6">
          <p>
            Himalayan Shilajit is formed over centuries by the gradual
            decomposition of certain plants by the action of microorganisms.
            This rare resin is sourced from the steep, high-altitude rocks of
            the Himalayas, making it one of the most precious Ayurvedic
            substances known to mankind.
          </p>
          <h3 className="text-2xl font-serif text-white mt-8 mb-3">
            The Science of Cellular Energy
          </h3>
          <p>
            Modern clinical studies have shown that Shilajit is rich in fulvic
            acid and over 84 essential minerals. It functions as a powerful
            antioxidant and anti-inflammatory agent, directly supporting
            mitochondrial function to enhance cellular energy production.
          </p>
          <blockquote className="border-l-2 border-emerald-500 pl-5 py-3 my-8 text-emerald-300 italic bg-emerald-900/10 rounded-r-xl font-serif text-lg">
            "Shilajit doesn't just stimulate the body; it nourishes the very
            cells that produce energy, creating sustainable vitality without the
            crash."
          </blockquote>
          <p>
            When incorporating Shilajit into your routine, purity is paramount.
            Always look for purified, resin-form Shilajit that has been
            heavy-metal tested to ensure you are getting the safest and most
            potent product possible.
          </p>
        </div>
      ),
      date: "Aug 18, 2026",
      readTime: "5 min read",
      category: "Ingredient Spotlight",
      image: blog1,
    },
    {
      id: 2,
      title: "Mindful Mornings: Building an Ayurvedic Routine",
      excerpt:
        "Practical ways to integrate ancient botanical rituals into your fast-paced modern mornings.",
      content: (
        <div className="space-y-5 mt-6">
          <p>
            In Ayurveda, the morning routine—known as <em>Dinacharya</em>—is
            designed to align our biological rhythms with the rhythms of nature.
            By waking up early and performing specific cleansing and grounding
            rituals, we set a tone of balance for the rest of the day.
          </p>
          <h3 className="text-2xl font-serif text-white mt-8 mb-3">
            Step 1: Cleansing the Senses
          </h3>
          <p>
            Start with tongue scraping to remove toxins (ama) accumulated
            overnight, followed by splashing cool water on your face and eyes.
            Drinking a glass of warm water with a squeeze of lemon aids
            digestion and flushes the system.
          </p>
          <h3 className="text-2xl font-serif text-white mt-8 mb-3">
            Step 2: Herbal Support
          </h3>
          <p>
            Introducing specific herbs like Ashwagandha or a spoonful of
            Chyawanprash in the morning can help your body build resilience
            against stress.
          </p>
          <blockquote className="border-l-2 border-emerald-500 pl-5 py-3 my-8 text-emerald-300 italic bg-emerald-900/10 rounded-r-xl font-serif text-lg">
            "Consistency is more important than intensity. A five-minute mindful
            routine practiced daily is far superior to a two-hour routine
            practiced once a month."
          </blockquote>
        </div>
      ),
      date: "Aug 10, 2026",
      readTime: "4 min read",
      category: "Wellness Rituals",
      image: blog2,
    },
    {
      id: 3,
      title: "Decoding GMP: Why Manufacturing Matters",
      excerpt:
        "A transparent look inside our cleanrooms and how rigorous testing ensures your supplements are safe.",
      content: (
        <div className="space-y-5 mt-6">
          <p>
            Good Manufacturing Practice (GMP) guidelines provide a system of
            processes, procedures, and documentation that assures a product has
            the identity, strength, composition, quality, and purity that it
            represents.
          </p>
          <h3 className="text-2xl font-serif text-white mt-8 mb-3">
            Beyond Basic Compliance
          </h3>
          <p>
            At Holy Basil Ayurveda, we view GMP not just as a regulatory
            requirement, but as a moral obligation. Ayurvedic herbs are potent,
            but they can also be susceptible to contamination if not handled
            correctly.
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4 text-[#F5F2EB]/70">
            <li>
              Raw material authentication through High-Performance Liquid
              Chromatography (HPLC).
            </li>
            <li>Strict microbiological testing for pathogens.</li>
            <li>
              Heavy metal screening to ensure levels are well below safety
              limits.
            </li>
          </ul>
          <blockquote className="border-l-2 border-emerald-500 pl-5 py-3 my-8 text-emerald-300 italic bg-emerald-900/10 rounded-r-xl font-serif text-lg">
            "We believe that the healing power of Ayurveda should never be
            compromised by substandard manufacturing practices."
          </blockquote>
        </div>
      ),
      date: "Jul 28, 2026",
      readTime: "6 min read",
      category: "Quality & Process",
      image: blog3,
    },
  ];

  return (
    <main className="min-h-screen py-8 bg-[#080D0A] text-[#F5F2EB] overflow-hidden relative">
      <div
        ref={sectionRef}
        className="container-hba mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
      >
        <div className="max-w-3xl text-center flex flex-col items-center mb-16">
          <span className="eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
            The Ayurveda Journal
          </span>
          <h1 className="display mt-4 font-serif text-4xl text-white sm:text-5xl md:text-6xl leading-[1.1]">
            Ideas for a more
            <br />
            <span className="text-emerald-400/70 italic font-normal">
              thoughtful wellness routine.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#F5F2EB]/60 max-w-2xl">
            Explore expert insights into rare botanical extracts, seasonal
            Ayurvedic routines, and transparent manufacturing innovations.
          </p>
        </div>

        <div className="w-full max-w-5xl mb-16 rounded-2xl bg-[#121E1A] p-6 border border-dashed border-emerald-900/50 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <p className="text-sm text-[#F5F2EB]/60">
            <strong>Admin Note:</strong> Use the admin dashboard to publish live
            articles here. Showing preview layout below.
          </p>
          <Link
            to="/contact"
            className="btn-outline shrink-0 px-6 py-2.5 text-xs"
          >
            Get in touch
          </Link>
        </div>

        <div className="w-full max-w-6xl grid md:grid-cols-3 gap-8">
          {mockPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col bg-[#121E1A] rounded-[2rem] border border-emerald-900/30 overflow-hidden shadow-lg transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_15px_40px_rgba(16,185,129,0.1)] hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#080D0A]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 bg-[#080D0A]/80 border border-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {post.category}
                </div>
              </div>
              <div className="flex flex-col flex-1 p-8">
                <div className="flex items-center gap-4 text-[11px] font-semibold text-emerald-400/60 uppercase tracking-widest mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-white leading-snug mb-3 transition-colors group-hover:text-emerald-400">
                  {post.title}
                </h3>
                <p className="text-sm text-[#F5F2EB]/50 leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(post);
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 transition-colors group-hover:text-emerald-300"
                  >
                    Read Article{" "}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Blog Modal Dark Theme */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-[2.5rem] bg-[#121E1A] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-200 border border-emerald-900/50">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-[#080D0A] text-[#F5F2EB]/60 transition hover:bg-emerald-900/40 hover:text-emerald-400 border border-emerald-900/30"
            >
              ✕
            </button>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-emerald-400/60 mb-4 pr-12">
              <span className="rounded-full bg-emerald-900/30 border border-emerald-500/20 px-3 py-1 text-emerald-400">
                {selectedPost.category}
              </span>
              <span>•</span>
              <span>{selectedPost.date}</span>
              <span>•</span>
              <span>{selectedPost.readTime}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white leading-snug mb-6">
              {selectedPost.title}
            </h2>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#080D0A] mb-6 border border-emerald-900/30">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="h-full w-full object-cover opacity-90"
              />
            </div>
            <div className="space-y-4 text-base text-[#F5F2EB]/70 leading-relaxed border-t border-emerald-900/30 pt-6">
              <p className="font-medium text-lg text-emerald-300">
                {selectedPost.excerpt}
              </p>
              {selectedPost.content}
            </div>
            <div className="mt-8 pt-6 border-t border-emerald-900/30 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="btn-outline px-6 py-2.5 text-xs"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export function Contact() {
  const [activeForm, setActiveForm] = useState("support");
  const formRef = useRef(null);

  const handleCardClick = (formType) => {
    setActiveForm(formType);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your support query has been submitted.");
  };

  const handleB2BSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your B2B quotation request has been submitted.");
  };

  return (
    <div className="bg-[#080D0A] text-[#F5F2EB] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container-hba mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 mb-3 block">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight">
            Let's start <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              a meaningful conversation.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#F5F2EB]/60 leading-relaxed">
            Whether you need product support, retail distribution partnerships,
            or custom private-label manufacturing enquiries, fill out the form
            or reach out to our teams below.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div
              onClick={() => handleCardClick("support")}
              className={`p-8 rounded-3xl border transition-all duration-300 cursor-pointer ${
                activeForm === "support"
                  ? "bg-[#162620] border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                  : "bg-[#121E1A] border-emerald-900/40 hover:border-emerald-500/50"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#080D0A] border border-emerald-900/60 flex items-center justify-center text-emerald-400 mb-6">
                <Mail size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">
                Customer Support
              </h3>
              <p className="text-xs sm:text-sm text-[#F5F2EB]/60 leading-relaxed mb-4">
                Have questions about your order, our formulations, or how to use
                a product? Our wellness team is here to help you on your
                journey.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span>Support Enquiry</span>
                <ArrowRight size={14} />
              </div>
            </div>

            <div
              onClick={() => handleCardClick("b2b")}
              className={`p-8 rounded-3xl border transition-all duration-300 cursor-pointer ${
                activeForm === "b2b"
                  ? "bg-[#162620] border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                  : "bg-[#121E1A] border-emerald-900/40 hover:border-emerald-500/50"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#080D0A] border border-emerald-900/60 flex items-center justify-center text-emerald-400 mb-6">
                <Building2 size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">
                B2B & Manufacturing
              </h3>
              <p className="text-xs sm:text-sm text-[#F5F2EB]/60 leading-relaxed mb-4">
                For private-label manufacturing, bulk ingredient sourcing, or
                global distribution, use the adjacent form for our direct
                quotation pipeline.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span>Request a Quote</span>
                <ArrowRight size={14} />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#121E1A] border border-emerald-900/40">
              <div className="w-12 h-12 rounded-2xl bg-[#080D0A] border border-emerald-900/60 flex items-center justify-center text-emerald-400 mb-6">
                <MapPin size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">
                Global Headquarters & Labs
              </h3>
              <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed">
                Holy Basil Ayurveda Pvt. Ltd.
                <br />
                294, F Block, Sector-63, Noida, Gautam Buddha Nagar,
                <br /> UP – 201301, India.
              </p>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-bold block mt-4">
                VISITS BY APPOINTMENT ONLY
              </span>
            </div>
          </div>

          <div
            ref={formRef}
            className="lg:col-span-6 bg-[#121E1A] border border-emerald-900/50 rounded-3xl p-8 sm:p-10 shadow-2xl relative scroll-mt-20"
          >
            {activeForm === "b2b" ? (
              <form
                onSubmit={handleB2BSubmit}
                className="space-y-6 animate-fade-in"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                    CUSTOM B2B SOLUTIONS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                    Request a Quote
                  </h3>
                  <p className="text-xs text-[#F5F2EB]/60 mt-1">
                    Fill out your formulation requirements below and our team
                    will review it instantly.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Herbal Ltd."
                      className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. India"
                      className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                      Product Category *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Resins / Syrups"
                      className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                      Estimated Qty *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2000 units"
                      className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                      Target Market *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Retail / D2C"
                      className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                    Packaging Requirement
                  </label>
                  <input
                    type="text"
                    placeholder="Amber glass jars..."
                    className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-emerald-500 rounded"
                    />{" "}
                    Private Label Required
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-emerald-500 rounded"
                    />{" "}
                    Custom Formulation
                  </label>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                    Message / Specs *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe requirements..."
                    className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer flex items-center justify-center gap-2"
                >
                  Submit Enquiry <Send size={14} />
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSupportSubmit}
                className="space-y-6 animate-fade-in"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                    WE ARE HERE TO HELP
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                    Customer Support Enquiry
                  </h3>
                  <p className="text-xs text-[#F5F2EB]/60 mt-1">
                    Send us your questions regarding orders, product usage, or
                    shipping details.
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                    Order ID / Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HBA-10293"
                    className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#F5F2EB]/80 uppercase tracking-wider mb-2">
                    How can we help you? *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your query, feedback, or support issue here..."
                    className="w-full bg-[#080D0A] border border-emerald-900/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer flex items-center justify-center gap-2"
                >
                  Send Support Message <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Quote() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    productCategory: "",
    estimatedQuantity: "",
    privateLabel: false,
    packagingRequirement: "",
    customFormulation: false,
    targetMarket: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await createEnquiry(formData);
      toast.success("Enquiry submitted successfully!");
      navigate("/enquiry-success");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to submit enquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080D0A] text-[#F5F2EB] py-8">
      <div className="container-hba mx-auto px-4 max-w-3xl">
        <div className="rounded-[3rem] bg-[#121E1A] p-8 sm:p-12 shadow-lg border border-emerald-900/30">
          <div className="mb-8 text-center">
            <span className="eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
              Custom B2B Solutions
            </span>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-white">
              Request a Quote
            </h1>
            <p className="mt-2 text-sm text-[#F5F2EB]/60">
              Fill out your formulation requirements and our manufacturing team
              will review your quote.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                  Full Name *
                </span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm placeholder:text-[#F5F2EB]/20"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                  Company Name
                </span>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Herbal Enterprise Ltd."
                  className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm placeholder:text-[#F5F2EB]/20"
                />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                  Email Address *
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. john@example.com"
                  className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm placeholder:text-[#F5F2EB]/20"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                  Phone Number
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm placeholder:text-[#F5F2EB]/20"
                />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                  Country *
                </span>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="e.g. India"
                  className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm placeholder:text-[#F5F2EB]/20"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                  Product Category
                </span>
                <input
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleChange}
                  placeholder="e.g. Resins / Syrups"
                  className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm placeholder:text-[#F5F2EB]/20"
                />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                  Estimated Quantity *
                </span>
                <input
                  name="estimatedQuantity"
                  value={formData.estimatedQuantity}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 2000 units"
                  className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm placeholder:text-[#F5F2EB]/20"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                  Target Market
                </span>
                <input
                  name="targetMarket"
                  value={formData.targetMarket}
                  onChange={handleChange}
                  placeholder="e.g. Retail / D2C"
                  className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm placeholder:text-[#F5F2EB]/20"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                Packaging Requirement
              </span>
              <input
                name="packagingRequirement"
                value={formData.packagingRequirement}
                onChange={handleChange}
                placeholder="e.g. Amber glass jars"
                className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm placeholder:text-[#F5F2EB]/20"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-900/40 bg-[#080D0A] cursor-pointer">
                <input
                  type="checkbox"
                  name="privateLabel"
                  checked={formData.privateLabel}
                  onChange={handleChange}
                  className="w-4 h-4 accent-emerald-500"
                />
                <span className="text-sm font-semibold text-white">
                  Private Label Required
                </span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-900/40 bg-[#080D0A] cursor-pointer">
                <input
                  type="checkbox"
                  name="customFormulation"
                  checked={formData.customFormulation}
                  onChange={handleChange}
                  className="w-4 h-4 accent-emerald-500"
                />
                <span className="text-sm font-semibold text-white">
                  Custom Formulation Needed
                </span>
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                Message / Specifications *
              </span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe your formulation, ingredients, or timeline requirements..."
                className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-sm resize-none placeholder:text-[#F5F2EB]/20"
              />
            </label>
            {error && (
              <div className="rounded-2xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-400">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Submitting Enquiry..." : "Submit Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
