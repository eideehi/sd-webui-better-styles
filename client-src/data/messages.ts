import { Message } from "./message";

const AddStyle = Message("better-styles.add-style", "Add style");
const ApplyStyles = Message("better-styles.apply-styles", "Apply styles");
const ApplyThisStyle = Message("better-styles.apply-this-style", "Apply this style");
const BetterStyles = Message("better-styles.extension-name", "Better Styles");
const CardLayout = Message("better-styles.card-layout", "Card layout");
const CfgScale = Message("better-styles.cfg-scale", "CFG Scale");
const CheckpointExclusive = Message("better-styles.checkpoint-exclusive", "Checkpoint exclusive");
const CheckpointExclusiveTooltip = Message(
  "better-styles.checkpoint-exclusive.tooltip",
  "Restrict the usage of this style to specific checkpoints only. If other checkpoints are active, this style will be excluded from the list. (However, it will still be shown exceptionally under the 'All' group tab.)"
);
const ClipSkip = Message("better-styles.clip-skip", "Clip skip");
const CloseThumbnailEditor = Message(
  "better-styles.close-thumbnail-editor",
  "Complete the editing"
);
const CompactLayout = Message("better-styles.compact-layout", "Compact layout");
const DefaultGroup = Message("better-styles.group.default", "default");
const DeleteStyles = Message("better-styles.delete-styles", "Delete styles");
const DeleteStylesCancel = Message(
  "better-styles.delete-styles.cancel",
  "No, cancel the style deletion"
);
const DeleteStylesConfirm = Message(
  "better-styles.delete-styles.confirm",
  "Yes, proceed with the style deletion"
);
const DeleteStylesDialog = Message(
  "better-styles.delete-styles.dialog",
  "You are about to delete the all selected styles. This action is irreversible. Do you wish to continue?"
);
const DeleteThisStyle = Message("better-styles.delete-this-style", "Delete this style");
const DeleteThisStyleDialog = Message(
  "better-styles.delete-this-style.dialog",
  'You are about to delete the "{0}" in the "{1}" group. This action is irreversible. Do you wish to continue?'
);
const DenoisingStrength = Message("better-styles.denoising-strength", "Denoising strength");
const DiscardChanges = Message("better-styles.discard-changes", "Discard changes and go back");
const EditThisStyle = Message("better-styles.edit-this-style", "Edit this style");
const EditThumbnail = Message("better-styles.edit-thumbnail", "Edit thumbnail");
const Enabled = Message("better-styles.enabled", "Enabled");
const EtaNoiseSeedDelta = Message("better-styles.eta-noise-seed-delta", "Eta noise seed delta");
const ExcludeDefaultValueFields = Message(
  "better-styles.exclude-default-value-fields",
  "Fields with default values will be excluded"
);
const ExcludeDefaultValueFieldsTooltip = Message(
  "better-styles.exclude-default-value-fields.tooltip",
  "If the field value matches the default value, the field will be excluded and not saved."
);
const Group = Message("better-styles.group", "Group");
const HiresFix = Message("better-styles.hires-fix", "Hires. fix");
const HiresSteps = Message("better-styles.hires-steps", "Hires steps");
const ImportStylesCsv = Message("better-styles.import-styles-csv", "Import styles.csv");
const ImportStylesCsvCancel = Message(
  "better-styles.import-styles-csv.cancel",
  "No, cancel the import of styles.csv"
);
const ImportStylesCsvConfirm = Message(
  "better-styles.import-styles-csv.confirm",
  "Yes, proceed with the import of styles.csv"
);
const ImportStylesCsvDialog = Message(
  "better-styles.import-styles-csv.dialog",
  'Do you want to import the contents of styles.csv into the "styles.csv" group? If the group does not exist, it will be created.'
);
const MoveStyle = Message(
  "better-styles.move-style",
  "Move to a different group using this content"
);
const NegativePrompt = Message("better-styles.negative-prompt", "Negative prompt");
const No = Message("better-styles.no", "No");
const NoAvailableStyles = Message(
  "better-styles.no-available-styles",
  "No styles are available for display."
);
const OverwriteStyle = Message(
  "better-styles.overwrite-style",
  "Apply this content to overwrite the existing style"
);
const Prompt = Message("better-styles.prompt", "Prompt");
const RequiredError = Message(
  "better-styles.required-error",
  "This field is required. Please provide a value."
);
const ResetStyle = Message("better-styles.reset-style", "Reset style");
const ResetStyleCancel = Message("better-styles.reset-style.cancel", "No, cancel the reset action");
const ResetStyleConfirm = Message(
  "better-styles.reset-style.confirm",
  "Yes, proceed with the style reset"
);
const ResetStyleDialog = Message(
  "better-styles.reset-style.dialog",
  "Are you certain you wish to revert all the currently modified styles to their default values?"
);
const RestoreFaces = Message("better-styles.restore-faces", "Restore faces");
const SamplingMethod = Message("better-styles.sampling-method", "Sampling method");
const SamplingSteps = Message("better-styles.sampling-steps", "Sampling steps");
const SaveAsNewStyle = Message(
  "better-styles.save-as-new-style",
  "Save this content as a new style"
);
const Seed = Message("better-styles.seed", "Seed");
const ShowHideComponent = Message("better-styles.show-hide-component", "Show/hide Better Styles");
const ShowStyleDetails = Message("better-styles.show-style-details", "Show style details");
const StyleMoved = Message(
  "better-styles.style-moved",
  "The style has been successfully relocated"
);
const StyleName = Message("better-styles.style-name", "Style name");
const StyleSaved = Message("better-styles.style-saved", "The style has been successfully saved");
const StylesCsvImported = Message(
  "better-styles.styles-csv-imported",
  "The import of styles.csv has been successfully completed"
);
const StylesDeleted = Message(
  "better-styles.styles-deleted",
  "The style has been successfully deleted"
);
const StylesNotRegistered = Message(
  "better-styles.styles-not-registered",
  'Currently, there are no registered styles. To add a new style, press the "Add style" button.'
);
const StylesNotSelected = Message(
  "better-styles.styles-not-selected",
  "No styles have been selected"
);
const Thumbnail = Message("better-styles.thumbnail", "Thumbnail");
const ThumbnailAlt = Message("better-styles.thumbnail-alt", "{0} - Thumbnail");
const ThumbnailEmpty = Message(
  "better-styles.thumbnail-empty",
  "Currently, thumbnail selection is unavailable. Once an image is generated, you will be able to choose a thumbnail."
);
const ThumbnailNotSet = Message(
  "better-styles.thumbnail-not-set",
  "There is no thumbnail set for this style."
);
const ThumbnailSaveError = Message(
  "better-styles.thumbnail-save-error",
  "The thumbnail could not be saved"
);
const Tiling = Message("better-styles.tiling", "Tiling");
const UnsetThumbnail = Message("better-styles.unset-thumbnail", "Unset this thumbnail");
const UpscaleBy = Message("better-styles.upscale-by", "Upscale by");
const Upscaler = Message("better-styles.upscaler", "Upscaler");
const Yes = Message("better-styles.yes", "Yes");

