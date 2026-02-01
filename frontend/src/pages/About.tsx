import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  return (
    <Card className="max-w-4xl mx-auto mt-10 p-8 border-0 shadow-lg">
      <div className="flex justify-end gap-6">
        {/* top navigation buttons */}
        <Button
          variant="link"
          type="button"
          className="p-0 h-auto font-medium"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>

        <Button
          variant="link"
          type="button"
          className="p-0 h-auto font-medium"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </div>

      {/* logo section */}
      <img
        src="/android-chrome-512x512.png"
        alt="RepRight Logo"
        className="w-40 h-40 mx-auto dark:hidden"
      />

      <div className="text-center mb-4">
        <h1 className="text-secondary text-4xl font-bold inline-block border-b-4 border-subheading">
          About RepRight
        </h1>
        <h2 className="text-subheading text-2xl text-center font-semibold">
          Train smarter. Move safer.
        </h2>
      </div>

      {/* description text */}
      <p className="text-subheading text-center mb-6">
        RepRight helps you maintain proper form during workouts, reducing the
        risk of injury and ensuring you get the most out of every exercise.
      </p>
      <p className="text-subheading text-center mb-6">
        Simply upload a video of yourself performing an exercise, and RepRight
        will analyze your movement to provide personalized feedback along with a
        clear performance score.
      </p>

      <p className="text-subheading text-center mb-6">
        As you continue logging exercises, you can track your improvement over
        time with detailed charts and visual insights on your personalized
        dashboard, making it easy to see progress, identify areas for
        improvement, and stay motivated.
      </p>

      {/* "demo" place holder */}
      {/* <div className="w-full aspect-video bg-subheading rounded-[2rem] flex items-center justify-center">
        <h3 className="text-secondary text-4xl font-semibold text-center">
          DEMO Picture OR Video
        </h3>
      </div> */}

      <br></br>

      {/* Team Section */}
      <h2 className="text-subheading text-3xl font-bold text-center">
        Our Team
      </h2>

      <br></br>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Braeden */}
        <div className="text-center">
          <div className="w-24 h-24 bg-subtle rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            B
          </div>
          <h3 className="font-bold text-secondary text-xl">Braeden Treutel</h3>
          <p className="text-subheading">FullStack Developer</p>
        </div>

        {/* Eliab */}
        <div className="text-center">
          <div className="w-24 h-24 bg-subtle rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            E
          </div>
          <h3 className="font-bold text-secondary text-xl">
            Eliab Woldegebriel
          </h3>
          <p className="text-subheading">FullStack Developer</p>
        </div>

        {/* Mario */}
        <div className="text-center">
          <div className="w-24 h-24 bg-subtle rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            M
          </div>
          <h3 className="font-bold text-secondary text-xl">Mario Missiha</h3>
          <p className="text-subheading">FullStack Developer</p>
        </div>
      </div>
    </Card>
  );
}
export default About;
