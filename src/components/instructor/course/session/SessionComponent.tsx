import DisplaySession from "./DisplaySession";
interface SessionComponentProps {
  refreshKey: any; // Replace 'any' with the appropriate type if known
}

const SessionComponent = ({ refreshKey }: SessionComponentProps) => {
  return (
    <div>
      <DisplaySession refreshKey={refreshKey} />
    </div>
  );
};

export default SessionComponent;
