using Colossal.UI.Binding;
using Game;
using Game.Buildings;
using Game.Citizens;
using Game.Common;
using Game.Companies;
using Game.Prefabs;
using Game.SceneFlow;
using Game.Simulation;
using Game.Tools;
using Game.UI;
using CityMonitor.Logic;
using CityMonitor.UI;
using Unity.Collections;
using Unity.Entities;

namespace CityMonitor
{
    public partial class EmploymentUISystem : UISystemBase
    {
        private const string Group = "cityMonitor";

        private ValueBinding<CityMonitorData> _dataBinding;
        private GetterValueBinding<bool> _showPanelBinding;
        private GetterValueBinding<bool> _compactValuesBinding;
        private GetterValueBinding<bool> _showLabelsBinding;
        private GetterValueBinding<bool> _iconOnlyModeBinding;
        private GetterValueBinding<int> _iconOrientationBinding;
        private GetterValueBinding<bool> _iconPositionLockedBinding;
        private GetterValueBinding<bool> _iconVisibilityEditModeBinding;
        private GetterValueBinding<int> _iconBackgroundTransparencyBinding;
        private GetterValueBinding<int> _iconSizeBinding;
        private GetterValueBinding<int> _iconGapBinding;
        private GetterValueBinding<string> _hiddenIconsBinding;
        private GetterValueBinding<string> _iconOrderBinding;
        private GetterValueBinding<int> _unemploymentGreenMaxBinding;
        private GetterValueBinding<int> _unemploymentYellowMaxBinding;
        private GetterValueBinding<int> _homelessGreenMaxBinding;
        private GetterValueBinding<int> _homelessYellowMaxBinding;
        private GetterValueBinding<int> _openJobsYellowMinBinding;
        private GetterValueBinding<int> _openJobsGreenMinBinding;
        private GetterValueBinding<int> _schoolYellowMinBinding;
        private GetterValueBinding<int> _schoolGreenMinBinding;
        private GetterValueBinding<int> _availabilityYellowMinBinding;
        private GetterValueBinding<int> _availabilityGreenMinBinding;
        private GetterValueBinding<int> _trafficYellowMinBinding;
        private GetterValueBinding<int> _trafficGreenMinBinding;
        private GetterValueBinding<int> _fireHazardGreenMaxBinding;
        private GetterValueBinding<int> _fireHazardYellowMaxBinding;
        private GetterValueBinding<int> _crimeRiskGreenMaxBinding;
        private GetterValueBinding<int> _crimeRiskYellowMaxBinding;

        private EntityQuery _potentialWorkforceQuery;
        private EntityQuery _workplaceQuery;
        private EntityQuery _schoolQuery;
        private EntityQuery _studentQuery;

        private float _timer = 0f;

        private float _updateIntervalSeconds = 15f;
        private CityMonitorData _lastData;
        private bool _hasPublishedData;

