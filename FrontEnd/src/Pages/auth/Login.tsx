import LoginForm from "./LoginForm";
import VideoBackground from "../../Components/Layouts/VideoBackground";

const Login = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <VideoBackground />
      <LoginForm />
    </div>
  );
};

export default Login;