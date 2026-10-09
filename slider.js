class ImageSlider {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector(".slider-track");
        this.slides = Array.from(this.track.children);
        this.previousButton = container.querySelector(".slider-previous");
        this.nextButton = container.querySelector(".slider-next");
        this.dotsContainer = container.querySelector(".slider-dots");
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoPlayInterval = null;

        if (this.slides.length === 0) {
            return;
        }

        this.createClones();
        this.createDots();
        this.bindEvents();
        this.updatePosition(false);
        this.startAutoplay();
    }

    createClones() {
        this.track.prepend(this.slides[this.slides.length - 1].cloneNode(true));
        this.track.append(this.slides[0].cloneNode(true));
    }

    createDots() {
        this.dots = this.slides.map((_, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "slider-dot";
            dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
            dot.addEventListener("click", () => this.goToSlide(index));
            this.dotsContainer.append(dot);
            return dot;
        });

        this.updateDots();
    }

    bindEvents() {
        this.previousButton.addEventListener("click", () => this.showPrevious());
        this.nextButton.addEventListener("click", () => this.showNext());
        const viewport = this.container.querySelector(".slider-viewport");
        viewport.addEventListener("mouseenter", () => this.stopAutoplay());
        viewport.addEventListener("mouseleave", () => this.startAutoplay());
        this.track.addEventListener("transitionend", (event) => {
            if (event.propertyName === "transform") {
                this.handleTransitionEnd();
            }
        });
    }

    startAutoplay() {
        if (this.autoPlayInterval === null) {
            this.autoPlayInterval = window.setInterval(() => this.showNext(), 5000);
        }
    }

    stopAutoplay() {
        window.clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
    }

    showPrevious() {
        this.moveTo(this.currentIndex - 1);
    }

    showNext() {
        this.moveTo(this.currentIndex + 1);
    }

    goToSlide(index) {
        this.moveTo(index);
    }

    moveTo(index) {
        if (this.isTransitioning || index < -1 || index > this.slides.length) {
            return;
        }

        this.currentIndex = index;
        this.isTransitioning = true;
        this.updatePosition(true);
        this.updateDots();
    }

    updatePosition(animate) {
        this.track.style.transition = animate ? "" : "none";
        this.track.style.transform = `translateX(-${(this.currentIndex + 1) * 100}%)`;
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            const activeIndex = (this.currentIndex + this.slides.length) % this.slides.length;
            if (index === activeIndex) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    handleTransitionEnd() {
        if (this.currentIndex === this.slides.length) {
            this.currentIndex = 0;
            this.updatePosition(false);
        } else if (this.currentIndex < 0) {
            this.currentIndex = this.slides.length - 1;
            this.updatePosition(false);
        }

        this.isTransitioning = false;
        this.updateDots();
    }
}

document.querySelectorAll("[data-slider]").forEach((slider) => {
    new ImageSlider(slider);
});
