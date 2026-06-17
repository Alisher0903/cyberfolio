"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX - 5, y: mouseY - 5, duration: 0.05, ease: "none" });
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      gsap.set(follower, { x: followerX - 18, y: followerY - 18 });
      requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      gsap.to(cursor, { scale: 2, duration: 0.3 });
      gsap.to(follower, { scale: 1.5, duration: 0.3 });
    };
    const onLeaveLink = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, duration: 0.3 });
    };

    document.addEventListener("mousemove", onMove);
    const links = document.querySelectorAll("a, button");
    links.forEach(l => {
      l.addEventListener("mouseenter", onEnterLink);
      l.addEventListener("mouseleave", onLeaveLink);
    });

    animate();
    return () => {
      document.removeEventListener("mousemove", onMove);
      links.forEach(l => {
        l.removeEventListener("mouseenter", onEnterLink);
        l.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
