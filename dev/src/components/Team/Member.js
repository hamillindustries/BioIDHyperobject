import React from "react";
const Member = ({ name, onClick, expand, desc }) => {
  const oName = { __html: `${name} ${expand ? "-" : "+"}` };
  const oDesc = { __html: `${desc}` };
  const className = `team_member-link ${expand ? "expand" : ""}`;
  return (
    <div className={className}>
      <p dangerouslySetInnerHTML={oName} onClick={onClick} />
      <p className="team_member-bio" dangerouslySetInnerHTML={oDesc} />
    </div>
  );
};

export default Member;
