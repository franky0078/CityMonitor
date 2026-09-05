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

namespace UI_Extended.Logic
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

        // --- TEIL A: BÜRGER (ARBEITSLOSIGKEIT) ---
        // Exakte InfoLoom-Logik
        public static WorkforceData CalculateWorkforce(NativeArray<Entity> allCitizens, EntityManager entityManager)
        {
            WorkforceData result = new WorkforceData();

            foreach (var entity in allCitizens)
            {
                // 1. Basis-Check
                if (!entityManager.HasComponent<Citizen>(entity)) continue;
                var citizen = entityManager.GetComponentData<Citizen>(entity);

                // 2. Alter: Nur Kinder und Senioren ignorieren (Teens zählen zur Workforce!)
                CitizenAge age = citizen.GetAge();
                if (age == CitizenAge.Child || age == CitizenAge.Elderly) continue;

                // 3. Status: Tote, Touristen und Pendler ignorieren
                if ((citizen.m_State & (CitizenFlags.Tourist | CitizenFlags.Commuter)) != 0) continue;

                if (entityManager.HasComponent<HealthProblem>(entity))
                {
                    var health = entityManager.GetComponentData<HealthProblem>(entity);
                    if ((health.m_Flags & HealthProblemFlags.Dead) != 0) continue;
                }

                // 4. Haushalt prüfen (Streng nach InfoLoom)
                // Jeder gültige Einwohner muss Teil eines Haushalts sein, der "MovedIn" ist.
                if (!entityManager.HasComponent<HouseholdMember>(entity)) continue;

                var member = entityManager.GetComponentData<HouseholdMember>(entity);
                Entity householdEntity = member.m_Household;

                if (!entityManager.HasComponent<Household>(householdEntity)) continue;
                var household = entityManager.GetComponentData<Household>(householdEntity);

                // INFO-LOOM CHECK: 
                // Haushalt muss "MovedIn" sein UND darf nicht "MovingAway" sein.
                if ((household.m_Flags & HouseholdFlags.MovedIn) == 0) continue;
                if (entityManager.HasComponent<MovingAway>(householdEntity)) continue;

                // 5. Zählung
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

        /// --- TEIL B: GEBÄUDE (OFFENE STELLEN) ---
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

        // --- TEIL C: BILDUNG ---
        public static (int elem, int high, int college, int uni) CalculateSchoolCapacities(NativeArray<Entity> schools, EntityManager entityManager)
        {
            int c1 = 0, c2 = 0, c3 = 0, c4 = 0;
            foreach (var entity in schools)
            {
                if (entityManager.HasComponent<PrefabRef>(entity))
                {
                    var prefabRef = entityManager.GetComponentData<PrefabRef>(entity);
                    if (entityManager.HasComponent<SchoolData>(prefabRef.m_Prefab))
                    {
                        var schoolData = entityManager.GetComponentData<SchoolData>(prefabRef.m_Prefab);
                        switch ((int)schoolData.m_EducationLevel)
                        {
                            case 1: c1 += schoolData.m_StudentCapacity; break;
                            case 2: c2 += schoolData.m_StudentCapacity; break;
                            case 3: c3 += schoolData.m_StudentCapacity; break;
                            case 4: c4 += schoolData.m_StudentCapacity; break;
                        }
                    }
                }
            }
            return (c1, c2, c3, c4);
        }

        public static (int elem, int high, int college, int uni) CountStudents(NativeArray<Game.Citizens.Student> students)
        {
            int s1 = 0, s2 = 0, s3 = 0, s4 = 0;
            for (int i = 0; i < students.Length; i++)
            {
                switch ((int)students[i].m_Level)
                {
                    case 0: case 1: s1++; break;
                    case 2: s2++; break;
                    case 3: s3++; break;
                    case 4: default: s4++; break;
                }
            }
            return (s1, s2, s3, s4);
        }

        public static string GetColorForValue(int capacity, int current) => (capacity - current < 0) ? "#ff6b6b" : "#51cf66";
        public static int CalculateFreeSchoolSlots(int capacity, int students) => Math.Max(0, capacity - students);
    }
}