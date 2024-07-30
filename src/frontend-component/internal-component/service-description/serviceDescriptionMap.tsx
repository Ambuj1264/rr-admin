interface servicesDescriptionUiFieldsInterface {
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
  
  export const servicesFieldDescription = [
    {
      fields: ["Service name"],
      placeholder: "Enter your heading",
      type: "text",
      title:"Heading",
      apiKey:"serviceName",
      cellScale: 3,
      variant:"outlined",
      createValidators: [
        "required", "matchRegexp:^.{0,15}$",
      ],
      createErrorMsgs: ["This field is required", "Only 15 character allowed"],
    },
    {
      fields: ["Service sub Heading"],
      placeholder: "Enter your sub heading",
      type: "text",
      cellScale: 3,
      title:"Sub heading",
      apiKey: "serviceSubheading",
      variant: "outlined",
      createValidators: [
        "required", "matchRegexp:^.{0,40}$",
      ],
      createErrorMsgs: ["This field is required", "Only 40 character allowed"],
    },
    {
      fields: ["Service Description"],
      placeholder: "Enter your text",
      type: "text",
      cellScale: 3,
      title: "Text",
      apiKey: "serviceDescription",
      variant: "outlined",
      createValidators: [
        "required", 
        "matchRegexp:^.{0,40}$",
      ],
      createErrorMsgs: ["This field is required","Only 40  character allowed"],
    },
    {
      fields: ["Service button"],
      placeholder: "Enter your button text",
      type: "text",
      cellScale: 3,
      title:"Button text",
      apiKey: "serviceButton",
      variant: "outlined",
      createValidators: [
        "required",  "matchRegexp:^.{0,20}$",
      ],
      createErrorMsgs: ["This field is required", "Only 20 character allowed"],
    },
   
   
  ] as servicesDescriptionUiFieldsInterface[];
  