        protected override void OnCreate()
        {
            base.OnCreate();
            Mod.Log.Info("EmploymentUISystem (Binding) gestartet.");

            SetupQueries();

            AddBinding(_dataBinding = new ValueBinding<CityMonitorData>(
                Group, "data", default, new ValueWriter<CityMonitorData>()));

            AddBinding(_showPanelBinding = new GetterValueBinding<bool>(
                Group, "showPanel", () => Mod.Setting?.ShowPanel ?? true));

            AddBinding(_compactValuesBinding = new GetterValueBinding<bool>(
                Group, "compactValues", () => Mod.Setting?.CompactValues ?? false));

            AddBinding(_showLabelsBinding = new GetterValueBinding<bool>(
                Group, "showLabels", () => Mod.Setting?.ShowLabels ?? false));

            AddBinding(_iconOnlyModeBinding = new GetterValueBinding<bool>(
                Group, "iconOnlyMode", () => Mod.Setting?.IconOnlyMode ?? false));

            AddBinding(_iconOrientationBinding = new GetterValueBinding<int>(
                Group, "iconOrientation",
                () => (int)(Mod.Setting?.IconOrientation ?? IconBarOrientation.Horizontal)));

            AddBinding(_iconPositionLockedBinding = new GetterValueBinding<bool>(
                Group, "iconPositionLocked",
                () => Mod.Setting?.IconPositionLocked ?? false));

            AddBinding(_iconVisibilityEditModeBinding = new GetterValueBinding<bool>(
                Group, "iconVisibilityEditMode",
                () => Mod.Setting?.IconVisibilityEditMode ?? false));

            AddBinding(_iconBackgroundTransparencyBinding = new GetterValueBinding<int>(
                Group, "iconBackgroundTransparency",
                () => ClampPercent(Mod.Setting?.IconBackgroundTransparency ?? 40)));

            AddBinding(_iconSizeBinding = new GetterValueBinding<int>(
                Group, "iconSize",
                () => ClampIconSize(Mod.Setting?.IconSize ?? 30)));

            AddBinding(_iconGapBinding = new GetterValueBinding<int>(
                Group, "iconGap",
                () => ClampIconGap(Mod.Setting?.IconGap ?? 5)));

            AddBinding(_hiddenIconsBinding = new GetterValueBinding<string>(
                Group, "hiddenIcons",
                () => Mod.Setting?.HiddenIcons ?? "[]"));

            AddBinding(_iconOrderBinding = new GetterValueBinding<string>(
                Group, "iconOrder",
                () => Mod.Setting?.IconOrder ?? "[]"));

            AddBinding(_unemploymentGreenMaxBinding = new GetterValueBinding<int>(
                Group, "unemploymentGreenMax", () => ClampPercent(Mod.Setting?.UnemploymentGreenMax ?? 5)));
            AddBinding(_unemploymentYellowMaxBinding = new GetterValueBinding<int>(
                Group, "unemploymentYellowMax", () => ClampPercent(Mod.Setting?.UnemploymentYellowMax ?? 10)));
            AddBinding(_homelessGreenMaxBinding = new GetterValueBinding<int>(
                Group, "homelessGreenMax", () => ClampPercent(Mod.Setting?.HomelessGreenMax ?? 1)));
            AddBinding(_homelessYellowMaxBinding = new GetterValueBinding<int>(
                Group, "homelessYellowMax", () => ClampPercent(Mod.Setting?.HomelessYellowMax ?? 3)));
            AddBinding(_openJobsYellowMinBinding = new GetterValueBinding<int>(
                Group, "openJobsYellowMin", () => ClampPercent(Mod.Setting?.OpenJobsYellowMin ?? 1)));
            AddBinding(_openJobsGreenMinBinding = new GetterValueBinding<int>(
                Group, "openJobsGreenMin", () => ClampPercent(Mod.Setting?.OpenJobsGreenMin ?? 5)));
            AddBinding(_schoolYellowMinBinding = new GetterValueBinding<int>(
                Group, "schoolYellowMin", () => ClampPercent(Mod.Setting?.SchoolYellowMin ?? 3)));
            AddBinding(_schoolGreenMinBinding = new GetterValueBinding<int>(
                Group, "schoolGreenMin", () => ClampPercent(Mod.Setting?.SchoolGreenMin ?? 10)));
            AddBinding(_availabilityYellowMinBinding = new GetterValueBinding<int>(
                Group, "availabilityYellowMin", () => ClampPercent(Mod.Setting?.AvailabilityYellowMin ?? 40)));
            AddBinding(_availabilityGreenMinBinding = new GetterValueBinding<int>(
                Group, "availabilityGreenMin", () => ClampPercent(Mod.Setting?.AvailabilityGreenMin ?? 60)));
            AddBinding(_trafficYellowMinBinding = new GetterValueBinding<int>(
                Group, "trafficYellowMin", () => ClampPercent(Mod.Setting?.TrafficYellowMin ?? 50)));
            AddBinding(_trafficGreenMinBinding = new GetterValueBinding<int>(
                Group, "trafficGreenMin", () => ClampPercent(Mod.Setting?.TrafficGreenMin ?? 70)));
            AddBinding(_fireHazardGreenMaxBinding = new GetterValueBinding<int>(
                Group, "fireHazardGreenMax", () => ClampPercent(Mod.Setting?.FireHazardGreenMax ?? 33)));
            AddBinding(_fireHazardYellowMaxBinding = new GetterValueBinding<int>(
                Group, "fireHazardYellowMax", () => ClampPercent(Mod.Setting?.FireHazardYellowMax ?? 66)));
            AddBinding(_crimeRiskGreenMaxBinding = new GetterValueBinding<int>(
                Group, "crimeRiskGreenMax", () => ClampPercent(Mod.Setting?.CrimeRiskGreenMax ?? 33)));
            AddBinding(_crimeRiskYellowMaxBinding = new GetterValueBinding<int>(
                Group, "crimeRiskYellowMax", () => ClampPercent(Mod.Setting?.CrimeRiskYellowMax ?? 66)));

            _updateIntervalSeconds = ClampUpdateInterval(Mod.Setting?.UpdateIntervalSeconds ?? 15f);

            if (Mod.Setting != null)
            {
                Mod.Setting.onSettingsApplied += OnSettingsApplied;
            }

            // Persistenter UI-Zustand und Symbolkonfiguration
            AddBinding(new ValueBinding<string>(Group, "uiState", Mod.Setting?.UiState ?? ""));

            AddBinding(new TriggerBinding<string>(Group, "saveUiState", (json) =>
            {
                if (Mod.Setting != null)
                {
                    Mod.Setting.UiState = json;
                    Mod.Setting.ApplyAndSave();
                }
            }));

            AddBinding(new TriggerBinding<string>(Group, "saveHiddenIcons", (json) =>
            {
                if (Mod.Setting != null)
                {
                    Mod.Setting.HiddenIcons = string.IsNullOrWhiteSpace(json)
                        ? "[]"
                        : json;
                    Mod.Setting.ApplyAndSave();
                }
            }));

            AddBinding(new TriggerBinding<string>(Group, "saveIconOrder", (json) =>
            {
                if (Mod.Setting != null)
                {
                    Mod.Setting.IconOrder = string.IsNullOrWhiteSpace(json)
                        ? "[]"
                        : json;
                    Mod.Setting.ApplyAndSave();
                }
            }));
        }

