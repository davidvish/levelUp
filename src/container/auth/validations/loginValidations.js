import * as yup from 'yup';
import {STRINGS} from '../../../constants';

const phoneRegex = RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
export const loginSchemaEmail = yup.object().shape({
  email: yup.string().email().required(STRINGS.emailIsRequired),
  password: yup.string().when('email', {
    is: valid => valid,
    then: yup.string().required(STRINGS.passwordIsRequired).min(6).max(16),
  }),
});

export const loginSchemaPhone = yup.object().shape({
  email: yup.string().email().required(STRINGS.emailIsRequired),

  mobileNumber: yup.string().when('email', {
    is: valid => valid,
    then: yup
      .string()
      .required(STRINGS.mobileNumberIsRequired)
      .test('len', STRINGS.mobileValidation, val => val.length === 10),
  }),
});
export const emailSchema = yup.object().shape({
  email: yup.string().email().required(STRINGS.emailIsRequired),
});
export const registerScheme = yup.object().shape({
  name: yup.string().required(STRINGS.nameIsRequired),
  password: yup.string().when('name', {
    is: valid => valid,
    then: yup.string().required(STRINGS.passwordIsRequired).min(6).max(16),
  }),
  email: yup.string().when('password', {
    is: valid => valid,
    then: yup.string().email().required(STRINGS.emailIsRequired),
  }),
  mobileNumber: yup.string().when('email', {
    is: valid => valid,
    then: yup
      .string()
      .required(STRINGS.mobileNumberIsRequired)
      .test('len', STRINGS.mobileValidation, val => val.length === 10),
  }),
  //   check: yup.string().when("mobileNumber", {
  //     is: (valid) => valid,
  //     then: yup.string().required(STRINGS.termsandconditionsWarning),
  //   }),
});

export const resetPasswordScheme = yup.object().shape({
  password: yup.string().required().min(6).max(16),
  confirmPassword: yup.string().when('password', {
    is: valid => valid,
    then: yup
      .string()
      .required()
      .oneOf([yup.ref('password'), null], STRINGS.passwordValidation),
  }),
});
export const loginWithPasswordScheme = yup.object().shape({
  mobileNumber: yup
    .string()
    .required(STRINGS.mobileNumberIsRequired)
    .test('len', STRINGS.mobileValidation, val => val.length === 10),
  password: yup.string().required(STRINGS.passwordIsRequired).min(6).max(16),
});
export const mobileScheme = yup
  .string()
  .required(STRINGS.mobileNumberIsRequired)
  .test('len', STRINGS.mobileValidation, val => val.length === 10);
// export const mobileScheme = yup
//   .string()
//   .required(STRINGS.mobileNumberIsRequired)
//   .test("len", STRINGS.mobileValidation, (val) => val.length === 10);
