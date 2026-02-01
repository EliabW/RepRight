import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { FancyButton } from "@/components/ui/fancybutton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "animate.css";

const exerciseVideos: Record<string, string> = {
  Squat: "/videos/squat.mp4",
  Pushup: "/videos/pushup.mp4",
  Deadlift: "/videos/deadlift.mp4",
};

function UploadExercise() {
  const [exercise, setExercise] = useState("");

  return (
    <div className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden ">

      {/* 🎥 Exercise Video Background */}
      {exercise && exerciseVideos[exercise] && (
        <video
          key={exercise}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0 animate__animated animate__fadeIn"
        >
          <source src={exerciseVideos[exercise]} type="video/mp4" />
        </video>
      )}

      {/* 🧠 RepRight watermark (dashboard style) */}
      {!exercise && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <img
            src="/android-chrome-512x512.png"
            alt="RepRight Logo"
            className="w-[700px] opacity-[0.07] dark:hidden"
          />
          <img
            src="/white-android-chrome-512x512.png"
            alt="RepRight Logo"
            className="w-[520px] opacity-[0.1] hidden dark:block"
          />
        </div>
      )}

      {/* dark overlay like dashboard */}
   

      {/* MAIN CARD */}
      <Card className="relative z-20 w-full max-w-[700px] p-16 shadow-2xl rounded-[40px] animate__animated animate__zoomIn bg-card-primary/60">
        <h1 className="text-4xl text-primary mb-2">
          Enter Exercise Information
        </h1>


        <div className="space-y-10">

          {/* Exercise Select */}
          <Field className="space-y-2">
            <FieldLabel className="text-lg text-subheading">
              Exercise
            </FieldLabel>

            <Select value={exercise} onValueChange={setExercise}>
              <SelectTrigger className="w-full h-14 px-5 rounded-xl border border-border bg-card-secondary text-foreground shadow-inner">
                <SelectValue placeholder="Select the exercise you are performing" />
              </SelectTrigger>

              <SelectContent className="bg-card-primary border border-border rounded-xl">
                <SelectItem value="Squat">Squat</SelectItem>
                <SelectItem value="Pushup">Pushup</SelectItem>
                <SelectItem value="Deadlift">Deadlift</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Reps */}
          <Field className="space-y-2">
            <FieldLabel className="text-lg text-subheading">
              Reps
            </FieldLabel>
            <input
              type="number"
              placeholder="Number of reps you are attempting"
              className="w-full h-14 px-5 rounded-xl bg-card-secondary text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>

          {/* CTA */}
          <FancyButton
            className="w-full h-16 text-lg rounded-xl shadow-lg"
            disabled={!exercise}
          >
            Start Workout
          </FancyButton>
        </div>
      </Card>
    </div>
  );
}

export default UploadExercise;
