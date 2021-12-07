export class StarRater extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: "open"});

        this.settings = {
            maxStars: (this.getAttribute("max-stars")) ? this.getAttribute("max-stars") : 5,
            currentRating: (this.getAttribute("current-rating")) ? this.getAttribute("current-rating") : 0,
            offColor: (this.getAttribute("off-color")) ? this.getAttribute("off-color") : "#F5F5F5",
            onColor: (this.getAttribute("on-color")) ? this.getAttribute("on-color") : "#FFD700",
        };

        this.hasOnchange = (this.getAttribute("onchange"));

        this.render();
    }

    connectedCallback() {
        this.stars = this.shadowRoot.querySelectorAll(".star");

        this.stars.forEach((star) => {
            star.addEventListener("mouseover", (e) => this.ratingHover(e));
    
            star.addEventListener("click", (e) => this.setRating(e))
        });
    
        this.addEventListener("mouseout", () => this.resetRating());

        this.resetRating();
    }

    render() {
        this.shadowRoot.innerHTML = this.template();
    }

    template() {
        const starsNeeded = Array.from({length: this.settings.maxStars}, (_, i) => i + 1)

        return `
            <style>
                :host {
                    display: block;
                }
                .star {
                    font-size: 5rem;
                    color: ${this.settings.offColor};
                }
            </style>
            ${starsNeeded.map((s) => this.starTemplate(s)).join("")}
        `;
    }

    starTemplate(val) {
        return `
            <span class="star" data-value="${val}">&#9733;</span>
        `;
    }

    resetRating() {
        const currentRating = this.getAttribute("current-rating") || 0;

        this.highlightRating(currentRating);
    }

    highlightRating(rating) {
        this.stars.forEach((star) => {
            star.style.color = (parseInt(rating) >= parseInt(star.getAttribute("data-value"))) ? this.settings.onColor : this.settings.offColor
        });
    }

    ratingHover({currentTarget}) {
        const hoverValue = currentTarget.getAttribute("data-value");

        this.highlightRating(hoverValue);
    }

    setRating({currentTarget}) {
        const newRating = currentTarget.getAttribute("data-value");

        this.setAttribute("current-rating", newRating);

        if(this.hasOnchange) {
            this.dispatchEvent(new Event('change', { 'bubbles': true }));
        }
    }
}
