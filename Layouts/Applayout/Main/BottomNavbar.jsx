import React from 'react';

const BottomNavbar = () => {
  const navItems = [
    { id: 1, icon: "fas fa-home", href: "#home", label: "Home" },
    { id: 2, icon: "fas fa-list", href: "#featured", label: "Featured" },
    { id: 3, icon: "fas fa-tags", href: "#arrivals", label: "Category" },
    { id: 4, icon: "fas fa-comments", href: "#reviews", label: "Reviews" },
    { id: 5, icon: "fas fa-comment-alt", href: "#blogs", label: "Feedback" },
  ];

  return (
    <nav className="bottom-navbar">
      {navItems.map((item) => (
        <a key={item.id} href={item.href} className={item.icon}></a>
      ))}
    </nav>
  );
};

export default BottomNavbar;