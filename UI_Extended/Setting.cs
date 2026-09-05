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

        public Setting(IMod mod) : base(mod) { }

        [SettingsUISection(kSection, kGeneralGroup)]
        public bool ShowPanel { get; set; } = true;

        [SettingsUISection(kSection, kDisplayGroup)]
        public bool CompactValues { get; set; } = false;

        [SettingsUISection(kSection, kDisplayGroup)]
        public bool ShowLabels { get; set; } = false;

        [SettingsUISection(kSection, kUpdateGroup)]
        [SettingsUISlider(min = 5, max = 60, step = 1)]
        public int UpdateIntervalSeconds { get; set; } = 15;

        public override void SetDefaults()
        {
            ShowPanel = true;
            CompactValues = false;
            ShowLabels = false;
            UpdateIntervalSeconds = 15;
        }
    }
}
