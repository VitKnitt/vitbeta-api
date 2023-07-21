import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [noMatch, setNoMatch] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [passwordChanged, setpasswordChanged] = useState(false);
  const { id, token } = useParams();

  const regexPassword = /^(?=.*[a-zA-z]).{6,}$/;

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setNoMatch(true);
      return;
    }

    if (!regexPassword.test(newPassword)) {
        console.log(`regex ${regexPassword.test(newPassword)}`);
      return 
    }

    try {
      const result = await fetch(`https://vitbeta-api.onrender.com/passwordreset/${id}/${token}`, {
        method: "POST",
        body: JSON.stringify({ newPassword, id, token }),
        headers: { "Content-type": "application/json" },
      });

      if(result.status === 401){
        //token expired
        setTokenExpired(true)
        console.log("token expired")
      }

      if(result.status === 404){
        //user not found
        console.log("user not found")
      }

      if(result.status === 200){
        //success navigate to login
        setpasswordChanged(true)
        console.log("success")
      }

    } catch (err) {
      console.log(err);
    }


  };

  if (noMatch) {
    setTimeout(() => {
      setNoMatch(false);
    }, 4000);
  }


  if (passwordChanged){
  return  <Navigate to="/login" />
  }

  return (
    <div className="passwordreset">
      <h1>reset hesla:</h1>
      <form onSubmit={handleChangePassword} className="passwordresetform">
        <h2>nové heslo:</h2>
        <p>
          min. délka 6{" "}
          {!regexPassword.test(newPassword) ? 
          (
            <FontAwesomeIcon icon={faXmark} style={{ color: "#e0101a" }} />
          ) : (
            <FontAwesomeIcon icon={faCheck} style={{ color: "#143d59" }} />
          )
          }
        </p>
        <input
          type="password"
          placeholder="new password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <h2>potvrďte heslo:</h2>
        <input
          type="password"
          placeholder="confirmpassword"
          required
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <button type="submit">potvrdit</button>
      </form>
      <div className="passwordresetmsg">
      {noMatch && <p>hesla se neshodují</p>}
      {tokenExpired && <p>platnost vypršela</p>}
      </div>
    </div>
  );
};

export default PasswordReset;
