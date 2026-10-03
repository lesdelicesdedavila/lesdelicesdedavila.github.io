const texts = {
  fr: {
    title: "Les Délices de Davila",
    text: "Les saveurs authentiques de l'Afrique au cœur de Marrakech.",
    button: "Réserver sur WhatsApp"
  },
  en: {
    title: "Les Délices de Davila",
    text: "Authentic African flavors in the heart of Marrakech.",
    button: "Book on WhatsApp"
  },
  es: {
    title: "Les Délices de Davila",
    text: "Sabores auténticos de África en el corazón de Marrakech.",
    button: "Reservar por WhatsApp"
  }
};

document.getElementById("language").addEventListener("change", function () {
  const lang = this.value;

  document.getElementById("hero-title").textContent = texts[lang].title;
  document.getElementById("hero-text").textContent = texts[lang].text;
  document.getElementById("hero-btn").textContent = texts[lang].button;
});const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.category;

        cards.forEach(card => {
            if (category === "all" || card.dataset.category === category) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});document.getElementById("reservationForm").addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("name").value;
    const people = document.getElementById("people").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    const message =
`Bonjour Les Délices de Davila !
Je souhaite réserver une table.

Nom : ${name}
Personnes : ${people}
Date : ${date}
Heure : ${time}`;

    const phone = "212664553220"; //
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
});
const galleryImages = document.querySelectorAll(".gallery-grid img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeLightbox = document.getElementById("close-lightbox");

galleryImages.forEach(img => {
    img.addEventListener("click", () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    });
});

closeLightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
});

lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
        lightbox.style.display = "none";
    }
});
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    reveals.forEach(section => {
        const windowHeight = window.innerHeight;
        const revealTop = section.getBoundingClientRect().top;

        if (revealTop < windowHeight - 100) {
            section.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
/* =========================================
   PANIER - LES DÉLICES DE DAVILA
========================================= */

let cart = JSON.parse(localStorage.getItem("davilaCart")) || [];


/* =========================================
   ÉLÉMENTS
========================================= */

const cartButton = document.getElementById("cart-button");
const cartModal = document.getElementById("cart-modal");
const closeCart = document.getElementById("close-cart");
const continueShopping = document.getElementById("continue-shopping");

const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

const whatsappOrder = document.getElementById("whatsapp-order");


/* =========================================
   FORMATER LE PRIX
========================================= */

function getPrice(price) {

    return parseFloat(
        String(price)
            .replace(/[^\d.,]/g, "")
            .replace(",", ".")
    ) || 0;

}


/* =========================================
   FORMATAGE MAD
========================================= */

function formatPrice(price) {

    return `${price.toFixed(2).replace(".00", "")} MAD`;

}


/* =========================================
   SAUVEGARDER LE PANIER
========================================= */

function saveCart() {

    localStorage.setItem(
        "davilaCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   AFFICHER LE PANIER
========================================= */

function renderCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;
    let quantityTotal = 0;


    /* PANIER VIDE */

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Votre panier est vide.
            </p>
        `;

        cartCount.textContent = "0";
        cartTotal.textContent = "0 MAD";

        if (whatsappOrder) {
            whatsappOrder.disabled = true;
        }

        return;
    }


    /* ARTICLES */

    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        quantityTotal += item.quantity;


        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.innerHTML = `

            <div class="cart-item-info">

                <p class="cart-item-name">
                    ${escapeHtml(item.name)}
                </p>

                <p class="cart-item-price">
                    ${formatPrice(item.price)}
                    × ${item.quantity}
                    = <strong>${formatPrice(itemTotal)}</strong>
                </p>

            </div>


            <div class="cart-quantity">

                <button
                    class="quantity-btn"
                    type="button"
                    data-action="decrease"
                    data-index="${index}">
                    −
                </button>

                <span class="quantity-value">
                    ${item.quantity}
                </span>

                <button
                    class="quantity-btn"
                    type="button"
                    data-action="increase"
                    data-index="${index}">
                    +
                </button>

            </div>


            <button
                class="remove-item"
                type="button"
                data-action="remove"
                data-index="${index}"
                aria-label="Supprimer ${escapeHtml(item.name)}">
                🗑️
            </button>

        `;

        cartItems.appendChild(itemElement);

    });


    cartCount.textContent = quantityTotal;

    cartTotal.textContent = formatPrice(total);

    if (whatsappOrder) {
        whatsappOrder.disabled = false;
    }

}


/* =========================================
   PROTECTION DU TEXTE
========================================= */

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   AJOUTER AU PANIER
========================================= */

function addToCart(name, price) {

    const numericPrice = getPrice(price);

    if (!name || numericPrice <= 0) {

        console.error(
            "Produit invalide :",
            name,
            price
        );

        return;
    }


    const existingItem = cart.find(
        item => item.name === name
    );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            name: name,

            price: numericPrice,

            quantity: 1

        });

    }


    saveCart();

    renderCart();

}


/* =========================================
   BOUTONS "AJOUTER AU PANIER"
========================================= */

document.querySelectorAll(".order-btn").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.plat;

        const price = button.dataset.prix;


        addToCart(name, price);


        /* Petit retour visuel */

        const originalText =
            button.textContent;

        button.textContent =
            "✓ Ajouté !";


        setTimeout(() => {

            button.textContent =
                originalText;

        }, 1000);

    });

});


/* =========================================
   OUVRIR LE PANIER
========================================= */

if (cartButton) {

    cartButton.addEventListener("click", () => {

        cartModal.classList.add("active");

        renderCart();

    });

}


/* =========================================
   FERMER LE PANIER
========================================= */

if (closeCart) {

    closeCart.addEventListener("click", () => {

        cartModal.classList.remove("active");

    });

}


/* =========================================
   CONTINUER LES ACHATS
========================================= */

if (continueShopping) {

    continueShopping.addEventListener(
        "click",
        () => {

            cartModal.classList.remove("active");

        }
    );

}


/* =========================================
   CLIQUER EN DEHORS DU PANIER
========================================= */

if (cartModal) {

    cartModal.addEventListener("click", event => {

        if (event.target === cartModal) {

            cartModal.classList.remove("active");

        }

    });

}


/* =========================================
   GESTION DES QUANTITÉS
========================================= */

if (cartItems) {

    cartItems.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("button");

            if (!button) return;


            const action =
                button.dataset.action;

            const index =
                Number(button.dataset.index);


            if (!cart[index]) return;


            /* DIMINUER */

            if (action === "decrease") {

                cart[index].quantity -= 1;


                if (cart[index].quantity <= 0) {

                    cart.splice(index, 1);

                }

            }


            /* AUGMENTER */

            if (action === "increase") {

                cart[index].quantity += 1;

            }


            /* SUPPRIMER */

            if (action === "remove") {

                cart.splice(index, 1);

            }


            saveCart();

            renderCart();

        }
    );

}


/* =========================================
   COMMANDER SUR WHATSAPP
========================================= */

if (whatsappOrder) {

    whatsappOrder.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                return;

            }


            let message =
                "Bonjour Les Délices de Davila !\n\n";

            message +=
                "Je souhaite commander :\n\n";


            let total = 0;


            cart.forEach(item => {

                const itemTotal =
                    item.price * item.quantity;

                total += itemTotal;


                message +=
                    `🍽️ ${item.name} × ${item.quantity} — ${formatPrice(itemTotal)}\n`;

            });


            message += "\n";

            message +=
                `💰 Total : ${formatPrice(total)}`;


            const phone =
                "212664553220";


            const whatsappURL =
                `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}


/* =========================================
   INITIALISATION
========================================= */

renderCart();

const translations = {
  fr: {
    menuTitre: "Notre Menu",
    galerieTitre: "Notre Galerie",
    contactTitre: "Contact",
    reservationTitre: "Réserver une table",
    specialitesTitre: "Nos spécialités",
    aboutTitre: "Pourquoi choisir Les Délices de Davila ?"
  },
  en: {
    menuTitre: "Our Menu",
    galerieTitre: "Our Gallery",
    contactTitre: "Contact",
    reservationTitre: "Book a Table",
    specialitesTitre: "Our Signature Dishes",
    aboutTitre: "Why Choose Les Délices de Davila?"
  },
  es: {
    menuTitre: "Nuestro Menú",
    galerieTitre: "Nuestra Galería",
    contactTitre: "Contacto",
    reservationTitre: "Reservar una Mesa",
    specialitesTitre: "Nuestras Especialidades",
    aboutTitre: "¿Por qué elegir Les Délices de Davila?"
  }
};

document.getElementById("language").addEventListener("change", function () {
  const lang = this.value;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = translations[lang][key];
  });
});
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".menu a");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {

    const top = section.offsetTop - 120;

    if (scrollY >= top) {
      current = section.id;
    }

  });

  navLinks.forEach(link => {

    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }

  });

});
document.getElementById("language")
const traductions = {
    fr:{
        hero:"Les saveurs authentiques de l'Afrique au cœur de Marrakech.",
        menu:"Notre Menu",
        galerie:"Notre Galerie",
        avis:"Ce que nos clients disent",
        contact:"Contact"
    },
    en:{
        hero:"Authentic African flavors in the heart of Marrakech.",
        menu:"Our Menu",
        galerie:"Our Gallery",
        avis:"What our customers say",
        contact:"Contact"
    },
    es:{
        hero:"Sabores auténticos de África en el corazón de Marrakech.",
        menu:"Nuestro Menú",
        galerie:"Nuestra Galería",
        avis:"Lo que dicen nuestros clientes",
        contact:"Contacto"
    }
};

document.querySelectorAll(".flag-btn").forEach(btn=>{

    btn.addEventListener("click",()=>{

        const langue = btn.dataset.lang;

        document.getElementById("hero-text").textContent = traductions[langue].hero;
        document.querySelector("#menu h2").textContent = traductions[langue].menu;
        document.querySelector("#galerie h2").textContent = traductions[langue].galerie;
        document.querySelector("#avis h2").textContent = traductions[langue].avis;
        document.querySelector("#contact h2").textContent = traductions[langue].contact;

    });

});