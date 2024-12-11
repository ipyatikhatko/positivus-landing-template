import gsap from "gsap";

export default function heroAnimation() {
  // Store base animations in variables to control them later
  const floatingAnimations = {
    megaphone: null,
    stars: [],
    circles: [],
    socialIcons: [],
  };

  // Initialize floating animations
  const initFloatingAnimations = () => {
    // Megaphone floating animation
    floatingAnimations.megaphone = gsap.to("#megaphone", {
      y: -10,
      rotation: 3,
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // Megaphone floating animation
    floatingAnimations.megaphone = gsap.to(".orbital-line", {
      y: -10,
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      stagger: 0.5,
      ease: "sine.inOut",
    });

    // Stars Animation
    floatingAnimations.stars.push(
      gsap.to("#star-large", {
        scale: 1.1,
        opacity: 0.7,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }),
      gsap.to("#star-small", {
        scale: 1.2,
        opacity: 0.8,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      })
    );

    // Floating Circles Animation
    floatingAnimations.circles.push(
      gsap.to("#circle-green-1", {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }),
      gsap.to("#circle-green-2", {
        y: -12,
        duration: 2.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.4,
      }),
      gsap.to("#circle-black", {
        y: -10,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.8,
      })
    );

    // Social Icons Animation
    const randomY = (min, max) => gsap.utils.random(min, max);
    const randomDuration = () => gsap.utils.random(2, 3);

    ["#heart", "#share", "#play", "#pin"].forEach((selector, index) => {
      floatingAnimations.socialIcons.push(
        gsap.to(selector, {
          y: randomY(-8, 8),
          x: randomY(-8, 8),
          rotation: randomY(-12, 12),
          duration: randomDuration(),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.2,
        })
      );
    });
  };

  // Initialize base animations
  initFloatingAnimations();

  // Add Parallax Effect with boundaries
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    let isMoving = false;
    let moveTimeout;

    const parallaxElements = {
      megaphone: document.querySelector("#megaphone"),
      stars: document.querySelectorAll("#star-large, #star-small"),
      circles: document.querySelectorAll(
        "#circle-green-1, #circle-green-2, #circle-black"
      ),
      socialIcons: document.querySelectorAll("#heart, #share, #play, #pin"),
    };

    // Store initial megaphone position
    const megaphoneInitialY = gsap.getProperty(parallaxElements.megaphone, "y");

    // Add clamp helper function
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    heroSection.addEventListener("mousemove", (e) => {
      if (moveTimeout) clearTimeout(moveTimeout);
      isMoving = true;

      const rect = heroSection.getBoundingClientRect();

      // Calculate relative to hero center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Get mouse position relative to center
      let mouseX = e.clientX - centerX;
      let mouseY = e.clientY - centerY;

      // Clamp movement to 100px in any direction
      mouseX = clamp(mouseX, -100, 100);
      mouseY = clamp(mouseY, -100, 100);

      // Slower movement for megaphone
      gsap.to(parallaxElements.megaphone, {
        x: mouseX * 0.15, // Reduced from 0.3 to 0.15
        y: megaphoneInitialY + mouseY * 0.15, // Reduced from 0.3 to 0.15
        duration: 1.2, // Increased from 0.6 to 1.2
        ease: "power2.out",
        overwrite: "auto",
      });

      // Slower movement for other elements
      gsap.to(parallaxElements.stars, {
        x: mouseX * 0.25, // Reduced from 0.5 to 0.25
        y: mouseY * 0.25,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(parallaxElements.circles, {
        x: mouseX * 0.1, // Reduced from 0.2 to 0.1
        y: mouseY * 0.1,
        duration: 1.6, // Increased from 0.8 to 1.6
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(parallaxElements.socialIcons, {
        x: mouseX * 0.2, // Reduced from 0.4 to 0.2
        y: mouseY * 0.2,
        duration: 1.4, // Increased from 0.7 to 1.4
        ease: "power2.out",
        overwrite: "auto",
      });

      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    });

    // Reset to initial position on mouse leave
    heroSection.addEventListener("mouseleave", () => {
      gsap.to(parallaxElements.megaphone, {
        x: 0,
        y: megaphoneInitialY,
        duration: 1.6, // Increased from 0.8 to 1.6
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(
        [
          parallaxElements.stars,
          parallaxElements.circles,
          parallaxElements.socialIcons,
        ],
        {
          x: 0,
          y: 0,
          duration: 1.6, // Increased from 0.8 to 1.6
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    });
  }

  // Updated hover effect to work with floating
  const heroImage = document.querySelector(".hero__image");
  if (heroImage) {
    heroImage.addEventListener("mouseenter", () => {
      gsap.to("#megaphone", {
        scale: 1.05,
        duration: 0.3,
        overwrite: "scale", // Only overwrite scale property
      });
    });

    heroImage.addEventListener("mouseleave", () => {
      gsap.to("#megaphone", {
        scale: 1,
        duration: 0.3,
        overwrite: "scale", // Only overwrite scale property
      });
    });
  }
}
