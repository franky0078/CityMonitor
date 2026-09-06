using System.Collections.Generic;
using Colossal;

namespace CityMonitor
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
                { m_Setting.GetOptionGroupLocaleID(Setting.kAboutGroup), "Über die Mod" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowPanel)), "Panel anzeigen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowPanel)),
                    "Blendet den City Monitor inklusive Schaltfläche im Spiel ein oder aus." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CompactValues)), "Nur relevante Werte anzeigen" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CompactValues)),
                    "Reduziert Mehrfachwerte auf die wichtigsten Kennzahlen. Das betrifft Arbeitslosigkeit, Obdachlosigkeit, Arbeitsplätze, Schulen sowie kombinierte Servicewerte wie Wasser/Abwasser. Im kompakten Symbolmodus gilt die Auswahl auch für die Hover-Tooltips." },

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
                    "Aktiviert den Bearbeitungsmodus für die Symbolleiste. Symbole können mit gedrückter linker Maustaste in eine neue Reihenfolge gezogen und mit Rechtsklick ein- oder ausgeblendet werden. Sichtbare Symbole werden vollständig deckend dargestellt, ausgeblendete Symbole mit 55 % Transparenz. Nach dem Deaktivieren werden ausgeblendete Symbole verborgen und für sichtbare Symbole wieder die eingestellte Icon-Transparenz verwendet." },

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

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ModVersion)), "Version" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ModVersion)),
                    "Aktuell installierte Version des City Monitors." },

                // Laufzeit-UI
                { "CityMonitor.Toggle", "City Monitor ein-/ausblenden" },
                { "CityMonitor.Drag", "Griff ziehen, um Leiste zu verschieben" },
                { "CityMonitor.PositionLocked", "Position fixiert" },
                { "CityMonitor.CollapseExpand", "Ein-/ausklappen" },
                { "CityMonitor.Resize", "Breite ziehen" },

                { "CityMonitor.Unemployment", "Arbeitslosigkeit" },
                { "CityMonitor.UnemploymentRate", "Quote" },
                { "CityMonitor.Unemployed", "Arbeitslose" },
                { "CityMonitor.Homeless", "Obdachlosigkeit" },
                { "CityMonitor.HomelessRate", "Quote" },
                { "CityMonitor.HomelessPeople", "Obdachlose" },

                { "CityMonitor.Jobs", "Arbeitsplätze" },
                { "CityMonitor.OpenJobs", "Offene Stellen" },
                { "CityMonitor.Open", "Offen" },
                { "CityMonitor.Free", "Frei" },
                { "CityMonitor.Total", "Gesamt" },

                { "CityMonitor.ElementarySchool", "Grundschule" },
                { "CityMonitor.HighSchool", "Oberschule" },
                { "CityMonitor.College", "College" },
                { "CityMonitor.University", "Universität" },

                { "CityMonitor.HideIcon", "Rechtsklick: Symbol ausblenden" },
                { "CityMonitor.ShowIcon", "Rechtsklick: Symbol einblenden" },
                { "CityMonitor.ReorderIcon", "Ziehen: Reihenfolge ändern" },
                { "CityMonitor.Hidden", "Ausgeblendet" },
                { "CityMonitor.Fire", "Feuerwehr" },
                { "CityMonitor.FireHazard", "Brandgefahr" },
                { "CityMonitor.Healthcare", "Krankenhaus" },
                { "CityMonitor.Cemetery", "Friedhof" },
                { "CityMonitor.Crematorium", "Krematorium" },
                { "CityMonitor.Garbage", "Müll" },
                { "CityMonitor.GarbageProcessing", "Müllverarbeitung" },
                { "CityMonitor.GarbageProduction", "Müll" },
                { "CityMonitor.Processing", "Verarbeitung" },
                { "CityMonitor.ProcessingRate", "Verarbeitung" },
                { "CityMonitor.Status", "Status" },
                { "CityMonitor.Landfill", "Deponie" },
                { "CityMonitor.Police", "Polizei" },
                { "CityMonitor.CrimeProbability", "Kriminalitätsrisiko" },
                { "CityMonitor.JailAvailability", "Gefängnis frei" },
                { "CityMonitor.CrimePerMonth", "Straftaten / Monat" },
                { "CityMonitor.TrafficFlow", "Verkehrsfluss" },
                { "CityMonitor.Electricity", "Strom" },
                { "CityMonitor.WaterSewage", "Wasser / Abwasser" },
                { "CityMonitor.Water", "Wasser" },
                { "CityMonitor.Sewage", "Abwasser" },
                { "CityMonitor.Availability", "Verfügbarkeit" },
                { "CityMonitor.CarParking", "Parkplätze Auto" },
                { "CityMonitor.BikeParking", "Parkplätze Fahrrad" },
                { "CityMonitor.Post", "Post" },
                { "CityMonitor.Tourism", "Tourismus" },
                { "CityMonitor.Tourists", "Touristen" },
                { "CityMonitor.Attractiveness", "Stadtattraktivität" },
            };
        }

        public void Unload() { }
    }
}
