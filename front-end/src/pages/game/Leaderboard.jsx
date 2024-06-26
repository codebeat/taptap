import axios from "axios";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { getTGUser } from "../../utlis/tg";
import { getAuth } from "../../utlis/localstorage";

import minerbg from "../../assets/img/mine-bg.png";
import coin from "../../assets/img/token.png";
import logo from "../../assets/img/logo.png";
import back from "../../assets/img/back-arrow.svg";
import coinIcon from "../../assets/img/coin.png";

import FriendsListItem from "../../components/taptap/FriendsListItem";
import LoadingScreen from "../../components/taptap/LoadingScreen";

function Leaderboard() {
  const navigate = useNavigate();
  const effectRan = useRef(false);

  const [topPlayers, setTopPlayers] = useState([]);
  const [userPosition, setUserPosition] = useState("");
  const [userEarndetails, setUserEarndetails] = useState([]);
  const [isLoading,setIsLoading] = useState(true);

  const postAjaxCall = async (endpoint, data) => {
    const token = getAuth();
    try {
      const response = await axios.post(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error in endpoint:", error);
      throw new Error("Error in endpoint", error);
    }
  };

  const getUserData = async (tgData) => {
    if (!tgData) {
      navigate("/game");
      return;
    }

    const { id: tid } = tgData;

    try {
      const res = await postAjaxCall("/api/game/usersrank", { tid });

      // console.log("res", res);
      const userDetails = res?.value || null;

      // console.log("userDetails", userDetails);

      if (userDetails && res.isthere == true) {
        setTopPlayers(userDetails.topplayers);
        setUserPosition(userDetails.userPosition);
        setUserEarndetails(userDetails.specificUserDetails);
        setIsLoading(false)
      } else {
        navigate("/game/earn");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!effectRan.current) {
      const tgData = getTGUser();
      getUserData(tgData);
      effectRan.current = true;
    }
  }, [navigate]);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.expand();

    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(-1);
      tg.BackButton.hide();
    });
  });

  const formatNumber = (value) => {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(1).replace(/\.0$/, "") + "b";
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "m";
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
    } else {
      return value;
    }
  };

  return (
    <>
      <LoadingScreen isloaded={isLoading} reURL={''} />
  
      {!isLoading && (
        <div
          className="leaderboard relative h-screen bg-black bg-cover bg-no-repeat flex items-center justify-center px-2 flex-col py-4 bg-top pt-10 gap-2"
          style={{ backgroundImage: `url(${minerbg})` }}
        >
          <h1 className="font-sfSemi text-4xl text-white">Leaderboard</h1>
          <div className="stats w-full h-full mb-8 flex flex-col items-center justify-start gap-2 overflow-y-auto rounded-3xl">
            {topPlayers &&
              topPlayers.map((player, index) => (
                <FriendsListItem
                  key={player.id}
                  name={player.firstname || player.username}
                  level={player.gameLevel}
                  rank={index + 1}
                  icon={logo}
                  profile={coinIcon}
                  displayType="leader"
                  balance={formatNumber(player.overallPoints)}
                />
              ))}
          </div>
          {userEarndetails && (
            <div className="bg-[#0FF378] backdrop-blur-md shadow-[0_0_24px_8px_#000000] absolute bottom-0 w-full pt-4 rounded-t-3xl">
              <div className="flex items-center justify-between w-[95%] bg-[#0FF378] rounded-2xl py-2 mt-2 px-4 mx-auto gap-2">
                <div className="flex items-center">
                  <h1 className="text-[#0B0B0B] text-2xl">{userPosition}</h1>
                  <img
                    src={coin}
                    className="w-12 h-12 m-2 border-2 border-[#0B2113] rounded-full basis-[10%]"
                    alt="Profile"
                  />
                  <div className="flex flex-col text-left">
                    <p className="text-[#0B0B0B] text-2xl font-sfSemi -my-1">
                      {userEarndetails.firstname || userEarndetails.username}
                    </p>
                    <p className="text-[#0B0B0B] text-base font-sfSemi flex-row flex items-center justify-start gap-1">
                      {formatNumber(userEarndetails.overallPoints)}{" "}
                      <img src={logo} className="w-4 h-4" alt="" />
                    </p>
                    <p className="text-[#0B0B0B] text-xl font-sfSemi -my-1">
                      {userEarndetails.game_level}
                    </p>
                  </div>
                </div>
                <div className="flex-col flex items-center justify-center"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
  

 
}

export default Leaderboard;
