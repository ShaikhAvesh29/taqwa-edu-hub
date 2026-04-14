"use client";

import { useState, useEffect } from "react";

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: "New Release",
      title: "Master 10th ICSE Syllabus",
      desc: "Comprehensive video lectures and mock tests for board preparation.",
      btnText: "Enroll Now"
    },
    {
      badge: "Trending",
      title: "Crack 12th Boards with Ease",
      desc: "Intensive preparation material for Physics, Chemistry, and Mathematics.",
      btnText: "Enroll Now"
    },
    {
      badge: "Announcement",
      title: "Early Bird: 9th & 7th ICSE",
      desc: "Start your foundation strong. Up to 30% off on early enrollment.",
      btnText: "Discover More"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="ad-carousel-container">
      <div className="ad-slides">
        {slides.map((slide, index) => (
          <div key={index} className={`ad-slide ${index === currentSlide ? "active" : ""}`}>
            <div className="ad-content">
              <span className="ad-badge">{slide.badge}</span>
              <h2>{slide.title}</h2>
              <p>{slide.desc}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.openEnrollModal?.()}
              >
                {slide.btnText}
              </button>
            </div>
            <img src="/course_thumbnail.png" alt="Ad Image" />
          </div>
        ))}
      </div>
      <button 
        className="slider-btn prev-btn" 
        onClick={() => setCurrentSlide(currentSlide <= 0 ? slides.length - 1 : currentSlide - 1)}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button 
        className="slider-btn next-btn" 
        onClick={() => setCurrentSlide(currentSlide >= slides.length - 1 ? 0 : currentSlide + 1)}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
      <div className="slider-dots">
        {slides.map((_, index) => (
          <span 
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
