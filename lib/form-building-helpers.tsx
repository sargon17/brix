import type { DeepKeys, useForm } from "@tanstack/react-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// @ts-expect-error
export type FormUtilType = ReturnType<typeof useForm<FormData>>;

type FieldConfig<T, V> = {
  name: DeepKeys<V>;
  label: string;
  placeholder?: string;
  form: T extends ReturnType<typeof useForm> ? T : FormUtilType;
};

export type TextFieldConfig<T, V> = FieldConfig<T, V> & {
  required?: boolean;
  description?: string;
};

export type TextAreaConfig<T, V> = FieldConfig<T, V> & {
  minRows?: number;
};

export function DefaultTextField<T, V>({
  name,
  label,
  placeholder,
  required,
  description,
  form,
}: TextFieldConfig<T, V>) {
  return (
    <form.Field key={name} name={name}>
      {(field) => (
        <Field>
          <FieldLabel
            htmlFor={field.name}
            className="flex items-center justify-between"
          >
            <span>{label}</span>
            {required ? (
              <span className="ml-2 text-xs font-normal text-destructive">
                required
              </span>
            ) : null}
          </FieldLabel>
          <Input
            id={field.name}
            placeholder={placeholder}
            value={field.state.value?.toString()}
            onChange={(event) => field.handleChange(event.target.value)}
            onBlur={field.handleBlur}
          />
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
          <FieldError errors={field.state.meta.errors} />
        </Field>
      )}
    </form.Field>
  );
}

export function DefaultTextArea<T, V>({
  name,
  label,
  placeholder,
  minRows = 4,
  form,
}: TextAreaConfig<T, V>) {
  return (
    <form.Field key={name} name={name}>
      {(field) => (
        <Field>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Textarea
            id={field.name}
            rows={minRows}
            placeholder={placeholder}
            value={field.state.value?.toString()}
            onChange={(event) => field.handleChange(event.target.value)}
            onBlur={field.handleBlur}
          />
          <FieldError errors={field.state.meta.errors} />
        </Field>
      )}
    </form.Field>
  );
}
