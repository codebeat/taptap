import GameLayout from "../layout/GameLayout";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import axios from "axios";

import InviteCard from "../../components/taptap/InviteCard";
import FriendsListItem from "../../components/taptap/FriendsListItem";

import LogoImg from "../../assets/img/logo.png";
import ActualizarImg from "../../assets/img/actualizar.png";
import PeopleImg from "../../assets/img/people.png";
import coinIcon from "../../assets/img/coin.png";
import { getTGUser } from "../../utlis/tg";
import { getAuth } from "../../utlis/localstorage";
import giftbox1 from "../../assets/img/giftbox1.png";
import giftbox2 from "../../assets/img/giftbox2.png";
import giftbox3 from "../../assets/img/giftbox3.png";
import Drawer from "../../components/taptap/Drawer";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [refLink, setRefLink] = useState('');
  const [refcode,setRefcode] = useState('');
  // THIS IS FOR DRAWER
  const [open, setOpen] = useState(false);
  // ------------------
  const navigate = useNavigate();
  const effectRan = useRef(false);

  
  const postAjaxCall = async (endpoint, data) => {
    const token = getAuth();
    try {
      const response = await axios.post(endpoint, data,{
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error in endpoint:', error);
      throw new Error("Error in endpoint", error);
    }
  };

  const  [cusText,setCusText] = useState('Invite Copied, Share it with your friends and family.')

  const getUserData = async (tgData) => {
    if (!tgData) {
      // navigate("/game");
      return;
    }

    const GAME_TG_URL = "https://t.me/taptapcore_bot/Earn";
    const { id: tid } = tgData;

    try {
      const res = await postAjaxCall('/api/referral/claim', {  });
      console.log(res.data)
      const userDetails = res?.data || null;

      if (userDetails ) {
        setFriends(userDetails.friends);
        // console.log(userDetails.friends);

        const refCode = userDetails?.refCode || '';
        if (refCode) {
          setRefcode(refCode);
          setRefLink(`${GAME_TG_URL}?startapp=${refCode}`);
        }
      } else {
        // navigate("/game");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (!effectRan.current) {
      const tgData = getTGUser();
      getUserData(tgData);
      effectRan.current = true;
    }
  }, [navigate]);

  const loadFriends = () => {
    const tgData = getTGUser();
    getUserData(tgData);
    navigate('/game/friends');
  };

  const triggerCopy = (e) => {
    e.preventDefault();
    
    navigator.clipboard
      .writeText(refLink)
      .then(() => {
        setOpen(true);
        setCusText('Invite Copied, Share it with your friends and family.')
        
      })
      .catch(() => {
        setOpen(false);
        setCusText('Fail to copy.')
      })
      .finally(() => {
        setTimeout(() => setOpen(false), 5000);
      });
  };
  const Claim = async (friendId) => {
    try {
      const tgData = getTGUser();
      // console.log({ friendID:friendId,"refCode":refcode})
     const res =  await postAjaxCall('/api/game/refclaim', { friendID:friendId,"refCode":refcode});
     
    //  console.log(res)
     if(res && res.icalimed){
      
      setFriends((prevFriends) =>
          prevFriends.map((friend) =>
            friend.id === friendId ? { ...friend, isClaimed: "Y" } : friend
          )
        );

        
        setCusText(`Claimed your ${res.refpoint} coins, well done keep going.`)
        setOpen(true);
      } else {
      
        setOpen(false);
        navigate("/game/friends");
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  return (
    <GameLayout>
      <div className="w-full overflow-y-auto mb-24">
        
        <Drawer open={open} setOpen={setOpen}>
          <div className="flex flex-col items-center justify-center px-4 gap-2">
            <h1 className="text-white font-sfSemi text-2xl ">
              {cusText}
            </h1>
            <motion.svg
              initial={{ rotate: -90, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-check w-14 h-14 text-white"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
              <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
              <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
              <path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
              <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
              <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
              <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
              <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
              <path d="M9 12l2 2l4 -4" />
            </motion.svg>
          </div>
        </Drawer>
        <h1 className="text-white text-4xl font-sfSemi">Invite Friends</h1>

        <InviteCard
          title="Invite friend"
          points="+2500 TTC"
          description="for you and your friend"
          logo={LogoImg}
          background={giftbox1}
        />
        <InviteCard
          title="Invite friend with Telegram Premium"
          points="+5000 TTC"
          description="for you and your friend"
          background={giftbox2}
          logo={LogoImg}
        />

        <div className="mt-4 relative w-[80%] text-center mx-auto">
          <h3 className="text-white text-[15px] font-sfSemi">Friends List</h3>
          <motion.a
            className="absolute right-0 top-0"
            onTouchStart={loadFriends}
            whileTap={{ rotate: 180 }}
          >
            <img
              className="h-[19px] w-[19px]"
              src={ActualizarImg}
              alt="Refresh"
            />
          </motion.a>
        </div>

        {friends.length > 0 &&
          friends.map((frd) => (
            <FriendsListItem
              key={frd.id}
              name={frd.first_name}
              level=""
              icon={coinIcon}
              profile={coinIcon}
              displayType="friend"
              buttonDisabled={frd.Claimed == "Y"}
              onButtonClick={() => Claim(frd.id)}
            />
          ))}
      </div>

      <div className="h-auto w-full fixed bottom-0 bg-[#0b0b0b5e] backdrop-blur-md pt-2">
        
        <a
          href="#"
          onClick={triggerCopy}
          className="text-[#0b0b0b] text-xl w-1/2  mb-28 rounded-[20px] bg-[#0FF378]  justify-center py-4 mt-2 mx-auto flex items-center"
        >
          Invite friends
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-users w-8 h-8 mx-2"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
            <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
          </svg>
        </a>
      </div>
    </GameLayout>
  );
};

export default Friends;
