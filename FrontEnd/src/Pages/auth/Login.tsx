import LoginForm from "../../components/LoginForm";
import VideoBackground from "../../components/VideoBackground";

const Login = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <VideoBackground />
      <LoginForm />
    </div>
  );
};

export default Login;