export {
  AddStyle,
  ApplyStyles,
  ApplyThisStyle,
  BetterStyles,
  CardLayout,
  CfgScale,
  CheckpointExclusive,
  CheckpointExclusiveTooltip,
  ClipSkip,
  CloseThumbnailEditor,
  CompactLayout,
  DefaultGroup,
  DeleteStyles,
  DeleteStylesCancel,
  DeleteStylesConfirm,
  DeleteStylesDialog,
  DeleteThisStyle,
  DeleteThisStyleDialog,
  DenoisingStrength,
  DiscardChanges,
  EditThisStyle,
  EditThumbnail,
  Enabled,
  EtaNoiseSeedDelta,
  ExcludeDefaultValueFields,
  ExcludeDefaultValueFieldsTooltip,
  Group,
  HiresFix,
  HiresSteps,
  ImportStylesCsv,
  ImportStylesCsvCancel,
  ImportStylesCsvConfirm,
  ImportStylesCsvDialog,
  MoveStyle,
  NegativePrompt,
  No,
  NoAvailableStyles,
  OverwriteStyle,
  Prompt,
  RequiredError,
  ResetStyle,
  ResetStyleCancel,
  ResetStyleConfirm,
  ResetStyleDialog,
  RestoreFaces,
  SamplingMethod,
  SamplingSteps,
  SaveAsNewStyle,
  Seed,
  ShowHideComponent,
  ShowStyleDetails,
  StyleMoved,
  StyleName,
  StyleSaved,
  StylesCsvImported,
  StylesDeleted,
  StylesNotRegistered,
  StylesNotSelected,
  Thumbnail,
  ThumbnailAlt,
  ThumbnailEmpty,
  ThumbnailNotSet,
  ThumbnailSaveError,
  Tiling,
  UnsetThumbnail,
  UpscaleBy,
  Upscaler,
  Yes,
};
