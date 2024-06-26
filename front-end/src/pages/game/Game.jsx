import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Error500 from "../error/Error500";

import { getTGUser } from "../../utlis/tg";
import { setSession } from "../../utlis/localstorage";

import LoadingScreen from "../../components/taptap/LoadingScreen"

function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const query_params = new URLSearchParams(location.search);
  const referral_by = query_params.get("tgWebAppStartParam");

  const [error, setError] = useState(false);
  const [isTg, setIsTg] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(function () {
    let unmounted = false;
    let tg_user = getTGUser();
    setIsTg(tg_user !== false);

    if (tg_user !== false) {
      tg_user["referral_by"] = referral_by;
      axios
        .post("/api/tg/auth/", tg_user)
        .then((res) => {
          var data = res.data;
          //TODO: check this sync_data validation
          if (data.sync_data) {
            setSession(data.sync_data);
            setIsLoading(false);
            navigate("/game/earn");
            return;
          } else {
            throw new Error("Sync data is not found");
          }
        })
        .catch((err) => {
          if (!unmounted) {
            if (err.response.status === 403) {
              setIsTg(false);
            } else {
              setError(true);
            }
            setIsLoading(false);
          }
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <>
      {isLoading === true && <LoadingScreen isloaded={isLoading} reURL={''} />}
      {isLoading === false && error === true && <Error500 />}
      {isLoading === false && error === false && isTg === false && (
        <h1 className="text-7xl text-white font-sfSemi text-center">
          Please open in TG
        </h1>
      )}
    </>
  );
}

export default Game;
