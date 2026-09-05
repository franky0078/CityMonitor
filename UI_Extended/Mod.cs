using Colossal.Logging;
using Game;
using Game.Modding;
using Game.SceneFlow;
using Colossal.IO.AssetDatabase;

namespace UI_Extended
{
    public class Mod : IMod
    {
        public static ILog Log =
            LogManager.GetLogger($"{nameof(UI_Extended)}")
                .SetShowsErrorsInUI(false);

        private EmploymentUISystem _uiSystem;

        public static Setting Setting { get; private set; }

        public void OnLoad(UpdateSystem updateSystem)
        {
            Log.Info(nameof(OnLoad));

            if (GameManager.instance.modManager.TryGetExecutableAsset(this, out var asset))
            {
                Log.Info($"Mod wurde geladen von: {asset.path}");
            }

            // Settings und Lokalisierung einrichten
            Setting = new Setting(this);
            Setting.RegisterInOptionsUI();

            GameManager.instance.localizationManager.AddSource(
                "en-US",
                new LocaleEN(Setting));

            GameManager.instance.localizationManager.AddSource(
                "de-DE",
                new LocaleDE(Setting));

            AssetDatabase.global.LoadSettings(
                nameof(UI_Extended),
                Setting,
                new Setting(this));

            // System registrieren
            _uiSystem = new EmploymentUISystem();
            updateSystem.UpdateAt<EmploymentUISystem>(
                SystemUpdatePhase.UIUpdate);

            Log.Info("EmploymentUISystem wurde gestartet.");
        }

        public void OnDispose()
        {
            Log.Info(nameof(OnDispose));

            if (Setting != null)
            {
                Setting.UnregisterInOptionsUI();
                Setting = null;
            }
        }
    }
}
