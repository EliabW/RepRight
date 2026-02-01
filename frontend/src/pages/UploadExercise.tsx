import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function UploadExercise() {
  const navigate = useNavigate();
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");

  const handleStart = () => {
    if (!exercise || !reps) {
      alert("Please select an exercise and enter the number of reps");
      return;
    }

    navigate("/livesession", {
      state: {
        exercise,
        reps: parseInt(reps), // Convert to number
      },
    });
  };

  return (
    <div className="min-h-screen bg-[tertiary] flex items-center justify-center p-4">
      <Card className="w-full max-w-[600px] p-10 border-0 shadow-2xl rounded-xl bg-card-primary">
        <h1 className="text-4xl text-center text-primary mb-10">
          Enter Exercise Information
        </h1>

        {/* exercise selection */}
        <div className="space-y-8">
          <Field className="space-y-2">
            <FieldLabel className="text-xl text-primary">Exercise</FieldLabel>
            <Select value={exercise} onValueChange={setExercise}>
              <SelectTrigger className="w-full h-14 px-5 rounded-xl border-none shadow-inner bg-white">
                <SelectValue
                  placeholder="Select the exercise you are performing"
                  className="text-white"
                ></SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl">
                <SelectItem value="Squat" className="text-xl ">
                  Squat
                </SelectItem>
                <SelectItem value="Pushup" className="text-xl ">
                  Pushup
                </SelectItem>
                <SelectItem value="Deadlift" className="text-xl ">
                  Deadlift
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* reps input */}
          <Field className="space-y-2">
            <FieldLabel className="text-xl text-primary">Reps</FieldLabel>
            <input
              type="number"
              placeholder="Number of reps you are attempting"
              className="w-full h-14 px-5 rounded-xl"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            ></input>
          </Field>

          <Button
            type="submit"
            className="w-full h-16 text-xl shadow-md rounded-xl"
            onClick={handleStart}
          >
            Start
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default UploadExercise;
