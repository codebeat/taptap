import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import GameLayout from "../layout/GameLayout";
import FriendsListItem from "../../components/taptap/FriendsListItem";
import Drawer from "../../components/taptap/Drawer";
import minerbg from "../../assets/img/mine-bg.png";
import coin from "../../assets/img/token.png";
import logo from "../../assets/img/logo.png";
import Xlogo from "../../assets/img/logo-black.png";
import telelogo from "../../assets/img/Logo.svg";
import ime from "../../assets/img/ime.jpg";
import { getTGUser } from "../../utlis/tg";
import { getAuth } from "../../utlis/localstorage";
import LoadingScreen from "../../components/taptap/LoadingScreen";

function Tasks() {
  const [isCheckin, setIsCheckin] = useState(false);
  const [checkinDetails, setCheckinDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [isLoading,setIsLoading] = useState(true);
  const [taskList, setTaskList] = useState({
    dailycheckin: false,
    X: true,
    T: false,
    ime: false,
    telecom:false
  });
  const [cusText, setCusText] = useState('Claimed Successfully');

  const navigate = useNavigate();
  const effectRan = useRef(false);

  const postAjaxCall = async (endpoint, data) => {
    const token = getAuth();
    try {
      const response = await axios.get(endpoint, {
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
      // navigate("/game");
      return;
    }
    const { id: tid } = tgData;

    try {
      const res = await postAjaxCall("/api/task/list", { tid });
      console.log("res=>",res)
      const checkinDetails = res?.value || {};
      const taskDoneList = res?.taskDoneList || {};

      if (checkinDetails && res.isCheckin === true) {
        setIsCheckin(true);
        setCheckinDetails(checkinDetails);
        setTaskList(taskDoneList);
        setOpen(false);
        
      }
      setIsLoading(false)
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

  const Claim = async (tasktype = null) => {
    try {
      const tgData = getTGUser();
      const res = await postAjaxCall("/api/game/upCheckin", {
        teleid: tgData.id,
        tasktype,
      });

      if (res && res.isCheckin) {
        let newTaskList = { ...taskList };

        if (tasktype === "daily") {
          setIsCheckin(false);
          newTaskList.dailycheckin = true;
          const pointsInLocalStorage = localStorage.getItem("score");
          localStorage.setItem(
            "score",
            parseInt(pointsInLocalStorage) + parseInt(checkinDetails.points)
          );
        } else if (tasktype === "x") {
          window.Telegram.WebApp.openLink("https://x.com/TapTap_bot");
          newTaskList.X = true;
          const pointsInLocalStorage = localStorage.getItem("score");
          localStorage.setItem("score", parseInt(pointsInLocalStorage) + 5000);
        } else if (tasktype === "telegram") {
          window.Telegram.WebApp.openLink("https://t.me/taptap_official");
          newTaskList.T = true;
          const pointsInLocalStorage = localStorage.getItem("score");
          localStorage.setItem("score", parseInt(pointsInLocalStorage) + 5000);
        } else if (tasktype === "ime") {
          window.Telegram.WebApp.openLink("https://t.me/ime_en");
          newTaskList.ime = true;
          const pointsInLocalStorage = localStorage.getItem("score");
          localStorage.setItem("score", parseInt(pointsInLocalStorage) + 5000);
        }else if (tasktype === "telecommunity") {
          window.Telegram.WebApp.openLink("https://t.me/taptapbotchat");
          newTaskList.telecom = true;
          const pointsInLocalStorage = localStorage.getItem("score");
          localStorage.setItem("score", parseInt(pointsInLocalStorage) + 5000);
        }

        setTaskList(newTaskList);
        setOpen(false);

        setTimeout(() => {
          setOpen(false);
        }, 3000);
      } else {
        setIsCheckin(false);
        setOpen(false);
        navigate("/game/earn");
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  const formatNumber = (value) => {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
      return value;
    }
  };

  return (
    <GameLayout>
    
      {isLoading ? (
        <LoadingScreen isloaded={isLoading} reURL={''} />
      ) : (
        <>
          <Drawer open={open} setOpen={setOpen}>
            <h1 className="text-white font-sfSemi text-2xl">
              {cusText}
            </h1>
          </Drawer>
          <>
            {/* <FriendsListItem
              profile={logo}
              key={1}
              name={`Day ${checkinDetails.todayRewardDay}`}
              level={`+ ${formatNumber(checkinDetails.points) !== "0" ? formatNumber(checkinDetails.points) : formatNumber(checkinDetails.todayRewardDay !== "" ? parseInt(checkinDetails.todayRewardDay) * 5000 : 5000)}`}
              icon={logo}
              displayType="checkin"
              buttonDisabled={!isCheckin}
              onButtonClick={() => !isCheckin ? Claim("daily") : null}
            /> */}
            <FriendsListItem
              profile={Xlogo}
              key={2}
              name={"Follow on X"}
              level={"+10k"}
              icon={logo}
              displayType="checkin"
              buttonDisabled={taskList.X}
              onButtonClick={() => !taskList.X ? Claim("x") : null}
            />
            <FriendsListItem
              profile={telelogo}
              key={3}
              name={"Join on Telegram"}
              level={"+10K"}
              icon={logo}
              displayType="checkin"
              buttonDisabled={taskList.T}
              onButtonClick={() => !taskList.T ? Claim("telegram") : null}
            />
            
            <FriendsListItem
              profile={ime}
              key={5}
              name={"Join on iMe"}
              level={"+10k"}
              icon={logo}
              displayType="checkin"
              buttonDisabled={taskList.ime}
              onButtonClick={() => !taskList.ime ? Claim("ime") : null}
            />
            <FriendsListItem
              profile={telelogo}
              key={6}
              name={"Join on Telegram community"}
              level={"+10K"}
              icon={logo}
              displayType="checkin"
              buttonDisabled={taskList.telecom}
              onButtonClick={() => !taskList.telecom ? Claim("telecommunity") : null}
            />
          </>
          </>
      )}
    
    </GameLayout>
  );
}

export default Tasks;
