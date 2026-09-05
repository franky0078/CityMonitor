using Colossal.IO.AssetDatabase;
using Game.Modding;
using Game.Settings;

namespace UI_Extended
{
    [FileLocation(nameof(UI_Extended))]
    [SettingsUIGroupOrder(
        kGeneralGroup,
        kDisplayGroup,
        kUpdateGroup)]
    [SettingsUIShowGroupName(
        kGeneralGroup,
        kDisplayGroup,
        kUpdateGroup)]
    public class Setting : ModSetting
    {
        public const string kSection = "MainSection";
        public const string kGeneralGroup = "Allgemein";
        public const string kDisplayGroup = "Anzeige";
        public const string kUpdateGroup = "Aktualisierung";

        // Interner Zustand des verschiebbaren Panels. Nicht in den Optionen anzeigen.
        [SettingsUIHidden]
        public string UiState { get; set; } = "";

        // JSON-Array mit den per Rechtsklick ausgeblendeten Symbol-IDs.
        [SettingsUIHidden]
        public string HiddenIcons { get; set; } = "[]";

        public Setting(IMod mod) : base(mod) { }

        [SettingsUISection(kSection, kGeneralGroup)]
        public bool ShowPanel { get; set; } = true;

        [SettingsUISection(kSection, kDisplayGroup)]
        public bool CompactValues { get; set; } = false;

        [SettingsUISection(kSection, kDisplayGroup)]
        public bool ShowLabels { get; set; } = false;

        [SettingsUISection(kSection, kDisplayGroup)]
        public bool IconOnlyMode { get; set; } = false;

        [SettingsUISection(kSection, kDisplayGroup)]
        [SettingsUIHideByCondition(typeof(Setting), nameof(IsIconOnlyModeDisabled))]
        public bool IconPositionLocked { get; set; } = false;

        [SettingsUISection(kSection, kDisplayGroup)]
        [SettingsUIHideByCondition(typeof(Setting), nameof(IsIconOnlyModeDisabled))]
        public bool IconVisibilityEditMode { get; set; } = false;

        [SettingsUISection(kSection, kDisplayGroup)]
        [SettingsUIHideByCondition(typeof(Setting), nameof(IsIconOnlyModeDisabled))]
        [SettingsUISlider(min = 0, max = 100, step = 5)]
        public int IconBackgroundTransparency { get; set; } = 40;

        [SettingsUISection(kSection, kDisplayGroup)]
        [SettingsUIHideByCondition(typeof(Setting), nameof(IsIconOnlyModeDisabled))]
        [SettingsUISlider(min = 22, max = 50, step = 2)]
        public int IconSize { get; set; } = 30;

        [SettingsUISection(kSection, kDisplayGroup)]
        [SettingsUIHideByCondition(typeof(Setting), nameof(IsIconOnlyModeDisabled))]
        [SettingsUISlider(min = 0, max = 20, step = 1)]
        public int IconGap { get; set; } = 5;

        [SettingsUIButton]
        [SettingsUISection(kSection, kDisplayGroup)]
        [SettingsUIHideByCondition(typeof(Setting), nameof(IsIconOnlyModeDisabled))]
        public bool ShowAllIcons
        {
            set
            {
                HiddenIcons = "[]";
                ApplyAndSave();
            }
        }

        [SettingsUISection(kSection, kUpdateGroup)]
        [SettingsUISlider(min = 5, max = 60, step = 1)]
        public int UpdateIntervalSeconds { get; set; } = 15;

        public bool IsIconOnlyModeDisabled()
        {
            return !IconOnlyMode;
        }

        public override void SetDefaults()
        {
            ShowPanel = true;
            CompactValues = false;
            ShowLabels = false;
            IconOnlyMode = false;
            IconPositionLocked = false;
            IconVisibilityEditMode = false;
            IconBackgroundTransparency = 40;
            IconSize = 30;
            IconGap = 5;
            HiddenIcons = "[]";
            UpdateIntervalSeconds = 15;
        }
    }
}
