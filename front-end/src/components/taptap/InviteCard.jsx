import React from "react";

const InviteCard = ({ title, points, description, logo, background }) => {
  return (
    <div
      className="h-[85px] flex flex-col items-center justify-center border-[1px] border-white/35 w-full bg-[#0B0B0B] rounded-[19px] mt-2  bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${background})` }}
    >
      <h3 className="text-white text-[15px] font-sfSemi">{title}</h3>
      <div className="flex">
        <img src={logo} className="h-[18px] w-[18px]" alt="Logo" />
        <p className="text-white text-[15px] font-sfSemi">{points}</p>
      </div>
      <p className="text-white text-[15px] font-sfSemi">{description}</p>
    </div>
  );
};

export default InviteCard;
