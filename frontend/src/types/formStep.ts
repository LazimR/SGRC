import {
  type FieldErrors,
  type UseFormRegister,
  type UseFormWatch,
  type UseFormSetValue,
  type FieldValues,
  type Control,
} from "react-hook-form"

export interface FormStepProps<T extends FieldValues> {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  watch?: UseFormWatch<T>
  setValue?: UseFormSetValue<T>
  control?: Control<T>
}
