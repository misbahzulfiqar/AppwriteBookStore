// Common functions and data for all components

export const bookImages = [
  "https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-Store-Website-/main/image/book-1.png",
  "https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-Store-Website-/main/image/book-2.png",
  "https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-Store-Website-/main/image/book-3.png",
  "https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-Store-Website-/main/image/book-4.png",
  "https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-Store-Website-/main/image/book-5.png",
  "https://raw.githubusercontent.com/KordePriyanka/Books4MU-Book-Store-Website-/main/image/book-6.png",
];

export const featuredBooks = [
  { id: 1, title: "Mathematics" },
  { id: 2, title: "Physics for Engineers" },
  { id: 3, title: "Programming" },
  { id: 4, title: "Electrical Circuits" },
  { id: 5, title: "Mechanical Design" },
  { id: 6, title: "Thermodynamics" },
  { id: 7, title: "Civil Engineering" },
  { id: 8, title: "Chemical Processes" },
  { id: 9, title: "Digital Electronics" },
  { id: 10, title: "Engineering Drawing" },
];

export const reviews = [
  { 
    id: 1, 
    name: "ujjwal", 
    text: "First of all it customer service is excellent. We get all author book for Mumbai University. People should try here affordable and best price.",
    rating: 4.5 
  },
  { 
    id: 2, 
    name: "marry", 
    text: "Best book store almost all books are available for prepartion of exam related or other books are available on reaonable price also.",
    rating: 4.5 
  },
  { 
    id: 3, 
    name: "Raghu", 
    text: "Customer Service is good. Greetings to customer and making the required Books available to Customers is very good.",
    rating: 4.5 
  },
  { 
    id: 4, 
    name: "Pooja", 
    text: "This book centre have large amount of a books. The engineering study material all semester books are available.then the peacefull and nice book centre.",
    rating: 4.5 
  },
  { 
    id: 5, 
    name: "Abhinav", 
    text: "I migrated to the online platform on Just books because I was finding it difficult to go to their libraries before closing time.",
    rating: 4.5 
  },
  { 
    id: 6, 
    name: "Sidddhi", 
    text: "I love the product because it is very easy to find. The book are in really organized manner you can easily find the book you want.",
    rating: 4.5 
  },
];

export const iconsData = [
  { id: 1, icon: "fas fa-shipping-fast", title: "free shipping", text: "order over $100" },
  { id: 2, icon: "fas fa-lock", title: "secure payment", text: "100 secure payment" },
  { id: 3, icon: "fas fa-redo-alt", title: "easy returns", text: "10 days returns" },
  { id: 4, icon: "fas fa-headset", title: "24/7 support", text: "call us anytime" },
];

export const footerLinks = {
  locations: [
    { name: "Pakistan", icon: "fas fa-map-marker-alt" },
    { name: "USA", icon: "fas fa-map-marker-alt" },
  ],
  quickLinks: [
    { name: "home", link: "/", icon: "fas fa-arrow-right" },
    { name: "featured", link: "#featured", icon: "fas fa-arrow-right" },
    { name: "Category", link: "#arrivals", icon: "fas fa-arrow-right" },
    { name: "reviews", link: "#reviews", icon: "fas fa-arrow-right" },
    { name: "feedback", link: "/feedback", icon: "fas fa-arrow-right" },
  ],
  extraLinks: [
    { name: "account info", icon: "fas fa-arrow-right" },
    { name: "ordered items", icon: "fas fa-arrow-right" },
    { name: "privacy policy", icon: "fas fa-arrow-right" },
    { name: "payment method", icon: "fas fa-arrow-right" },
    { name: "our serivces", icon: "fas fa-arrow-right" },
  ],
  contactInfo: [
    { value: "9167064054", icon: "fas fa-phone" },
    { value: "77388 44717", icon: "fas fa-phone" },
    { value: "misbahzulfiqar.333ww@gmail.com", icon: "fas fa-envelope" },
    { value: "Shabanakousar.333ww@gmail.com", icon: "fas fa-envelope" },
  ],
  socialLinks: [
    { platform: "facebook", icon: "fab fa-facebook-f", link: "#" },
    { platform: "twitter", icon: "fab fa-twitter", link: "https://twitter.com/priyankakorde" },
    { platform: "instagram", icon: "fab fa-instagram", link: "https://www.instagram.com/im_priyankak_/" },
    { platform: "linkedin", icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/priyanka-korde-2029521a1/" },
    { platform: "linkedin", icon: "fab fa-linkedin", link: "https://www.linkedin.com/in/rohit-m-3494521a2/" },
  ],
};

// Swiper initialization function
export const initializeSwiper = (selector, options = {}) => {
  const defaultOptions = {
    spaceBetween: 10,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 9500,
      disableOnInteraction: false,
    },
    ...options,
  };

  return new window.Swiper(selector, defaultOptions);
};