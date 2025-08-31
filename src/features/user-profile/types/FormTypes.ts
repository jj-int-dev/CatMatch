export type FormChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;

export type FormComponentProps = {
  isEditMode: boolean;
  value?: string;
  onChange?: (e: FormChangeEvent) => void;
};

export type FormButtonComponentProps = {
  isEditMode: boolean;
  onEditPress: () => void;
  onSavePress: () => void;
};
