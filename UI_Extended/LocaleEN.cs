using System.Collections.Generic;
using Colossal;

namespace UI_Extended
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

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowPanel)), "Show panel" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowPanel)),
                    "Shows or hides the City Monitor, including its in-game toggle button." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CompactValues)), "Show relevant values only" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CompactValues)),
                    "Shows only the unemployment rate, the number of open jobs, and free school slots. In compact icon mode, this also applies to the hover tooltips. When disabled, the tooltips additionally show the number of unemployed citizens or the total number of slots." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowLabels)), "Show labels" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowLabels)),
                    "Shows labels next to the icons, such as Rate, Open Jobs, Elementary School, High School, College, and University." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOnlyMode)), "Compact icon mode" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOnlyMode)),
                    "Shows only the status icons without the panel background or header. A colored ring indicates the current status, and values are shown on hover." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconPositionLocked)), "Lock icon bar" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconPositionLocked)),
                    "Locks the icon bar at its current position. When disabled, the bar can be moved with the mouse." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconVisibilityEditMode)), "Show / hide icons" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconVisibilityEditMode)),
                    "Enables icon visibility editing. Visible icons are shown fully opaque, while hidden icons are shown with 75% transparency. Right-click an icon to hide it or make it visible again. When editing is disabled, hidden icons disappear and visible icons return to the configured icon transparency." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconBackgroundTransparency)), "Icon transparency (%)" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconBackgroundTransparency)),
                    "Controls the transparency of the complete icon in compact icon mode. 0% = fully visible, 100% = maximum transparency. The icon, colored status ring, and dark circular background are affected; the hover tooltip remains fully visible." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconSize)), "Icon size" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconSize)),
                    "Sets the size of the round status icons in compact icon mode. Range: 22 to 50." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconGap)), "Icon spacing" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconGap)),
                    "Sets the vertical spacing between status icons in compact icon mode. Range: 0 to 20." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowAllIcons)), "Show all icons" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowAllIcons)),
                    "Restores all icons that were hidden with a right-click in compact icon mode." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UpdateIntervalSeconds)), "Update interval" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UpdateIntervalSeconds)),
                    "Sets how often the City Monitor values are recalculated. Range: 5 to 60 seconds. Shorter intervals require slightly more processing time." },

                // Runtime UI
                { "UI_Extended.CityMonitor.Toggle", "Toggle City Monitor" },
                { "UI_Extended.CityMonitor.Drag", "Drag to move" },
                { "UI_Extended.CityMonitor.PositionLocked", "Position locked" },
                { "UI_Extended.CityMonitor.CollapseExpand", "Collapse / expand" },
                { "UI_Extended.CityMonitor.Resize", "Drag to resize" },

                { "UI_Extended.CityMonitor.Unemployment", "Unemployment" },
                { "UI_Extended.CityMonitor.UnemploymentRate", "Rate" },
                { "UI_Extended.CityMonitor.Unemployed", "Unemployed" },

                { "UI_Extended.CityMonitor.Jobs", "Jobs" },
                { "UI_Extended.CityMonitor.OpenJobs", "Open jobs" },
                { "UI_Extended.CityMonitor.Open", "Open" },
                { "UI_Extended.CityMonitor.Free", "Free" },
                { "UI_Extended.CityMonitor.Total", "Total" },

                { "UI_Extended.CityMonitor.ElementarySchool", "Elementary School" },
                { "UI_Extended.CityMonitor.HighSchool", "High School" },
                { "UI_Extended.CityMonitor.College", "College" },
                { "UI_Extended.CityMonitor.University", "University" },

                { "UI_Extended.CityMonitor.HideIcon", "Right-click: hide icon" },
                { "UI_Extended.CityMonitor.ShowIcon", "Right-click: show icon" },
                { "UI_Extended.CityMonitor.Fire", "Fire & Rescue" },
                { "UI_Extended.CityMonitor.FireHazard", "Fire hazard" },
                { "UI_Extended.CityMonitor.Healthcare", "Healthcare" },
                { "UI_Extended.CityMonitor.Cemetery", "Cemetery" },
                { "UI_Extended.CityMonitor.Garbage", "Garbage" },
                { "UI_Extended.CityMonitor.Processing", "Processing" },
                { "UI_Extended.CityMonitor.Landfill", "Landfill free" },
                { "UI_Extended.CityMonitor.TrafficFlow", "Traffic flow" },
                { "UI_Extended.CityMonitor.Electricity", "Electricity" },
                { "UI_Extended.CityMonitor.WaterSewage", "Water / Sewage" },
                { "UI_Extended.CityMonitor.Water", "Water" },
                { "UI_Extended.CityMonitor.Sewage", "Sewage" },
                { "UI_Extended.CityMonitor.Availability", "Availability" },
            };
        }

        public void Unload() { }
    }
}
