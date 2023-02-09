import { useAuth } from "@arcana/auth-react";
import { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";

const Home = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps
  let auth=useAuth();
  console.log(auth.user)

  return (
    <Center>
      <Logout />
    </Center>
  );
};

export default Home;
