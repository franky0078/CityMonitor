using System.Collections.Generic;
using Colossal;

namespace CityMonitor
{
    public class LocaleES : IDictionarySource
    {
        private readonly Setting m_Setting;

        public LocaleES(Setting setting)
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
                { m_Setting.GetOptionTabLocaleID(Setting.kThresholdSection), "Umbrales de color" },

                { m_Setting.GetOptionGroupLocaleID(Setting.kGeneralGroup), "General" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kDisplayGroup), "Visualización" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kUpdateGroup), "Actualización" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kPopulationThresholdGroup), "Población y empleo" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kCapacityThresholdGroup), "Capacidades y flujo de tráfico" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kRiskThresholdGroup), "Riesgos" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kAboutGroup), "Acerca del mod" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowPanel)), "Mostrar panel" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowPanel)),
                    "Muestra u oculta City Monitor, incluido su botón dentro del juego." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ButtonLocation)), "Ubicación del botón del mod" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ButtonLocation)),
                    "Define si el botón de City Monitor se muestra en su posición original o dentro del nuevo menú universal de mods." },
                { m_Setting.GetEnumValueLocaleID(ModButtonLocation.Standard), "Estándar (posición original)" },
                { m_Setting.GetEnumValueLocaleID(ModButtonLocation.UniversalModMenu), "Menú universal de mods" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CompactValues)), "Mostrar solo valores relevantes" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CompactValues)),
                    "Reduce los indicadores con varios valores a las cifras más importantes. Se aplica al desempleo, personas sin hogar, empleos, escuelas y servicios combinados como agua y alcantarillado. En el modo de iconos compactos también se aplica a la información emergente." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowLabels)), "Mostrar etiquetas" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowLabels)),
                    "Muestra los nombres de los indicadores y servicios urbanos junto a sus iconos." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOnlyMode)), "Modo de iconos compactos" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOnlyMode)),
                    "Muestra solo los iconos de estado, sin fondo ni cabecera del panel. Un anillo de color indica el estado y los valores aparecen al pasar el cursor." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOrientation)), "Orientación de la barra de iconos" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOrientation)),
                    "Define si la barra de iconos se muestra en vertical u horizontal." },
                { m_Setting.GetEnumValueLocaleID(IconBarOrientation.Vertical), "Vertical" },
                { m_Setting.GetEnumValueLocaleID(IconBarOrientation.Horizontal), "Horizontal" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconPositionLocked)), "Bloquear barra de iconos" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconPositionLocked)),
                    "Bloquea la barra de iconos en su posición actual. Si está desactivado, puede moverse con el ratón." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconVisibilityEditMode)), "Editar iconos" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconVisibilityEditMode)),
                    "Activa la edición de la barra de iconos. Arrastra los iconos con el botón izquierdo para cambiar su orden y haz clic derecho para ocultarlos o mostrarlos. Los iconos visibles se muestran totalmente opacos y los ocultos con un 55 % de transparencia. Al desactivar la edición, los iconos ocultos desaparecen y los visibles recuperan la transparencia configurada." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconBackgroundTransparency)), "Transparencia de iconos (%)" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconBackgroundTransparency)),
                    "Controla la transparencia del icono completo en el modo compacto. 0 % = totalmente visible, 100 % = máxima transparencia. Afecta al icono, al anillo de estado y al fondo circular oscuro; la información emergente permanece visible." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconSize)), "Tamaño de iconos" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconSize)),
                    "Define el tamaño de los iconos de estado redondos en el modo compacto. Intervalo: 22 a 50." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconGap)), "Espaciado de iconos" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconGap)),
                    "Define el espacio entre los iconos de estado en el modo compacto. Intervalo: 0 a 20." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowAllIcons)), "Mostrar todos los iconos" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowAllIcons)),
                    "Restaura todos los iconos ocultados con clic derecho en el modo compacto." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ResetIconOrder)), "Restablecer orden de iconos" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ResetIconOrder)),
                    "Restaura el orden predeterminado de los iconos en el modo compacto." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UpdateIntervalSeconds)), "Intervalo de actualización" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UpdateIntervalSeconds)),
                    "Define cada cuánto se recalculan el desempleo, los empleos y las plazas escolares. Intervalo: 0,5 a 60 segundos. Los servicios usan directamente los datos del juego. Los iconos ocultos no se recalculan ni se suscriben." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UnemploymentGreenMax)), "Desempleo: verde hasta" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UnemploymentGreenMax)), "El estado es verde hasta esta tasa de desempleo." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UnemploymentYellowMax)), "Desempleo: amarillo hasta" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UnemploymentYellowMax)), "El estado es amarillo hasta esta tasa de desempleo y rojo por encima." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.HomelessGreenMax)), "Personas sin hogar: verde hasta" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.HomelessGreenMax)), "El estado es verde hasta este porcentaje de personas sin hogar." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.HomelessYellowMax)), "Personas sin hogar: amarillo hasta" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.HomelessYellowMax)), "El estado es amarillo hasta este porcentaje y rojo por encima." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.OpenJobsYellowMin)), "Puestos vacantes: amarillo desde" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.OpenJobsYellowMin)), "El estado cambia de rojo a amarillo a partir de este porcentaje de puestos vacantes." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.OpenJobsGreenMin)), "Puestos vacantes: verde desde" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.OpenJobsGreenMin)), "El estado es verde a partir de este porcentaje de puestos vacantes." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.SchoolYellowMin)), "Capacidad escolar: amarillo desde" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.SchoolYellowMin)), "El estado cambia de rojo a amarillo a partir de este porcentaje de plazas escolares libres." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.SchoolGreenMin)), "Capacidad escolar: verde desde" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.SchoolGreenMin)), "El estado es verde a partir de este porcentaje de plazas escolares libres." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.AvailabilityYellowMin)), "Disponibilidad: amarillo desde" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.AvailabilityYellowMin)), "Se aplica a sanidad, cementerio, crematorio, basura, vertedero, electricidad, agua, aparcamientos, correos y atractivo urbano." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.AvailabilityGreenMin)), "Disponibilidad: verde desde" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.AvailabilityGreenMin)), "El estado es verde a partir de este valor de disponibilidad." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.TrafficYellowMin)), "Flujo de tráfico: amarillo desde" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.TrafficYellowMin)), "El estado cambia de rojo a amarillo a partir de este valor de flujo de tráfico." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.TrafficGreenMin)), "Flujo de tráfico: verde desde" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.TrafficGreenMin)), "El estado es verde a partir de este valor de flujo de tráfico." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.FireHazardGreenMax)), "Riesgo de incendio: verde hasta" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.FireHazardGreenMax)), "El estado es verde hasta este valor de riesgo de incendio." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.FireHazardYellowMax)), "Riesgo de incendio: amarillo hasta" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.FireHazardYellowMax)), "El estado es amarillo hasta este valor y rojo por encima." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CrimeRiskGreenMax)), "Riesgo delictivo: verde hasta" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CrimeRiskGreenMax)), "El estado es verde hasta este valor de riesgo delictivo." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CrimeRiskYellowMax)), "Riesgo delictivo: amarillo hasta" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CrimeRiskYellowMax)), "El estado es amarillo hasta este valor y rojo por encima." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ResetColorThresholds)), "Restablecer umbrales de color" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ResetColorThresholds)), "Restaura todos los umbrales de color a los valores predeterminados recomendados." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ModVersion)), "Versión" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ModVersion)), "Versión instalada actualmente de City Monitor." },

                // Interfaz durante el juego
                { "CityMonitor.Toggle", "Mostrar u ocultar City Monitor" },
                { "CityMonitor.Drag", "Arrastra para mover la barra de iconos" },
                { "CityMonitor.PositionLocked", "Posición bloqueada" },
                { "CityMonitor.CollapseExpand", "Contraer / expandir" },
                { "CityMonitor.Resize", "Arrastra para cambiar el tamaño" },
                { "CityMonitor.Unemployment", "Desempleo" },
                { "CityMonitor.UnemploymentRate", "Tasa" },
                { "CityMonitor.Unemployed", "Desempleados" },
                { "CityMonitor.Homeless", "Personas sin hogar" },
                { "CityMonitor.HomelessRate", "Tasa" },
                { "CityMonitor.HomelessPeople", "Personas sin hogar" },
                { "CityMonitor.Jobs", "Empleos" },
                { "CityMonitor.OpenJobs", "Puestos vacantes" },
                { "CityMonitor.Open", "Vacantes" },
                { "CityMonitor.Free", "Libres" },
                { "CityMonitor.Occupied", "Ocupadas" },
                { "CityMonitor.Total", "Total" },
                { "CityMonitor.ElementarySchool", "Escuela primaria" },
                { "CityMonitor.HighSchool", "Instituto" },
                { "CityMonitor.College", "Universidad técnica" },
                { "CityMonitor.University", "Universidad" },
                { "CityMonitor.HideIcon", "Clic derecho: ocultar icono" },
                { "CityMonitor.ShowIcon", "Clic derecho: mostrar icono" },
                { "CityMonitor.ReorderIcon", "Arrastrar: cambiar orden" },
                { "CityMonitor.Hidden", "Oculto" },
                { "CityMonitor.Fire", "Bomberos y rescate" },
                { "CityMonitor.FireHazard", "Riesgo de incendio" },
                { "CityMonitor.Healthcare", "Sanidad" },
                { "CityMonitor.Cemetery", "Cementerio" },
                { "CityMonitor.Crematorium", "Crematorio" },
                { "CityMonitor.Garbage", "Basura" },
                { "CityMonitor.GarbageProcessing", "Procesamiento de basura" },
                { "CityMonitor.GarbageProduction", "Basura" },
                { "CityMonitor.Processing", "Procesamiento" },
                { "CityMonitor.ProcessingRate", "Procesamiento" },
                { "CityMonitor.Status", "Estado" },
                { "CityMonitor.Landfill", "Vertedero" },
                { "CityMonitor.Police", "Policía" },
                { "CityMonitor.CrimeProbability", "Probabilidad delictiva" },
                { "CityMonitor.JailAvailability", "Disponibilidad de cárceles" },
                { "CityMonitor.CrimePerMonth", "Delitos / mes" },
                { "CityMonitor.TrafficFlow", "Flujo de tráfico" },
                { "CityMonitor.Electricity", "Electricidad" },
                { "CityMonitor.WaterSewage", "Agua / alcantarillado" },
                { "CityMonitor.Water", "Agua" },
                { "CityMonitor.Sewage", "Alcantarillado" },
                { "CityMonitor.Availability", "Disponibilidad" },
                { "CityMonitor.CarParking", "Aparcamiento para coches" },
                { "CityMonitor.BikeParking", "Aparcamiento para bicicletas" },
                { "CityMonitor.Post", "Servicio postal" },
                { "CityMonitor.Tourism", "Turismo" },
                { "CityMonitor.Tourists", "Turistas" },
                { "CityMonitor.Attractiveness", "Atractivo urbano" },
            };
        }

        public void Unload() { }
    }
}
