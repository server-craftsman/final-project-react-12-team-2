import CreateButton from "./CreateButton";
import DisplayLesson from "./DisplayLesson";

const LessionComponent = () => {
  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <CreateButton />
      </div>
      <DisplayLesson />
    </div>
  );
};

export default LessionComponent;
