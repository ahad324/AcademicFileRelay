import React from "react";
import { FaRegFileAlt, FaEye, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "./Loader";
import { IoMdCloudDownload } from "react-icons/io";

const Card = ({ data, reference, loading, onDelete, isAdmin }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(data.url);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = data.desc;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  const handleView = () => {
    const link = document.createElement("a");
    link.href = data.url;
    document.body.appendChild(link);
    link.click();
  };

  const handleDelete = () => {
    onDelete(data.id);
  };

  return (
    <motion.div
      drag
      dragElastic={1}
      dragConstraints={reference}
      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
      dragMomentum={true}
      dragTransition={{ bounceStiffness: 200, bounceDamping: 7 }}
      className="card shadow-custom relative flex-shrink-0 w-60 h-72 rounded-[45px] bg-[--card-bg] text-[--text-color] px-8 py-10 overflow-hidden backdrop-blur-md"
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <FaRegFileAlt />
          <p className="text-sm leading-tight mt-5 font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
            {data.desc}
          </p>
          <div className="footer absolute bottom-0 w-full left-0">
            <div className="flex items-center justify-between py-3  px-8  mb-3">
              <h5>{data.filesize}</h5>
              <span
                className="w-7 h-7 bg-[--eye-bg] rounded-full shadow-custom transition-colors flex items-center justify-center cursor-pointer  backdrop-blur-md hover:bg-[--accent-color] text-[--text-hover-color]"
                onClick={handleView}
              >
                <FaEye
                  size="1rem"
                  aria-label="View Online"
                  title="View Online"
                />
              </span>
              {isAdmin && (
                <span
                  className="w-7 h-7 bg-[--eye-bg] rounded-full shadow-custom transition-colors flex items-center justify-center cursor-pointer  backdrop-blur-md hover:bg-[--accent-color] text-[--text-hover-color]"
                  onClick={handleDelete}
                >
                  <FaTrashAlt
                    size="1rem"
                    aria-label="Delete"
                    title="Delete File"
                  />
                </span>
              )}
            </div>
            <div
              className={`tag w-full py-4 bg-[--accent-color] transition-colors flex items-center justify-center cursor-pointer hover:text-[--text-hover-color]`}
              onClick={handleDownload}
            >
              <h3 className="text-sm font-semibold flex justify-evenly items-center">
                <p className="mr-1">Download Now</p>
                <IoMdCloudDownload size="1.5em" />
              </h3>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Card;