        protected override void OnUpdate()
        {
            base.OnUpdate();

            if (GameManager.instance.gameMode != GameMode.Game)
                return;

            _timer += SystemAPI.Time.DeltaTime;

            if (_timer < _updateIntervalSeconds)
                return;

            _timer = 0f;
            CalculateAndUpdate();
        }

        protected override void OnDestroy()
        {
            if (Mod.Setting != null)
            {
                Mod.Setting.onSettingsApplied -= OnSettingsApplied;
            }

            base.OnDestroy();
        }

        // Änderungen aus den Optionen sofort übernehmen
        private void OnSettingsApplied(Game.Settings.Setting setting)
        {
            _showPanelBinding.Update();
            _compactValuesBinding.Update();
            _showLabelsBinding.Update();
            _iconOnlyModeBinding.Update();
            _iconOrientationBinding.Update();
            _iconPositionLockedBinding.Update();
            _iconVisibilityEditModeBinding.Update();
            _iconBackgroundTransparencyBinding.Update();
            _iconSizeBinding.Update();
            _iconGapBinding.Update();
            _hiddenIconsBinding.Update();
            _iconOrderBinding.Update();
            _unemploymentGreenMaxBinding.Update();
            _unemploymentYellowMaxBinding.Update();
            _homelessGreenMaxBinding.Update();
            _homelessYellowMaxBinding.Update();
            _openJobsYellowMinBinding.Update();
            _openJobsGreenMinBinding.Update();
            _schoolYellowMinBinding.Update();
            _schoolGreenMinBinding.Update();
            _availabilityYellowMinBinding.Update();
            _availabilityGreenMinBinding.Update();
            _trafficYellowMinBinding.Update();
            _trafficGreenMinBinding.Update();
            _fireHazardGreenMaxBinding.Update();
            _fireHazardYellowMaxBinding.Update();
            _crimeRiskGreenMaxBinding.Update();
            _crimeRiskYellowMaxBinding.Update();

            _updateIntervalSeconds = ClampUpdateInterval(
                Mod.Setting?.UpdateIntervalSeconds ?? 15f);

            _timer = _updateIntervalSeconds;

            Mod.Log.Info(
                $"UI settings applied: ShowPanel={Mod.Setting?.ShowPanel}, " +
                $"CompactValues={Mod.Setting?.CompactValues}, " +
                $"ShowLabels={Mod.Setting?.ShowLabels}, " +
                $"IconOnlyMode={Mod.Setting?.IconOnlyMode}, " +
                $"IconOrientation={Mod.Setting?.IconOrientation}, " +
                $"IconPositionLocked={Mod.Setting?.IconPositionLocked}, " +
                $"IconVisibilityEditMode={Mod.Setting?.IconVisibilityEditMode}, " +
                $"IconBackgroundTransparency={ClampPercent(Mod.Setting?.IconBackgroundTransparency ?? 40)}%, " +
                $"IconSize={ClampIconSize(Mod.Setting?.IconSize ?? 30)}, " +
                $"IconGap={ClampIconGap(Mod.Setting?.IconGap ?? 5)}, " +
                $"UpdateInterval={_updateIntervalSeconds}s");
        }

