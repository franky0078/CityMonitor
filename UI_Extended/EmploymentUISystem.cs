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
using UI_Extended.Logic;
using UI_Extended.UI;
using Unity.Collections;
using Unity.Entities;

namespace UI_Extended
{
    public partial class EmploymentUISystem : UISystemBase
    {
        private const string Group = "cityMonitor";

        private ValueBinding<CityMonitorData> _dataBinding;
        private GetterValueBinding<bool> _showPanelBinding;
        private GetterValueBinding<bool> _compactValuesBinding;
        private GetterValueBinding<bool> _showLabelsBinding;
        private GetterValueBinding<bool> _iconOnlyModeBinding;
        private GetterValueBinding<bool> _iconPositionLockedBinding;
        private GetterValueBinding<int> _iconBackgroundTransparencyBinding;
        private GetterValueBinding<int> _iconSizeBinding;
        private GetterValueBinding<int> _iconGapBinding;

        private EntityQuery _potentialWorkforceQuery;
        private EntityQuery _workplaceQuery;
        private EntityQuery _schoolQuery;
        private EntityQuery _studentQuery;

        private float _timer = 0f;

        private int _updateIntervalSeconds = 15;

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

            AddBinding(_iconPositionLockedBinding = new GetterValueBinding<bool>(
                Group, "iconPositionLocked",
                () => Mod.Setting?.IconPositionLocked ?? false));

            AddBinding(_iconBackgroundTransparencyBinding = new GetterValueBinding<int>(
                Group, "iconBackgroundTransparency",
                () => ClampPercent(Mod.Setting?.IconBackgroundTransparency ?? 40)));

            AddBinding(_iconSizeBinding = new GetterValueBinding<int>(
                Group, "iconSize",
                () => ClampIconSize(Mod.Setting?.IconSize ?? 30)));

            AddBinding(_iconGapBinding = new GetterValueBinding<int>(
                Group, "iconGap",
                () => ClampIconGap(Mod.Setting?.IconGap ?? 5)));

            _updateIntervalSeconds = ClampUpdateInterval(Mod.Setting?.UpdateIntervalSeconds ?? 15);

            // Änderungen aus dem normalen Cities-Skylines-Optionenmenü werden
            // von ModSetting.ApplyAndSave() über dieses Event gemeldet.
            if (Mod.Setting != null)
            {
                Mod.Setting.onSettingsApplied += OnSettingsApplied;
            }

            // Gespeicherten UI-Zustand an die Oberfläche geben
            AddBinding(new ValueBinding<string>(Group, "uiState", Mod.Setting?.UiState ?? ""));

            // Änderungen aus der UI entgegennehmen und speichern
            AddBinding(new TriggerBinding<string>(Group, "saveUiState", (json) =>
            {
                if (Mod.Setting != null)
                {
                    Mod.Setting.UiState = json;
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

        private void OnSettingsApplied(Game.Settings.Setting setting)
        {
            // GetterValueBinding liest beim Update direkt die aktuellen Werte
            // aus der tatsächlich angewendeten ModSetting-Instanz.
            _showPanelBinding.Update();
            _compactValuesBinding.Update();
            _showLabelsBinding.Update();
            _iconOnlyModeBinding.Update();
            _iconPositionLockedBinding.Update();
            _iconBackgroundTransparencyBinding.Update();
            _iconSizeBinding.Update();
            _iconGapBinding.Update();

            _updateIntervalSeconds = ClampUpdateInterval(
                Mod.Setting?.UpdateIntervalSeconds ?? 15);

            Mod.Log.Info(
                $"UI settings applied: ShowPanel={Mod.Setting?.ShowPanel}, " +
                $"CompactValues={Mod.Setting?.CompactValues}, " +
                $"ShowLabels={Mod.Setting?.ShowLabels}, " +
                $"IconOnlyMode={Mod.Setting?.IconOnlyMode}, " +
                $"IconPositionLocked={Mod.Setting?.IconPositionLocked}, " +
                $"IconBackgroundTransparency={ClampPercent(Mod.Setting?.IconBackgroundTransparency ?? 40)}%, " +
                $"IconSize={ClampIconSize(Mod.Setting?.IconSize ?? 30)}, " +
                $"IconGap={ClampIconGap(Mod.Setting?.IconGap ?? 5)}, " +
                $"UpdateInterval={_updateIntervalSeconds}s");
        }

        private static int ClampUpdateInterval(int value)
        {
            if (value < 5) return 5;
            if (value > 60) return 60;
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

        private void CalculateAndUpdate()
        {
            using var allCitizens = _potentialWorkforceQuery.ToEntityArray(Allocator.Temp);
            using var workplaces = _workplaceQuery.ToEntityArray(Allocator.Temp);
            using var schoolEntities = _schoolQuery.ToEntityArray(Allocator.Temp);
            using var students = _studentQuery.ToComponentDataArray<Game.Citizens.Student>(Allocator.Temp);

            var wf = EmploymentCalculator.CalculateWorkforce(allCitizens, EntityManager);
            var jobs = EmploymentCalculator.CalculateJobData(workplaces, EntityManager);
            var cap = EmploymentCalculator.CalculateSchoolCapacities(schoolEntities, EntityManager);
            var stud = EmploymentCalculator.CountStudents(students);

            var data = new CityMonitorData
            {
                UnemployedCount = wf.TotalUnemployed,
                UnemploymentRate = wf.TotalWorkforce > 0
                    ? (float)wf.TotalUnemployed / wf.TotalWorkforce * 100f : 0f,
                OpenJobs = jobs.OpenSlots,
                TotalJobSlots = jobs.TotalCapacity,

                ElementaryStudents = stud.elem,
                ElementaryFreeSlots = EmploymentCalculator.CalculateFreeSchoolSlots(cap.elem, stud.elem),
                HighSchoolStudents = stud.high,
                HighSchoolFreeSlots = EmploymentCalculator.CalculateFreeSchoolSlots(cap.high, stud.high),
                CollegeStudents = stud.college,
                CollegeFreeSlots = EmploymentCalculator.CalculateFreeSchoolSlots(cap.college, stud.college),
                UniversityStudents = stud.uni,
                UniversityFreeSlots = EmploymentCalculator.CalculateFreeSchoolSlots(cap.uni, stud.uni),
            };

            _dataBinding.Update(data);
        }

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
