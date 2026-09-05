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
using Game.UI;                 // UISystemBase
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

        private EntityQuery _potentialWorkforceQuery;
        private EntityQuery _workplaceQuery;
        private EntityQuery _schoolQuery;
        private EntityQuery _studentQuery;

        private float _timer = 0f;
        private const float STATS_INTERVAL = 15f;

        protected override void OnCreate()
        {
            base.OnCreate();
            Mod.Log.Info("EmploymentUISystem (Binding) gestartet.");

            SetupQueries();

            AddBinding(_dataBinding = new ValueBinding<CityMonitorData>(
                Group, "data", default, new ValueWriter<CityMonitorData>()));

            // Gespeicherten UI-Zustand an die Oberfläche geben
            AddBinding(new ValueBinding<string>("cityMonitor", "uiState", Mod.Setting?.UiState ?? ""));

            // Änderungen aus der UI entgegennehmen und speichern
            AddBinding(new TriggerBinding<string>("cityMonitor", "saveUiState", (json) =>
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

            if (GameManager.instance.gameMode != GameMode.Game) return;

            _timer += SystemAPI.Time.DeltaTime;
            if (_timer < STATS_INTERVAL) return;
            _timer = 0f;

            CalculateAndUpdate();
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
                None = new[] {
                    ComponentType.ReadOnly<Game.Citizens.Student>(),
                    ComponentType.ReadOnly<Deleted>(),
                    ComponentType.ReadOnly<Temp>()
                }
            });

            _workplaceQuery = GetEntityQuery(new EntityQueryDesc
            {
                All = new[] { ComponentType.ReadOnly<WorkProvider>(), ComponentType.ReadOnly<PrefabRef>() },
                Any = new[] { ComponentType.ReadOnly<PropertyRenter>(), ComponentType.ReadOnly<Building>() },
                None = new[] { ComponentType.ReadOnly<Temp>(), ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Game.Objects.UnderConstruction>() }
            });

            _schoolQuery = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<Game.Buildings.School>(), ComponentType.ReadOnly<PrefabRef>(), ComponentType.ReadOnly<UpdateFrame>() }, None = new[] { ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } });
            _studentQuery = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<Game.Citizens.Student>(), ComponentType.ReadOnly<Citizen>() }, None = new[] { ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } });
        }
    }
}