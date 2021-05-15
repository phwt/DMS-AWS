const WorkTypeBadge = ({ type }) => {
  switch (type) {
    case "CREATE":
      return <span className="badge badge-pill badge-success">Create</span>;
    case "EDIT":
      return <span className="badge badge-pill badge-warning">Edit</span>;
    case "CANCEL":
      return <span className="badge badge-pill badge-danger">Cancel</span>;
  }
};

export default WorkTypeBadge;
