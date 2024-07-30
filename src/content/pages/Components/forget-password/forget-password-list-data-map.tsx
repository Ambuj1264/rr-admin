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
    fields: ["email"],
    placeholder: "Enter your email",
    type: "text",
    apiKey:"email",
    cellScale: 6,
    variant:"outlined",
    createValidators: [
      "required",
      "matchRegexp:^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\\.[A-Za-z]+$",
    ],
    createErrorMsgs: ["The field is required", "Invalid email"],
  },
] as LoginFieldsInterface[];