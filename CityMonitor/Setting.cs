using Colossal.IO.AssetDatabase;
using Game.Modding;
using Game.Settings;
using Game.UI;

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
        kPopulationThresholdGroup,
        kCapacityThresholdGroup,
        kRiskThresholdGroup,
        kAboutGroup)]
    [SettingsUIShowGroupName(
        kGeneralGroup,
        kDisplayGroup,
        kUpdateGroup,
        kPopulationThresholdGroup,
        kCapacityThresholdGroup,
        kRiskThresholdGroup,
        kAboutGroup)]
    public class Setting : ModSetting
    {
        public const string kSection = "MainSection";
        public const string kThresholdSection = "ColorThresholdSection";
        public const string kGeneralGroup = "Allgemein";
        public const string kDisplayGroup = "Anzeige";
        public const string kUpdateGroup = "Aktualisierung";
        public const string kPopulationThresholdGroup = "PopulationThresholds";
        public const string kCapacityThresholdGroup = "CapacityThresholds";
        public const string kRiskThresholdGroup = "RiskThresholds";
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
            IconBarOrientation.Horizontal;

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
        [SettingsUISlider(
            min = 0.5f,
            max = 60f,
            step = 0.5f,
            scalarMultiplier = 1f,
            unit = Unit.kFloatSingleFraction)]
        public float UpdateIntervalSeconds { get; set; } = 15f;

        [SettingsUISection(kThresholdSection, kPopulationThresholdGroup)]
        [SettingsUISlider(min = 0, max = 30, step = 1, unit = Unit.kPercentage)]
        public int UnemploymentGreenMax { get; set; } = 5;

        [SettingsUISection(kThresholdSection, kPopulationThresholdGroup)]
        [SettingsUISlider(min = 0, max = 30, step = 1, unit = Unit.kPercentage)]
        public int UnemploymentYellowMax { get; set; } = 10;

        [SettingsUISection(kThresholdSection, kPopulationThresholdGroup)]
        [SettingsUISlider(min = 0, max = 20, step = 1, unit = Unit.kPercentage)]
        public int HomelessGreenMax { get; set; } = 1;

        [SettingsUISection(kThresholdSection, kPopulationThresholdGroup)]
        [SettingsUISlider(min = 0, max = 20, step = 1, unit = Unit.kPercentage)]
        public int HomelessYellowMax { get; set; } = 3;

        [SettingsUISection(kThresholdSection, kPopulationThresholdGroup)]
        [SettingsUISlider(min = 0, max = 30, step = 1, unit = Unit.kPercentage)]
        public int OpenJobsYellowMin { get; set; } = 1;

        [SettingsUISection(kThresholdSection, kPopulationThresholdGroup)]
        [SettingsUISlider(min = 0, max = 30, step = 1, unit = Unit.kPercentage)]
        public int OpenJobsGreenMin { get; set; } = 5;

        [SettingsUISection(kThresholdSection, kCapacityThresholdGroup)]
        [SettingsUISlider(min = 0, max = 50, step = 1, unit = Unit.kPercentage)]
        public int SchoolYellowMin { get; set; } = 3;

        [SettingsUISection(kThresholdSection, kCapacityThresholdGroup)]
        [SettingsUISlider(min = 0, max = 50, step = 1, unit = Unit.kPercentage)]
        public int SchoolGreenMin { get; set; } = 10;

        [SettingsUISection(kThresholdSection, kCapacityThresholdGroup)]
        [SettingsUISlider(min = 0, max = 100, step = 5, unit = Unit.kPercentage)]
        public int AvailabilityYellowMin { get; set; } = 40;

        [SettingsUISection(kThresholdSection, kCapacityThresholdGroup)]
        [SettingsUISlider(min = 0, max = 100, step = 5, unit = Unit.kPercentage)]
        public int AvailabilityGreenMin { get; set; } = 60;

        [SettingsUISection(kThresholdSection, kCapacityThresholdGroup)]
        [SettingsUISlider(min = 0, max = 100, step = 5, unit = Unit.kPercentage)]
        public int TrafficYellowMin { get; set; } = 50;

        [SettingsUISection(kThresholdSection, kCapacityThresholdGroup)]
        [SettingsUISlider(min = 0, max = 100, step = 5, unit = Unit.kPercentage)]
        public int TrafficGreenMin { get; set; } = 70;

        [SettingsUISection(kThresholdSection, kRiskThresholdGroup)]
        [SettingsUISlider(min = 0, max = 100, step = 1, unit = Unit.kPercentage)]
        public int FireHazardGreenMax { get; set; } = 33;

        [SettingsUISection(kThresholdSection, kRiskThresholdGroup)]
        [SettingsUISlider(min = 0, max = 100, step = 1, unit = Unit.kPercentage)]
        public int FireHazardYellowMax { get; set; } = 66;

        [SettingsUISection(kThresholdSection, kRiskThresholdGroup)]
        [SettingsUISlider(min = 0, max = 100, step = 1, unit = Unit.kPercentage)]
        public int CrimeRiskGreenMax { get; set; } = 33;

        [SettingsUISection(kThresholdSection, kRiskThresholdGroup)]
        [SettingsUISlider(min = 0, max = 100, step = 1, unit = Unit.kPercentage)]
        public int CrimeRiskYellowMax { get; set; } = 66;

        [SettingsUIButton]
        [SettingsUISection(kThresholdSection, kRiskThresholdGroup)]
        public bool ResetColorThresholds
        {
            set
            {
                SetColorThresholdDefaults();
                ApplyAndSave();
            }
        }

        // Versionsanzeige aus der Assembly
        [SettingsUISection(kSection, kAboutGroup)]
        public string ModVersion =>
            typeof(Mod).Assembly.GetName().Version?.ToString(3) ?? "1.1.0";

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
            IconOrientation = IconBarOrientation.Horizontal;
            IconPositionLocked = false;
            IconVisibilityEditMode = false;
            IconBackgroundTransparency = 40;
            IconSize = 30;
            IconGap = 5;
            HiddenIcons = "[]";
            IconOrder = "[]";
            UpdateIntervalSeconds = 15f;
            SetColorThresholdDefaults();
        }

        private void SetColorThresholdDefaults()
        {
            UnemploymentGreenMax = 5;
            UnemploymentYellowMax = 10;
            HomelessGreenMax = 1;
            HomelessYellowMax = 3;
            OpenJobsYellowMin = 1;
            OpenJobsGreenMin = 5;
            SchoolYellowMin = 3;
            SchoolGreenMin = 10;
            AvailabilityYellowMin = 40;
            AvailabilityGreenMin = 60;
            TrafficYellowMin = 50;
            TrafficGreenMin = 70;
            FireHazardGreenMax = 33;
            FireHazardYellowMax = 66;
            CrimeRiskGreenMax = 33;
            CrimeRiskYellowMax = 66;
        }
    }
}
