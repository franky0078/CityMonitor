using System.Collections.Generic;
using Colossal;

namespace CityMonitor
{
    public class LocaleFR : IDictionarySource
    {
        private readonly Setting m_Setting;

        public LocaleFR(Setting setting)
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
                { m_Setting.GetOptionTabLocaleID(Setting.kSection), "Général" },
                { m_Setting.GetOptionTabLocaleID(Setting.kThresholdSection), "Seuils de couleur" },

                { m_Setting.GetOptionGroupLocaleID(Setting.kGeneralGroup), "Général" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kDisplayGroup), "Affichage" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kUpdateGroup), "Actualisation" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kPopulationThresholdGroup), "Population et emplois" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kCapacityThresholdGroup), "Capacités et circulation" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kRiskThresholdGroup), "Risques" },
                { m_Setting.GetOptionGroupLocaleID(Setting.kAboutGroup), "À propos du mod" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowPanel)), "Afficher le panneau" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowPanel)),
                    "Affiche ou masque City Monitor, y compris son bouton dans le jeu." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ButtonLocation)), "Emplacement du bouton du mod" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ButtonLocation)),
                    "Définit si le bouton City Monitor apparaît à son emplacement d'origine ou dans le nouveau menu universel des mods." },
                { m_Setting.GetEnumValueLocaleID(ModButtonLocation.Standard), "Standard (emplacement d'origine)" },
                { m_Setting.GetEnumValueLocaleID(ModButtonLocation.UniversalModMenu), "Menu universel des mods" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CompactValues)), "Afficher uniquement les valeurs pertinentes" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CompactValues)),
                    "Réduit les indicateurs à plusieurs valeurs aux données essentielles. Cela concerne le chômage, les sans-abri, les emplois, les écoles et les services combinés tels que l'eau et les eaux usées. En mode icônes compactes, ce réglage s'applique aussi aux infobulles." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowLabels)), "Afficher les libellés" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowLabels)),
                    "Affiche les noms des indicateurs et des services urbains à côté de leurs icônes." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOnlyMode)), "Mode icônes compactes" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOnlyMode)),
                    "Affiche uniquement les icônes d'état, sans fond ni en-tête du panneau. Un anneau coloré indique l'état et les valeurs apparaissent au survol." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconOrientation)), "Orientation de la barre d'icônes" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconOrientation)),
                    "Définit si la barre d'icônes est affichée verticalement ou horizontalement." },
                { m_Setting.GetEnumValueLocaleID(IconBarOrientation.Vertical), "Verticale" },
                { m_Setting.GetEnumValueLocaleID(IconBarOrientation.Horizontal), "Horizontale" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconPositionLocked)), "Verrouiller la barre d'icônes" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconPositionLocked)),
                    "Verrouille la barre d'icônes à sa position actuelle. Lorsque cette option est désactivée, elle peut être déplacée avec la souris." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconVisibilityEditMode)), "Personnaliser l'affichage" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconVisibilityEditMode)),
                    "Active la modification de l'affichage actuel. Faites un clic droit sur un élément pour le masquer ou l'afficher. En mode icônes compactes, vous pouvez aussi modifier l'ordre en faisant glisser avec le bouton gauche. Les éléments masqués restent transparents pendant la modification et disparaissent lorsqu'elle est désactivée." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconBackgroundTransparency)), "Transparence des icônes (%)" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconBackgroundTransparency)),
                    "Contrôle la transparence de l'icône complète en mode compact. 0 % = entièrement visible, 100 % = transparence maximale. L'icône, l'anneau d'état et le fond circulaire sombre sont concernés ; l'infobulle reste entièrement visible." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconSize)), "Taille des icônes" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconSize)),
                    "Définit la taille des icônes d'état rondes en mode compact. Plage : 22 à 50." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.IconGap)), "Espacement des icônes" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.IconGap)),
                    "Définit l'espace entre les icônes d'état en mode compact. Plage : 0 à 20." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowAllIcons)), "Afficher toutes les icônes" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowAllIcons)),
                    "Restaure toutes les icônes masquées par clic droit en mode compact." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ShowAllNormalStats)), "Afficher toutes les statistiques" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ShowAllNormalStats)),
                    "Restaure toutes les statistiques et tous les services urbains dans l'affichage normal." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ResetIconOrder)), "Réinitialiser l'ordre des icônes" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ResetIconOrder)),
                    "Restaure l'ordre par défaut des icônes en mode compact." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UpdateIntervalSeconds)), "Intervalle d'actualisation" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UpdateIntervalSeconds)),
                    "Définit la fréquence de recalcul du chômage, des emplois et des places scolaires. Plage : 0,5 à 60 secondes. Les services utilisent directement les données du jeu. Les icônes masquées ne sont ni recalculées ni suivies." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UnemploymentGreenMax)), "Chômage : vert jusqu'à" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UnemploymentGreenMax)), "L'état est vert jusqu'à ce taux de chômage." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.UnemploymentYellowMax)), "Chômage : jaune jusqu'à" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.UnemploymentYellowMax)), "L'état est jaune jusqu'à ce taux de chômage et rouge au-delà." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.HomelessGreenMax)), "Sans-abri : vert jusqu'à" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.HomelessGreenMax)), "L'état est vert jusqu'à ce taux de sans-abri." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.HomelessYellowMax)), "Sans-abri : jaune jusqu'à" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.HomelessYellowMax)), "L'état est jaune jusqu'à ce taux et rouge au-delà." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.OpenJobsYellowMin)), "Emplois vacants : jaune à partir de" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.OpenJobsYellowMin)), "L'état passe du rouge au jaune à partir de cette proportion d'emplois vacants." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.OpenJobsGreenMin)), "Emplois vacants : vert à partir de" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.OpenJobsGreenMin)), "L'état est vert à partir de cette proportion d'emplois vacants." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.SchoolYellowMin)), "Capacité scolaire : jaune à partir de" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.SchoolYellowMin)), "L'état passe du rouge au jaune à partir de cette proportion de places scolaires libres." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.SchoolGreenMin)), "Capacité scolaire : vert à partir de" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.SchoolGreenMin)), "L'état est vert à partir de cette proportion de places scolaires libres." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.AvailabilityYellowMin)), "Disponibilité : jaune à partir de" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.AvailabilityYellowMin)), "S'applique aux soins de santé, au cimetière, au crématorium, aux déchets, à la décharge, à l'électricité, à l'eau, au stationnement, à la poste et à l'attractivité de la ville." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.AvailabilityGreenMin)), "Disponibilité : vert à partir de" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.AvailabilityGreenMin)), "L'état est vert à partir de cette valeur de disponibilité." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.TrafficYellowMin)), "Fluidité du trafic : jaune à partir de" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.TrafficYellowMin)), "L'état passe du rouge au jaune à partir de cette valeur de fluidité du trafic." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.TrafficGreenMin)), "Fluidité du trafic : vert à partir de" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.TrafficGreenMin)), "L'état est vert à partir de cette valeur de fluidité du trafic." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.FireHazardGreenMax)), "Risque d'incendie : vert jusqu'à" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.FireHazardGreenMax)), "L'état est vert jusqu'à cette valeur de risque d'incendie." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.FireHazardYellowMax)), "Risque d'incendie : jaune jusqu'à" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.FireHazardYellowMax)), "L'état est jaune jusqu'à cette valeur et rouge au-delà." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CrimeRiskGreenMax)), "Risque criminel : vert jusqu'à" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CrimeRiskGreenMax)), "L'état est vert jusqu'à cette valeur de risque criminel." },
                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.CrimeRiskYellowMax)), "Risque criminel : jaune jusqu'à" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.CrimeRiskYellowMax)), "L'état est jaune jusqu'à cette valeur et rouge au-delà." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ResetColorThresholds)), "Réinitialiser les seuils de couleur" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ResetColorThresholds)), "Restaure tous les seuils de couleur à leurs valeurs recommandées par défaut." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ModVersion)), "Version" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ModVersion)), "Version de City Monitor actuellement installée." },

                // Interface en jeu
                { "CityMonitor.Toggle", "Afficher ou masquer City Monitor" },
                { "CityMonitor.Drag", "Faire glisser pour déplacer la barre d'icônes" },
                { "CityMonitor.PositionLocked", "Position verrouillée" },
                { "CityMonitor.CollapseExpand", "Réduire / développer" },
                { "CityMonitor.Resize", "Faire glisser pour redimensionner" },
                { "CityMonitor.Unemployment", "Chômage" },
                { "CityMonitor.UnemploymentRate", "Taux" },
                { "CityMonitor.Unemployed", "Chômeurs" },
                { "CityMonitor.Homeless", "Sans-abri" },
                { "CityMonitor.HomelessRate", "Taux" },
                { "CityMonitor.HomelessPeople", "Personnes sans-abri" },
                { "CityMonitor.Jobs", "Emplois" },
                { "CityMonitor.OpenJobs", "Emplois vacants" },
                { "CityMonitor.Open", "Vacants" },
                { "CityMonitor.Free", "Libres" },
                { "CityMonitor.Occupied", "Occupées" },
                { "CityMonitor.Total", "Total" },
                { "CityMonitor.ElementarySchool", "École primaire" },
                { "CityMonitor.HighSchool", "Lycée" },
                { "CityMonitor.College", "Faculté" },
                { "CityMonitor.University", "Université" },
                { "CityMonitor.HideIcon", "Clic droit : masquer l'icône" },
                { "CityMonitor.ShowIcon", "Clic droit : afficher l'icône" },
                { "CityMonitor.ReorderIcon", "Faire glisser : modifier l'ordre" },
                { "CityMonitor.HideStat", "Clic droit : masquer la statistique" },
                { "CityMonitor.ShowStat", "Clic droit : afficher la statistique" },
                { "CityMonitor.Hidden", "Masqué" },
                { "CityMonitor.Fire", "Incendie et secours" },
                { "CityMonitor.FireHazard", "Risque d'incendie" },
                { "CityMonitor.Healthcare", "Soins de santé" },
                { "CityMonitor.Cemetery", "Cimetière" },
                { "CityMonitor.Crematorium", "Crématorium" },
                { "CityMonitor.Garbage", "Déchets" },
                { "CityMonitor.GarbageProcessing", "Traitement des déchets" },
                { "CityMonitor.GarbageProduction", "Déchets" },
                { "CityMonitor.Processing", "Traitement" },
                { "CityMonitor.ProcessingRate", "Traitement" },
                { "CityMonitor.Status", "État" },
                { "CityMonitor.Landfill", "Décharge" },
                { "CityMonitor.Police", "Police" },
                { "CityMonitor.CrimeProbability", "Probabilité de crime" },
                { "CityMonitor.JailAvailability", "Disponibilité des prisons" },
                { "CityMonitor.CrimePerMonth", "Crimes / mois" },
                { "CityMonitor.TrafficFlow", "Fluidité du trafic" },
                { "CityMonitor.Electricity", "Électricité" },
                { "CityMonitor.WaterSewage", "Eau / eaux usées" },
                { "CityMonitor.Water", "Eau" },
                { "CityMonitor.Sewage", "Eaux usées" },
                { "CityMonitor.Availability", "Disponibilité" },
                { "CityMonitor.CarParking", "Stationnement automobile" },
                { "CityMonitor.BikeParking", "Stationnement vélo" },
                { "CityMonitor.Post", "Service postal" },
                { "CityMonitor.Tourism", "Tourisme" },
                { "CityMonitor.Tourists", "Touristes" },
                { "CityMonitor.Attractiveness", "Attractivité de la ville" },
            };
        }

        public void Unload() { }
    }
}
