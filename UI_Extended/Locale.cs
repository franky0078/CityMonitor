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
                    "Reduziert Mehrfachwerte auf die wichtigsten Kennzahlen. Das betrifft Arbeitslosigkeit, Arbeitsplätze, Schulen sowie kombinierte Servicewerte wie Müll und Wasser/Abwasser. Im kompakten Symbolmodus gilt die Auswahl auch für die Hover-Tooltips." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowLabels)), "Beschriftungen anzeigen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowLabels)),
                    "Zeigt neben den Symbolen die Bezeichnungen der Kennzahlen und Stadtservices an." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOnlyMode)), "Kompakter Symbolmodus" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOnlyMode)),
                    "Zeigt nur die Status-Symbole ohne Panel-Hintergrund und Kopfzeile. Ein farbiger Ring zeigt den Zustand an; die aktuellen Werte erscheinen beim Überfahren mit der Maus." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOrientation)), "Ausrichtung der Icon-Leiste" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOrientation)),
                    "Legt fest, ob die Icon-Leiste senkrecht oder waagrecht angezeigt wird." },
                { m_Setting.GetEnumValueLocaleID(IconBarOrientation.Vertical), "Senkrecht" },
                { m_Setting.GetEnumValueLocaleID(IconBarOrientation.Horizontal), "Waagrecht" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconPositionLocked)), "Icon-Leiste fixieren" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconPositionLocked)),
                    "Fixiert die Icon-Leiste an ihrer aktuellen Position. Ist die Option deaktiviert, kann die Leiste mit der Maus verschoben werden." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconVisibilityEditMode)), "Symbole bearbeiten" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconVisibilityEditMode)),
                    "Aktiviert den Bearbeitungsmodus für die Symbolleiste. Symbole können mit gedrückter linker Maustaste in eine neue Reihenfolge gezogen und mit Rechtsklick ein- oder ausgeblendet werden. Sichtbare Symbole werden vollständig deckend dargestellt, ausgeblendete Symbole mit 60 % Transparenz. Nach dem Deaktivieren werden ausgeblendete Symbole verborgen und für sichtbare Symbole wieder die eingestellte Icon-Transparenz verwendet." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconBackgroundTransparency)), "Icon-Transparenz (%)" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconBackgroundTransparency)),
                    "Steuert die Transparenz des kompletten Symbols im kompakten Symbolmodus. 0 % = vollständig sichtbar, 100 % = maximal transparent. Betroffen sind Symbol, farbiger Ring und die dunkle Kreisfläche; der Hover-Tooltip bleibt normal sichtbar." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconSize)), "Icon-Größe" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconSize)),
                    "Legt die Größe der runden Status-Symbole im kompakten Symbolmodus fest. Bereich: 22 bis 50." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconGap)), "Icon-Abstand" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconGap)),
                    "Legt den Abstand zwischen den Status-Symbolen im kompakten Symbolmodus fest. Bereich: 0 bis 20." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowAllIcons)), "Alle Icons einblenden" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowAllIcons)),
                    "Blendet alle Symbole wieder ein, die im kompakten Symbolmodus per Rechtsklick ausgeblendet wurden." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ResetIconOrder)), "Symbolreihenfolge zurücksetzen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ResetIconOrder)),
                    "Stellt die Standardreihenfolge der Symbole im kompakten Symbolmodus wieder her." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UpdateIntervalSeconds)), "Aktualisierungsintervall" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UpdateIntervalSeconds)),
                    "Legt fest, wie oft Arbeitslosigkeit, Arbeitsplätze und Schulwerte neu berechnet werden. Bereich: 5 bis 60 Sekunden. Die Serviceanzeigen verwenden die Spiel-Bindings direkt. Ausgeblendete Symbole werden nicht neu berechnet bzw. nicht abonniert." },

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

                { "UI_Extended.CityMonitor.HideIcon", "Rechtsklick: Symbol ausblenden" },
                { "UI_Extended.CityMonitor.ShowIcon", "Rechtsklick: Symbol einblenden" },
                { "UI_Extended.CityMonitor.ReorderIcon", "Ziehen: Reihenfolge ändern" },
                { "UI_Extended.CityMonitor.Hidden", "Ausgeblendet" },
                { "UI_Extended.CityMonitor.Fire", "Feuerwehr" },
                { "UI_Extended.CityMonitor.FireHazard", "Brandgefahr" },
                { "UI_Extended.CityMonitor.Healthcare", "Krankenhaus" },
                { "UI_Extended.CityMonitor.Cemetery", "Friedhof" },
                { "UI_Extended.CityMonitor.Garbage", "Müll" },
                { "UI_Extended.CityMonitor.Processing", "Verarbeitung" },
                { "UI_Extended.CityMonitor.Landfill", "Deponie frei" },
                { "UI_Extended.CityMonitor.TrafficFlow", "Verkehrsfluss" },
                { "UI_Extended.CityMonitor.Electricity", "Strom" },
                { "UI_Extended.CityMonitor.WaterSewage", "Wasser / Abwasser" },
                { "UI_Extended.CityMonitor.Water", "Wasser" },
                { "UI_Extended.CityMonitor.Sewage", "Abwasser" },
                { "UI_Extended.CityMonitor.Availability", "Verfügbarkeit" },
                { "UI_Extended.CityMonitor.CarParking", "Parkplätze Auto" },
                { "UI_Extended.CityMonitor.BikeParking", "Parkplätze Fahrrad" },
                { "UI_Extended.CityMonitor.Post", "Post" },
                { "UI_Extended.CityMonitor.Tourism", "Tourismus" },
                { "UI_Extended.CityMonitor.Tourists", "Touristen" },
                { "UI_Extended.CityMonitor.Attractiveness", "Stadtattraktivität" },
            };
        }

        public void Unload() { }
    }
}
