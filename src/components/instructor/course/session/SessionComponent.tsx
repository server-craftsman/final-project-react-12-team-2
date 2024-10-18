import CreateButton from "./CreateButton";
import DisplaySession from "./DisplaySession";

const SessionComponent = () => {
  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <CreateButton />
      </div>
      <DisplaySession />
    </div>
  );
};

export default SessionComponent;
