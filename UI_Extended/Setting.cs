using Colossal.IO.AssetDatabase;
using Game.Modding;
using Game.Settings;

namespace UI_Extended
{
    [FileLocation(nameof(UI_Extended))]
    [SettingsUIGroupOrder(kGeneralGroup)]
    [SettingsUIShowGroupName(kGeneralGroup)]
    [SettingsUIHidden]

    public class Setting : ModSetting
    {
        public const string kSection = "MainSection";
        public const string kGeneralGroup = "Allgemein";
        public string UiState { get; set; } = "";

        public Setting(IMod mod) : base(mod) { }

        [SettingsUISection(kSection, kGeneralGroup)]
        public bool ShowPanel { get; set; } = true;

        public override void SetDefaults()
        {
            ShowPanel = true;
        }
    }
}