"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FileText, Scale, Shield, Users, Globe, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function TermsConditionsPage() {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: "By accessing and using MultiVendor's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      id: "definitions",
      title: "Definitions",
      icon: FileText,
      content: "In these Terms and Conditions, 'Company' refers to MultiVendor, 'Service' refers to our website and related services, 'User' refers to anyone who accesses or uses our Service, and 'Content' refers to all information, data, text, software, music, sound, photographs, graphics, video, messages, or other materials."
    },
    {
      id: "user-accounts",
      title: "User Accounts",
      icon: Users,
      content: "To access certain features of our Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account."
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      icon: Shield,
      content: "You agree to use our Service only for lawful purposes and in accordance with these Terms. You may not use our Service to transmit, distribute, store or destroy material that could constitute or encourage conduct that would be considered a criminal offense, give rise to civil liability, or otherwise violate any law or regulation."
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      icon: Scale,
      content: "The Service and its original content, features, and functionality are and will remain the exclusive property of MultiVendor and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent."
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: Shield,
      content: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection, use, and disclosure of your personal information."
    }
  ];

  const prohibitedActivities = [
    "Violating any applicable laws or regulations",
    "Infringing on intellectual property rights",
    "Transmitting harmful or malicious code",
    "Attempting to gain unauthorized access to our systems",
    "Interfering with the proper functioning of the Service",
    "Engaging in fraudulent activities",
    "Harassing or threatening other users",
    "Posting false or misleading information"
  ];

  const userRights = [
    "Access and use our Service in accordance with these Terms",
    "Create an account and maintain your profile",
    "Purchase products and services offered on our platform",
    "Receive customer support and assistance",
    "Request deletion of your personal data",
    "Opt-out of marketing communications"
  ];

  const userResponsibilities = [
    "Provide accurate and complete information",
    "Maintain the security of your account credentials",
    "Comply with all applicable laws and regulations",
    "Respect the rights of other users and third parties",
    "Use the Service only for its intended purposes",
    "Report any violations or security issues"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-rose-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our Service. 
            These terms govern your use of MultiVendor's website and services.
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
              Welcome to MultiVendor! These Terms and Conditions ("Terms", "Terms and Conditions") govern your 
              relationship with MultiVendor website (the "Service") operated by MultiVendor ("us", "we", or "our").
            </p>
            <p className="text-gray-600 leading-relaxed">
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. 
              These Terms apply to all visitors, users and others who access or use the Service.
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
            <p className="text-gray-600 leading-relaxed">{section.content}</p>
          </div>
        ))}

        {/* Prohibited Activities */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Prohibited Activities</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            You may not access or use the Service for any purpose other than that for which we make the Service available. 
            The Service may not be used in connection with any commercial endeavors except those that are specifically 
            endorsed or approved by us. Prohibited activities include, but are not limited to:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {prohibitedActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{activity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* User Rights */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <p className="text-gray-600 mb-6">As a user of our Service, you have the following rights:</p>
            <div className="space-y-3">
              {userRights.map((right, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{right}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Responsibilities</h2>
            </div>
            <p className="text-gray-600 mb-6">As a user of our Service, you are responsible for:</p>
            <div className="space-y-3">
              {userResponsibilities.map((responsibility, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{responsibility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Terms */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Important Terms</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
              <p className="text-gray-600 text-sm mb-6">
                In no event shall MultiVendor, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Disclaimer</h3>
              <p className="text-gray-600 text-sm">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
                this Company excludes all representations, warranties, conditions and terms.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Governing Law</h3>
              <p className="text-gray-600 text-sm mb-6">
                These Terms shall be interpreted and governed by the laws of the State of New York, without regard to 
                its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not 
                be considered a waiver of those rights.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Changes to Terms</h3>
              <p className="text-gray-600 text-sm">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FileText className="h-8 w-8 text-rose-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Email</p>
              <p className="text-sm text-gray-600">legal@multivendor.com</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Globe className="h-8 w-8 text-rose-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Website</p>
              <p className="text-sm text-gray-600">www.multivendor.com</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FileText className="h-8 w-8 text-rose-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Address</p>
              <p className="text-sm text-gray-600">123 Business Ave, Suite 100<br />New York, NY 10001</p>
            </div>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Agreement Acknowledgment</h2>
          <p className="mb-6 opacity-90">
            By using our Service, you acknowledge that you have read and understood these Terms and Conditions 
            and agree to be bound by them.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/privacy-policy"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/returns-refunds"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Returns & Refunds
            </a>
            <a
              href="/contact"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
