"use client";

import React, { useState } from "react";

interface ExpandableTextProps {
  text: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (isExpanded) {
      return (
        <>
          {text}{" "}
          <button onClick={toggleText} className="text-gray-400 font-bold">
            Show less
          </button>
        </>
      );
    }

    if (text.length > 300) {
      return (
        <>
          {text.substring(0, 200)}...{" "}
          <button onClick={toggleText} className="text-gray-400 font-bold">
            Show more
          </button>
        </>
      );
    }

    return text;
  };

  return <p className="mt2 text-small-regular text-light-2">{renderText()}</p>;
};

export default ExpandableText;
