
import { useState } from "react";
import { Link } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const categories = [
  { id: "home-appliances", name: "Home Appliances" },
  { id: "kitchen-appliances", name: "Kitchen Appliances" },
  { id: "lighting", name: "Lighting Solutions" },
  { id: "smart-devices", name: "Smart Devices" },
  { id: "tools", name: "Power Tools" },
];

const brands = [
  { id: "electrico", name: "ElectriCo" },
  { id: "powerplus", name: "PowerPlus" },
  { id: "brightlife", name: "BrightLife" },
  { id: "smartech", name: "SmarTech" },
  { id: "kitchenmate", name: "KitchenMate" },
];

const ShopSidebar = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link 
                to={`/shop?category=${category.id}`}
                className="text-electric-darkgray hover:text-electric-blue transition-colors duration-300"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox id={`brand-${brand.id}`} />
              <Label htmlFor={`brand-${brand.id}`} className="text-sm font-normal cursor-pointer">
                {brand.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          onValueChange={setPriceRange}
        />
        <div className="flex justify-between mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="text-sm font-normal cursor-pointer flex">
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                {Array.from({ length: 5 - rating }).map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopSidebar;
