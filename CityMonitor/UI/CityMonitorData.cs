using Colossal.UI.Binding;

namespace CityMonitor.UI
{
    public struct CityMonitorData : IJsonWritable
    {
        public int UnemployedCount;
        public float UnemploymentRate;
        public int OpenJobs;
        public int TotalJobSlots;

        public int ElementaryStudents;
        public int ElementaryFreeSlots;
        public int HighSchoolStudents;
        public int HighSchoolFreeSlots;
        public int CollegeStudents;
        public int CollegeFreeSlots;
        public int UniversityStudents;
        public int UniversityFreeSlots;

        public void Write(IJsonWriter writer)
        {
            writer.TypeBegin("CityMonitor.CityMonitorData");
            writer.PropertyName("unemployedCount"); writer.Write(UnemployedCount);
            writer.PropertyName("unemploymentRate"); writer.Write(UnemploymentRate);
            writer.PropertyName("openJobs"); writer.Write(OpenJobs);
            writer.PropertyName("totalJobSlots"); writer.Write(TotalJobSlots);
            writer.PropertyName("elementaryStudents"); writer.Write(ElementaryStudents);
            writer.PropertyName("elementaryFreeSlots"); writer.Write(ElementaryFreeSlots);
            writer.PropertyName("highStudents"); writer.Write(HighSchoolStudents);
            writer.PropertyName("highFreeSlots"); writer.Write(HighSchoolFreeSlots);
            writer.PropertyName("collegeStudents"); writer.Write(CollegeStudents);
            writer.PropertyName("collegeFreeSlots"); writer.Write(CollegeFreeSlots);
            writer.PropertyName("uniStudents"); writer.Write(UniversityStudents);
            writer.PropertyName("uniFreeSlots"); writer.Write(UniversityFreeSlots);
            writer.TypeEnd();
        }
    }
}