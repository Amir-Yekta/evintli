import React from "react";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { BiArea } from "react-icons/bi";
import { FaPeopleRoof } from "react-icons/fa6";
import { IoPersonAddOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";

function Listing({
  title,
  url,
  company,
  description,
  category,
  capacity,
  price,
  location,
  staff,
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <Image
        src={url}
        alt={title}
        className="w-full h-48 object-cover rounded"
        height={200}
        width={300}
        priority={true}
      />
      {/* Replace this with dynamic listing cards later */}
      <div className="p-3 bg-white rounded shadow">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className=" text-gray-600">
          ${price.min} - ${price.max}
        </p>
        <div>
          <p className="flex gap-5  text-sm text-gray-800">
            <BiArea /> {company}
          </p>
          <p className="flex gap-5 text-sm text-gray-600">
            <BiCategory /> {category}
          </p>
          <p className="flex gap-5  text-sm text-gray-800">
            <CiLocationOn /> {location}
          </p>
        </div>

        <div>
          <p className="flex text-sm text-gray-600">
            <IoPersonAddOutline /> {capacity}
          </p>

          <p className="flex text-sm text-gray-600">
            <FaPeopleRoof /> {staff.min} - {staff.max}
          </p>
        </div>

        <p className="text-sm text-gray-600">
          {description.split(" ").slice(0, 10).join(" ")}...{" "}
          <span className="underline font-bold">more</span>
        </p>
      </div>
    </div>
  );
}

export default Listing;
