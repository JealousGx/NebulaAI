import { useEffect, useRef } from "react";

export function VortexBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current as HTMLCanvasElement;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		let particles: Particle[] = [];
		let animationFrameId: number;
		let mouseX = 0;
		let mouseY = 0;

		class Particle {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			opacity: number;
			baseOpacity: number;
			angle: number;
			color: string;

			constructor() {
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * canvas.height;
				this.size = Math.random() * 3 + 0.5;
				this.speedX = (Math.random() - 0.5) * 0.8;
				this.speedY = (Math.random() - 0.5) * 0.8;
				this.baseOpacity = Math.random() * 0.4 + 0.1;
				this.opacity = this.baseOpacity;
				this.angle = Math.random() * Math.PI * 2;

				// Random colors from the theme palette
				const colors = [
					"rgba(114, 192, 255, ", // Primary blue
					"rgba(124, 230, 255, ", // Cyan
					"rgba(190, 220, 140, ", // Yellow-green
				];
				this.color = colors[Math.floor(Math.random() * colors.length)];
			}

			update() {
				// Calculate distance from mouse
				const dx = mouseX - this.x;
				const dy = mouseY - this.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				// Mouse interaction - particles move away from cursor
				if (distance < 150 && distance > 0) {
					const force = (150 - distance) / 150;
					this.x -= (dx / distance) * force * 2;
					this.y -= (dy / distance) * force * 2;
					this.opacity = Math.min(this.baseOpacity * 2, 0.8);
				} else {
					this.opacity = this.baseOpacity;
				}

				// Orbital movement
				this.angle += 0.005;
				this.x += this.speedX + Math.cos(this.angle) * 0.2;
				this.y += this.speedY + Math.sin(this.angle) * 0.2;

				// Wrap around screen
				if (this.x > canvas.width) this.x = 0;
				if (this.x < 0) this.x = canvas.width;
				if (this.y > canvas.height) this.y = 0;
				if (this.y < 0) this.y = canvas.height;
			}

			draw() {
				if (!ctx) return;

				// Ensure values are finite before drawing
				if (
					!Number.isFinite(this.x) ||
					!Number.isFinite(this.y) ||
					!Number.isFinite(this.size) ||
					!Number.isFinite(this.opacity)
				) {
					return;
				}

				// Draw glow effect
				const gradient = ctx.createRadialGradient(
					this.x,
					this.y,
					0,
					this.x,
					this.y,
					this.size * 3,
				);
				gradient.addColorStop(0, `${this.color}${this.opacity})`);
				gradient.addColorStop(1, `${this.color}0)`);

				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
				ctx.fill();

				// Draw particle core
				ctx.fillStyle = `${this.color}${this.opacity * 1.5})`;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		const init = () => {
			particles = [];
			for (let i = 0; i < 150; i++) {
				particles.push(new Particle());
			}
		};

		const connectParticles = () => {
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 120) {
						ctx.strokeStyle = `rgba(114, 192, 255, ${0.15 * (1 - distance / 120)})`;
						ctx.lineWidth = 0.5;
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.stroke();
					}
				}
			}
		};

		const animate = () => {
			// Gradient background
			const gradient = ctx.createLinearGradient(
				0,
				0,
				canvas.width,
				canvas.height,
			);
			gradient.addColorStop(0, "rgba(23, 23, 26, 0.95)");
			gradient.addColorStop(0.5, "rgba(31, 23, 40, 0.95)");
			gradient.addColorStop(1, "rgba(23, 23, 26, 0.95)");

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			connectParticles();

			particles.forEach((particle) => {
				particle.update();
				particle.draw();
			});

			animationFrameId = requestAnimationFrame(animate);
		};

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			init();
		};

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		init();
		animate();

		window.addEventListener("resize", handleResize);
		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 w-full h-full -z-10"
			style={{ background: "oklch(0.1797 0.0043 308.1928)" }}
		/>
	);
}
