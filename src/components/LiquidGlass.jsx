
import React, { useEffect, useRef } from 'react';
import '../App.css';

const LiquidGlass = () => {
  const particleContainerRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const particleContainer = particleContainerRef.current;
    const follower = followerRef.current;
    let particles = [];
    let animationFrameId;

    // Create particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;
      particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
      particle.style.borderRadius = '50%';
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
      particleContainer.appendChild(particle);
      particles.push({
        element: particle,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    const handleMouseMove = (e) => {
      if (follower) {
        follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Particle repulsion
      particles.forEach(p => {
        const dx = e.clientX - parseFloat(p.element.style.left);
        const dy = e.clientY - parseFloat(p.element.style.top);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 100;
          p.vx -= Math.cos(angle) * force * 0.5;
          p.vy -= Math.sin(angle) * force * 0.5;
        }
      });
    };

    const handleClick = (e) => {
      const wave = document.createElement('div');
      wave.style.position = 'absolute';
      wave.style.width = '10px';
      wave.style.height = '10px';
      wave.style.background = 'rgba(255, 255, 255, 0.3)';
      wave.style.borderRadius = '50%';
      wave.style.left = `${e.clientX}px`;
      wave.style.top = `${e.clientY}px`;
      wave.style.transform = 'translate(-50%, -50%)';
      wave.style.transition = 'all 1s ease-out';
      document.body.appendChild(wave);

      setTimeout(() => {
        wave.style.width = '200px';
        wave.style.height = '200px';
        wave.style.opacity = '0';
      }, 10);

      setTimeout(() => {
        wave.remove();
      }, 1000);
    };

    const animateParticles = () => {
      particles.forEach(p => {
        let x = parseFloat(p.element.style.left) + p.vx;
        let y = parseFloat(p.element.style.top) + p.vy;

        if (x < 0 || x > window.innerWidth) p.vx *= -1;
        if (y < 0 || y > window.innerHeight) p.vy *= -1;

        p.element.style.left = `${x}px`;
        p.element.style.top = `${y}px`;

        // Dampening
        p.vx *= 0.99;
        p.vy *= 0.99;
      });

      animationFrameId = requestAnimationFrame(animateParticles);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    animateParticles();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      particleContainer.innerHTML = '';
    };
  }, []);

  return (
    <>
      <div className="liquid-glass-bg"></div>
      <div ref={particleContainerRef} className="particle-container"></div>
      <div ref={followerRef} className="mouse-follower"></div>
    </>
  );
};

export default LiquidGlass;
