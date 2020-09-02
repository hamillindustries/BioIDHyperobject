import React from "react";
const Member = ({ name, onClick }) => {
  const oText = { __html: `${name} +` };
  return (
    <div className="team_member-link" onClick={onClick}>
      <p dangerouslySetInnerHTML={oText} />
    </div>
  );
};

export default Member;
