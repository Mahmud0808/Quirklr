"use client";

import React, { useState } from "react";
import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

interface ExpandableTextProps {
  text: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const censor = new TextCensor();
  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (isExpanded) {
      const content = censor.applyTo(text, matcher.getAllMatches(text));
      return (
        <>
          {content}{" "}
          <button onClick={toggleText} className="text-gray-400 font-bold">
            Show less
          </button>
        </>
      );
    }

    if (text.length > 300) {
      const content = censor.applyTo(
        text.substring(0, 200),
        matcher.getAllMatches(text.substring(0, 200))
      );
      return (
        <>
          {content}...{" "}
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
