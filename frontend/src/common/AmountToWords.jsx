import React from "react";
import { toTitleCase } from "./helper";

// eslint-disable-next-line react/prop-types
const AmountToWords = ({ amount }) => {
  const convertAmountToWords = (amount) => {
    const numberWords = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
      "twenty",
      "twenty-one",
      "twenty-two",
      "twenty-three",
      "twenty-four",
      "twenty-five",
      "twenty-six",
      "twenty-seven",
      "twenty-eight",
      "twenty-nine",
      "thirty",
      "thirty-one",
      "thirty-two",
      "thirty-three",
      "thirty-four",
      "thirty-five",
      "thirty-six",
      "thirty-seven",
      "thirty-eight",
      "thirty-nine",
      "forty",
      "forty-one",
      "forty-two",
      "forty-three",
      "forty-four",
      "forty-five",
      "forty-six",
      "forty-seven",
      "forty-eight",
      "forty-nine",
      "fifty",
      "fifty-one",
      "fifty-two",
      "fifty-three",
      "fifty-four",
      "fifty-five",
      "fifty-six",
      "fifty-seven",
      "fifty-eight",
      "fifty-nine",
      "sixty",
      "sixty-one",
      "sixty-two",
      "sixty-three",
      "sixty-four",
      "sixty-five",
      "sixty-six",
      "sixty-seven",
      "sixty-eight",
      "sixty-nine",
      "seventy",
      "seventy-one",
      "seventy-two",
      "seventy-three",
      "seventy-four",
      "seventy-five",
      "seventy-six",
      "seventy-seven",
      "seventy-eight",
      "seventy-nine",
      "eighty",
      "eighty-one",
      "eighty-two",
      "eighty-three",
      "eighty-four",
      "eighty-five",
      "eighty-six",
      "eighty-seven",
      "eighty-eight",
      "eighty-nine",
      "ninety",
      "ninety-one",
      "ninety-two",
      "ninety-three",
      "ninety-four",
      "ninety-five",
      "ninety-six",
      "ninety-seven",
      "ninety-eight",
      "ninety-nine",
    ];

    const tensWords = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    const crore = Math.floor(amount / 10000000);
    const lakh = Math.floor((amount % 10000000) / 100000);
    const thousand = Math.floor((amount % 100000) / 1000);
    const hundred = Math.floor((amount % 1000) / 100);
    const tens = Math.floor((amount % 100) / 10);
    const ones = Math.floor(amount % 10);

    let amountInWords = "";

    // Convert crore to words
    if (crore > 0) {
      amountInWords += numberWords[crore] + " crore ";
    }

    // Convert lakh to words
    if (lakh > 0) {
      amountInWords += numberWords[lakh] + " lakh ";
    }

    // Convert thousand to words
    if (thousand > 0) {
      amountInWords += numberWords[thousand] + " thousand ";
    }

    // Convert hundred to words
    if (hundred > 0) {
      amountInWords += numberWords[hundred] + " hundred ";
    }

    // Convert tens and ones to words
    if (tens > 0 || ones > 0) {
      if (tens < 2) {
        amountInWords += numberWords[tens * 10 + ones];
      } else {
        amountInWords += tensWords[tens] + " " + numberWords[ones];
      }
    }

    // Add currency details
    amountInWords += " rupees";

    // Add decimal part
    const decimalPart = Math.round((amount - Math.floor(amount)) * 100);
    if (decimalPart > 0) {
      amountInWords += ` and ${numberWords[decimalPart]} paise`;
    }

    return amountInWords;
  };

  const amountInWords = convertAmountToWords(amount);

  return <span>{toTitleCase(amountInWords)}</span>;
};

export default AmountToWords;
