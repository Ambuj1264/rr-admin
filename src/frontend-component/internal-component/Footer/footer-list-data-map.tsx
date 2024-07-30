interface footerUiFieldsInterface {
    id: string;
    fields: string[];
    title: string;
    key: string;
    type: string;
    editField: string;
    editable?: boolean;
    displayable?: boolean;
    cellScale?: number;
    options?: any;
    apiKey?: string;
    defaultValue?: any;
    placeholder?:string
    variant?: string
    createValidators?:string[],
    createErrorMsgs?: string[]
  }
  
  export const footerFields = [
    {
      fields: ["footerLogo"],
      placeholder: "Enter your brand name",
      type: "text",
      apiKey:"footerLogo",
      cellScale: 3,
      variant:"outlined",
      title:"Brand name",
      createValidators: [
        "required", "matchRegexp:^.{0,40}$",
      ],
      createErrorMsgs: ["This field is required", "Only 40 character allowed"],
    },
    {
      fields: ["footerDescription"],
      placeholder: "Enter your footer description",
      type: "text",
      cellScale: 3,
      apiKey: "footerDescription",
      title:"Footer description",
      variant: "outlined",
      createValidators: [
        "required", "matchRegexp:^.{0,300}$",
      ],
      createErrorMsgs: ["This field is required", "Only 300 character allowed"],
    },
    {
      fields: ["social-link-facebook"],
      placeholder: "Enter your facebook url",
      type: "text",
      cellScale: 3,
      apiKey: "facebook",
      title:"Facebook url",
      variant: "outlined",
      createValidators: [
        "required", "matchRegexp:^.{0,300}$",
      ],
      createErrorMsgs: ["This field is required", "Only 150 character allowed"],
    },
    {
      fields: ["social-link-twitter"],
      placeholder: "Enter your twitter url",
      type: "text",
      cellScale: 3,
      apiKey: "twitter",
      title:"Twitter url",
      variant: "outlined",
      createValidators: [
        "required", "matchRegexp:^.{0,300}$",
      ],
      createErrorMsgs: ["This field is required", "Only 300 character allowed"],
    },
    {
      fields: ["social-link-instagram"],
      placeholder: "Enter your instagram url",
      type: "text",
      cellScale: 3,
      apiKey: "instagram",
      title:"Instagram url",
      variant: "outlined",
      createValidators: [
        "required", "matchRegexp:^.{0,300}$",
      ],
      createErrorMsgs: ["This field is required", "Only 300 character allowed"],
    },
    {
      fields: ["social-link-linkedin"],
      placeholder: "Enter your linkedin url",
      type: "text",
      cellScale: 3,
      apiKey: "linkedin",
      variant: "outlined",
      title:"Linkedin url",
      createValidators: [
        "required", "matchRegexp:^.{0,300}$",
      ],
      createErrorMsgs: ["This field is required", "Only 300 character allowed"],
    }
   
   
  ] as footerUiFieldsInterface[];
  