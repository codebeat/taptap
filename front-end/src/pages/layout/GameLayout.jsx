import Tabs from "../../components/taptap/Tabs";
import TGAuth from "../../components/taptap/TGAuth";

import { getTGUser } from "../../utlis/tg";

import walletIcon from "../../assets/img/wallet-icon.svg";
import leaderboard from "../../assets/img/leaderboard.svg";
import coinIcon from "../../assets/img/coin.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  TonConnectButton,
  TonConnectUI,
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectModal,
  useTonWallet,
} from "@tonconnect/ui-react";

function GameLayout({ children }) {
  let tg_user = getTGUser();
  const tg = window.Telegram.WebApp;
  useEffect(() => {
    tg.expand();
  }, []);
  const { state, open, close } = useTonConnectModal();
  const wallet = useTonWallet();
  const userFriendlyAddress = useTonAddress();
  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    const start = address.slice(0, 2);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };
  return (
    <TGAuth>
      {tg_user !== false && (
        <div className="container text-center h-screen flex flex-col items-center px-2 bg-transparent backdrop-blur-md font-sfRegular">
          <div className="top-bar w-full flex flex-row items-center justify-between py-2 h-[74px]">
            <div className="flex flex-row justify-between align-items-center w-full">
              <div className="flex flex-row items-center justify-center">
                <img
                  src={tg_user.photo_url || coinIcon}
                  className="w-12 h-12 m-1 border-2 border-[#0B2113] rounded-full"
                  alt="Profile"
                  width="50"
                />
                <span className="ml-2 text-white text-xl font-sfSemi">
                  {tg_user.first_name}
                </span>
              </div>
              <div className="menu flex flex-row items-center justify-center gap-4">
                {wallet ? (
                  <button
                    onClick={open}
                    className="text-white px-4 font-sfSemi rounded-xl bg-[#0B2113] h-12"
                  >
                    {formatWalletAddress(userFriendlyAddress)}
                  </button>
                ) : (
                  <button onClick={open}>
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
                      class="icon icon-tabler icons-tabler-outline icon-tabler-wallet  w-12 h-12 text-white p-2 rounded-xl bg-[#0B2113]"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                      <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                    </svg>
                  </button>
                )}

                <Link to="/game/leaderboard" className=" ">
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
                    class="icon icon-tabler icons-tabler-outline icon-tabler-medal w-12 h-12 text-white p-2 rounded-xl bg-[#0B2113]"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 4v3m-4 -3v6m8 -6v6" />
                    <path d="M12 18.5l-3 1.5l.5 -3.5l-2 -2l3 -.5l1.5 -3l1.5 3l3 .5l-2 2l.5 3.5z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          {children}
          <Tabs />
        </div>
      )}
      {tg_user === false && (
        <h1 className="text-7xl text-white font-sfSemi text-center">
          
        </h1>
      )}
    </TGAuth>
  );
}

export default GameLayout;