        private static float ClampUpdateInterval(float value)
        {
            if (value < 0.5f) return 0.5f;
            if (value > 60f) return 60f;
            return value;
        }

        private static int ClampPercent(int value)
        {
            if (value < 0) return 0;
            if (value > 100) return 100;
            return value;
        }

        private static int ClampIconSize(int value)
        {
            if (value < 22) return 22;
            if (value > 50) return 50;
            return value;
        }

        private static int ClampIconGap(int value)
        {
            if (value < 0) return 0;
            if (value > 20) return 20;
            return value;
        }

        // Nur sichtbare lokale Kennzahlen neu berechnen
        private void CalculateAndUpdate()
        {
            bool optimizeHiddenIcons =
                Mod.Setting?.IconOnlyMode == true;

            string hiddenIcons = Mod.Setting?.HiddenIcons ?? "[]";

            bool updateUnemployment =
                !optimizeHiddenIcons ||
                !IsIconHidden(hiddenIcons, "unemployment");

            bool updateJobs =
                !optimizeHiddenIcons ||
                !IsIconHidden(hiddenIcons, "jobs");

            bool updateElementary =
                !optimizeHiddenIcons ||
                !IsIconHidden(hiddenIcons, "elementary");

            bool updateHighSchool =
                !optimizeHiddenIcons ||
                !IsIconHidden(hiddenIcons, "highschool");

            bool updateCollege =
                !optimizeHiddenIcons ||
                !IsIconHidden(hiddenIcons, "college");

            bool updateUniversity =
                !optimizeHiddenIcons ||
                !IsIconHidden(hiddenIcons, "university");

            bool updateSchools =
                updateElementary ||
                updateHighSchool ||
                updateCollege ||
                updateUniversity;

            CityMonitorData data = _lastData;

            if (updateUnemployment)
            {
                using var allCitizens =
                    _potentialWorkforceQuery.ToEntityArray(Allocator.Temp);

                var wf = EmploymentCalculator.CalculateWorkforce(
                    allCitizens,
                    EntityManager);

                data.UnemployedCount = wf.TotalUnemployed;
                data.UnemploymentRate = wf.TotalWorkforce > 0
                    ? (float)wf.TotalUnemployed / wf.TotalWorkforce * 100f
                    : 0f;
            }

            if (updateJobs)
            {
                using var workplaces =
                    _workplaceQuery.ToEntityArray(Allocator.Temp);

                var jobs = EmploymentCalculator.CalculateJobData(
                    workplaces,
                    EntityManager);

                data.OpenJobs = jobs.OpenSlots;
                data.TotalJobSlots = jobs.TotalCapacity;
            }

            if (updateSchools)
            {
                using var schoolEntities =
                    _schoolQuery.ToEntityArray(Allocator.Temp);
                using var students =
                    _studentQuery.ToComponentDataArray<Game.Citizens.Student>(
                        Allocator.Temp);

                var cap = EmploymentCalculator.CalculateSchoolCapacities(
                    schoolEntities,
                    EntityManager);
                var stud = EmploymentCalculator.CountStudents(students);

                if (updateElementary)
                {
                    data.ElementaryStudents = stud.elem;
                    data.ElementaryFreeSlots =
                        EmploymentCalculator.CalculateFreeSchoolSlots(
                            cap.elem,
                            stud.elem);
                }

                if (updateHighSchool)
                {
                    data.HighSchoolStudents = stud.high;
                    data.HighSchoolFreeSlots =
                        EmploymentCalculator.CalculateFreeSchoolSlots(
                            cap.high,
                            stud.high);
                }

                if (updateCollege)
                {
                    data.CollegeStudents = stud.college;
                    data.CollegeFreeSlots =
                        EmploymentCalculator.CalculateFreeSchoolSlots(
                            cap.college,
                            stud.college);
                }

                if (updateUniversity)
                {
                    data.UniversityStudents = stud.uni;
                    data.UniversityFreeSlots =
                        EmploymentCalculator.CalculateFreeSchoolSlots(
                            cap.uni,
                            stud.uni);
                }
            }

            _lastData = data;

            bool anyLocalValueUpdated =
                updateUnemployment ||
                updateJobs ||
                updateSchools;

            if (anyLocalValueUpdated || !_hasPublishedData)
            {
                _dataBinding.Update(data);
                _hasPublishedData = true;
            }
        }

