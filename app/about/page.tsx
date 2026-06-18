import {
  Building2,
  Target,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Headset,
  Settings,
  Wrench,
  Users,
  Globe,
} from "lucide-react";

const whyChooseUs = [
  { icon: Clock, title: "9+ Years of Industry Experience" },
  { icon: CheckCircle2, title: "Genuine and Quality Products" },
  { icon: Headset, title: "Professional Technical Support" },
  { icon: Settings, title: "Customized IT & Security Solutions" },
  { icon: Wrench, title: "Reliable AMC Services" },
  { icon: Users, title: "Customer-Centric Approach" },
  { icon: Globe, title: "Pan-India Online Availability" },
];

export default function About() {
  return (
    <div className="-mx-8 -mt-8 -mb-8">
      {/* Hero Section */}
      <section className="relative bg-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur mb-6">
            <Building2 className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              About Us
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Gurugram IT Networks
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Your trusted technology partner for reliable IT solutions, security
            systems, and business infrastructure services.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Founded with a vision to simplify technology for businesses and
              individuals, Gurugram IT Networks has been serving customers for
              over <strong className="text-gray-900">9 years</strong>.
              Throughout our journey, we have built a strong reputation for
              delivering quality products, professional support, and dependable
              service across a wide range of IT and security solutions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our expertise includes CCTV surveillance systems, biometric
              attendance machines, networking solutions, EPABX systems, computer
              hardware, laptops, desktops, accessories, and Annual Maintenance
              Contract (AMC) services. Over the years, we have successfully
              supported businesses, offices, educational institutions, retail
              outlets, and residential customers with customized technology
              solutions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              As technology continues to evolve, so do we. To better serve our
              customers across India, we are now expanding into the e-commerce
              space through{" "}
              <strong className="text-gray-900">GurugramITNetworks.com</strong>.
              Our goal is to make high-quality IT products and solutions easily
              accessible online while maintaining the same trust, support, and
              customer-first approach that has defined our business for nearly a
              decade.
            </p>
            <p className="text-gray-600 leading-relaxed">
              At Gurugram IT Networks, we believe that technology should empower
              growth, improve security, and simplify operations. Whether you are
              looking for a single product or a complete IT infrastructure
              solution, our team is committed to helping you find the right
              solution at the right price.
            </p>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-4xl font-extrabold text-gray-900">9+</p>
              <p className="text-sm text-gray-500 mt-1">
                Years of Industry Experience
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-4xl font-extrabold text-gray-900">1000+</p>
              <p className="text-sm text-gray-500 mt-1">
                Happy Customers Served
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-4xl font-extrabold text-gray-900">Pan-India</p>
              <p className="text-sm text-gray-500 mt-1">Online Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Mission & Vision */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-3">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To provide affordable, reliable, and innovative technology
              solutions that help businesses and individuals stay connected,
              secure, and productive.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg mb-6">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-3">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To become one of India&apos;s most trusted IT and security
              solution providers by combining expert service, quality products,
              and a seamless online shopping experience.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Why Choose Us */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Why Choose Us
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Here is what sets Gurugram IT Networks apart from the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyChooseUs.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 text-gray-700 flex-shrink-0">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
