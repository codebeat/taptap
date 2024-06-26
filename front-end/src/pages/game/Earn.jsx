import { easeInOut, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import GameLayout from "../layout/GameLayout";
import {
  getAuth,
  setLocalStorage,
  getLocalStorage,
} from "../../utlis/localstorage";
import { getTGUser } from "../../utlis/tg";
import {
  initializeAudio,
  playAudio,
  stopAudio,
} from "../../utlis/audioUtils";
import AnimatedCounter from "../../components/taptap/AnimatedCounter";
import PlayIcon from "../../assets/img/play-icon.svg";
import coinBackgroundImg from "../../assets/img/coin-background.png";
import heroBackgroundImg from "../../assets/img/background-hero.png";
import LogoImg from "../../assets/img/logo.png";
import RobotImg from "../../assets/img/robot-1.png";
import RobotImg4 from "../../assets/img/robot-4.png";
import CoinImg from "../../assets/img/coin.png";
import BoltIcon from "../../assets/img/bolt-icon.svg";
import tapaudio from "../../assets/sounds/mixkit-arcade-game-jump-coin-216.wav";

import robot_1 from "../../assets/img/robot-1.png";
import robot_2 from "../../assets/img/robot-2.png";
import robot_3 from "../../assets/img/robot-3.png";
import robot_4 from "../../assets/img/robot-4.png";

import LoadingScreen from "../../components/taptap/LoadingScreen";


function Earn() {
  const navigate = useNavigate();

  const [clicks, setClicks] = useState([]);
  const [scale, setScale] = useState(1);
  const [meteorStyles, setMeteorStyles] = useState([]);

  const [deductCount, setDeductCount] = useState(1);
  const [prePoint, setprePoint] = useState(1);

  const [localEnergy, setLocalEnergy] = useState(2000);
  const [localPoints, setLocalPoints] = useState(0);
  const [restoreTime, setRestoreTime] = useState(null);
  const [newsCount, setNewsCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [user, setUser] = useState();
  const [remingtime,setRemingtime] = useState();
  const [gamelevel,setGamelevel] =useState();
  const [isLoading,setIsLoading] = useState(true);

  const defaultEnergyLevel = 2000;

  const robot = {
    0: robot_1,
    1: robot_1,
    2: robot_2,
    3: robot_3,
    4: robot_4,
    5: robot_4,
  };

  const robotlevel = {
    0: "LVL 1",
    1: "LVL 1",
    2: "LVL 2",
    3: "LVL 3",
    4: "LVL 4",
    5: "LVL 5"
  }

  const checkTime = (time) => {
    const localTime = moment(time, 'YYYY-MM-DD HH:mm:ss');
    const utcTime = localTime.utc();
    const currentUtcTime = moment.utc();
    return utcTime.isBefore(currentUtcTime) ?  utcTime.format('YYYY-MM-DD HH:mm:ss') :'';
  };

  //TODO
  useEffect(() => {
    console.log("effect test", isActive, localEnergy, localPoints, user, restoreTime)
  }, []);

  useEffect(() => {
    const initAudio = async () => {
      try {
        await initializeAudio(tapaudio);
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    };
    initAudio();
    return () => {
      stopAudio();
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuth();
      const tgUser = getTGUser();

      const response = await axios.get(`/api/earn/getscore`,{
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("response==>",response)

      const res = response.data;
      const resdata = res.data;

      if (!resdata) {
        // navigate("/game");
        return;
      }else{

        

        setIsLoading(false)
      }

      const userData = resdata;
      setUser(userData);

      setGamelevel(userData.game_level);

      // console.log("ds",userData)
      // if(userData.points == 0){

      //   localStorage.setItem("energy",2000);
      //   localStorage.setItem("score",0);
      //   localStorage.setItem("lastSyncTime",null);
      //   localStorage.setItem("restoreTime",null);

      // }

      


      const storedEnergy = localStorage.getItem("energy");
      var storedPoints = localStorage.getItem("score");
      const lastSyncTime = localStorage.getItem("lastSyncTime");

      console.log("storedPoints==>",storedPoints)

     
      if(storedPoints==0){
        localStorage.setItem("score",userData.points)
        storedPoints = userData.points
         
      }




      if (storedEnergy && storedPoints) {
        const now = Date.now();
        if (!lastSyncTime || (lastSyncTime && now - lastSyncTime > 2000)) {
          let tempLocalEn = localStorage.getItem("energy");
          let tempLocalPO = localStorage.getItem("score");
          await syncWithServer(tempLocalEn, tempLocalPO, userData.restore_time)
          .then(() => {
                      setLocalEnergy(tempLocalEn);
                      setLocalPoints(tempLocalPO);
                    });
        } else {
          const energy = storedEnergy;
          const points = storedPoints;
          if (energy !== null && points !== null) {
            setLocalEnergy(energy <= 0 ? defaultEnergyLevel : energy);
            setLocalPoints(points);
          } else {
            setLocalEnergy(defaultEnergyLevel);
            setLocalPoints(0);
          }
        }
      } else {
        const energy = userData.energy;
        const points = userData.points;
        if (energy !== null && points !== null) {
          setLocalEnergy(energy <= 0 ? defaultEnergyLevel : energy);
          setLocalPoints(points);
        } else {
          setLocalEnergy(defaultEnergyLevel);
          setLocalPoints(0);
        }
      }

      const storedRestoreTime = localStorage.getItem("restoreTime");
      

      if (storedRestoreTime && storedRestoreTime !== null) {
        const result = checkTime(storedRestoreTime);
        console.log("1")
        if (result !== null && result !== '') {
          console.log("2")
          setRestoreTime(result);
          const currentTime = moment.utc().format("YYYY-MM-DD HH:mm:ss");
          const duration = moment.duration(moment( localStorage.getItem("restoreTime")).diff(currentTime));
          setElapsedSeconds(duration.asSeconds());
          if(storedEnergy>0 ){
            setLocalEnergy(storedEnergy);
          }else{
            setLocalEnergy(0);
          }
          
        //  localStorage.getItem("restoreTime");
        console.log("result", localStorage.getItem("restoreTime"))
         setRestoreTime( localStorage.getItem("restoreTime"));
        } else {
          console.log("3")
          setRestoreTime('');
          setLocalEnergy(storedEnergy !== null ? storedEnergy : defaultEnergyLevel);
        }
      } else if (userData.restore_time && userData.restore_time !== null) {
        console.log("4")
        const result = checkTime(userData.restore_time);
        if (result !== null && result !== '') {
          setRestoreTime(result);
          console.log("5")
          if(userData.energy==0){
            console.log("from db 5")
            const currentTime = moment.utc().format("YYYY-MM-DD HH:mm:ss");
            
            console.log("userData.restore_time",userData.restore_time)

            const temp = moment(userData.restore_time).format("YYYY-MM-DD HH:mm:ss");
            console.log("temp",temp)

            const duration = moment.duration(moment(currentTime).diff(moment(temp))).asSeconds();
            setElapsedSeconds(duration);
            setLocalEnergy(userData.energy);
            setRestoreTime(userData.restore_time);

          }else{

            console.log("from db 5 relse")
            setLocalEnergy(userData.energy);
            setElapsedSeconds('')
            setRestoreTime(userData.restore_time);

          }
         
        } else {
          console.log("6")
          setRestoreTime('');
          setLocalEnergy(storedEnergy !== null ? storedEnergy : userData.energy || defaultEnergyLevel);
        }
      } else {
        console.log("7")
        setRestoreTime('');
        setElapsedSeconds(null);
        setLocalEnergy(storedEnergy !== null ? storedEnergy : defaultEnergyLevel);
      }
    };
    fetchUser();
  }, [!user, navigate]);

  const syncWithServer = async (energy, points, restore_time) => {
    const token = getAuth();
    if (user ) {

      if( points>0){
        await axios.post(
          `/api/game/upscore`,
          {
            score: 10000,
            energy_remaning: 100,
            restore_time:moment.utc().format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        localStorage.setItem("lastSyncTime", Date.now());
        
        console.log("reset")

      }else{
        if(user.points>0){
          localStorage.setItem("score",user.points);
        }else{
          localStorage.setItem("score",localPoints);
        }
        
      }
      

    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          setLocalEnergy(defaultEnergyLevel)
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const handleTap = (tapcount = 1) => {
    console.log("tab test", isActive, localEnergy, localPoints, user, restoreTime)

    if (localEnergy > 0) {
      const newEnergy = parseInt(localEnergy) - parseInt(tapcount);
      const newPoints = parseInt(localPoints) + parseInt(tapcount);

      setLocalEnergy(newEnergy);
      setLocalPoints((prevLocalPoints) => {
        setprePoint(prevLocalPoints);
        return newPoints;
      });
      setNewsCount(newPoints);
      localStorage.setItem("energy", newEnergy);
      localStorage.setItem("score", newPoints);

      console.log("tap 1")

     
        console.log("tap 2")
        const currentUtcTime = moment.utc();
        const futureUtcTime = currentUtcTime.add(1, 'hours');
        const restoreTimess = futureUtcTime.format("YYYY-MM-DD HH:mm:ss");
        
        localStorage.setItem("restoreTime", restoreTimess);
        if(newPoints == 0){

        
          setRestoreTime(restoreTimess);
          setElapsedSeconds(3600);
        }
  
      

      setIsActive(true);
      playAudio();
    } else {
      console.log("tap 3")
      stopAudio();
    }
    console.log("effect test done", isActive, localEnergy, localPoints, user, restoreTime)
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')} hr`;
    } else if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')} mins`;
    } else {
      return `${secs} secs`;
    }
  };

  useEffect(() => {
    if (localEnergy === 0 && restoreTime && elapsedSeconds == null) {
      const interval = setInterval(() => {
        const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
        console.log("restoreTime",restoreTime)
        console.log("now",now)
        // const lcaorestime = moment(restoreTime).utc().format("YYYY-MM-DD HH:mm:ss");
        // console.log("lcaorestime",lcaorestime)
        const remainingTime = moment.duration(moment(restoreTime).diff(moment(now))).asSeconds();
        console.log("remainingTime",remainingTime)
        if (remainingTime <= 0) {
          setLocalEnergy(defaultEnergyLevel);
          setRestoreTime(null);
          // localStorage.removeItem("restoreTime");
          clearInterval(interval); // Clear interval once the restore time has been processed
        } else {
          setElapsedSeconds(remainingTime);
        }
      }, 1000);

      // Clean up interval on component unmount or when conditions change
      return () => clearInterval(interval);
    }
  }, [localEnergy, restoreTime,elapsedSeconds]);

  useEffect(() => {
    let syncInterval;
    let inactivityTimer;

    const startSync = () => {
      clearInterval(syncInterval);
      syncInterval = setInterval(() => {
        syncWithServer(localEnergy, localPoints, restoreTime);
      }, 1500); // Sync every 4 seconds
    };

    const stopSync = () => {
      clearInterval(syncInterval);
    };

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsActive(false);
      }, 1000); // 5 seconds of inactivity
    };

    if (isActive) {
      startSync();
      resetInactivityTimer();
    } else {
      stopSync();
    }

    return () => {
      clearInterval(syncInterval);
      clearTimeout(inactivityTimer);
    };
  }, [isActive, localEnergy, localPoints, user, restoreTime]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      await syncWithServer(localEnergy, localPoints, restoreTime);
    };
    handleBeforeUnload()
    // window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [localEnergy, localPoints, user, restoreTime]);

  const handleTouchStart = (e) => {
    const touchCount = e.touches.length;
    for (let i = 0; i < touchCount; i++) {
      handleTap(touchCount);
      handleCoinAnimaton();

      const tg = window.Telegram.WebApp;
      tg.HapticFeedback.impactOccurred("medium");
      const touch = e.touches[i];
      const x = touch.clientX;
      const y = touch.clientY;

      const newClick = {
        id: Math.random(),
        x,
        y,
      };

      setClicks((prevClicks) => [...prevClicks, newClick]);

      setTimeout(() => {
        setClicks((prevClicks) =>
          prevClicks.filter((click) => click.id !== newClick.id)
        );
      }, 1000);
    }
  };

  const handleCoinAnimaton = () => {
    setScale(0.9);
    setTimeout(() => setScale(1), 50); // Reset to original scale after 100ms
  };

  const number = 20;
  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: 0,
      left: Math.floor(Math.random() * window.innerWidth) + "px",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <GameLayout>
      <LoadingScreen isloaded={isLoading} reURL={''} />
      

      {!isLoading && (
        <>

<div
className="hero w-full h-24 min-h-24 mb-4 rounded-3xl bg-no-repeat bg-cover flex flex-col items-center justify-center"
style={{ backgroundImage: `url(${heroBackgroundImg})` }}
>
<span className="flex flex-row items-center justify-center gap-2 text-xl font-black bg-[#181A1B] rounded-full text-[#0FF378] py-2 px-2 pr-4">
  <img
    src={PlayIcon}
    className="w-8 h-8 object-contain rounded-full"
    alt=""
  />{" "}
  PLAY
</span>
</div>
<div
className={`coinsection w-full h-full bg-black flex flex-col items-center justify-center p-4 relative select-none mb-2 bg-center bg-no-repeat `}
style={{
  backgroundImage: `url(${coinBackgroundImg})`,
  backgroundBlendMode: "hard-light",
}}
>
<div className="topbar bg-black/35 backdrop-blur-sm border-[#3131316c] border-[1px] w-[90%] py-2 absolute top-0 z-20 rounded-3xl">
  <Link
    to="/game/reward"
    className="miner flex flex-col items-center justify-center absolute my-2 ml-4"
  >
    <img src={robot[`${gamelevel}`] ? robot[`${gamelevel}`] : robot_1}
    alt="" className="w-8 h-8" />
    <h1 className="font-sfSemi text-sm text-white">{robotlevel[gamelevel]}</h1>
  </Link>
  <div className="flex flex-col items-center justify-center gap-2">
    <h1 className="font-sfSemi text-sm text-white">YOU'VE EARNED</h1>
    <h1 className="font-sfSemi text-2xl text-white flex flex-row gap-2 items-center justify-center">
      <AnimatedCounter from={parseInt(prePoint)} to={parseInt(localPoints)} />
      <img src={LogoImg} className="w-8 h-8" />
    </h1>
  </div>
</div>

<div className="coin-display small:-mt-10">
  {[...meteorStyles].map((style, idx) => (
    <span
      key={idx}
      className={
        "pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-[#0FF378] shadow-[0_0_0_1px_#ffffff10]"
      }
      style={style}
    >
      <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-[#0FF378] to-transparent" />
    </span>
  ))}
  <div className="flex">
    <div className="relative flex">
      <motion.img
        animate={{ scale }}
        transition={{ duration: 0.1 }}
        src={CoinImg}
        alt="Coin"
        className="img-fluid animate__animated animate__bounce small:w-52 small:h-52 h-64 w-64 z-10 rounded-full select-none"
        onTouchStart={handleTouchStart}
      />
      {localEnergy
        ? clicks.map((click) => (
            <motion.div
              key={click.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -100 }}
              transition={{ duration: 1 }}
              className="absolute text-2xl font-sfSemi text-white z-20 flex"
              style={{ top: click.y - 300, left: click.x - 100 }}
            >
              +{deductCount || "5"}
            </motion.div>
          ))
        : ""}
      <div className="h-52 w-52 bg-[#0ff37969] rounded-full absolute top-1/2 -translate-y-1/2 z-0 blur-2xl left-1/2 -translate-x-1/2"></div>
    </div>
  </div>
</div>
<div className="rank flex flex-row gap-2 small:items-start items-center justify-center left-0 my-10 small:my-0">
  <div className="progressbar w-60 rounded-full relative h-3 bg-[#050F08]">
    <div
      className="absolute h-full bg-gradient-to-r from-[#0FF378] to-[#6ABE6A] bottom-0 rounded-full"
      style={{
        width: `${Math.min(Math.max((parseInt(localEnergy) / 2000) * 100, 0), 100)}%`,
      }}
    ></div>
  </div>
  <h1 className="text-sm text-[#0FF378] flex flex-row items-center gap-1">
    {restoreTime != null && restoreTime !== '' && localEnergy === 0 ? (
      !isNaN(parseInt(elapsedSeconds)) ? formatTime(elapsedSeconds) : `1h`
      // elapsedSeconds
    ) : (
      <>
        {localEnergy} <img src={BoltIcon} className="w-3 h-4" alt="Bolt Icon" />
      </>
    )}
  </h1>
</div>
</div>
</>

      )}
      
    </GameLayout>
  );
}

export default Earn;
