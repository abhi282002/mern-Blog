import { Button } from "flowbite-react";
import React from "react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col ">
        <h2 className="text-2xl">Want to learn more about JavaScript?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with 100 JavaScript Projects
        </p>
        <Button
          className="rounded-tl-xl rounded-bl-none"
          gradientDuoTone={"purpleToPink"}
        >
          100 JavaScript Projects
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://oracle-devrel.github.io/devo-image-repository/seo-thumbnails/JavaScript---Thumbnail-1200-x-630.jpg" />
      </div>
    </div>
  );
}
