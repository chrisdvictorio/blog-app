import React from "react";

import {
  FcOrgUnit,
  FcGraduationCap,
  FcClapperboard,
  FcMoneyTransfer,
  FcIcons8Cup,
  FcLike,
  FcSportsMode,
  FcTabletAndroid,
  FcInTransit,
} from "react-icons/fc";

import NavbarItem from "./NavbarItem";

const Navbar = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { name: "All", icon: FcOrgUnit },
    { name: "Education", icon: FcGraduationCap },
    { name: "Entertainment", icon: FcClapperboard },
    { name: "Finance", icon: FcMoneyTransfer },
    { name: "Food & Drink", icon: FcIcons8Cup },
    { name: "Health", icon: FcLike },
    { name: "Lifestyle", icon: FcSportsMode },
    { name: "Technology", icon: FcTabletAndroid },
    { name: "Travel", icon: FcInTransit },
  ];

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
  };

  return (
    <div className="px-4 py-3 sm:px-12 sm:py-4 shadow-md bg-white">
      <ul className="flex flex-wrap justify-between gap-3 sm:gap-5">
        {categories.map((category) => (
          <NavbarItem
            key={category.name}
            category={category}
            active={activeCategory === category.name}
            onClick={() => handleCategoryClick(category.name)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
