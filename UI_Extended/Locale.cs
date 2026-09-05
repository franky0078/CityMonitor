﻿using System.Collections.Generic;
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
                { m_Setting.GetSettingsLocaleID(), "Stadt Monitor" },
                { m_Setting.GetOptionTabLocaleID(Setting.kSection), "Allgemein" },

                { m_Setting.GetOptionGroupLocaleID(Setting.kGeneralGroup), "Allgemein" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kDisplayGroup), "Anzeige" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kUpdateGroup), "Aktualisierung" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowPanel)), "Panel anzeigen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowPanel)),
                    "Blendet den Stadt-Monitor inklusive Schaltfläche im Spiel ein oder aus." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CompactValues)), "Nur relevante Werte anzeigen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CompactValues)),
                    "Zeigt nur die Arbeitslosenquote, die Anzahl der freien Arbeitsplätze und die freien Schulplätze. Die absolute Zahl der Arbeitslosen sowie Gesamt-/Belegungswerte werden ausgeblendet." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowLabels)), "Beschriftungen anzeigen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowLabels)),
                    "Zeigt neben den Symbolen die Bezeichnungen wie Quote, Offene Stellen, Grundschule, Oberschule, College und Universität an." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOnlyMode)), "Kompakter Symbolmodus" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOnlyMode)),
                    "Zeigt nur die Status-Symbole ohne Panel-Hintergrund und Kopfzeile. Ein farbiger Ring zeigt den Zustand an; die aktuellen Werte erscheinen beim Überfahren mit der Maus. Beschriftungen und die normale Wertdarstellung werden in diesem Modus ignoriert." },

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
                    "Legt fest, wie oft die Werte des Stadt-Monitors neu berechnet werden. Bereich: 5 bis 60 Sekunden. Kürzere Intervalle benötigen etwas mehr Rechenleistung." },
            };
        }

        public void Unload() { }
    }
}
