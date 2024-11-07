import DisplayLesson from "./DisplayLesson";

interface LessionComponentProps {
  refreshKey: any; // Replace 'any' with the appropriate type if known
}

const LessionComponent = ({ refreshKey }: LessionComponentProps) => {
  return (
    <div>
      <DisplayLesson refreshKey={refreshKey} />
    </div>
  );
};

export default LessionComponent;
