import React from "react";

type Props = {};

const VolunteerApplicationEdit = (props: Props) => {
  return (
    <div className="text-sm">
      <h2 className="text-2xl pb-2">Edit Volunteer Application</h2>
      <p>Volunteers already provide the following fields:</p>
      <ul>
        <li>- Name</li>
        <li>- Contact e-mail</li>
        <li>- School and graduation year</li>
        <li>- Notable achievements</li>
        <li>- Past volunteer experience</li>
      </ul>
      <p>
        Do not include information that would go in your onboarding form, such
        as T-Shirt size
      </p>
    </div>
  );
};

export default VolunteerApplicationEdit;