        private static bool IsIconHidden(string hiddenIcons, string iconId)
        {
            if (string.IsNullOrEmpty(hiddenIcons) ||
                string.IsNullOrEmpty(iconId))
            {
                return false;
            }

            return hiddenIcons.Contains($"\"{iconId}\"");
        }


        // ECS-Abfragen für Arbeit und Bildung
        private void SetupQueries()
        {
            _potentialWorkforceQuery = GetEntityQuery(new EntityQueryDesc
            {
                All = new[] { ComponentType.ReadOnly<Citizen>() },
                None = new[]
                {
                    ComponentType.ReadOnly<Game.Citizens.Student>(),
                    ComponentType.ReadOnly<Deleted>(),
                    ComponentType.ReadOnly<Temp>()
                }
            });

            _workplaceQuery = GetEntityQuery(new EntityQueryDesc
            {
                All = new[]
                {
                    ComponentType.ReadOnly<WorkProvider>(),
                    ComponentType.ReadOnly<PrefabRef>()
                },
                Any = new[]
                {
                    ComponentType.ReadOnly<PropertyRenter>(),
                    ComponentType.ReadOnly<Building>()
                },
                None = new[]
                {
                    ComponentType.ReadOnly<Temp>(),
                    ComponentType.ReadOnly<Deleted>(),
                    ComponentType.ReadOnly<Game.Objects.UnderConstruction>()
                }
            });

            _schoolQuery = GetEntityQuery(new EntityQueryDesc
            {
                All = new[]
                {
                    ComponentType.ReadOnly<Game.Buildings.School>(),
                    ComponentType.ReadOnly<PrefabRef>(),
                    ComponentType.ReadOnly<UpdateFrame>()
                },
                None = new[]
                {
                    ComponentType.ReadOnly<Deleted>(),
                    ComponentType.ReadOnly<Temp>()
                }
            });

            _studentQuery = GetEntityQuery(new EntityQueryDesc
            {
                All = new[]
                {
                    ComponentType.ReadOnly<Game.Citizens.Student>(),
                    ComponentType.ReadOnly<Citizen>()
                },
                None = new[]
                {
                    ComponentType.ReadOnly<Deleted>(),
                    ComponentType.ReadOnly<Temp>()
                }
            });
        }
    }
}
