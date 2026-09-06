using Colossal.IO.AssetDatabase;
using Game.Modding;
using Game.Settings;

namespace CityMonitor
{
    public enum IconBarOrientation
    {
        Vertical = 0,
        Horizontal = 1
    }

    [FileLocation(nameof(CityMonitor))]
    [SettingsUIGroupOrder(
        kGeneralGroup,
        kDisplayGroup,
        kUpdateGroup,
        kAboutGroup)]
    [SettingsUIShowGroupName(
        kGeneralGroup,
        kDisplayGroup,
        kUpdateGroup,
        kAboutGroup)]
    public class Setting : ModSetting
    {
        public const string kSection = "MainSection";
        public const string kGeneralGroup = "Allgemein";
        public const string kDisplayGroup = "Anzeige";
        public const string kUpdateGroup = "Aktualisierung";
        public const string kAboutGroup = "About";

        // Interner UI-Zustand
        [SettingsUIHidden]
        public string UiState { get; set; } = "";

        [SettingsUIHidden]
        public string HiddenIcons { get; set; } = "[]";

        [SettingsUIHidden]
        public string IconOrder { get; set; } = "[]";

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
        public IconBarOrientation IconOrientation { get; set; } =
            IconBarOrientation.Vertical;

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

        [SettingsUIButton]
        [SettingsUISection(kSection, kDisplayGroup)]
        [SettingsUIHideByCondition(typeof(Setting), nameof(IsIconOnlyModeDisabled))]
        public bool ResetIconOrder
        {
            set
            {
                IconOrder = "[]";
                ApplyAndSave();
            }
        }

        [SettingsUISection(kSection, kUpdateGroup)]
        [SettingsUISlider(min = 5, max = 60, step = 1)]
        public int UpdateIntervalSeconds { get; set; } = 15;

        // Versionsanzeige aus der Assembly
        [SettingsUISection(kSection, kAboutGroup)]
        public string ModVersion =>
            typeof(Mod).Assembly.GetName().Version?.ToString(3) ?? "1.0.0";

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
            IconOrientation = IconBarOrientation.Vertical;
            IconPositionLocked = false;
            IconVisibilityEditMode = false;
            IconBackgroundTransparency = 40;
            IconSize = 30;
            IconGap = 5;
            HiddenIcons = "[]";
            IconOrder = "[]";
            UpdateIntervalSeconds = 15;
        }
    }
}
