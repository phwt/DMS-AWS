import { ReactNode } from "react";

interface Props {
  header: string;
  children: ReactNode | ReactNode[];
}

const ActionCard = ({ header, children }: Props) => {
  return (
    <div className="card bg-16 w-100">
      <div className="card-header">
        <h5>{header}</h5>
      </div>
      <div className="card-body">
        <div className="card-text">{children}</div>
      </div>
    </div>
  );
};

export default ActionCard;
