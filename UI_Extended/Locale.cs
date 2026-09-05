using System.Collections.Generic;
using Colossal;

namespace UI_Extended
{
    public class LocaleDE : IDictionarySource
    {
        private readonly Setting m_Setting;

        public LocaleDE(Setting setting)
        {
            m_Setting = setting;
        }

        public IEnumerable<KeyValuePair<string, string>> ReadEntries(
            IList<IDictionaryEntryError> errors,
            Dictionary<string, int> indexCounts)
        {
            return new Dictionary<string, string>
            {
                { m_Setting.GetSettingsLocaleID(), "City Monitor" },
                { m_Setting.GetOptionTabLocaleID(Setting.kSection), "Allgemein" },

                { m_Setting.GetOptionGroupLocaleID(Setting.kGeneralGroup), "Allgemein" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kDisplayGroup), "Anzeige" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kUpdateGroup), "Aktualisierung" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowPanel)), "Panel anzeigen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowPanel)),
                    "Blendet den City Monitor inklusive Schaltfläche im Spiel ein oder aus." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CompactValues)), "Nur relevante Werte anzeigen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CompactValues)),
                    "Zeigt nur die Arbeitslosenquote, die Anzahl der freien Arbeitsplätze und die freien Schulplätze. Im kompakten Symbolmodus gilt diese Auswahl auch für die Hover-Tooltips. Ist die Option deaktiviert, werden dort zusätzlich Arbeitslosenzahl bzw. Gesamtplätze angezeigt." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowLabels)), "Beschriftungen anzeigen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowLabels)),
                    "Zeigt neben den Symbolen die Bezeichnungen wie Quote, Offene Stellen, Grundschule, Oberschule, College und Universität an." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOnlyMode)), "Kompakter Symbolmodus" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOnlyMode)),
                    "Zeigt nur die Status-Symbole ohne Panel-Hintergrund und Kopfzeile. Ein farbiger Ring zeigt den Zustand an; die aktuellen Werte erscheinen beim Überfahren mit der Maus. Beschriftungen und die normale Wertdarstellung werden in diesem Modus ignoriert." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconPositionLocked)), "Icon-Leiste fixieren" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconPositionLocked)),
                    "Fixiert die Icon-Leiste an ihrer aktuellen Position. Ist die Option deaktiviert, kann die Leiste mit der Maus verschoben werden." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconBackgroundTransparency)), "Icon-Transparenz (%)" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconBackgroundTransparency)),
                    "Steuert die Transparenz des kompletten Symbols im kompakten Symbolmodus. 0 % = vollständig sichtbar, 100 % = maximal transparent. Betroffen sind Symbol, farbiger Ring und die dunkle Kreisfläche; der Hover-Tooltip bleibt normal sichtbar." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconSize)), "Icon-Größe" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconSize)),
                    "Legt die Größe der runden Status-Symbole im kompakten Symbolmodus fest. Bereich: 22 bis 50." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconGap)), "Icon-Abstand" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconGap)),
                    "Legt den vertikalen Abstand zwischen den Status-Symbolen im kompakten Symbolmodus fest. Bereich: 0 bis 20." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UpdateIntervalSeconds)), "Aktualisierungsintervall" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UpdateIntervalSeconds)),
                    "Legt fest, wie oft die Werte des City Monitors neu berechnet werden. Bereich: 5 bis 60 Sekunden. Kürzere Intervalle benötigen etwas mehr Rechenleistung." },

                // Laufzeit-UI
                { "UI_Extended.CityMonitor.Toggle", "City Monitor ein-/ausblenden" },
                { "UI_Extended.CityMonitor.Drag", "Zum Verschieben ziehen" },
                { "UI_Extended.CityMonitor.PositionLocked", "Position fixiert" },
                { "UI_Extended.CityMonitor.CollapseExpand", "Ein-/ausklappen" },
                { "UI_Extended.CityMonitor.Resize", "Breite ziehen" },

                { "UI_Extended.CityMonitor.Unemployment", "Arbeitslosigkeit" },
                { "UI_Extended.CityMonitor.UnemploymentRate", "Quote" },
                { "UI_Extended.CityMonitor.Unemployed", "Arbeitslose" },

                { "UI_Extended.CityMonitor.Jobs", "Arbeitsplätze" },
                { "UI_Extended.CityMonitor.OpenJobs", "Offene Stellen" },
                { "UI_Extended.CityMonitor.Open", "Offen" },
                { "UI_Extended.CityMonitor.Free", "Frei" },
                { "UI_Extended.CityMonitor.Total", "Gesamt" },

                { "UI_Extended.CityMonitor.ElementarySchool", "Grundschule" },
                { "UI_Extended.CityMonitor.HighSchool", "Oberschule" },
                { "UI_Extended.CityMonitor.College", "College" },
                { "UI_Extended.CityMonitor.University", "Universität" },
            };
        }

        public void Unload() { }
    }
}
