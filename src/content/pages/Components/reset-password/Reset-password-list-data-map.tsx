interface LoginFieldsInterface {
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
export const LoginFields = [
  {
    fields: ["password"],
    placeholder: "Enter your password",
    type: "password",
    cellScale: 6,
    apiKey: "password",
    variant: "outlined",
    createValidators: [
      "required",
      "matchRegexp:^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$"
    ],
    createErrorMsgs: [
      "The field is required",
      "Password should contains at least 8 characters and containing special character, uppercase, lowercase and numbers"
    ],
  },
  {
    fields: ["confirmPassword"],
    placeholder: "Enter your confirm password",
    type: "password",
    cellScale: 6,
    apiKey: "confirmPassword",
    variant: "outlined",
    createValidators: [
      "required",
      "matchRegexp:^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$"
    ],
    createErrorMsgs: [
      "The field is required",
      "Password should contains at least 8 characters and containing special character, uppercase, lowercase and numbers"
    ],
  }
] as LoginFieldsInterface[];