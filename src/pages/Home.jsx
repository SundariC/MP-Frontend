import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Video,
  MessageCircle,
  ArrowRight,
  UserCheck,
  CreditCard,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleFindDoctor = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/browse");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <header className="pt-12 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
            {user && user.fullName
              ? `Welcome back, ${user.fullName.split(" ")[0]}!`
              : "Talk to a professional counselor"}

            <span className="text-teal-600 font-extrabold">
              {" "}
              online from home.
            </span>
          </h1>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleFindDoctor}
              className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100"
            >
              Find a Doctor
            </button>
            {!user && (
              <button className="px-8 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition">
                Join as Counselor
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=800"
            className="rounded-[2rem] shadow-2xl"
            alt="Therapy Session"
          />
        </div>
      </header>

      {/* 2. OUR SERVICES SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            Our Services
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Professional help for every aspect of your life.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Mental Health",
              desc: "Support for anxiety, depression, and stress management.",
              icon: <ShieldCheck className="text-teal-600" />,
            },
            {
              title: "Relationships",
              desc: "Guidance for couples, families, and interpersonal connections.",
              icon: <MessageCircle className="text-teal-600" />,
            },
            {
              title: "Career Coach",
              desc: "Professional advice to help you navigate your career path.",
              icon: <UserCheck className="text-teal-600" />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-10 bg-white rounded-3xl border border-slate-100 hover:shadow-xl transition group text-center"
            >
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-500 mb-6 leading-relaxed">{item.desc}</p>
              <button className="text-teal-600 font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all">
                Find a mentor <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-slate-500">
              Getting started is simple and secure.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              {
                step: "1",
                title: "Identify",
                desc: "Understand your needs and goals.",
                icon: <UserCheck />,
              },
              {
                step: "2",
                title: "Choose Counselor",
                desc: "Select from our licensed experts.",
                icon: <Video />,
              },
              {
                step: "3",
                title: "Book & Pay",
                desc: "Securely schedule your sessions.",
                icon: <CreditCard />,
              },
              {
                step: "4",
                title: "Join Session",
                desc: "Connect via video or chat.",
                icon: <MessageCircle />,
              },
            ].map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-6 text-xl">
                  {item.step}
                </div>
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS (STORIES) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center text-slate-900 mb-16">
            Stories from our community
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100"
              >
                <div className="flex gap-1 mb-4 text-orange-400">
                  {"★ ★ ★ ★ ★".split(" ").map((s, idx) => (
                    <span key={idx}>{s}</span>
                  ))}
                </div>
                <p className="text-slate-600 italic mb-6 leading-relaxed">
                  "The counseling sessions helped me regain my confidence.
                  Finding a counselor was so easy and the support was amazing."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      Client Name
                    </p>
                    <p className="text-xs text-slate-400">Verified User</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
