using Game.Agents;
using Game.Buildings;
using Game.Citizens;
using Game.Common;
using Game.Companies;
using Game.Economy;
using Game.Prefabs;
using Game.Simulation;

using System;
using Unity.Collections;
using Unity.Entities;

namespace CityMonitor.Logic
{
    public static class EmploymentCalculator
    {
        public struct WorkforceData
        {
            public int TotalWorkers;
            public int TotalUnemployed;
            public int TotalWorkforce => TotalWorkers + TotalUnemployed;
        }

        public struct JobData
        {
            public int TotalCapacity;
            public int TotalOccupied;
            public int OpenSlots => Math.Max(0, TotalCapacity - TotalOccupied);
        }

        public struct SchoolDataResult
        {
            public int ElementaryCapacity;
            public int HighSchoolCapacity;
            public int CollegeCapacity;
            public int UniversityCapacity;

            public int ElementaryStudents;
            public int HighSchoolStudents;
            public int CollegeStudents;
            public int UniversityStudents;
        }

        // Arbeitslosigkeit nach Einwohnerstatus berechnen
        public static WorkforceData CalculateWorkforce(NativeArray<Entity> allCitizens, EntityManager entityManager)
        {
            WorkforceData result = new WorkforceData();

            foreach (var entity in allCitizens)
            {
                if (!entityManager.HasComponent<Citizen>(entity)) continue;
                var citizen = entityManager.GetComponentData<Citizen>(entity);

                CitizenAge age = citizen.GetAge();
                if (age == CitizenAge.Child || age == CitizenAge.Elderly) continue;

                if ((citizen.m_State & (CitizenFlags.Tourist | CitizenFlags.Commuter)) != 0) continue;

                if (entityManager.HasComponent<HealthProblem>(entity))
                {
                    var health = entityManager.GetComponentData<HealthProblem>(entity);
                    if ((health.m_Flags & HealthProblemFlags.Dead) != 0) continue;
                }

                if (!entityManager.HasComponent<HouseholdMember>(entity)) continue;

                var member = entityManager.GetComponentData<HouseholdMember>(entity);
                Entity householdEntity = member.m_Household;

                if (!entityManager.HasComponent<Household>(householdEntity)) continue;
                var household = entityManager.GetComponentData<Household>(householdEntity);

                if ((household.m_Flags & HouseholdFlags.MovedIn) == 0) continue;
                if (entityManager.HasComponent<MovingAway>(householdEntity)) continue;

                if (entityManager.HasComponent<Worker>(entity))
                {
                    result.TotalWorkers++;
                }
                else
                {
                    result.TotalUnemployed++;
                }
            }

            return result;
        }

        // Offene Arbeitsplätze aus WorkProvider-Daten berechnen
        public static JobData CalculateJobData(NativeArray<Entity> workplaces, EntityManager entityManager)
        {
            JobData result = new JobData();

            foreach (var entity in workplaces)
            {
                if (!entityManager.HasComponent<WorkProvider>(entity) || !entityManager.HasComponent<PrefabRef>(entity))
                    continue;

                var workProvider = entityManager.GetComponentData<WorkProvider>(entity);

                result.TotalCapacity += workProvider.m_MaxWorkers;

                if (entityManager.HasBuffer<Employee>(entity))
                {
                    var employees = entityManager.GetBuffer<Employee>(entity, true);
                    result.TotalOccupied += employees.Length;
                }
            }

            return result;
        }

        // Schulkapazitäten und tatsächliche Belegung
        public static SchoolDataResult CalculateSchoolData(
            NativeArray<Entity> schools,
            EntityManager entityManager,
            ref ComponentLookup<PrefabRef> prefabRefs,
            ref ComponentLookup<SchoolData> schoolDataLookup)
        {
            SchoolDataResult result = new SchoolDataResult();

            foreach (var entity in schools)
            {
                if (!entityManager.HasBuffer<Efficiency>(entity))
                    continue;

                var efficiency = entityManager.GetBuffer<Efficiency>(entity, true);
                if (BuildingUtils.GetEfficiency(efficiency) == 0f)
                    continue;

                if (!prefabRefs.TryGetComponent(entity, out var prefabRef) ||
                    !schoolDataLookup.TryGetComponent(prefabRef.m_Prefab, out var schoolData))
                {
                    continue;
                }

                if (entityManager.HasBuffer<InstalledUpgrade>(entity))
                {
                    var upgrades = entityManager.GetBuffer<InstalledUpgrade>(entity, true);
                    UpgradeUtils.CombineStats(
                        ref schoolData,
                        upgrades,
                        ref prefabRefs,
                        ref schoolDataLookup);
                }

                int students = entityManager.HasBuffer<Game.Buildings.Student>(entity)
                    ? entityManager.GetBuffer<Game.Buildings.Student>(entity, true).Length
                    : 0;

                switch ((int)schoolData.m_EducationLevel)
                {
                    case 1:
                        result.ElementaryCapacity += schoolData.m_StudentCapacity;
                        result.ElementaryStudents += students;
                        break;
                    case 2:
                        result.HighSchoolCapacity += schoolData.m_StudentCapacity;
                        result.HighSchoolStudents += students;
                        break;
                    case 3:
                        result.CollegeCapacity += schoolData.m_StudentCapacity;
                        result.CollegeStudents += students;
                        break;
                    case 4:
                        result.UniversityCapacity += schoolData.m_StudentCapacity;
                        result.UniversityStudents += students;
                        break;
                }
            }

            return result;
        }

        public static string GetColorForValue(int capacity, int current) => (capacity - current < 0) ? "#ff6b6b" : "#51cf66";
        public static int CalculateFreeSchoolSlots(int capacity, int students) => Math.Max(0, capacity - students);
    }
}
