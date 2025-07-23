import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const DecanterIcon: React.FC<IconProps> = ({
  width = 48,
  height = 48,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="150 280 600 600"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <style>{`path { stroke: currentColor; }`}</style>
    <path
      d="M200.95 841.25c161.48.37 322.95.74 484.43 1.11C604.08 676.1 522.79 509.85 441.5 343.59 361.32 509.48 281.13 675.36 200.95 841.25Z"
      strokeWidth="64"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M333.23 695.25h269.72"
      strokeWidth="64"
    />
    <path
      d="M193.63 842.54 445.09 299.41h83.38L283.38 842.54Z"
      fill="currentColor"
      strokeWidth="50"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DecanterIcon;
