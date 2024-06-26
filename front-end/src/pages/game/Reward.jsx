import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import axios from "axios";
import moment from "moment";

import TGAuth from "../../components/taptap/TGAuth";
import Drawer from "../../components/taptap/Drawer";

import {getAuth} from "../../utlis/localstorage";

import minerbg from "../../assets/img/mine-bg.png";
import stars from "../../assets/img/stars-robo.svg";
import energy from "../../assets/img/energy.svg";
import clock from "../../assets/img/clock.svg";
import upgrade from "../../assets/img/upgrade.svg";
import robot_1 from "../../assets/img/robot-1.png";
import robot_2 from "../../assets/img/robot-2.png";
import robot_3 from "../../assets/img/robot-3.png";
import robot_4 from "../../assets/img/robot-4.png";

function RoboMine() {
  const navigate = useNavigate();
  const [is_claim, setIsClaim] = useState(false);
  const [contdown, setCountDown] = useState(0);

  //TODO: rework the drawer
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const robot = {
    0: robot_1,
    1: robot_1,
    2: robot_2,
    3: robot_3,
    4: robot_4,
    5: robot_4,
  };

  let miner_level = localStorage.getItem("miner_level");
  miner_level = !isNaN(parseInt(miner_level)) ? parseInt(miner_level) : 0;
  let last_mine_date = localStorage.getItem("last_mine_date");
  last_mine_date =
      last_mine_date !== null && last_mine_date !== "" ? last_mine_date : null;
  let last_mine_batch = last_mine_date !== null ? findBatch(last_mine_date) : 0;
  let currrent_batch = findBatch();

  function getCurrentDateFormatted() {
    var now = new Date();
    var year = now.getUTCFullYear();
    var month = (now.getUTCMonth() + 1).toString().padStart(2, "0"); // getUTCMonth() returns month index (0-11)
    var day = now.getUTCDate().toString().padStart(2, "0");

    return year + "-" + month + "-" + day;
  }

  if (is_claim === false && miner_level > 0) {
    if (last_mine_date === null) {
      setIsClaim(true);
    } else if (last_mine_date !== null) {
      let last_date = moment.utc(last_mine_date).format("YYYY-MM-DD");
      let current_date = getCurrentDateFormatted();
      if (current_date > last_date) {
        console.log("dwsded");
        setIsClaim(true);
      } else if (
          current_date == last_date &&
          last_mine_batch < currrent_batch
      ) {
        console.log("dsdsd");
        setIsClaim(true);
      }
    }
  }

  function getSecondOfDayUTC(date_time = null) {
    const now = date_time !== null ? new Date(date_time) : new Date();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    const final_seconds = hours * 3600 + minutes * 60 + seconds;

    return final_seconds;
  }

  function findBatch(date_time = null) {
    const total_seconds_in_day = 24 * 3600;
    const number_of_batches = 8;
    const seconds_per_batch = total_seconds_in_day / number_of_batches;

    const seconds_of_day = getSecondOfDayUTC(date_time);
    const batch = Math.floor(seconds_of_day / seconds_per_batch) + 1;

    return batch;
  }

  function convertSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remaining_seconds = seconds % 60;

    const formatted_time = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(remaining_seconds).padStart(2, "0")}`;

    return formatted_time;
  }

  function getRemainingSeconds() {
    const total_seconds_in_day = 24 * 3600;
    const number_of_batches = 8;
    const seconds_per_batch = total_seconds_in_day / number_of_batches;

    const seconds_of_day = getSecondOfDayUTC();
    const batch = findBatch();

    const end_of_batch_second = batch * seconds_per_batch;
    const remaining_seconds = end_of_batch_second - seconds_of_day;

    return remaining_seconds;
  }

  function getRequiredScore(miner_level) {
    if (miner_level === 1) {
      return [20000, "20k"];
    } else if (miner_level === 2) {
      return [100000, "100k"];
    } else if (miner_level === 3) {
      return [200000, "200k"];
    } else if (miner_level === 4) {
      return [500000, "500k"];
    } else if (miner_level === 5) {
      return [1000000, "1M"];
    } else {
      throw new Error(
          `miner_level not found for getRequiredScore(${miner_level})`
      );
    }
  }

  function getClaimScore(miner_level) {
    if (miner_level === 1) {
      return [10000, "10k"];
    } else if (miner_level === 2) {
      return [50000, "50k"];
    } else if (miner_level === 3) {
      return [75000, "75k"];
    } else if (miner_level === 4) {
      return [100000, "100k"];
    } else if (miner_level === 5) {
      return [150000, "150k"];
    } else {
      throw new Error(
          `miner_level not found for getClaimScore(${miner_level})`
      );
    }
  }

  useEffect(function () {
    let score = localStorage.getItem("score");
    let miner_level = localStorage.getItem("miner_level");
    let last_mine_date = localStorage.getItem("last_mine_date");

    if (score === null || miner_level === null || last_mine_date === null) {
      return navigate("/game");
    }
    let remaining_seconds = getRemainingSeconds();
    setCountDown(remaining_seconds);
    let interval_id = setInterval(function () {
      setCountDown((prev_count_down) => {
        if (prev_count_down <= 0) {
          setIsClaim(false);
          let remaining_seconds = getRemainingSeconds();
          return remaining_seconds;
        }
        return prev_count_down - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval_id);
    };
  }, []);

  function handleClaim() {
    let miner_level = localStorage.getItem("miner_level");
    miner_level = !isNaN(parseInt(miner_level)) ? parseInt(miner_level) : 0;
    const token = getAuth();
    axios
        .get("/api/reward/claim", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          //TODO need to handle res properly
          var data = res.data;
          localStorage.setItem("last_mine_date", data.last_mine_date);
          localStorage.setItem("score", data.score);
          setIsClaim(false);
          setContent(`${getClaimScore(miner_level)[1]} claimed`);
          setOpen(true);
        })
        .catch((err) => {
          //TODO need to handle err properly
          alert("Something went wrong!");
          if (err.response.status === 401) {
            return navigate("/game");
          }
        });
  }

  function handleUpgrade() {
    let score = localStorage.getItem("score");
    score = !isNaN(parseInt(score)) ? parseInt(score) : 0;
    let miner_level = localStorage.getItem("miner_level");
    miner_level = !isNaN(parseInt(miner_level)) ? parseInt(miner_level) : 0;
    let next_miner_level = miner_level + 1;

    if (next_miner_level > 5) {
      setContent("You Exceed max upgrade");
      setOpen(true);
      return;
    }
    const [required_score, score_in_text] = getRequiredScore(next_miner_level);

    if (score < required_score) {
      setContent(`Insufficient coins (${score_in_text} coins required)`);
      setOpen(true);
      return;
    }

    const token = getAuth();
    axios
        .get("/api/reward/upgrade", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          //TODO need to handle res properly
          var data = res.data;
          localStorage.setItem("miner_level", data.miner_level);
          localStorage.setItem("score", data.score);
          setContent(`Upgraded to level ${next_miner_level}`);
          setOpen(true);
        })
        .catch((err) => {
          //TODO need to handle err properly
          alert("Something went wrong!");
          if (err.response.status === 401) {
            return navigate("/game");
          }
        });
  }

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.expand();

    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(-1);
      tg.BackButton.hide();
    });
  });

  return (
      <TGAuth>
        <Drawer open={open} setOpen={setOpen}>
          <div className="flex flex-col items-center justify-center px-4 gap-2">
            <h2 className="text-white font-sfSemi text-2xl">{content}</h2>
          </div>
        </Drawer>
        <div
            className="RoboMine relative h-screen bg-black bg-cover bg-no-repeat flex items-center justify-center px-2 flex-col py-4 bg-top pt-10"
            style={{ backgroundImage: `url(${minerbg})` }}
        >
          {/* <button
          className="absolute top-0 left-0 m-2 bg-white p-3 rounded-full"
          onClick={() => navigate(-1)}
        >
          <img src={back} className="w-4 h-4" alt="" />
        </button> */}
          <h1 className="font-bold text-4xl text-white">ROBO MINER</h1>
          <p className=" text-xl text-white">Upgrade your robot</p>
          <div className="robotcontainer relative flex">
            <img
                src={robot[`${miner_level}`] ? robot[`${miner_level}`] : robot_1}
                className="h-80 w-auto z-20 small:h-60 small:w-60"
                alt=""
            />
            <motion.img
                src={stars}
                className="absolute  h-80 w-80 small:h-60 small:w-60"
                alt=""
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                initial={{ rotate: 0 }}
            />
            <motion.img
                src={stars}
                className="absolute  h-80 w-80 small:h-60 small:w-60"
                alt=""
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                initial={{ rotate: 0 }}
            />
            <div className="h-52 w-52 bg-[#39ff9571] rounded-full absolute top-1/2 -translate-y-1/2 z-0 blur-2xl left-1/2  -translate-x-1/2"></div>
          </div>
          <div className="stats w-full h-full bg-[#0b0b0b4f] backdrop-blur-md border-[1px] border-[#313131] rounded-3xl flex flex-col items-center justify-center gap-2">
            <div className="flex flex-row items-center w-5/6 justify-between gap-4">
              <img src={energy} className="w-6 h-6" alt="" />
              <div className="flex flex-col items-center justify-center w-full gap-1">
                <div className="flex flex-row items-center justify-between w-full">
                  <h1 className="text-white font-bold text-sm">Energy</h1>
                  <h1 className="text-white font-bold text-sm">{miner_level}</h1>
                </div>
                <div className="progressbar w-full rounded-full relative  h-3 bg-[#050F08] border-[#45D470] border-[1px]">
                  <div
                      className="absolute  h-full bg-gradient-to-r from-[#0FF378] to-[#6ABE6A] bottom-0 rounded-full"
                      style={{ width: `${miner_level * 20}%` }}
                  ></div>
                </div>
              </div>
            </div>
            {/* <div className="flex flex-row items-center w-5/6 justify-between gap-4">
            <img src={health} className="w-6 h-6" alt="" />
            <div className="flex flex-col items-center justify-center w-full gap-1">
              <div className="flex flex-row items-center justify-between w-full">
                <h1 className="text-white font-bold text-sm">Health</h1>
                <h1 className="text-white font-bold text-sm">{miner_level}</h1>
              </div>
              <div className="progressbar w-full rounded-full relative  h-3 bg-[#050F08] border-[#45D470] border-[1px]">
                <div
                  className="absolute  h-full bg-gradient-to-r from-[#0FF378] to-[#6ABE6A] bottom-0 rounded-full"
                  style={{ width: `${miner_level * 20}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center w-5/6 justify-between gap-4">
            <img src={defence} className="w-6 h-6" alt="" />
            <div className="flex flex-col items-center justify-center w-full gap-1">
              <div className="flex flex-row items-center justify-between w-full">
                <h1 className="text-white font-bold text-sm">Defence</h1>
                <h1 className="text-white font-bold text-sm">{miner_level}</h1>
              </div>
              <div className="progressbar w-full rounded-full relative  h-3 bg-[#050F08] border-[#45D470] border-[1px]">
                <div
                  className="absolute  h-full bg-gradient-to-r from-[#0FF378] to-[#6ABE6A] bottom-0 rounded-full"
                  style={{ width: `${miner_level * 20}%` }}
                ></div>
              </div>
            </div>
          </div> */}
            <div className="flex flex-row items-center justify-center gap-4">
              {miner_level == 0 && (
                  <button
                      onClick={handleUpgrade}
                      className="claim bg-[#0FF378] flex flex-row items-center justify-center gap-2 px-6 py-4 mt-2 rounded-2xl text-xl font-bold "
                  >
                    Unlock 20k
                  </button>
              )}
              {miner_level > 0 && is_claim && (
                  <>
                    <button
                        onClick={handleUpgrade}
                        className="claim bg-[#0FF378] flex flex-row items-center justify-center gap-2 px-6 py-4 mt-2 rounded-2xl text-xl font-bold "
                    >
                      <img src={upgrade} className="h-6 w-6" />
                      Upgrade
                    </button>
                    <button
                        onClick={handleClaim}
                        className="claim bg-[#0FF378] flex flex-row items-center justify-center gap-2 px-6 py-4 mt-2 rounded-2xl text-xl font-bold "
                    >
                      Claim
                    </button>
                  </>
              )}
              {miner_level > 0 && is_claim === false && (
                  <>
                    <button
                        onClick={handleUpgrade}
                        className="claim bg-[#0FF378] flex flex-row items-center justify-center gap-2 px-6 py-4 mt-2 rounded-2xl text-xl font-bold "
                    >
                      <img src={upgrade} className="h-6 w-6" />
                      Upgrade
                    </button>
                    <button className="claim bg-[#0FF378] flex flex-row items-center justify-center gap-2 px-6 py-4 mt-2 rounded-2xl text-xl font-bold ">
                      <img src={clock} className="h-6 w-6" />
                      {convertSecondsToTime(contdown)}
                    </button>
                  </>
              )}
            </div>
          </div>
        </div>
      </TGAuth>
  );
}

export default RoboMine;
