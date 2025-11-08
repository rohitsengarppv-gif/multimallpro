"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Users, Award, Target, Heart, Globe, Truck, Shield, Star } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Products Sold", value: "100K+", icon: Award },
    { label: "Years Experience", value: "10+", icon: Target },
    { label: "Countries Served", value: "25+", icon: Globe }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We put our customers at the heart of everything we do, ensuring exceptional service and satisfaction."
    },
    {
      icon: Award,
      title: "Quality Products",
      description: "We carefully curate our products to ensure only the highest quality items reach our customers."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to get your orders to you as fast as possible."
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your privacy and security are our top priorities with encrypted transactions and data protection."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      description: "Passionate about creating exceptional shopping experiences for our customers."
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      description: "Ensures smooth operations and timely delivery of all orders."
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      description: "Dedicated to providing outstanding customer service and support."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About MultiVendor</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're passionate about bringing you the best products from around the world. 
            Our mission is to create an exceptional shopping experience that connects customers 
            with quality products and trusted vendors.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-rose-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Our Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2014, MultiVendor started as a small team with a big vision: 
                to create a marketplace where quality meets convenience. We believed that 
                shopping online should be more than just a transaction—it should be an experience.
              </p>
              <p>
                Over the years, we've grown from a local startup to a global platform, 
                serving customers in over 25 countries. Our success is built on three 
                pillars: quality products, exceptional service, and trusted relationships 
                with both customers and vendors.
              </p>
              <p>
                Today, we're proud to be home to thousands of products from hundreds of 
                verified vendors, all committed to delivering excellence. Every purchase 
                you make supports not just our platform, but the dreams and livelihoods 
                of entrepreneurs worldwide.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
              alt="Our team working"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600">4.9/5 Customer Rating</p>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-rose-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-rose-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of our growing community and discover amazing products from trusted vendors.
          </p>
          <button className="bg-white text-rose-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Shopping
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
