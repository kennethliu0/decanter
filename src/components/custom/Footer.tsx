import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="py-4 text-center mt-auto">
      Decanter
      {" | "}
      <Link href="/privacy-policy">
        <span className="hover:underline">Privacy Policy</span>
      </Link>
      {" | "}
      <Link href="/terms">
        <span className="hover:underline">Terms</span>
      </Link>
      {" | "}
      <Link
        href="https://forms.gle/5wrN534xJzMjHPny7"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="hover:underline">Contact Us</span>
      </Link>
    </footer>
  );
};

export default Footer;
