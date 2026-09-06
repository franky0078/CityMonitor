using System.Collections.Generic;
using Colossal;

namespace CityMonitor
{
    public class LocaleEN : IDictionarySource
    {
        private readonly Setting m_Setting;

        public LocaleEN(Setting setting)
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
                { m_Setting.GetOptionTabLocaleID(Setting.kSection), "General" },

                { m_Setting.GetOptionGroupLocaleID(Setting.kGeneralGroup), "General" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kDisplayGroup), "Display" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kUpdateGroup), "Update" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kAboutGroup), "About" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowPanel)), "Show panel" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowPanel)),
                    "Shows or hides the City Monitor, including its in-game toggle button." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CompactValues)), "Show relevant values only" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CompactValues)),
                    "Reduces multi-value indicators to their most relevant values. This applies to unemployment, homelessness, jobs, schools, and combined service indicators such as water/sewage. In compact icon mode, the same setting also applies to hover tooltips." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowLabels)), "Show labels" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowLabels)),
                    "Shows the names of indicators and city services next to their icons." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOnlyMode)), "Compact icon mode" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOnlyMode)),
                    "Shows only the status icons without the panel background or header. A colored ring indicates the current status, and values are shown on hover." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOrientation)), "Icon bar orientation" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOrientation)),
                    "Sets whether the icon bar is displayed vertically or horizontally." },
                { m_Setting.GetEnumValueLocaleID(IconBarOrientation.Vertical), "Vertical" },
                { m_Setting.GetEnumValueLocaleID(IconBarOrientation.Horizontal), "Horizontal" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconPositionLocked)), "Lock icon bar" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconPositionLocked)),
                    "Locks the icon bar at its current position. When disabled, the bar can be moved with the mouse." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconVisibilityEditMode)), "Edit icons" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconVisibilityEditMode)),
                    "Enables icon bar editing. Drag icons with the left mouse button to change their order and right-click an icon to hide it or make it visible again. Visible icons are shown fully opaque, while hidden icons are shown with 55% transparency. When editing is disabled, hidden icons disappear and visible icons return to the configured icon transparency." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconBackgroundTransparency)), "Icon transparency (%)" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconBackgroundTransparency)),
                    "Controls the transparency of the complete icon in compact icon mode. 0% = fully visible, 100% = maximum transparency. The icon, colored status ring, and dark circular background are affected; the hover tooltip remains fully visible." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconSize)), "Icon size" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconSize)),
                    "Sets the size of the round status icons in compact icon mode. Range: 22 to 50." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconGap)), "Icon spacing" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconGap)),
                    "Sets the spacing between status icons in compact icon mode. Range: 0 to 20." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowAllIcons)), "Show all icons" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowAllIcons)),
                    "Restores all icons that were hidden with a right-click in compact icon mode." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ResetIconOrder)), "Reset icon order" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ResetIconOrder)),
                    "Restores the default icon order in compact icon mode." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UpdateIntervalSeconds)), "Update interval" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UpdateIntervalSeconds)),
                    "Sets how often unemployment, jobs, and school values are recalculated. Range: 5 to 60 seconds. Service indicators use the game bindings directly. Hidden icons are not recalculated or subscribed." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ModVersion)), "Version" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ModVersion)),
                    "Currently installed version of City Monitor." },

                // Runtime UI
                { "CityMonitor.Toggle", "Toggle City Monitor" },
                { "CityMonitor.Drag", "Drag handle to move icon bar" },
                { "CityMonitor.PositionLocked", "Position locked" },
                { "CityMonitor.CollapseExpand", "Collapse / expand" },
                { "CityMonitor.Resize", "Drag to resize" },

                { "CityMonitor.Unemployment", "Unemployment" },
                { "CityMonitor.UnemploymentRate", "Rate" },
                { "CityMonitor.Unemployed", "Unemployed" },
                { "CityMonitor.Homeless", "Homelessness" },
                { "CityMonitor.HomelessRate", "Rate" },
                { "CityMonitor.HomelessPeople", "Homeless people" },

                { "CityMonitor.Jobs", "Jobs" },
                { "CityMonitor.OpenJobs", "Open jobs" },
                { "CityMonitor.Open", "Open" },
                { "CityMonitor.Free", "Free" },
                { "CityMonitor.Total", "Total" },

                { "CityMonitor.ElementarySchool", "Elementary School" },
                { "CityMonitor.HighSchool", "High School" },
                { "CityMonitor.College", "College" },
                { "CityMonitor.University", "University" },

                { "CityMonitor.HideIcon", "Right-click: hide icon" },
                { "CityMonitor.ShowIcon", "Right-click: show icon" },
                { "CityMonitor.ReorderIcon", "Drag: change order" },
                { "CityMonitor.Hidden", "Hidden" },
                { "CityMonitor.Fire", "Fire & Rescue" },
                { "CityMonitor.FireHazard", "Fire hazard" },
                { "CityMonitor.Healthcare", "Healthcare" },
                { "CityMonitor.Cemetery", "Cemetery" },
                { "CityMonitor.Crematorium", "Crematorium" },
                { "CityMonitor.Garbage", "Garbage" },
                { "CityMonitor.GarbageProcessing", "Garbage processing" },
                { "CityMonitor.GarbageProduction", "Garbage" },
                { "CityMonitor.Processing", "Processing" },
                { "CityMonitor.ProcessingRate", "Processing" },
                { "CityMonitor.Status", "Status" },
                { "CityMonitor.Landfill", "Landfill" },
                { "CityMonitor.Police", "Police" },
                { "CityMonitor.CrimeProbability", "Crime probability" },
                { "CityMonitor.JailAvailability", "Jail availability" },
                { "CityMonitor.CrimePerMonth", "Crimes / month" },
                { "CityMonitor.TrafficFlow", "Traffic flow" },
                { "CityMonitor.Electricity", "Electricity" },
                { "CityMonitor.WaterSewage", "Water / Sewage" },
                { "CityMonitor.Water", "Water" },
                { "CityMonitor.Sewage", "Sewage" },
                { "CityMonitor.Availability", "Availability" },
                { "CityMonitor.CarParking", "Car parking" },
                { "CityMonitor.BikeParking", "Bicycle parking" },
                { "CityMonitor.Post", "Post service" },
                { "CityMonitor.Tourism", "Tourism" },
                { "CityMonitor.Tourists", "Tourists" },
                { "CityMonitor.Attractiveness", "City attractiveness" },
            };
        }

        public void Unload() { }
    }
}
