using System.Collections.Generic;
using Colossal;

namespace UI_Extended
{
    public class LocaleDE : IDictionarySource
    {
        private readonly Setting m_Setting;
        public LocaleDE(Setting setting) { m_Setting = setting; }

        public IEnumerable<KeyValuePair<string, string>> ReadEntries(
            IList<IDictionaryEntryError> errors, Dictionary<string, int> indexCounts)
        {
            return new Dictionary<string, string>
            {
                // Name des Mods in der Optionen-Liste (ersetzt den Platzhalter!)
                { m_Setting.GetSettingsLocaleID(), "Stadt Monitor" },
                { m_Setting.GetOptionTabLocaleID(Setting.kSection), "Allgemein" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kGeneralGroup), "Allgemein" },

                // Beschriftung + Tooltip der Option
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowPanel)), "Panel anzeigen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowPanel)),
                    "Blendet das Stadt-Monitor-Panel im Spiel ein oder aus." },
            };
        }

        public void Unload() { }
    }
}