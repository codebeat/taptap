import { Link, useLocation } from "react-router-dom";

import TokenImg from "../../assets/img/coins.svg";
import FriendImg from "../../assets/img/friends.svg";
import GiftImg from "../../assets/img/gift.svg";
import TaskImg from "../../assets/img/task.svg";
import LeaderBoardImg from "../../assets/img/leaderboard.svg";

import { useNavigate } from "react-router-dom";

let tabs = [
  { id: "Earn", label: "Earn", img: TokenImg, path: "/game/earn" },
  { id: "Friends", label: "Friends", img: FriendImg, path: "/game/friends" },
  { id: "Reward", label: "Mine", img: GiftImg, path: "/game/reward" },
  { id: "Tasks", label: "Tasks", img: TaskImg, path: "/game/tasks" },
  // {
  //   id: "Leaderboard",
  //   label: "Leaderboard",
  //   img: LeaderBoardImg,
  //   path: "/game/leaderboard",
  // },
];

export default function Tabs() {
  const location = useLocation();
  return (
    <div className="flex z-40 w-full  mt-auto max-w-sm   bg-black/25 backdrop-blur-md border-[1px] border-[#31313180] p-2  rounded-3xl  bottom-6 left-1/2 -translate-x-1/2 fixed">
      <div className=" h-full w-full flex flex-row justify-between">
        {tabs.map((tab) => (
          <Link
            to={tab.path}
            key={tab.id}
            className={`inline-flex flex-col items-center justify-center px-6 py-2 rounded-2xl  group ${
              location.pathname === tab.path ? "bg-[#0FF378]" : "bg-[#0B0B0B]"
            }`}
          >
            <img
              className={`w-6 h-6 mb-1 text-gray-500  group-hover:text-blue-600 ${
                location.pathname === tab.path ? "invert" : ""
              }`}
              src={tab.img}
            />
            <span
              className={`text-xs text-white ${
                location.pathname === tab.path ? "invert" : ""
              }`}
            >
              {tab.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
