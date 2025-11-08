"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Shield, Eye, Lock, Database, Users, Globe, Mail, Phone } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information."
        },
        {
          subtitle: "Automatically Collected Information",
          text: "We automatically collect certain information about your device and how you interact with our services, including IP address, browser type, operating system, referring URLs, pages viewed, and the dates/times of visits."
        },
        {
          subtitle: "Cookies and Tracking Technologies",
          text: "We use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities and preferences to provide personalized experiences and improve our services."
        }
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide, maintain, and improve our services, process transactions, send order confirmations, and provide customer support."
        },
        {
          subtitle: "Communication",
          text: "We may use your information to send you promotional materials, newsletters, and other communications that may be of interest to you. You can opt out of these communications at any time."
        },
        {
          subtitle: "Analytics and Improvements",
          text: "We analyze usage patterns and feedback to understand how our services are used and to improve functionality, user experience, and develop new features."
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      icon: Users,
      content: [
        {
          subtitle: "Service Providers",
          text: "We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required to do so by law or if we believe that such action is necessary to comply with legal processes, protect our rights, or ensure the safety of our users."
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          subtitle: "Encryption",
          text: "We use industry-standard encryption protocols to protect sensitive information during transmission and storage."
        },
        {
          subtitle: "Access Controls",
          text: "Access to personal information is restricted to employees and contractors who need it to perform their job functions and are bound by confidentiality obligations."
        }
      ]
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      icon: Shield,
      content: [
        {
          subtitle: "Account Information",
          text: "You can update, correct, or delete your account information at any time by logging into your account settings or contacting us directly."
        },
        {
          subtitle: "Marketing Communications",
          text: "You can opt out of receiving promotional emails by following the unsubscribe instructions in those emails or by updating your preferences in your account settings."
        },
        {
          subtitle: "Data Portability",
          text: "You have the right to request a copy of your personal information in a structured, commonly used format."
        },
        {
          subtitle: "Data Deletion",
          text: "You can request deletion of your personal information, subject to certain legal and business requirements."
        }
      ]
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      icon: Globe,
      content: [
        {
          subtitle: "Cross-Border Transfers",
          text: "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information during such transfers."
        },
        {
          subtitle: "Adequacy Decisions",
          text: "We rely on adequacy decisions by relevant authorities or implement appropriate safeguards such as standard contractual clauses to protect your information."
        }
      ]
    }
  ];

  const quickLinks = [
    { title: "Contact Us", href: "/contact", icon: Mail },
    { title: "Terms & Conditions", href: "/terms-conditions", icon: Phone },
    { title: "Returns & Refunds", href: "/returns-refunds", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-rose-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: November 6, 2024
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 py-2 px-3 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <section.icon className="h-4 w-4" />
                <span className="text-sm">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              At MultiVendor, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              website, mobile application, and related services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our services.
            </p>
          </div>
        </div>

        {/* Main Sections */}
        {sections.map((section, index) => (
          <div key={section.id} id={section.id} className="bg-white rounded-xl p-8 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-rose-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <section.icon className="h-6 w-6 text-rose-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
            </div>
            
            <div className="space-y-6">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.subtitle}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us About Privacy</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us using the information below:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Mail className="h-8 w-8 text-rose-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Email</p>
              <p className="text-sm text-gray-600">privacy@multivendor.com</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Phone className="h-8 w-8 text-rose-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Phone</p>
              <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Mail className="h-8 w-8 text-rose-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Address</p>
              <p className="text-sm text-gray-600">123 Business Ave, Suite 100<br />New York, NY 10001</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Related Information</h2>
          <p className="mb-6 opacity-90">Learn more about our policies and how we protect you</p>
          <div className="flex flex-wrap justify-center gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
