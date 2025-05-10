import LoginForm from "../../Components/LoginForm";
import VideoBackground from "../../Components/VideoBackground";

const Login = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <VideoBackground />
      <LoginForm />
    </div>
  );
};

export default Login;