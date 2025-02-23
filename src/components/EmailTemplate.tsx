import React from "react";

interface EmailTemplateProps {
  name: string;
  text: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = (props) => (
  <div>
    <h1>Welcome, {props.name}!</h1>
    <div>
      <p>{props.text}</p>
    </div>
  </div>
);

export default EmailTemplate;
