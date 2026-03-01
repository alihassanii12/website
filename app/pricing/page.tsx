"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type User = {
  id: string;
  email: string;
  plan?: "Free" | "Pro" | "Enterprise";
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PricingSection() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "For personal projects & testing",
      storage: "5GB Image Storage",
      features: [
        "Upload up to 5GB images",
        "Basic image optimization",
        "Public image URLs",
        "Community support",
      ],
      button: "Get Started",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$9",
      description: "Perfect for creators & startups",
      storage: "50GB Image Storage",
      features: [
        "Upload up to 50GB images",
        "Advanced optimization",
        "Private images",
        "Fast CDN delivery",
        "Email support",
      ],
      button: "Upgrade to Pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large scale businesses",
      storage: "Unlimited Storage",
      features: [
        "Unlimited image uploads",
        "Dedicated CDN",
        "Team access",
        "Priority support",
        "Custom integrations",
      ],
      button: "Contact Sales",
      highlight: false,
    },
  ];

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/me`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (planName: string) => {
    if (processing) return;

    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    if (planName === "Free") {
      router.push("/dashboard");
      return;
    }

    if (planName === "Pro") {
      try {
        setProcessing(true);
        const res = await axios.post(
          `${API_URL}/create-checkout`,
          { userId: user.id, email: user.email },
          { withCredentials: true }
        );
        window.location.href = res.data.url;
      } catch {
        setProcessing(false);
        alert("Checkout failed. Please try again.");
      }
      return;
    }

    if (planName === "Enterprise") {
      router.push("/contact");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading pricing…
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-gray-50">
        <section className="py-20 min-h-screen">
          <div className="max-w-6xl mx-auto px-6">
            {/* Heading */}
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                Simple <span className="text-blue-500">Pricing</span>
              </h2>
              <p className="mt-3 text-base text-gray-600">
                Choose the perfect plan for your image library needs
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {plans.map((plan) => {
                const isCurrentPlan = user?.plan === plan.name;

                return (
                  <div
                    key={plan.name}
                    className={`relative rounded-2xl p-6 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]
                    ${plan.highlight ? "ring-2 ring-blue-500" : ""}`}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-0.5 text-xs rounded-full">
                        Most Popular
                      </span>
                    )}

                    <h3 className="text-xl font-semibold text-gray-900">
                      {plan.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {plan.description}
                    </p>

                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.price !== "Custom" && (
                        <span className="text-sm text-gray-500"> / month</span>
                      )}
                    </div>

                    <p className="mt-3 text-sm font-medium text-blue-600">
                      {plan.storage}
                    </p>

                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="text-green-500 text-xs">✔</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      disabled={processing || isCurrentPlan}
                      onClick={() => handleAction(plan.name)}
                      className={`mt-6 w-full py-2.5 rounded-full text-sm font-medium transition
                        ${
                          plan.highlight
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-black text-white hover:bg-gray-800"
                        }
                        ${
                          processing || isCurrentPlan
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                    >
                      {isCurrentPlan
                        ? "Current Plan"
                        : !user
                        ? plan.name === "Free"
                          ? "Get Started Free"
                          : "Get Started"
                        : plan.button}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}